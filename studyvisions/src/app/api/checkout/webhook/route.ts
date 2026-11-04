import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";
import crypto from "crypto";
import { fulfillOrder } from "@/lib/services/fulfillment";

export async function POST(req: Request) {
  try {
    const bodyText = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    // Required webhook secret must be validated before attempting verification.
    // Fail closed if webhook secret configuration is missing.
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!secret) {
      logger.critical("Razorpay webhook configuration error: RAZORPAY_WEBHOOK_SECRET is not configured");
      return NextResponse.json(
        { error: "Webhook verification service is unavailable" },
        { status: 500 }
      );
    }

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(bodyText)
      .digest("hex");

    const isSignatureValid =
      typeof signature === "string" &&
      expectedSignature.length === signature.length &&
      crypto.timingSafeEqual(
        Buffer.from(expectedSignature, "utf-8"),
        Buffer.from(signature, "utf-8")
      );

    if (!isSignatureValid) {
      logger.error("Razorpay webhook signature verification failed");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    let event: any;
    try {
      event = JSON.parse(bodyText);
    } catch {
      logger.error("Invalid JSON payload received in webhook");
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    // Handle payment.captured or order.paid event
    if (event.event === "payment.captured" || event.event === "order.paid") {
      const payment = event.payload?.payment?.entity;
      const orderId = payment?.order_id; // This is the razorpay_order_id

      if (!orderId) {
        logger.error("Webhook event missing razorpay order_id", { event: event.event });
        return NextResponse.json({ error: "Missing order_id in payload" }, { status: 400 });
      }

      const order = await prisma.order.findUnique({
        where: { razorpayOrderId: orderId },
        include: { items: true }
      });

      if (order && order.status !== "PAID") {
        // Atomic transaction fulfillment for ALL products in the order
        await fulfillOrder(order.id, {
          razorpayPaymentId: payment.id,
          paymentMethod: payment.method,
        });

        logger.info("Order marked as PAID via webhook", "PAYMENT", {
          orderId: order.id,
          razorpayOrderId: orderId,
        });
      }
    } else if (event.event === "payment.failed") {
      const payment = event.payload?.payment?.entity;
      const orderId = payment?.order_id;
      if (orderId) {
        const order = await prisma.order.findUnique({
          where: { razorpayOrderId: orderId }
        });
        
        if (order && order.status !== "PAID") {
          await prisma.order.update({
            where: { id: order.id },
            data: { status: "FAILED" }
          });
          logger.info("Order marked as FAILED via webhook", "PAYMENT", {
            orderId: order.id,
            razorpayOrderId: orderId,
          });
        }
      }
    }

    return NextResponse.json({ status: "ok" });
  } catch (error: any) {
    logger.error("Webhook processing error", { message: error.message, stack: error.stack });
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
