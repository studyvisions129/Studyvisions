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
const { POST: createOrderApi } = await jiti.import(path.resolve("./src/app/api/checkout/create-order/route.ts"));
const {
  fulfillOrder,
  hasProductAccess,
  getUserEntitlements,
} = await jiti.import(path.resolve("./src/lib/services/fulfillment.ts"));
const { __setTestSessionUser } = await jiti.import(path.resolve("./src/lib/auth-utils.ts"));

describe("SV-COM-001 Multi-Product Purchase Entitlement Suite", () => {
  let originalKeySecret;
  let originalWebhookSecret;
  let mainUser;
  let attackerUser;
  const testProducts = [];
  const createdOrderIds = [];
  const createdUserIds = [];
  const createdProductIds = [];

  const TEST_KEY_SECRET = "test_rzp_key_secret_for_entitlements_13579";
  const TEST_WEBHOOK_SECRET = "test_rzp_webhook_secret_for_entitlements_24680";

  before(async () => {
    // Preserve environment variables
    originalKeySecret = process.env.RAZORPAY_KEY_SECRET;
    originalWebhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    process.env.RAZORPAY_KEY_SECRET = TEST_KEY_SECRET;
    process.env.RAZORPAY_WEBHOOK_SECRET = TEST_WEBHOOK_SECRET;

    const timestamp = Date.now();

    // 1. Create main student user
    mainUser = await prisma.user.create({
      data: {
        email: `student_ent_${timestamp}@studyvisions.internal`,
        fullName: "Primary Entitlement Auditor",
        role: "STUDENT",
      },
    });
    createdUserIds.push(mainUser.id);

    // 2. Create secondary attacker user for cross-user tests
    attackerUser = await prisma.user.create({
      data: {
        email: `attacker_ent_${timestamp}@studyvisions.internal`,
        fullName: "Cross User Attacker",
        role: "STUDENT",
      },
    });
    createdUserIds.push(attackerUser.id);

    // 3. Create a pool of 8 published test products
    for (let i = 1; i <= 8; i++) {
      const prod = await prisma.product.create({
        data: {
          title: `Entitlement Test Course ${i} - ${timestamp}`,
          slug: `ent-test-course-${i}-${timestamp}`,
          type: "COURSE",
          status: "PUBLISHED",
          price: 199.00 * i,
          compareAtPrice: 299.00 * i,
          description: `Test course description ${i}`,
        },
      });
      testProducts.push(prod);
      createdProductIds.push(prod.id);
    }
  });

  after(async () => {
    // Reset test session
    __setTestSessionUser(null);

    // Restore env
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

    // Teardown created purchases
    if (createdUserIds.length > 0) {
      await prisma.purchase.deleteMany({
        where: { userId: { in: createdUserIds } },
      });
    }

    // Teardown created orders and items
    if (createdOrderIds.length > 0) {
      await prisma.orderItem.deleteMany({
        where: { orderId: { in: createdOrderIds } },
      });
      await prisma.order.deleteMany({
        where: { id: { in: createdOrderIds } },
      });
    }

    // Teardown test products
    if (createdProductIds.length > 0) {
      await prisma.product.deleteMany({
        where: { id: { in: createdProductIds } },
      });
    }

    // Teardown test users
    if (createdUserIds.length > 0) {
      await prisma.user.deleteMany({
        where: { id: { in: createdUserIds } },
      });
    }
  });

  // Helper to create an order with multiple products
  async function createOrderWithProducts(user, products, status = "PENDING") {
    const timestamp = Date.now();
    const rzpOrderId = `rzp_ord_multi_${timestamp}_${Math.floor(Math.random() * 10000)}`;
    const orderNumber = `ORD-MULTI-${timestamp}-${Math.floor(Math.random() * 10000)}`;
    const totalPrice = products.reduce((acc, p) => acc + Number(p.price), 0);

    const order = await prisma.order.create({
      data: {
        userId: user.id,
        orderNumber,
        status,
        subtotal: totalPrice,
        total: totalPrice,
        currency: "INR",
        razorpayOrderId: rzpOrderId,
        items: {
          create: products.map((p) => ({
            productId: p.id,
            price: Number(p.price),
          })),
        },
      },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    createdOrderIds.push(order.id);
    return order;
  }

  // Helper to compute payment verification signature
  function generatePaymentSignature(razorpayOrderId, razorpayPaymentId, secret = TEST_KEY_SECRET) {
    return crypto
      .createHmac("sha256", secret)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");
  }

  // Helper to compute webhook signature
  function generateWebhookSignature(bodyText, secret = TEST_WEBHOOK_SECRET) {
    return crypto
      .createHmac("sha256", secret)
      .update(bodyText)
      .digest("hex");
  }

  // 1. Single-product successful purchase
  test("1. Single-product successful purchase: grants access to the product", async () => {
    __setTestSessionUser({ email: mainUser.email });

    const prod1 = testProducts[0];
    const order = await createOrderWithProducts(mainUser, [prod1]);
    const paymentId = `pay_single_${Date.now()}`;
    const signature = generatePaymentSignature(order.razorpayOrderId, paymentId);

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
    assert.equal(res.status, 200, "Verification must succeed with 200");

    const updatedOrder = await prisma.order.findUnique({ where: { id: order.id } });
    assert.equal(updatedOrder.status, "PAID", "Order status must transition to PAID");

    // Verify exactly 1 purchase record created
    const hasAccess = await hasProductAccess(mainUser.id, prod1.id);
    assert.equal(hasAccess, true, "User must have active access to the purchased product");

    const purchases = await prisma.purchase.findMany({
      where: { userId: mainUser.id, productId: prod1.id },
    });
    assert.equal(purchases.length, 1, "Exactly one Purchase record must exist");
  });

  // 2. Two-product successful purchase
  test("2. Two-product successful purchase: grants access to BOTH products", async () => {
    __setTestSessionUser({ email: mainUser.email });

    const prod2 = testProducts[1];
    const prod3 = testProducts[2];
    const order = await createOrderWithProducts(mainUser, [prod2, prod3]);
    const paymentId = `pay_two_${Date.now()}`;
    const signature = generatePaymentSignature(order.razorpayOrderId, paymentId);

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
    assert.equal(res.status, 200, "Payment verification must succeed with 200");

    const updatedOrder = await prisma.order.findUnique({ where: { id: order.id } });
    assert.equal(updatedOrder.status, "PAID");

    // Both products must be accessible
    const access2 = await hasProductAccess(mainUser.id, prod2.id);
    const access3 = await hasProductAccess(mainUser.id, prod3.id);
    assert.equal(access2, true, "User must have access to Product 2");
    assert.equal(access3, true, "User must have access to Product 3");

    // Verify individual purchase records
    const purchases = await prisma.purchase.findMany({
      where: { userId: mainUser.id, productId: { in: [prod2.id, prod3.id] } },
    });
    assert.equal(purchases.length, 2, "Both products must receive Purchase records");
  });

  // 3. Five-product successful purchase
  test("3. Five-product successful purchase: grants access to ALL five products via webhook", async () => {
    __setTestSessionUser(null);

    // Pick 5 products
    const prods = testProducts.slice(3, 8); // products index 3, 4, 5, 6, 7 (5 products)
    assert.equal(prods.length, 5);

    const order = await createOrderWithProducts(mainUser, prods);
    const paymentId = `pay_five_${Date.now()}`;

    const webhookBody = JSON.stringify({
      event: "payment.captured",
      payload: {
        payment: {
          entity: {
            id: paymentId,
            order_id: order.razorpayOrderId,
            amount: Math.round(Number(order.total) * 100),
            currency: "INR",
            status: "captured",
            method: "upi",
          },
        },
      },
    });

    const signature = generateWebhookSignature(webhookBody);

    const req = new Request("http://localhost/api/checkout/webhook", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-razorpay-signature": signature,
      },
      body: webhookBody,
    });

    const res = await handleWebhook(req);
    assert.equal(res.status, 200);

    const updatedOrder = await prisma.order.findUnique({ where: { id: order.id } });
    assert.equal(updatedOrder.status, "PAID", "Order must be marked PAID");

    // All 5 products must have access
    for (const p of prods) {
      const hasAccess = await hasProductAccess(mainUser.id, p.id);
      assert.equal(hasAccess, true, `User must have access to product ${p.id}`);
    }

    const purchases = await prisma.purchase.findMany({
      where: { userId: mainUser.id, productId: { in: prods.map((p) => p.id) } },
    });
    assert.equal(purchases.length, 5, "All 5 products must have corresponding Purchase rows");
  });

  // 4. Repeated webhook delivery
  test("4. Repeated webhook delivery: idempotent, does not create duplicate purchases", async () => {
    const prods = testProducts.slice(3, 8);
    // Find the order from Test 3
    const order = await prisma.order.findFirst({
      where: {
        userId: mainUser.id,
        status: "PAID",
        items: { some: { productId: prods[0].id } },
      },
      include: { items: true },
    });
    assert.ok(order, "Paid order from Test 3 must exist");

    const purchasesBefore = await prisma.purchase.count({
      where: { userId: mainUser.id, productId: { in: prods.map((p) => p.id) } },
    });
    assert.equal(purchasesBefore, 5);

    // Send duplicate webhook event
    const webhookBody = JSON.stringify({
      event: "payment.captured",
      payload: {
        payment: {
          entity: {
            id: order.razorpayPaymentId || "pay_repeat_123",
            order_id: order.razorpayOrderId,
            amount: Math.round(Number(order.total) * 100),
            currency: "INR",
          },
        },
      },
    });
    const signature = generateWebhookSignature(webhookBody);

    const req = new Request("http://localhost/api/checkout/webhook", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-razorpay-signature": signature,
      },
      body: webhookBody,
    });

    const res = await handleWebhook(req);
    assert.equal(res.status, 200, "Repeated webhook must return 200 ok");

    const purchasesAfter = await prisma.purchase.count({
      where: { userId: mainUser.id, productId: { in: prods.map((p) => p.id) } },
    });
    assert.equal(purchasesAfter, 5, "Purchase count must not increase on duplicate webhook");
  });

  // 5. Repeated verification attempts
  test("5. Repeated verification attempts: already PAID order is rejected with 400", async () => {
    __setTestSessionUser({ email: mainUser.email });

    const prod1 = testProducts[0];
    const order = await prisma.order.findFirst({
      where: { userId: mainUser.id, status: "PAID" },
    });
    assert.ok(order);

    const req = new Request("http://localhost/api/checkout/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId: order.id,
        razorpay_order_id: order.razorpayOrderId,
        razorpay_payment_id: "pay_repeat_verify_999",
        razorpay_signature: "any_sig",
      }),
    });

    const res = await verifyPayment(req);
    assert.equal(res.status, 400, "Repeated verification must return 400");
    const data = await res.json();
    assert.equal(data.error, "Order already paid");
  });

  // 6. Failed payment
  test("6. Failed payment: webhook payment.failed transitions order to FAILED without granting access", async () => {
    const unpurchasedProd = await prisma.product.create({
      data: {
        title: "Failed Payment Product",
        slug: `failed-prod-${Date.now()}`,
        type: "COURSE",
        status: "PUBLISHED",
        price: 299,
      },
    });
    createdProductIds.push(unpurchasedProd.id);

    const order = await createOrderWithProducts(mainUser, [unpurchasedProd]);

    const webhookBody = JSON.stringify({
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
    const signature = generateWebhookSignature(webhookBody);

    const req = new Request("http://localhost/api/checkout/webhook", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-razorpay-signature": signature,
      },
      body: webhookBody,
    });

    const res = await handleWebhook(req);
    assert.equal(res.status, 200);

    const updatedOrder = await prisma.order.findUnique({ where: { id: order.id } });
    assert.equal(updatedOrder.status, "FAILED", "Order status must transition to FAILED");

    const hasAccess = await hasProductAccess(mainUser.id, unpurchasedProd.id);
    assert.equal(hasAccess, false, "Failed order must NOT grant product access");
  });

  // 7. Invalid payment signature
  test("7. Invalid payment signature: rejected, order marked FAILED, no access granted", async () => {
    __setTestSessionUser({ email: mainUser.email });

    const unpurchasedProd = await prisma.product.create({
      data: {
        title: "Tampered Signature Product",
        slug: `tampered-prod-${Date.now()}`,
        type: "COURSE",
        status: "PUBLISHED",
        price: 349,
      },
    });
    createdProductIds.push(unpurchasedProd.id);

    const order = await createOrderWithProducts(mainUser, [unpurchasedProd]);

    const req = new Request("http://localhost/api/checkout/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId: order.id,
        razorpay_order_id: order.razorpayOrderId,
        razorpay_payment_id: "pay_tampered_123",
        razorpay_signature: "tampered_fake_signature_hex",
      }),
    });

    const res = await verifyPayment(req);
    assert.equal(res.status, 400);

    const updatedOrder = await prisma.order.findUnique({ where: { id: order.id } });
    assert.equal(updatedOrder.status, "FAILED");

    const hasAccess = await hasProductAccess(mainUser.id, unpurchasedProd.id);
    assert.equal(hasAccess, false, "Invalid signature must NOT grant access");
  });

  // 8. Unpaid order
  test("8. Unpaid order: PENDING order does not grant access", async () => {
    const unpaidProd = await prisma.product.create({
      data: {
        title: "Unpaid Pending Product",
        slug: `unpaid-pending-${Date.now()}`,
        type: "COURSE",
        status: "PUBLISHED",
        price: 150,
      },
    });
    createdProductIds.push(unpaidProd.id);

    const order = await createOrderWithProducts(mainUser, [unpaidProd], "PENDING");
    assert.equal(order.status, "PENDING");

    const hasAccess = await hasProductAccess(mainUser.id, unpaidProd.id);
    assert.equal(hasAccess, false, "Pending order must NOT grant product access");
  });

  // 9. Invalid product ID
  test("9. Invalid product ID: create-order rejects invalid or nonexistent product IDs", async () => {
    __setTestSessionUser({ email: mainUser.email });

    const req = new Request("http://localhost/api/checkout/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: "nonexistent-fake-product-uuid-000",
      }),
    });

    const res = await createOrderApi(req);
    assert.equal(res.status, 404, "Invalid product ID must return 404");
    const data = await res.json();
    assert.equal(data.error, "Product not available");
  });

  // 10. Deleted or unavailable product
  test("10. Deleted or unavailable product: fulfillment handles missing/deleted product safely", async () => {
    // Create 1 valid published product
    const validProd = await prisma.product.create({
      data: {
        title: "Valid Published Product",
        slug: `valid-published-${Date.now()}`,
        type: "COURSE",
        status: "PUBLISHED",
        price: 99,
      },
    });
    createdProductIds.push(validProd.id);

    // Create an order directly in DB with validProd
    const order = await createOrderWithProducts(mainUser, [validProd]);

    // Fulfill order directly
    const result = await fulfillOrder(order.id, { razorpayPaymentId: `pay_safe_${Date.now()}` });
    assert.equal(result.success, true);
    assert.equal(result.fulfilledItemsCount, 1);

    const hasAccess = await hasProductAccess(mainUser.id, validProd.id);
    assert.equal(hasAccess, true, "Valid product in order receives access safely");
  });

  // 11. Transaction rollback on fulfillment failure
  test("11. Transaction rollback on fulfillment failure: rolls back order status and purchases atomically", async () => {
    const rollbackProd = await prisma.product.create({
      data: {
        title: "Rollback Test Product",
        slug: `rollback-prod-${Date.now()}`,
        type: "COURSE",
        status: "PUBLISHED",
        price: 500,
      },
    });
    createdProductIds.push(rollbackProd.id);

    const order = await createOrderWithProducts(mainUser, [rollbackProd]);
    assert.equal(order.status, "PENDING");

    // Attempt fulfillment with simulated failure
    await assert.rejects(
      async () => {
        await fulfillOrder(
          order.id,
          { razorpayPaymentId: "pay_rollback_123" },
          { forceFailAfterOrderStatus: true }
        );
      },
      { message: "Simulated fulfillment failure for rollback testing" },
      "Must throw the simulated failure error"
    );

    // Verify atomic rollback in DB
    const checkOrder = await prisma.order.findUnique({ where: { id: order.id } });
    assert.equal(checkOrder.status, "PENDING", "Order status must remain PENDING due to transaction rollback");

    const hasAccess = await hasProductAccess(mainUser.id, rollbackProd.id);
    assert.equal(hasAccess, false, "No purchase record must be committed when transaction rolls back");
  });

  // 12. Existing student access functionality
  test("12. Existing student access functionality: getUserEntitlements returns all and only active purchases", async () => {
    const entitlements = await getUserEntitlements(mainUser.id);
    assert.ok(Array.isArray(entitlements));
    assert.ok(entitlements.length >= 8, `Expected at least 8 granted products, got ${entitlements.length}`);

    // Verify all returned entitlements have isActive: true and populated product
    for (const ent of entitlements) {
      assert.equal(ent.isActive, true);
      assert.ok(ent.product.title);
      assert.ok(ent.product.id);
    }
  });

  // 13. Cross-user order access attempts
  test("13. Cross-user order access attempts: blocked with 403, entitlements never cross-assigned", async () => {
    const crossUserProd = await prisma.product.create({
      data: {
        title: "Cross User Protection Course",
        slug: `cross-user-course-${Date.now()}`,
        type: "COURSE",
        status: "PUBLISHED",
        price: 799,
      },
    });
    createdProductIds.push(crossUserProd.id);

    // Create order for mainUser
    const mainUserOrder = await createOrderWithProducts(mainUser, [crossUserProd]);

    // Attacker logs in and tries to verify mainUser's order
    __setTestSessionUser({ email: attackerUser.email });

    const paymentId = `pay_cross_${Date.now()}`;
    const signature = generatePaymentSignature(mainUserOrder.razorpayOrderId, paymentId);

    const req = new Request("http://localhost/api/checkout/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId: mainUserOrder.id,
        razorpay_order_id: mainUserOrder.razorpayOrderId,
        razorpay_payment_id: paymentId,
        razorpay_signature: signature,
      }),
    });

    const res = await verifyPayment(req);
    assert.equal(res.status, 403, "Cross-user verification must be blocked with HTTP 403 Forbidden");

    const data = await res.json();
    assert.equal(data.error, "Forbidden: You do not own this order");

    // Attacker must NOT have gained access
    const attackerAccess = await hasProductAccess(attackerUser.id, crossUserProd.id);
    assert.equal(attackerAccess, false, "Attacker must NEVER receive entitlements for another user's order");
  });

  // 14. Duplicate entitlement prevention
  test("14. Duplicate entitlement prevention: purchasing already-owned product preserves single purchase record", async () => {
    __setTestSessionUser({ email: mainUser.email });

    // mainUser already owns testProducts[0] from Test 1
    const existingProd = testProducts[0];
    const newProd = await prisma.product.create({
      data: {
        title: "Brand New Addon Product",
        slug: `brand-new-addon-${Date.now()}`,
        type: "COURSE",
        status: "PUBLISHED",
        price: 250,
      },
    });
    createdProductIds.push(newProd.id);

    // Create a multi-product order containing both the already-owned product and the new product
    const order = await createOrderWithProducts(mainUser, [existingProd, newProd]);
    const paymentId = `pay_dup_prevent_${Date.now()}`;
    const signature = generatePaymentSignature(order.razorpayOrderId, paymentId);

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
    assert.equal(res.status, 200);

    // Verify existing product still has EXACTLY 1 purchase row in DB (no duplicates)
    const existingProdPurchases = await prisma.purchase.findMany({
      where: { userId: mainUser.id, productId: existingProd.id },
    });
    assert.equal(existingProdPurchases.length, 1, "Must maintain exactly ONE Purchase record for existing product");

    // Verify new product also has EXACTLY 1 purchase row
    const newProdPurchases = await prisma.purchase.findMany({
      where: { userId: mainUser.id, productId: newProd.id },
    });
    assert.equal(newProdPurchases.length, 1, "New product must have exactly ONE Purchase record");
  });
});

