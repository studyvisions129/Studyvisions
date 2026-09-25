import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { orderId, razorpay_payment_id, razorpay_order_id, razorpay_signature } = await req.json();

    if (!orderId || !razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
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

    // Verify signature
    const secret = process.env.RAZORPAY_KEY_SECRET || "xxx";
    const generated_signature = crypto
      .createHmac("sha256", secret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      // Signature verification failed
      await prisma.order.update({
        where: { id: order.id },
        data: { status: "FAILED" }
      });
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // Success! 
    // Update order status
    await prisma.order.update({
      where: { id: order.id },
      data: {
        status: "PAID",
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        paidAt: new Date(),
      }
    });

    // Grant access (Purchase record)
    // We assume an order item has a single product for "Buy Now"
    const productId = order.items[0]?.productId;
    
    if (productId) {
      await prisma.purchase.upsert({
        where: {
          userId_productId: {
            userId: order.userId,
            productId: productId,
          }
        },
        create: {
          userId: order.userId,
          productId: productId,
        },
        update: {
          isActive: true
        }
      });
    }

    return NextResponse.json({ success: true });

  } catch (error: any) {
    logger.error("Verify Order Error", { message: error.message, stack: error.stack });
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
