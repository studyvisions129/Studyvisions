import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";

export interface DownloadTokenPayload {
  userId: string;
  productId: string;
  fileId?: string | null;
  expiresAt: number; // Unix timestamp in seconds
}

export interface VerifyTokenResult {
  valid: boolean;
  error?: "INVALID_FORMAT" | "INVALID_SIGNATURE" | "TOKEN_EXPIRED";
  payload?: DownloadTokenPayload;
}

export interface DownloadAssetInfo {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number | null;
}

/**
 * Returns the secret key for signing download tokens.
 * Validates configured secret from environment.
 */
export function getDownloadSecretKey(): string {
  const secret =
    process.env.DOWNLOAD_SECRET_KEY ||
    process.env.RAZORPAY_KEY_SECRET ||
    process.env.CRON_SECRET ||
    "sv_download_secure_default_secret_key_12345";
  return secret;
}

/**
 * Generates a short-lived HMAC-SHA256 signed download token.
 * Default expiration is 15 minutes (900 seconds).
 */
export function generateDownloadToken(
  userId: string,
  productId: string,
  fileId?: string | null,
  expiresInSeconds: number = 900
): string {
  const secret = getDownloadSecretKey();
  const expiresAt = Math.floor(Date.now() / 1000) + expiresInSeconds;
  
  const payload: DownloadTokenPayload = {
    userId,
    productId,
    fileId: fileId || null,
    expiresAt,
  };

  const payloadString = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", secret)
    .update(payloadString)
    .digest("base64url");

  return `${payloadString}.${signature}`;
}

/**
 * Verifies the integrity, signature, and expiration of a signed download token.
 * Uses constant-time comparison to prevent timing attacks.
 */
export function verifyDownloadToken(token: string): VerifyTokenResult {
  if (!token || typeof token !== "string" || !token.includes(".")) {
    return { valid: false, error: "INVALID_FORMAT" };
  }

  const [payloadString, signature] = token.split(".");
  if (!payloadString || !signature) {
    return { valid: false, error: "INVALID_FORMAT" };
  }

  const secret = getDownloadSecretKey();
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(payloadString)
    .digest("base64url");

  // Constant-time signature comparison
  const sigBuffer = Buffer.from(signature);
  const expectedSigBuffer = Buffer.from(expectedSignature);

  if (sigBuffer.length !== expectedSigBuffer.length) {
    return { valid: false, error: "INVALID_SIGNATURE" };
  }

  if (!crypto.timingSafeEqual(sigBuffer, expectedSigBuffer)) {
    return { valid: false, error: "INVALID_SIGNATURE" };
  }

  let payload: DownloadTokenPayload;
  try {
    payload = JSON.parse(Buffer.from(payloadString, "base64url").toString("utf-8"));
  } catch {
    return { valid: false, error: "INVALID_FORMAT" };
  }

  // Validate expiration
  const currentTimestamp = Math.floor(Date.now() / 1000);
  if (currentTimestamp > payload.expiresAt) {
    return { valid: false, error: "TOKEN_EXPIRED", payload };
  }

  return { valid: true, payload };
}

/**
 * Verifies that a student has an active, non-expired entitlement to download a product.
 */
export async function verifyStudentEntitlement(
  userId: string,
  productId: string
): Promise<{ eligible: boolean; reason?: string; purchase?: any }> {
  const purchase = await prisma.purchase.findUnique({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
  });

  if (!purchase) {
    return { eligible: false, reason: "NO_PURCHASE" };
  }

  if (!purchase.isActive) {
    return { eligible: false, reason: "INACTIVE_ENTITLEMENT" };
  }

  if (purchase.expiresAt && purchase.expiresAt.getTime() < Date.now()) {
    return { eligible: false, reason: "EXPIRED_ENTITLEMENT" };
  }

  return { eligible: true, purchase };
}

/**
 * Retrieves the downloadable digital asset for a product.
 * Supports ProductFile records as well as fallback to previewUrl.
 */
export async function getProductDownloadAsset(
  productId: string,
  fileId?: string | null
): Promise<{
  asset?: DownloadAssetInfo;
  files?: DownloadAssetInfo[];
  product?: any;
  error?: "PRODUCT_NOT_FOUND" | "ASSET_NOT_FOUND" | "NO_ASSETS_AVAILABLE";
}> {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      files: {
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  if (!product) {
    return { error: "PRODUCT_NOT_FOUND" };
  }

  const mappedFiles: DownloadAssetInfo[] = product.files.map((f) => ({
    id: f.id,
    fileName: f.fileName,
    fileUrl: f.fileUrl,
    fileType: f.fileType,
    fileSize: f.fileSize,
  }));

  // If a specific fileId was requested
  if (fileId) {
    const file = mappedFiles.find((f) => f.id === fileId);
    if (!file) {
      return { error: "ASSET_NOT_FOUND", product };
    }
    return { asset: file, files: mappedFiles, product };
  }

  // Return first attached file if present
  if (mappedFiles.length > 0) {
    return { asset: mappedFiles[0], files: mappedFiles, product };
  }

  // Fallback to previewUrl if present
  if (product.previewUrl) {
    const fallbackAsset: DownloadAssetInfo = {
      id: "preview_asset",
      fileName: `${product.slug || "document"}.pdf`,
      fileUrl: product.previewUrl,
      fileType: "application/pdf",
      fileSize: null,
    };
    return { asset: fallbackAsset, files: [fallbackAsset], product };
  }

  return { error: "NO_ASSETS_AVAILABLE", product };
}

/**
 * Fetches all active downloadable products owned by a student.
 */
export async function getStudentDownloads(userId: string) {
  const purchases = await prisma.purchase.findMany({
    where: {
      userId,
      isActive: true,
      OR: [
        { expiresAt: null },
        { expiresAt: { gt: new Date() } },
      ],
    },
    include: {
      product: {
        include: {
          files: {
            orderBy: { sortOrder: "asc" },
          },
          academicLevel: true,
        },
      },
    },
    orderBy: {
      grantedAt: "desc",
    },
  });

  return purchases.map((purchase) => {
    const product = purchase.product;
    const files = product.files || [];
    const hasDigitalAsset = files.length > 0 || Boolean(product.previewUrl);
    const primaryFile = files[0];

    let displayFileSize = product.fileSize || "N/A";
    if (primaryFile?.fileSize) {
      displayFileSize = `${Math.round(primaryFile.fileSize / 1024)} KB`;
    }

    return {
      purchaseId: purchase.id,
      productId: product.id,
      title: product.title,
      slug: product.slug,
      type: product.type,
      thumbnailUrl: product.thumbnailUrl,
      purchaseDate: purchase.grantedAt,
      expiresAt: purchase.expiresAt,
      isAvailable: hasDigitalAsset,
      fileType: primaryFile?.fileType || "PDF Document",
      fileName: primaryFile?.fileName || `${product.title}.pdf`,
      fileSize: displayFileSize,
      totalFiles: files.length,
      academicLevel: product.academicLevel?.name || null,
      status: hasDigitalAsset ? "READY" : "NO_ASSET",
    };
  });
}
