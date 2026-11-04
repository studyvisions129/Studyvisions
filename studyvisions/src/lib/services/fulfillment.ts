import { PrismaClient, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";

export interface PaymentDetails {
  razorpayPaymentId: string;
  razorpaySignature?: string;
  paymentMethod?: string;
}

export interface FulfillmentOptions {
  /**
   * For testing transaction rollback atomicity.
   * If true, throws an error immediately after updating order status but before committing purchases.
   */
  forceFailAfterOrderStatus?: boolean;
}

export interface FulfillmentResult {
  success: boolean;
  orderId: string;
  alreadyPaid: boolean;
  fulfilledItemsCount: number;
  purchasedProductIds: string[];
}

/**
 * Fulfills an order within an atomic database transaction.
 * Marks the order as PAID and grants active Purchase entitlements for every eligible product item.
 * Strictly idempotent: if the order is already PAID, returns early without duplicating purchases.
 */
export async function fulfillOrder(
  orderId: string,
  paymentDetails: PaymentDetails,
  options?: FulfillmentOptions,
  client: PrismaClient | Prisma.TransactionClient = prisma
): Promise<FulfillmentResult> {
  const executeFulfillment = async (tx: Prisma.TransactionClient): Promise<FulfillmentResult> => {
    // 1. Fetch order with items and associated products
    const order = await tx.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    if (!order) {
      throw new Error(`Order ${orderId} not found`);
    }

    // 2. Idempotency check: if already paid, do not re-process or duplicate purchases
    if (order.status === "PAID") {
      logger.info(`Order ${orderId} is already fulfilled (status: PAID)`, "PAYMENT", { orderId });
      return {
        success: true,
        orderId: order.id,
        alreadyPaid: true,
        fulfilledItemsCount: 0,
        purchasedProductIds: [],
      };
    }

    // 3. Mark order as PAID inside the transaction
    await tx.order.update({
      where: { id: order.id },
      data: {
        status: "PAID",
        razorpayPaymentId: paymentDetails.razorpayPaymentId,
        ...(paymentDetails.razorpaySignature ? { razorpaySignature: paymentDetails.razorpaySignature } : {}),
        ...(paymentDetails.paymentMethod ? { paymentMethod: paymentDetails.paymentMethod } : {}),
        paidAt: new Date(),
      },
    });

    // Simulated failure hook for testing transaction rollback
    if (options?.forceFailAfterOrderStatus) {
      throw new Error("Simulated fulfillment failure for rollback testing");
    }

    // 4. Grant access (Purchase records) for EVERY eligible product in order.items
    const purchasedProductIds: string[] = [];

    for (const item of order.items) {
      if (!item.productId) {
        continue;
      }

      // Safe handling of deleted / unavailable / missing products
      if (!item.product) {
        logger.warn(`Product ${item.productId} in order ${order.id} not found in database or unavailable`, "PAYMENT", {
          orderId: order.id,
          productId: item.productId,
        });
        continue;
      }

      // Upsert purchase record to maintain idempotency and prevent duplicates
      await tx.purchase.upsert({
        where: {
          userId_productId: {
            userId: order.userId,
            productId: item.productId,
          },
        },
        create: {
          userId: order.userId,
          productId: item.productId,
          isActive: true,
        },
        update: {
          isActive: true,
        },
      });

      purchasedProductIds.push(item.productId);
    }

    logger.info(`Successfully fulfilled order ${order.id} with ${purchasedProductIds.length} entitlements`, "PAYMENT", {
      orderId: order.id,
      userId: order.userId,
      purchasedProductIds,
    });

    return {
      success: true,
      orderId: order.id,
      alreadyPaid: false,
      fulfilledItemsCount: purchasedProductIds.length,
      purchasedProductIds,
    };
  };

  // If client supports $transaction, wrap execution in an interactive transaction
  if ("$transaction" in client && typeof client.$transaction === "function") {
    return (client as PrismaClient).$transaction(executeFulfillment);
  } else {
    return executeFulfillment(client as Prisma.TransactionClient);
  }
}

/**
 * Checks whether a user has active entitlement/access to a given product.
 */
export async function hasProductAccess(userId: string, productId: string): Promise<boolean> {
  const purchase = await prisma.purchase.findUnique({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
  });
  return Boolean(purchase && purchase.isActive);
}

/**
 * Fetches all active product entitlements for a user.
 */
export async function getUserEntitlements(userId: string) {
  return prisma.purchase.findMany({
    where: {
      userId,
      isActive: true,
    },
    include: {
      product: true,
    },
    orderBy: {
      grantedAt: "desc",
    },
  });
}

