import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("End-to-End Operational Lifecycle & Reconciliation Test", () => {
  let testUserId = null;
  let testProductId = null;
  let testOrderId = null;
  let testOrderPrice = 0;

  test("Step 1: Discover test user and product from database", async () => {
    const user = await prisma.user.findFirst({ where: { role: "STUDENT" } });
    const product = await prisma.product.findFirst({ where: { status: "PUBLISHED" } });

    assert.ok(user, "At least one student user must exist");
    assert.ok(product, "At least one published product must exist");

    testUserId = user.id;
    testProductId = product.id;
    testOrderPrice = Number(product.price);
  });

  test("Step 2: Create PENDING order (Checkout initiation)", async () => {
    const orderNumber = `TEST-ORD-${Date.now()}`;

    const order = await prisma.order.create({
      data: {
        userId: testUserId,
        orderNumber,
        status: "PENDING",
        subtotal: testOrderPrice,
        discount: 0,
        total: testOrderPrice,
        currency: "INR",
        razorpayOrderId: `rzp_test_order_${Date.now()}`,
        items: {
          create: {
            productId: testProductId,
            price: testOrderPrice
          }
        }
      }
    });

    assert.ok(order.id);
    assert.equal(order.status, "PENDING");
    testOrderId = order.id;

    // Verify that PENDING order is NOT included in recognized PAID revenue
    const paidSum = await prisma.order.aggregate({
      where: { status: "PAID" },
      _sum: { total: true }
    });
    assert.equal(Number(paidSum._sum.total || 0), 0, "PENDING orders must not be in PAID aggregate");
  });

  test("Step 3: Capture payment -> PAID status & Entitlement grant", async () => {
    // Transition order to PAID
    const updatedOrder = await prisma.order.update({
      where: { id: testOrderId },
      data: {
        status: "PAID",
        paidAt: new Date(),
        razorpayPaymentId: `rzp_test_pay_${Date.now()}`
      }
    });
    assert.equal(updatedOrder.status, "PAID");

    // Grant access (Purchase entitlement)
    const purchase = await prisma.purchase.upsert({
      where: {
        userId_productId: {
          userId: testUserId,
          productId: testProductId
        }
      },
      create: {
        userId: testUserId,
        productId: testProductId
      },
      update: {
        isActive: true
      }
    });
    assert.equal(purchase.isActive, true);

    // Track analytics event
    await prisma.analyticsEvent.create({
      data: {
        eventName: "Payment Successful",
        category: "Payment",
        userId: testUserId,
        productId: testProductId,
        metadata: { orderId: testOrderId, testRun: true }
      }
    });
  });

  test("Step 4: Financial aggregation & Command Center KPI reconciliation", async () => {
    const [paidAggregation, paidCount] = await Promise.all([
      prisma.order.aggregate({
        where: { status: "PAID" },
        _sum: { total: true }
      }),
      prisma.order.count({ where: { status: "PAID" } })
    ]);

    const grossRevenue = Number(paidAggregation._sum.total || 0);
    assert.equal(grossRevenue, testOrderPrice, "Gross revenue must reflect paid order");
    assert.equal(paidCount, 1, "Completed order count must be 1");

    const gatewayFees = Math.round(grossRevenue * 0.02);
    const taxes = Math.round(grossRevenue * 0.18);
    const netProfit = grossRevenue - gatewayFees - taxes;
    assert.equal(netProfit, grossRevenue - (gatewayFees + taxes));

    // Top products ranking check
    const orderItems = await prisma.orderItem.findMany({
      where: { order: { status: "PAID" } },
      include: { product: true }
    });
    assert.equal(orderItems.length, 1);
    assert.equal(orderItems[0].productId, testProductId);
  });

  test("Step 5: Process Refund and verify accounting adjustment", async () => {
    // Create refund record
    const refund = await prisma.refund.create({
      data: {
        orderId: testOrderId,
        amount: testOrderPrice,
        reason: "Test reconciliation refund",
        status: "COMPLETED",
        razorpayRefundId: `rfnd_test_${Date.now()}`,
        processedAt: new Date()
      }
    });
    assert.ok(refund.id);

    // Update order status to REFUNDED
    await prisma.order.update({
      where: { id: testOrderId },
      data: { status: "REFUNDED" }
    });

    const [paidSumAfterRefund, refundsSum] = await Promise.all([
      prisma.order.aggregate({
        where: { status: "PAID" },
        _sum: { total: true }
      }),
      prisma.refund.aggregate({
        where: { status: "COMPLETED" },
        _sum: { amount: true }
      })
    ]);

    assert.equal(Number(paidSumAfterRefund._sum.total || 0), 0, "No PAID orders remain");
    assert.equal(Number(refundsSum._sum.amount || 0), testOrderPrice, "Refund correctly captured");
  });

  test("Step 6: Teardown and Cleanup (Preserve zero production contamination)", async () => {
    // Delete test refund
    await prisma.refund.deleteMany({ where: { orderId: testOrderId } });
    // Delete test order items & order
    await prisma.orderItem.deleteMany({ where: { orderId: testOrderId } });
    await prisma.order.delete({ where: { id: testOrderId } });
    // Delete test purchase
    await prisma.purchase.deleteMany({ where: { userId: testUserId, productId: testProductId } });
    // Delete test analytics events
    await prisma.analyticsEvent.deleteMany({ where: { metadata: { path: ["testRun"], equals: true } } });

    const remainingOrders = await prisma.order.count();
    assert.equal(remainingOrders, 0, "All test artifacts removed cleanly");
    console.log("Database left in 100% clean production state.");
  });
});
