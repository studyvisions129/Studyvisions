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

const { POST: verifyPayment } = await jiti.import(path.resolve("./src/app/api/checkout/verify/route.ts"));
const { POST: handleWebhook } = await jiti.import(path.resolve("./src/app/api/checkout/webhook/route.ts"));

describe("SV-SEC-001 Payment Verification & Webhook Security Hardening", () => {
  let originalKeySecret;
  let originalWebhookSecret;
  let testUser;
  let testProduct;
  const createdOrderIds = [];

  const TEST_KEY_SECRET = "test_rzp_key_secret_for_hardening_suite_9876";
  const TEST_WEBHOOK_SECRET = "test_rzp_webhook_secret_for_hardening_suite_5432";

  before(async () => {
    // Preserve existing environment variables
    originalKeySecret = process.env.RAZORPAY_KEY_SECRET;
    originalWebhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    // Discover published product
    testProduct = await prisma.product.findFirst({ where: { status: "PUBLISHED" } });
    assert.ok(testProduct, "A published product must exist in the database");

    // Create an isolated student user for security test suite
    testUser = await prisma.user.create({
      data: {
        email: `sec_test_${Date.now()}_${Math.floor(Math.random() * 10000)}@studyvisions.internal`,
        fullName: "SV-SEC Security Hardening Auditor",
        role: "STUDENT",
      },
    });
    assert.ok(testUser.id, "Security test user must be created");
  });

  after(async () => {
    // Restore original environment variables
    if (originalKeySecret !== undefined) {
      process.env.RAZORPAY_KEY_SECRET = originalKeySecret;
    } else {
      delete process.env.RAZORPAY_KEY_SECRET;
    }

    if (originalWebhookSecret !== undefined) {
      process.env.RAZORPAY_WEBHOOK_SECRET = originalWebhookSecret;
    } else {
      delete process.env.RAZORPAY_WEBHOOK_SECRET;
    }

    // Teardown: delete any created purchases, order items, orders and user
    if (testUser?.id) {
      await prisma.purchase.deleteMany({ where: { userId: testUser.id } });
      if (createdOrderIds.length > 0) {
        await prisma.orderItem.deleteMany({ where: { orderId: { in: createdOrderIds } } });
        await prisma.order.deleteMany({ where: { id: { in: createdOrderIds } } });
      }
      await prisma.user.delete({ where: { id: testUser.id } }).catch(() => {});
    }
  });

  // Helper to create a test order in the DB
  async function createTestOrder(customRzpOrderId) {
    const rzpOrderId = customRzpOrderId || `rzp_sec_ord_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
    const orderNumber = `SEC-ORD-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const price = Number(testProduct.price);

    const order = await prisma.order.create({
      data: {
        userId: testUser.id,
        orderNumber,
        status: "PENDING",
        subtotal: price,
        discount: 0,
        total: price,
        currency: "INR",
        razorpayOrderId: rzpOrderId,
        items: {
          create: {
            productId: testProduct.id,
            price: price,
          },
        },
      },
      include: { items: true },
    });

    createdOrderIds.push(order.id);
    return order;
  }

  // 1. Missing payment verification secret
  test("1. Missing payment verification secret: fails closed, rejects verification, does not mark PAID", async () => {
    delete process.env.RAZORPAY_KEY_SECRET;

    const order = await createTestOrder();
    const req = new Request("http://localhost/api/checkout/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId: order.id,
        razorpay_order_id: order.razorpayOrderId,
        razorpay_payment_id: "pay_mock_123",
        razorpay_signature: "mock_signature_attempt",
      }),
    });

    const res = await verifyPayment(req);
    const body = await res.json();

    assert.equal(res.status, 500, "Must return HTTP 500 when RAZORPAY_KEY_SECRET is unconfigured");
    assert.equal(body.error, "Payment verification service is unavailable");

    // Verify DB order remains PENDING
    const dbOrder = await prisma.order.findUnique({ where: { id: order.id } });
    assert.equal(dbOrder.status, "PENDING", "Order status must remain PENDING");
    assert.equal(dbOrder.paidAt, null, "paidAt must remain null");

    // Verify product access was not granted
    const purchase = await prisma.purchase.findUnique({
      where: { userId_productId: { userId: testUser.id, productId: testProduct.id } },
    });
    assert.equal(purchase, null, "Product access must not be granted");
  });

  // 2. Missing webhook secret
  test("2. Missing webhook secret: fails closed, rejects webhook, does not mark PAID", async () => {
    delete process.env.RAZORPAY_WEBHOOK_SECRET;

    const order = await createTestOrder();
    const payload = JSON.stringify({
      event: "payment.captured",
      payload: {
        payment: {
          entity: {
            id: "pay_wh_missing_secret",
            order_id: order.razorpayOrderId,
          },
        },
      },
    });

    const req = new Request("http://localhost/api/checkout/webhook", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-razorpay-signature": "forged_or_any_signature",
      },
      body: payload,
    });

    const res = await handleWebhook(req);
    const body = await res.json();

    assert.equal(res.status, 500, "Must return HTTP 500 when RAZORPAY_WEBHOOK_SECRET is unconfigured");
    assert.equal(body.error, "Webhook verification service is unavailable");

    // Verify DB order remains PENDING
    const dbOrder = await prisma.order.findUnique({ where: { id: order.id } });
    assert.equal(dbOrder.status, "PENDING", "Order status must remain PENDING");

    // Verify product access was not granted
    const purchase = await prisma.purchase.findUnique({
      where: { userId_productId: { userId: testUser.id, productId: testProduct.id } },
    });
    assert.equal(purchase, null, "Product access must not be granted");
  });

  // 3. Valid payment signature
  test("3. Valid payment signature: verifies server-side, transitions to PAID, grants access", async () => {
    process.env.RAZORPAY_KEY_SECRET = TEST_KEY_SECRET;

    const order = await createTestOrder();
    const paymentId = `pay_valid_${Date.now()}`;
    const signature = crypto
      .createHmac("sha256", TEST_KEY_SECRET)
      .update(order.razorpayOrderId + "|" + paymentId)
      .digest("hex");

    const req = new Request("http://localhost/api/checkout/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId: order.id,
        razorpay_order_id: order.razorpayOrderId,
        razorpay_payment_id: paymentId,
        razorpay_signature: signature,
      }),
    });

    const res = await verifyPayment(req);
    const body = await res.json();

    assert.equal(res.status, 200, "Must return HTTP 200 on valid signature");
    assert.equal(body.success, true);

    // Verify DB order transitioned to PAID
    const dbOrder = await prisma.order.findUnique({ where: { id: order.id } });
    assert.equal(dbOrder.status, "PAID", "Order status must transition to PAID");
    assert.equal(dbOrder.razorpayPaymentId, paymentId);
    assert.equal(dbOrder.razorpaySignature, signature);
    assert.ok(dbOrder.paidAt instanceof Date, "paidAt must be recorded");

    // Verify product access was granted
    const purchase = await prisma.purchase.findUnique({
      where: { userId_productId: { userId: testUser.id, productId: testProduct.id } },
    });
    assert.ok(purchase, "Purchase record must exist");
    assert.equal(purchase.isActive, true, "Purchase must be active");

    // Cleanup purchase for subsequent tests
    await prisma.purchase.deleteMany({ where: { userId: testUser.id } });
  });

  // 4. Invalid payment signature
  test("4. Invalid payment signature: rejected, order marked FAILED, access denied", async () => {
    process.env.RAZORPAY_KEY_SECRET = TEST_KEY_SECRET;

    const order = await createTestOrder();
    const paymentId = `pay_fake_${Date.now()}`;
    // Signature created with attacker's dummy secret 'xxx' or wrong key
    const forgedSignature = crypto
      .createHmac("sha256", "xxx")
      .update(order.razorpayOrderId + "|" + paymentId)
      .digest("hex");

    const req = new Request("http://localhost/api/checkout/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId: order.id,
        razorpay_order_id: order.razorpayOrderId,
        razorpay_payment_id: paymentId,
        razorpay_signature: forgedSignature,
      }),
    });

    const res = await verifyPayment(req);
    const body = await res.json();

    assert.equal(res.status, 400, "Must return HTTP 400 on invalid signature");
    assert.equal(body.error, "Invalid signature");

    // Verify DB order status is FAILED
    const dbOrder = await prisma.order.findUnique({ where: { id: order.id } });
    assert.equal(dbOrder.status, "FAILED", "Order status must transition to FAILED");

    // Verify product access was not granted
    const purchase = await prisma.purchase.findUnique({
      where: { userId_productId: { userId: testUser.id, productId: testProduct.id } },
    });
    assert.equal(purchase, null, "Product access must not be granted");
  });

  // 5. Valid webhook signature
  test("5. Valid webhook signature: uses RAZORPAY_WEBHOOK_SECRET, marks PAID, grants access", async () => {
    process.env.RAZORPAY_WEBHOOK_SECRET = TEST_WEBHOOK_SECRET;

    const order = await createTestOrder();
    const paymentId = `pay_wh_${Date.now()}`;
    const payload = JSON.stringify({
      event: "payment.captured",
      payload: {
        payment: {
          entity: {
            id: paymentId,
            order_id: order.razorpayOrderId,
          },
        },
      },
    });

    const validSignature = crypto
      .createHmac("sha256", TEST_WEBHOOK_SECRET)
      .update(payload)
      .digest("hex");

    const req = new Request("http://localhost/api/checkout/webhook", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-razorpay-signature": validSignature,
      },
      body: payload,
    });

    const res = await handleWebhook(req);
    const body = await res.json();

    assert.equal(res.status, 200, "Must return HTTP 200 on valid webhook signature");
    assert.equal(body.status, "ok");

    // Verify DB order transitioned to PAID
    const dbOrder = await prisma.order.findUnique({ where: { id: order.id } });
    assert.equal(dbOrder.status, "PAID", "Order status must transition to PAID");
    assert.equal(dbOrder.razorpayPaymentId, paymentId);
    assert.ok(dbOrder.paidAt instanceof Date);

    // Verify product access was granted
    const purchase = await prisma.purchase.findUnique({
      where: { userId_productId: { userId: testUser.id, productId: testProduct.id } },
    });
    assert.ok(purchase, "Purchase record must exist");
    assert.equal(purchase.isActive, true);
  });

  // 6. Invalid webhook signature
  test("6. Invalid webhook signature: rejected, order remains unpaid, access denied", async () => {
    process.env.RAZORPAY_WEBHOOK_SECRET = TEST_WEBHOOK_SECRET;

    const order = await createTestOrder();
    const payload = JSON.stringify({
      event: "payment.captured",
      payload: {
        payment: {
          entity: {
            id: `pay_attacker_${Date.now()}`,
            order_id: order.razorpayOrderId,
          },
        },
      },
    });

    // Attacker signs payload with fallback 'xxx'
    const forgedSignature = crypto
      .createHmac("sha256", "xxx")
      .update(payload)
      .digest("hex");

    const req = new Request("http://localhost/api/checkout/webhook", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-razorpay-signature": forgedSignature,
      },
      body: payload,
    });

    const res = await handleWebhook(req);
    const body = await res.json();

    assert.equal(res.status, 400, "Must return HTTP 400 on invalid webhook signature");
    assert.equal(body.error, "Invalid signature");

    // Verify DB order was not updated to PAID
    const dbOrder = await prisma.order.findUnique({ where: { id: order.id } });
    assert.equal(dbOrder.status, "PENDING", "Order status must remain PENDING");
  });

  // 7. Duplicate webhook event
  test("7. Duplicate webhook event: idempotent, returns 200 ok, does not duplicate orders or entitlements", async () => {
    process.env.RAZORPAY_WEBHOOK_SECRET = TEST_WEBHOOK_SECRET;

    const order = await createTestOrder();
    const paymentId = `pay_wh_dup_${Date.now()}`;
    const payload = JSON.stringify({
      event: "payment.captured",
      payload: {
        payment: {
          entity: {
            id: paymentId,
            order_id: order.razorpayOrderId,
          },
        },
      },
    });

    const signature = crypto
      .createHmac("sha256", TEST_WEBHOOK_SECRET)
      .update(payload)
      .digest("hex");

    // First webhook delivery
    const req1 = new Request("http://localhost/api/checkout/webhook", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-razorpay-signature": signature },
      body: payload,
    });
    const res1 = await handleWebhook(req1);
    assert.equal(res1.status, 200);

    const initialPaidAt = (await prisma.order.findUnique({ where: { id: order.id } })).paidAt;

    // Duplicate webhook delivery
    const req2 = new Request("http://localhost/api/checkout/webhook", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-razorpay-signature": signature },
      body: payload,
    });
    const res2 = await handleWebhook(req2);
    const body2 = await res2.json();

    assert.equal(res2.status, 200, "Duplicate webhook must return HTTP 200");
    assert.equal(body2.status, "ok");

    // Verify order is still singular and unchanged
    const dbOrder = await prisma.order.findUnique({ where: { id: order.id } });
    assert.equal(dbOrder.status, "PAID");
    assert.equal(dbOrder.paidAt.getTime(), initialPaidAt.getTime(), "paidAt must remain original timestamp");

    // Verify entitlement count is exactly 1
    const purchaseCount = await prisma.purchase.count({
      where: { userId: testUser.id, productId: testProduct.id },
    });
    assert.equal(purchaseCount, 1, "Entitlements must not be duplicated");

    // Cleanup purchase
    await prisma.purchase.deleteMany({ where: { userId: testUser.id } });
  });

  // 8. Repeated payment verification
  test("8. Repeated payment verification: already PAID order is rejected with 400", async () => {
    process.env.RAZORPAY_KEY_SECRET = TEST_KEY_SECRET;

    const order = await createTestOrder();
    const paymentId = `pay_repeated_${Date.now()}`;
    const signature = crypto
      .createHmac("sha256", TEST_KEY_SECRET)
      .update(order.razorpayOrderId + "|" + paymentId)
      .digest("hex");

    // First verification -> succeeds
    const req1 = new Request("http://localhost/api/checkout/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId: order.id,
        razorpay_order_id: order.razorpayOrderId,
        razorpay_payment_id: paymentId,
        razorpay_signature: signature,
      }),
    });
    const res1 = await verifyPayment(req1);
    assert.equal(res1.status, 200);

    // Repeated verification attempt
    const req2 = new Request("http://localhost/api/checkout/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId: order.id,
        razorpay_order_id: order.razorpayOrderId,
        razorpay_payment_id: paymentId,
        razorpay_signature: signature,
      }),
    });
    const res2 = await verifyPayment(req2);
    const body2 = await res2.json();

    assert.equal(res2.status, 400, "Repeated verification must return HTTP 400");
    assert.equal(body2.error, "Order already paid");

    // Cleanup purchase
    await prisma.purchase.deleteMany({ where: { userId: testUser.id } });
  });

  // 9. Failed payment
  test("9. Failed payment: webhook payment.failed transitions order to FAILED without granting access", async () => {
    process.env.RAZORPAY_WEBHOOK_SECRET = TEST_WEBHOOK_SECRET;

    const order = await createTestOrder();
    const payload = JSON.stringify({
      event: "payment.failed",
      payload: {
        payment: {
          entity: {
            id: `pay_failed_${Date.now()}`,
            order_id: order.razorpayOrderId,
          },
        },
      },
    });

    const signature = crypto
      .createHmac("sha256", TEST_WEBHOOK_SECRET)
      .update(payload)
      .digest("hex");

    const req = new Request("http://localhost/api/checkout/webhook", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-razorpay-signature": signature },
      body: payload,
    });

    const res = await handleWebhook(req);
    const body = await res.json();

    assert.equal(res.status, 200);
    assert.equal(body.status, "ok");

    // Verify DB order transitioned to FAILED
    const dbOrder = await prisma.order.findUnique({ where: { id: order.id } });
    assert.equal(dbOrder.status, "FAILED", "Order status must be FAILED");

    // Verify product access was not granted
    const purchase = await prisma.purchase.findUnique({
      where: { userId_productId: { userId: testUser.id, productId: testProduct.id } },
    });
    assert.equal(purchase, null, "Product access must not be granted");
  });

  // 10. Order status cannot be changed to PAID without verification
  test("10. Order status cannot be changed to PAID without verification (parameter tampering & header bypass)", async () => {
    process.env.RAZORPAY_KEY_SECRET = TEST_KEY_SECRET;
    process.env.RAZORPAY_WEBHOOK_SECRET = TEST_WEBHOOK_SECRET;

    // 10a. Missing signature header in webhook
    const order1 = await createTestOrder();
    const reqNoHeader = new Request("http://localhost/api/checkout/webhook", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event: "payment.captured" }),
    });
    const resNoHeader = await handleWebhook(reqNoHeader);
    assert.equal(resNoHeader.status, 400, "Missing signature header must be rejected with 400");
    const dbOrder1 = await prisma.order.findUnique({ where: { id: order1.id } });
    assert.equal(dbOrder1.status, "PENDING", "Order status must not change");

    // 10b. Missing parameters in verification request
    const order2 = await createTestOrder();
    const reqMissingParams = new Request("http://localhost/api/checkout/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId: order2.id }),
    });
    const resMissingParams = await verifyPayment(reqMissingParams);
    assert.equal(resMissingParams.status, 400, "Missing parameters must be rejected with 400");
    const dbOrder2 = await prisma.order.findUnique({ where: { id: order2.id } });
    assert.equal(dbOrder2.status, "PENDING", "Order status must not change");

    // 10c. Cross-order tampering: verifying order A with razorpay_order_id of order B
    const orderA = await createTestOrder("rzp_sec_order_A");
    const orderB = await createTestOrder("rzp_sec_order_B");
    const paymentId = `pay_tamper_${Date.now()}`;
    const sigForB = crypto
      .createHmac("sha256", TEST_KEY_SECRET)
      .update(orderB.razorpayOrderId + "|" + paymentId)
      .digest("hex");

    const reqTamper = new Request("http://localhost/api/checkout/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId: orderA.id, // Targeting Order A
        razorpay_order_id: orderB.razorpayOrderId, // Supplying Order B's razorpay ID
        razorpay_payment_id: paymentId,
        razorpay_signature: sigForB,
      }),
    });
    const resTamper = await verifyPayment(reqTamper);
    assert.equal(resTamper.status, 400, "Cross-order tampering must be rejected with 400");
    const dbOrderA = await prisma.order.findUnique({ where: { id: orderA.id } });
    assert.notEqual(dbOrderA.status, "PAID", "Order A must NEVER become PAID via mismatched order_id");

    // 10d. Webhook signed with RAZORPAY_KEY_SECRET instead of RAZORPAY_WEBHOOK_SECRET must fail
    const order3 = await createTestOrder();
    const payload3 = JSON.stringify({
      event: "payment.captured",
      payload: {
        payment: { entity: { id: `pay_wrong_secret_${Date.now()}`, order_id: order3.razorpayOrderId } },
      },
    });
    const sigWrongSecret = crypto
      .createHmac("sha256", TEST_KEY_SECRET) // Incorrectly using key secret instead of webhook secret
      .update(payload3)
      .digest("hex");

    const reqWrongSecret = new Request("http://localhost/api/checkout/webhook", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-razorpay-signature": sigWrongSecret },
      body: payload3,
    });
    const resWrongSecret = await handleWebhook(reqWrongSecret);
    assert.equal(resWrongSecret.status, 400, "Webhook signed with non-webhook secret must be rejected");
    const dbOrder3 = await prisma.order.findUnique({ where: { id: order3.id } });
    assert.equal(dbOrder3.status, "PENDING", "Order must remain PENDING");
  });

  // 11. Product access is not granted after failed verification
  test("11. Product access is not granted after failed verification", async () => {
    process.env.RAZORPAY_KEY_SECRET = TEST_KEY_SECRET;

    const order = await createTestOrder();
    const req = new Request("http://localhost/api/checkout/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId: order.id,
        razorpay_order_id: order.razorpayOrderId,
        razorpay_payment_id: "pay_failed_access",
        razorpay_signature: "completely_bogus_signature",
      }),
    });

    const res = await verifyPayment(req);
    assert.equal(res.status, 400);

    const purchase = await prisma.purchase.findUnique({
      where: { userId_productId: { userId: testUser.id, productId: testProduct.id } },
    });
    assert.equal(purchase, null, "User must NOT have access to the product after failed verification");
  });
});
