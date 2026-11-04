import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";
import { getAuthenticatedUserEmail } from "@/lib/auth-utils";
import crypto from "crypto";
import { fulfillOrder } from "@/lib/services/fulfillment";

export async function POST(req: Request) {
  try {
    const { orderId, razorpay_payment_id, razorpay_order_id, razorpay_signature } = await req.json();

    if (!orderId || !razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    // Required secrets must be validated before attempting verification.
    // Fail closed if payment secret configuration is missing.
    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      logger.critical("Payment verification configuration error: RAZORPAY_KEY_SECRET is not configured", {
        orderId,
      });
      return NextResponse.json(
        { error: "Payment verification service is unavailable" },
        { status: 500 }
      );
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true }
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.status === "PAID") {
      return NextResponse.json({ error: "Order already paid" }, { status: 400 });
    }

    // Validate ownership if an authenticated session exists (prevent cross-user verification)
    const authEmail = await getAuthenticatedUserEmail();
    if (authEmail) {
      const sessionUser = await prisma.user.findUnique({
        where: { email: authEmail },
        select: { id: true }
      });
      if (sessionUser && sessionUser.id !== order.userId) {
        logger.warn("Cross-user payment verification attempt blocked", "AUTH", {
          sessionUserId: sessionUser.id,
          orderUserId: order.userId,
          orderId: order.id,
        });
        return NextResponse.json({ error: "Forbidden: You do not own this order" }, { status: 403 });
      }
    }

    // Verify razorpay_order_id matches the order's registered razorpayOrderId
    if (order.razorpayOrderId && order.razorpayOrderId !== razorpay_order_id) {
      logger.error("Payment verification failed: razorpay_order_id mismatch", {
        orderId: order.id,
      });
      await prisma.order.update({
        where: { id: order.id },
        data: { status: "FAILED" }
      });
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // Verify signature using constant-time comparison to prevent timing attacks
    const generated_signature = crypto
      .createHmac("sha256", secret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    const isSignatureValid =
      typeof razorpay_signature === "string" &&
      generated_signature.length === razorpay_signature.length &&
      crypto.timingSafeEqual(
        Buffer.from(generated_signature, "utf-8"),
        Buffer.from(razorpay_signature, "utf-8")
      );

    if (!isSignatureValid) {
      // Signature verification failed
      await prisma.order.update({
        where: { id: order.id },
        data: { status: "FAILED" }
      });
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // Success! Fulfill all products in order inside an atomic transaction
    await fulfillOrder(order.id, {
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
    });

    logger.info("Payment verified successfully", "PAYMENT", {
      orderId: order.id,
    });

    return NextResponse.json({ success: true });

  } catch (error: any) {
    logger.error("Verify Order Error", { message: error.message, stack: error.stack });
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
