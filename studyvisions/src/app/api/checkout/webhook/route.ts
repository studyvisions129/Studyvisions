import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const bodyText = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || "xxx"; // Configure this in env
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(bodyText)
      .digest("hex");

    if (expectedSignature !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(bodyText);

    // Handle payment.captured event
    if (event.event === "payment.captured" || event.event === "order.paid") {
      const payment = event.payload.payment.entity;
      const orderId = payment.order_id; // This is the razorpay_order_id

      const order = await prisma.order.findUnique({
        where: { razorpayOrderId: orderId },
        include: { items: true }
      });

      if (order && order.status !== "PAID") {
        // Update order status
        await prisma.order.update({
          where: { id: order.id },
          data: {
            status: "PAID",
            razorpayPaymentId: payment.id,
            paidAt: new Date(),
          }
        });

        // Grant access
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
      }
    } else if (event.event === "payment.failed") {
       const payment = event.payload.payment.entity;
       const orderId = payment.order_id;
       const order = await prisma.order.findUnique({
         where: { razorpayOrderId: orderId }
       });
       
       if (order && order.status !== "PAID") {
         await prisma.order.update({
           where: { id: order.id },
           data: { status: "FAILED" }
         });
       }
    }

    return NextResponse.json({ status: "ok" });
  } catch (error: any) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
