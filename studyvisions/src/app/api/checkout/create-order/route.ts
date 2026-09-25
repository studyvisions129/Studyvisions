import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { logger } from "@/lib/logger";
import Razorpay from "razorpay";
import crypto from "crypto";

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_xxx",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "xxx",
});

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId } = await req.json();

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product || product.status !== "PUBLISHED") {
      return NextResponse.json({ error: "Product not available" }, { status: 404 });
    }

    // Check if already purchased
    const existingPurchase = await prisma.purchase.findUnique({
      where: {
        userId_productId: {
          userId: user.id,
          productId: product.id,
        }
      }
    });

    if (existingPurchase) {
      return NextResponse.json({ error: "Already purchased" }, { status: 400 });
    }

    // Calculate price
    const finalPrice = Number(product.price);
    const amountInPaise = finalPrice * 100;

    // Create Razorpay Order
    const rpOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `rcpt_${Date.now()}_${user.id.slice(0, 5)}`,
    });

    // Generate unique order number for our DB
    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Create DB Order (Status PENDING)
    const dbOrder = await prisma.order.create({
      data: {
        userId: user.id,
        orderNumber,
        status: "PENDING",
        subtotal: finalPrice,
        total: finalPrice,
        currency: "INR",
        razorpayOrderId: rpOrder.id,
        items: {
          create: {
            productId: product.id,
            price: finalPrice
          }
        }
      }
    });

    return NextResponse.json({
      id: dbOrder.id,
      razorpayOrderId: rpOrder.id,
      amount: rpOrder.amount,
      currency: rpOrder.currency,
    });

  } catch (error: any) {
    logger.error("Create Order Error", { message: error.message, stack: error.stack });
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
