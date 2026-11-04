import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth-utils";
import {
  verifyStudentEntitlement,
  getProductDownloadAsset,
  generateDownloadToken,
} from "@/lib/services/download-service";
import { logger } from "@/lib/logger";

interface RouteParams {
  params: Promise<{ productId: string }> | { productId: string };
}

export async function POST(req: Request, context: RouteParams) {
  return handleDownloadRequest(req, context);
}

export async function GET(req: Request, context: RouteParams) {
  return handleDownloadRequest(req, context);
}

async function handleDownloadRequest(req: Request, context: RouteParams) {
  try {
    // 1. Authenticate student server-side
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in to download this product." },
        { status: 401 }
      );
    }

    // 2. Extract productId from route params (handles async params in Next.js 15+)
    const resolvedParams = await Promise.resolve(context.params);
    const productId = resolvedParams.productId;

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required." },
        { status: 400 }
      );
    }

    // 3. Verify student has an active entitlement for this product
    const entitlement = await verifyStudentEntitlement(user.id, productId);
    if (!entitlement.eligible) {
      logger.warn(`Unauthorized download attempt by user ${user.id} for product ${productId}`, "APPLICATION", {
        userId: user.id,
        productId,
        reason: entitlement.reason,
      });

      return NextResponse.json(
        { error: "Access denied. You do not have an active purchase entitlement for this product." },
        { status: 403 }
      );
    }

    // 4. Extract optional fileId from search parameters
    const url = new URL(req.url);
    const fileId = url.searchParams.get("fileId");

    // 5. Retrieve digital asset
    const assetResult = await getProductDownloadAsset(productId, fileId);

    if (assetResult.error === "PRODUCT_NOT_FOUND") {
      return NextResponse.json(
        { error: "Product not found." },
        { status: 404 }
      );
    }

    if (assetResult.error === "NO_ASSETS_AVAILABLE" || !assetResult.asset) {
      return NextResponse.json(
        { error: "No digital asset is currently available for download." },
        { status: 404 }
      );
    }

    if (assetResult.error === "ASSET_NOT_FOUND") {
      return NextResponse.json(
        { error: "Requested asset file not found." },
        { status: 404 }
      );
    }

    // 6. Generate short-lived signed download token (valid for 15 minutes)
    const expiresInSeconds = 900;
    const token = generateDownloadToken(user.id, productId, assetResult.asset.id, expiresInSeconds);

    // 7. Generate secure download URL
    const downloadUrl = `/api/downloads/file?token=${encodeURIComponent(token)}`;

    logger.info(`Student generated download token for product ${productId}`, "APPLICATION", {
      userId: user.id,
      productId,
      assetId: assetResult.asset.id,
    });

    return NextResponse.json({
      success: true,
      productId,
      productTitle: assetResult.product.title,
      fileName: assetResult.asset.fileName,
      fileType: assetResult.asset.fileType,
      fileSize: assetResult.asset.fileSize,
      downloadUrl,
      expiresInSeconds,
    });
  } catch (error: any) {
    logger.error("Download route exception", {
      error: error?.message || String(error),
    });

    return NextResponse.json(
      { error: "Internal server error processing download request." },
      { status: 500 }
    );
  }
}
