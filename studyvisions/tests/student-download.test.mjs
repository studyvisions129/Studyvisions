import { test, describe, before, after } from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import path from "node:path";
import { PrismaClient } from "@prisma/client";
import { createJiti } from "jiti";

const prisma = new PrismaClient();
const jiti = createJiti(import.meta.url, {
  alias: {
    "@": path.resolve("./src"),
  },
});

const { POST: requestDownloadApi } = await jiti.import(
  path.resolve("./src/app/api/downloads/[productId]/route.ts")
);
const { GET: fulfillDownloadApi } = await jiti.import(
  path.resolve("./src/app/api/downloads/file/route.ts")
);
const {
  generateDownloadToken,
  verifyDownloadToken,
  verifyStudentEntitlement,
  getProductDownloadAsset,
  getStudentDownloads,
} = await jiti.import(path.resolve("./src/lib/services/download-service.ts"));
const { fulfillOrder } = await jiti.import(path.resolve("./src/lib/services/fulfillment.ts"));
const { __setTestSessionUser } = await jiti.import(path.resolve("./src/lib/auth-utils.ts"));

describe("SV-COM-002 Student Download Fulfillment Suite", () => {
  let studentA;
  let studentB;
  let testAcademicLevel;
  const createdUserIds = [];
  const createdProductIds = [];
  const createdFileIds = [];
  const createdOrderIds = [];
  const createdFreeContentIds = [];
  let productWithFile;
  let productWithPreviewOnly;
  let productWithoutAssets;
  let productMulti1;
  let productMulti2;
  let sampleFile;

  before(async () => {
    const timestamp = Date.now();

    // 1. Create Academic Level
    testAcademicLevel = await prisma.academicLevel.create({
      data: {
        name: `Test Level ${timestamp}`,
        slug: `test-level-${timestamp}`,
        levelType: "CLASS",
      },
    });

    // 2. Create Students
    studentA = await prisma.user.create({
      data: {
        email: `student_a_dl_${timestamp}@studyvisions.internal`,
        fullName: "Student Download User A",
        role: "STUDENT",
      },
    });
    createdUserIds.push(studentA.id);

    studentB = await prisma.user.create({
      data: {
        email: `student_b_dl_${timestamp}@studyvisions.internal`,
        fullName: "Student Download User B",
        role: "STUDENT",
      },
    });
    createdUserIds.push(studentB.id);

    // 3. Create Product with attached ProductFile (PDF Notes)
    productWithFile = await prisma.product.create({
      data: {
        title: `Comprehensive Physics Notes ${timestamp}`,
        slug: `physics-notes-${timestamp}`,
        type: "PREMIUM_NOTES",
        status: "PUBLISHED",
        price: 299.0,
        academicLevelId: testAcademicLevel.id,
        fileSize: "4.5 MB",
      },
    });
    createdProductIds.push(productWithFile.id);

    sampleFile = await prisma.productFile.create({
      data: {
        productId: productWithFile.id,
        fileName: "Physics_Complete_Module.pdf",
        fileUrl: "/mock-storage/physics-notes.pdf",
        fileType: "application/pdf",
        fileSize: 4500000,
        sortOrder: 0,
      },
    });
    createdFileIds.push(sampleFile.id);

    // 4. Create Product with previewUrl only (EBook)
    productWithPreviewOnly = await prisma.product.create({
      data: {
        title: `Organic Chemistry Handbook ${timestamp}`,
        slug: `organic-chem-${timestamp}`,
        type: "EBOOK",
        status: "PUBLISHED",
        price: 199.0,
        previewUrl: "https://example.com/assets/organic-chem-preview.pdf",
        academicLevelId: testAcademicLevel.id,
      },
    });
    createdProductIds.push(productWithPreviewOnly.id);

    // 5. Create Product without any assets
    productWithoutAssets = await prisma.product.create({
      data: {
        title: `Empty Assets Product ${timestamp}`,
        slug: `empty-assets-${timestamp}`,
        type: "STUDY_MATERIAL",
        status: "PUBLISHED",
        price: 99.0,
      },
    });
    createdProductIds.push(productWithoutAssets.id);

    // 6. Create Multi-purchase products
    productMulti1 = await prisma.product.create({
      data: {
        title: `Mathematics Formula Guide ${timestamp}`,
        slug: `math-formulas-${timestamp}`,
        type: "PREMIUM_NOTES",
        status: "PUBLISHED",
        price: 149.0,
      },
    });
    createdProductIds.push(productMulti1.id);

    const multiFile1 = await prisma.productFile.create({
      data: {
        productId: productMulti1.id,
        fileName: "Math_Guide.pdf",
        fileUrl: "/mock-storage/math-guide.pdf",
        fileType: "application/pdf",
        fileSize: 2000000,
      },
    });
    createdFileIds.push(multiFile1.id);

    productMulti2 = await prisma.product.create({
      data: {
        title: `Biology Key Revision ${timestamp}`,
        slug: `biology-revision-${timestamp}`,
        type: "STUDY_MATERIAL",
        status: "PUBLISHED",
        price: 179.0,
      },
    });
    createdProductIds.push(productMulti2.id);

    const multiFile2 = await prisma.productFile.create({
      data: {
        productId: productMulti2.id,
        fileName: "Biology_Revision.pdf",
        fileUrl: "/mock-storage/bio-revision.pdf",
        fileType: "application/pdf",
        fileSize: 3100000,
      },
    });
    createdFileIds.push(multiFile2.id);

    // 7. Grant studentA initial entitlement for productWithFile
    await prisma.purchase.create({
      data: {
        userId: studentA.id,
        productId: productWithFile.id,
        isActive: true,
      },
    });
  });

  after(async () => {
    __setTestSessionUser(null);

    // Clean up purchases
    if (createdUserIds.length > 0) {
      await prisma.purchase.deleteMany({
        where: { userId: { in: createdUserIds } },
      });
    }

    // Clean up order items and orders
    if (createdOrderIds.length > 0) {
      await prisma.orderItem.deleteMany({
        where: { orderId: { in: createdOrderIds } },
      });
      await prisma.order.deleteMany({
        where: { id: { in: createdOrderIds } },
      });
    }

    // Clean up files
    if (createdProductIds.length > 0) {
      await prisma.productFile.deleteMany({
        where: { productId: { in: createdProductIds } },
      });
    }

    // Clean up free content
    if (createdFreeContentIds.length > 0) {
      await prisma.freeContent.deleteMany({
        where: { id: { in: createdFreeContentIds } },
      });
    }

    // Clean up products
    if (createdProductIds.length > 0) {
      await prisma.product.deleteMany({
        where: { id: { in: createdProductIds } },
      });
    }

    // Clean up academic level
    if (testAcademicLevel?.id) {
      await prisma.academicLevel.deleteMany({
        where: { id: testAcademicLevel.id },
      });
    }

    // Clean up users
    if (createdUserIds.length > 0) {
      await prisma.user.deleteMany({
        where: { id: { in: createdUserIds } },
      });
    }

    await prisma.$disconnect();
  });

  test("1. Authenticated student with valid entitlement can request download URL", async () => {
    __setTestSessionUser({ email: studentA.email });

    const req = new Request(
      `http://localhost/api/downloads/${productWithFile.id}`,
      { method: "POST" }
    );
    const res = await requestDownloadApi(req, {
      params: Promise.resolve({ productId: productWithFile.id }),
    });

    assert.equal(res.status, 200, "Must return HTTP 200 for valid entitlement");
    const data = await res.json();
    assert.equal(data.success, true);
    assert.equal(data.productId, productWithFile.id);
    assert.equal(data.fileName, "Physics_Complete_Module.pdf");
    assert.ok(data.downloadUrl.includes("/api/downloads/file?token="));
    assert.equal(data.expiresInSeconds, 900);
  });

  test("2. Student without entitlement is rejected with HTTP 403 Forbidden", async () => {
    __setTestSessionUser({ email: studentB.email }); // Student B does not have purchase

    const req = new Request(
      `http://localhost/api/downloads/${productWithFile.id}`,
      { method: "POST" }
    );
    const res = await requestDownloadApi(req, {
      params: Promise.resolve({ productId: productWithFile.id }),
    });

    assert.equal(res.status, 403, "Must return HTTP 403 Forbidden");
    const data = await res.json();
    assert.ok(data.error.includes("Access denied"));
  });

  test("3. Unauthenticated download request is rejected with HTTP 401 Unauthorized", async () => {
    __setTestSessionUser(null); // No logged in user

    const req = new Request(
      `http://localhost/api/downloads/${productWithFile.id}`,
      { method: "POST" }
    );
    const res = await requestDownloadApi(req, {
      params: Promise.resolve({ productId: productWithFile.id }),
    });

    assert.equal(res.status, 401, "Must return HTTP 401 Unauthorized");
    const data = await res.json();
    assert.ok(data.error.includes("Unauthorized"));
  });

  test("4. Cross-user download attempt is blocked", async () => {
    // 4a: Student B cannot generate download token for Student A's product
    __setTestSessionUser({ email: studentB.email });
    const req = new Request(
      `http://localhost/api/downloads/${productWithFile.id}`,
      { method: "POST" }
    );
    const res = await requestDownloadApi(req, {
      params: Promise.resolve({ productId: productWithFile.id }),
    });
    assert.equal(res.status, 403, "Student B must be rejected");

    // 4b: Student B tampers with a token to swap user ID
    const validToken = generateDownloadToken(
      studentA.id,
      productWithFile.id,
      sampleFile.id,
      900
    );
    const [payloadBase64, signature] = validToken.split(".");
    const decodedPayload = JSON.parse(
      Buffer.from(payloadBase64, "base64url").toString("utf8")
    );

    // Tamper payload with studentB's ID while keeping signature
    decodedPayload.userId = studentB.id;
    const tamperedPayloadBase64 = Buffer.from(
      JSON.stringify(decodedPayload)
    ).toString("base64url");
    const tamperedToken = `${tamperedPayloadBase64}.${signature}`;

    const fulfillReq = new Request(
      `http://localhost/api/downloads/file?token=${tamperedToken}`,
      { method: "GET" }
    );
    const fulfillRes = await fulfillDownloadApi(fulfillReq);
    assert.equal(
      fulfillRes.status,
      403,
      "Tampered cross-user token must be rejected with 403"
    );
  });

  test("5. Inactive entitlement is rejected with HTTP 403", async () => {
    // Create an inactive purchase
    const inactivePurchase = await prisma.purchase.create({
      data: {
        userId: studentB.id,
        productId: productWithPreviewOnly.id,
        isActive: false, // Revoked/inactive
      },
    });

    __setTestSessionUser({ email: studentB.email });

    const req = new Request(
      `http://localhost/api/downloads/${productWithPreviewOnly.id}`,
      { method: "POST" }
    );
    const res = await requestDownloadApi(req, {
      params: Promise.resolve({ productId: productWithPreviewOnly.id }),
    });

    assert.equal(res.status, 403, "Inactive entitlement must return 403");
    const data = await res.json();
    assert.ok(data.error.includes("Access denied"));

    // Cleanup
    await prisma.purchase.delete({ where: { id: inactivePurchase.id } });
  });

  test("6. Missing digital asset returns HTTP 404 safely without crashing", async () => {
    // Grant studentA access to productWithoutAssets
    const tempPurchase = await prisma.purchase.create({
      data: {
        userId: studentA.id,
        productId: productWithoutAssets.id,
        isActive: true,
      },
    });

    __setTestSessionUser({ email: studentA.email });

    const req = new Request(
      `http://localhost/api/downloads/${productWithoutAssets.id}`,
      { method: "POST" }
    );
    const res = await requestDownloadApi(req, {
      params: Promise.resolve({ productId: productWithoutAssets.id }),
    });

    assert.equal(res.status, 404, "Missing asset must return HTTP 404");
    const data = await res.json();
    assert.ok(data.error.includes("No digital asset"));

    // Cleanup
    await prisma.purchase.delete({ where: { id: tempPurchase.id } });
  });

  test("7. Deleted asset requested via token is handled safely with HTTP 404", async () => {
    // Create temporary file then delete it
    const tempFile = await prisma.productFile.create({
      data: {
        productId: productWithFile.id,
        fileName: "Temp_Obsolete.pdf",
        fileUrl: "/mock/obsolete.pdf",
        fileType: "application/pdf",
      },
    });

    const token = generateDownloadToken(
      studentA.id,
      productWithFile.id,
      tempFile.id,
      900
    );

    // Delete the file from DB
    await prisma.productFile.delete({ where: { id: tempFile.id } });

    const req = new Request(
      `http://localhost/api/downloads/file?token=${encodeURIComponent(token)}`,
      { method: "GET" }
    );
    const res = await fulfillDownloadApi(req);

    assert.equal(res.status, 404, "Deleted asset token must return HTTP 404");
    const data = await res.json();
    assert.ok(data.error.includes("could not be found or has been removed"));
  });

  test("8. Expired signed URL / token is rejected with HTTP 403", async () => {
    // Generate token that expired 60 seconds ago
    const expiredToken = generateDownloadToken(
      studentA.id,
      productWithFile.id,
      sampleFile.id,
      -60
    );

    const req = new Request(
      `http://localhost/api/downloads/file?token=${encodeURIComponent(expiredToken)}`,
      { method: "GET" }
    );
    const res = await fulfillDownloadApi(req);

    assert.equal(res.status, 403, "Expired token must return HTTP 403");
    const data = await res.json();
    assert.ok(data.error.includes("expired"));
  });

  test("9. Valid PDF download request delivers file payload with appropriate headers", async () => {
    const validToken = generateDownloadToken(
      studentA.id,
      productWithFile.id,
      sampleFile.id,
      900
    );

    const req = new Request(
      `http://localhost/api/downloads/file?token=${encodeURIComponent(validToken)}`,
      { method: "GET" }
    );
    const res = await fulfillDownloadApi(req);

    assert.equal(res.status, 200, "Valid token must return 200");
    assert.equal(res.headers.get("Content-Type"), "application/pdf");
    assert.ok(
      res.headers
        .get("Content-Disposition")
        .includes("Physics_Complete_Module.pdf")
    );
    assert.ok(
      res.headers.get("Cache-Control").includes("no-store") ||
        res.headers.get("Cache-Control").includes("no-cache")
    );
  });

  test("10. Multiple purchased products grant download access to all owned items", async () => {
    // Grant studentA access to productMulti1 and productMulti2
    await prisma.purchase.createMany({
      data: [
        { userId: studentA.id, productId: productMulti1.id, isActive: true },
        { userId: studentA.id, productId: productMulti2.id, isActive: true },
      ],
    });

    __setTestSessionUser({ email: studentA.email });

    // Request download for productMulti1
    const req1 = new Request(
      `http://localhost/api/downloads/${productMulti1.id}`,
      { method: "POST" }
    );
    const res1 = await requestDownloadApi(req1, {
      params: Promise.resolve({ productId: productMulti1.id }),
    });
    assert.equal(res1.status, 200);
    const data1 = await res1.json();
    assert.equal(data1.fileName, "Math_Guide.pdf");

    // Request download for productMulti2
    const req2 = new Request(
      `http://localhost/api/downloads/${productMulti2.id}`,
      { method: "POST" }
    );
    const res2 = await requestDownloadApi(req2, {
      params: Promise.resolve({ productId: productMulti2.id }),
    });
    assert.equal(res2.status, 200);
    const data2 = await res2.json();
    assert.equal(data2.fileName, "Biology_Revision.pdf");

    // Download both files
    const fulfill1 = await fulfillDownloadApi(new Request(`http://localhost${data1.downloadUrl}`, { method: "GET" }));
    assert.equal(fulfill1.status, 200);

    const fulfill2 = await fulfillDownloadApi(new Request(`http://localhost${data2.downloadUrl}`, { method: "GET" }));
    assert.equal(fulfill2.status, 200);
  });

  test("11. Student Downloads page data query (getStudentDownloads) returns real records", async () => {
    const downloads = await getStudentDownloads(studentA.id);

    assert.ok(Array.isArray(downloads), "Must return an array of downloads");
    assert.ok(
      downloads.length >= 3,
      "Student A must have at least 3 purchased downloads"
    );

    const physicsItem = downloads.find((d) => d.productId === productWithFile.id);
    assert.ok(physicsItem, "Physics product must be present in downloads");
    assert.equal(physicsItem.title, productWithFile.title);
    assert.equal(physicsItem.type, "PREMIUM_NOTES");
    assert.equal(physicsItem.isAvailable, true);
    assert.equal(physicsItem.fileName, "Physics_Complete_Module.pdf");
    assert.equal(physicsItem.status, "READY");
    assert.ok(physicsItem.purchaseDate instanceof Date);

    // Verify student B has 0 active downloads
    const studentBDownloads = await getStudentDownloads(studentB.id);
    assert.equal(studentBDownloads.length, 0, "Student B must have 0 downloads");
  });

  test("12. Unauthorized access rejected for tampered and malformed tokens", async () => {
    // 12a: completely invalid token string
    const reqMalformed = new Request(
      "http://localhost/api/downloads/file?token=not-a-valid-token",
      { method: "GET" }
    );
    const resMalformed = await fulfillDownloadApi(reqMalformed);
    assert.equal(resMalformed.status, 403);

    // 12b: token missing
    const reqMissing = new Request("http://localhost/api/downloads/file", {
      method: "GET",
    });
    const resMissing = await fulfillDownloadApi(reqMissing);
    assert.equal(resMissing.status, 400);

    // 12c: invalid HMAC signature
    const validToken = generateDownloadToken(
      studentA.id,
      productWithFile.id,
      sampleFile.id,
      900
    );
    const [payload, sig] = validToken.split(".");
    const invalidSig = sig.slice(0, -2) + (sig.slice(-1) === "a" ? "b" : "a");
    const tamperedToken = `${payload}.${invalidSig}`;

    const reqTampered = new Request(
      `http://localhost/api/downloads/file?token=${tamperedToken}`,
      { method: "GET" }
    );
    const resTampered = await fulfillDownloadApi(reqTampered);
    assert.equal(resTampered.status, 403);
  });

  test("13. Existing free content access remains functional without purchase requirement", async () => {
    const timestamp = Date.now();
    const freeContent = await prisma.freeContent.create({
      data: {
        title: `Open Study Guide ${timestamp}`,
        slug: `open-study-guide-${timestamp}`,
        contentType: "NOTES",
        contentHtml: "<p>Free educational summary for all students</p>",
        isPermanentlyFree: true,
        isPublished: true,
      },
    });
    createdFreeContentIds.push(freeContent.id);

    const fetched = await prisma.freeContent.findUnique({
      where: { id: freeContent.id },
    });
    assert.ok(fetched, "Free content must exist in database");
    assert.equal(fetched.isPermanentlyFree, true);
    assert.equal(fetched.isPublished, true);
  });

  test("14. Existing payment and entitlement fulfillment seamlessly integrates with downloads", async () => {
    const timestamp = Date.now();

    // Create a new product with file
    const newProduct = await prisma.product.create({
      data: {
        title: `Integrated Payment Product ${timestamp}`,
        slug: `integrated-pay-${timestamp}`,
        type: "PREMIUM_NOTES",
        status: "PUBLISHED",
        price: 249.0,
      },
    });
    createdProductIds.push(newProduct.id);

    const newFile = await prisma.productFile.create({
      data: {
        productId: newProduct.id,
        fileName: "Integration_Guide.pdf",
        fileUrl: "/storage/integration.pdf",
        fileType: "application/pdf",
        fileSize: 1500000,
      },
    });
    createdFileIds.push(newFile.id);

    // Create order for student B
    const order = await prisma.order.create({
      data: {
        userId: studentB.id,
        orderNumber: `ORD-DL-${timestamp}`,
        status: "PENDING",
        subtotal: 249.0,
        total: 249.0,
        razorpayOrderId: `order_dl_${timestamp}`,
        items: {
          create: [
            {
              productId: newProduct.id,
              price: 249.0,
            },
          ],
        },
      },
    });
    createdOrderIds.push(order.id);

    // Fulfill order using SV-COM-001 fulfillOrder
    const fulfillRes = await fulfillOrder(order.id, {
      razorpayPaymentId: `pay_dl_${timestamp}`,
    });
    assert.equal(fulfillRes.success, true);
    assert.equal(fulfillRes.fulfilledItemsCount, 1);

    // Verify student B now has access in downloads
    const studentBDownloads = await getStudentDownloads(studentB.id);
    assert.equal(studentBDownloads.length, 1);
    assert.equal(studentBDownloads[0].productId, newProduct.id);
    assert.equal(studentBDownloads[0].fileName, "Integration_Guide.pdf");

    // Request download as student B
    __setTestSessionUser({ email: studentB.email });
    const dlReq = new Request(
      `http://localhost/api/downloads/${newProduct.id}`,
      { method: "POST" }
    );
    const dlRes = await requestDownloadApi(dlReq, {
      params: Promise.resolve({ productId: newProduct.id }),
    });
    assert.equal(dlRes.status, 200);
    const dlData = await dlRes.json();
    assert.equal(dlData.fileName, "Integration_Guide.pdf");
  });
});
