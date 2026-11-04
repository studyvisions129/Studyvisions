import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUserEmail } from "@/lib/auth-utils";
import { logger } from "@/lib/logger";
import Razorpay from "razorpay";
import crypto from "crypto";

// Initialize Razorpay client helper
function getRazorpayClient() {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;
  if (!key_id || !key_secret) {
    return null;
  }
  return new Razorpay({ key_id, key_secret });
}

export async function POST(req: Request) {
  try {
    const razorpay = getRazorpayClient();
    if (!razorpay) {
      logger.critical("Create order configuration error: RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is not configured");
      return NextResponse.json({ error: "Payment service is unavailable" }, { status: 500 });
    }

    const authEmail = await getAuthenticatedUserEmail();

    if (!authEmail) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    let targetProductIds: string[] = [];
    if (Array.isArray(body.productIds) && body.productIds.length > 0) {
      targetProductIds = body.productIds;
    } else if (Array.isArray(body.items) && body.items.length > 0) {
      targetProductIds = body.items.map((i: any) => typeof i === "string" ? i : i.productId).filter(Boolean);
    } else if (body.productId && typeof body.productId === "string") {
      targetProductIds = [body.productId];
    }

    if (targetProductIds.length === 0) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: authEmail }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Deduplicate requested product IDs
    const uniqueProductIds = Array.from(new Set(targetProductIds));

    // Fetch products
    const products = await prisma.product.findMany({
      where: { id: { in: uniqueProductIds } }
    });

    if (products.length !== uniqueProductIds.length || products.some(p => p.status !== "PUBLISHED")) {
      return NextResponse.json({ error: "Product not available" }, { status: 404 });
    }

    // Check if already purchased
    const existingPurchases = await prisma.purchase.findMany({
      where: {
        userId: user.id,
        productId: { in: uniqueProductIds },
        isActive: true,
      }
    });

    // If single product and already purchased, or if all products already purchased
    if (uniqueProductIds.length === 1 && existingPurchases.length > 0) {
      return NextResponse.json({ error: "Already purchased" }, { status: 400 });
    }

    if (existingPurchases.length === uniqueProductIds.length) {
      return NextResponse.json({ error: "Already purchased" }, { status: 400 });
    }

    // Calculate total price
    const finalPrice = products.reduce((acc, p) => acc + Number(p.price), 0);
    const amountInPaise = Math.round(finalPrice * 100);

    // Create Razorpay Order
    const rpOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `rcpt_${Date.now()}_${user.id.slice(0, 5)}`,
    });

    // Generate unique order number for our DB
    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Create DB Order (Status PENDING) with all items
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
          create: products.map((p) => ({
            productId: p.id,
            price: Number(p.price)
          }))
        }
      },
      include: {
        items: true
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
