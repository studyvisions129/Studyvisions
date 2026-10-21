import prisma from "@/lib/prisma";

export interface ActionAlert {
  id: string;
  severity: "critical" | "warning" | "recommendation";
  title: string;
  description: string;
  actionLabel: string;
  actionHref?: string;
  blockedReason?: string;
  badge?: string;
}

export interface ActionCenterSummary {
  criticalCount: number;
  warningCount: number;
  recommendationCount: number;
  alerts: ActionAlert[];
}

export async function getActionCenterAlerts(): Promise<ActionCenterSummary> {
  const alerts: ActionAlert[] = [];

  // 1. Check Payment Gateway Configuration & Mode
  const razorpayKey = process.env.RAZORPAY_KEY_ID || "";
  if (!razorpayKey) {
    alerts.push({
      id: "rzp-missing",
      severity: "critical",
      title: "Payment Gateway Missing",
      description: "RAZORPAY_KEY_ID is unconfigured. Customer checkouts cannot process.",
      actionLabel: "Configure",
      actionHref: "/admin/settings"
    });
  } else if (razorpayKey.startsWith("rzp_test_")) {
    alerts.push({
      id: "rzp-test-mode",
      severity: "warning",
      title: "Payment Gateway in Test Mode",
      description: "Using test keys (rzp_test_...). Live payments require production keys in settings.",
      actionLabel: "Settings",
      actionHref: "/admin/settings",
      badge: "Sandbox"
    });
  }

  // 2. Check Webhook Secret
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!webhookSecret) {
    alerts.push({
      id: "rzp-webhook-missing",
      severity: "warning",
      title: "Payment Webhook Secret Missing",
      description: "RAZORPAY_WEBHOOK_SECRET is unconfigured. Asynchronous payment reconciliation is degraded.",
      actionLabel: "Docs",
      actionHref: "/admin/settings"
    });
  }

  // 3. Check Meta Ads Integration
  const metaToken = process.env.META_ADS_ACCESS_TOKEN || process.env.META_ADS_ACCOUNT_ID;
  if (!metaToken) {
    alerts.push({
      id: "meta-ads-disconnected",
      severity: "warning",
      title: "Meta Ads Disconnected",
      description: "Meta Marketing API keys unconfigured. Ad spend is currently tracked as ₹0.",
      actionLabel: "Configure",
      actionHref: "/admin/settings"
    });
  }

  // 4. Check Orders Requiring Review
  const [pendingOrdersCount, failedOrdersCount] = await Promise.all([
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.order.count({ where: { status: "FAILED" } })
  ]);

  if (pendingOrdersCount > 0) {
    alerts.push({
      id: "orders-pending",
      severity: "warning",
      title: `${pendingOrdersCount} Pending Order(s)`,
      description: "Customer checkout initiated but pending payment verification.",
      actionLabel: "Review",
      actionHref: "/admin/orders?status=Pending"
    });
  }

  if (failedOrdersCount > 0) {
    alerts.push({
      id: "orders-failed",
      severity: "warning",
      title: `${failedOrdersCount} Failed Payment(s)`,
      description: "Checkout attempts encountered verification or gateway failure.",
      actionLabel: "Inspect",
      actionHref: "/admin/orders?status=Failed"
    });
  }

  // 5. Google Ads Recommendation
  const googleAdsId = process.env.GOOGLE_ADS_CLIENT_ID;
  if (!googleAdsId) {
    alerts.push({
      id: "google-ads-recommendation",
      severity: "recommendation",
      title: "Google Ads Unlinked",
      description: "Link Google Ads developer credentials to track search ad attribution.",
      actionLabel: "Learn More",
      actionHref: "/admin/settings"
    });
  }

  // 6. Healthy System Condition
  if (pendingOrdersCount === 0 && failedOrdersCount === 0) {
    alerts.push({
      id: "orders-healthy",
      severity: "recommendation",
      title: "Order Queue Healthy",
      description: "No pending or failed customer orders requiring admin intervention.",
      actionLabel: "View Orders",
      actionHref: "/admin/orders"
    });
  }

  const criticalCount = alerts.filter(a => a.severity === "critical").length;
  const warningCount = alerts.filter(a => a.severity === "warning").length;
  const recommendationCount = alerts.filter(a => a.severity === "recommendation").length;

  return {
    criticalCount,
    warningCount,
    recommendationCount,
    alerts
  };
}
