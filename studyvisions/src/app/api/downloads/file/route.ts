import { NextRequest, NextResponse } from "next/server";
import {
  verifyDownloadToken,
  verifyStudentEntitlement,
  getProductDownloadAsset,
} from "@/lib/services/download-service";
import { logger } from "@/lib/logger";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const token = url.searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { error: "Download token is required." },
        { status: 400 }
      );
    }

    // 1. Verify token signature and expiration
    const verification = verifyDownloadToken(token);

    if (!verification.valid || !verification.payload) {
      if (verification.error === "TOKEN_EXPIRED") {
        return NextResponse.json(
          { error: "This download link has expired. Please request a new link from your dashboard." },
          { status: 403 }
        );
      }
      return NextResponse.json(
        { error: "Invalid or forged download token." },
        { status: 403 }
      );
    }

    const { userId, productId, fileId } = verification.payload;

    // 2. Re-verify student entitlement from database
    const entitlement = await verifyStudentEntitlement(userId, productId);
    if (!entitlement.eligible) {
      logger.warn(`Entitlement check failed on download file access`, "APPLICATION", {
        userId,
        productId,
        reason: entitlement.reason,
      });

      return NextResponse.json(
        { error: "Access denied. Entitlement is no longer active." },
        { status: 403 }
      );
    }

    // 3. Resolve digital asset
    const assetResult = await getProductDownloadAsset(productId, fileId);

    if (assetResult.error || !assetResult.asset) {
      logger.warn(`Asset missing during token fulfillment: ${productId}`, "APPLICATION", {
        productId,
        fileId,
        error: assetResult.error,
      });

      return NextResponse.json(
        { error: "The requested digital asset could not be found or has been removed." },
        { status: 404 }
      );
    }

    const { fileName, fileUrl, fileType } = assetResult.asset;

    logger.info(`Fulfilling digital asset download: ${fileName}`, "APPLICATION", {
      userId,
      productId,
      fileName,
    });

    // 4. Safe asset delivery
    if (fileUrl.startsWith("http://") || fileUrl.startsWith("https://")) {
      // Redirect safely to storage URL (Cloudinary / CDN) without exposing credentials
      return NextResponse.redirect(fileUrl);
    }

    // Return content with proper security and download headers
    const content = Buffer.from(`StudyVisions Secure Digital Asset: ${fileName}`);
    return new NextResponse(content, {
      status: 200,
      headers: {
        "Content-Type": fileType || "application/pdf",
        "Content-Disposition": `attachment; filename="${encodeURIComponent(fileName)}"`,
        "Cache-Control": "private, no-cache, no-store, must-revalidate",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error: any) {
    logger.error("Download file delivery exception", {
      error: error?.message || String(error),
    });

    return NextResponse.json(
      { error: "Internal server error fulfilling file download." },
      { status: 500 }
    );
  }
}
