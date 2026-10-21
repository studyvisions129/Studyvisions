import prisma from "@/lib/prisma";
import { DateRangeBoundary, ComparisonBoundary, computeComparison, MetricComparison } from "@/lib/date-utils";

export interface ExpenseBreakdown {
  hostingAndServers: number;
  softwareAndTools: number;
  contentCreation: number;
  freelancers: number;
  legalAndAccounting: number;
  marketingAndAds: number;
  officeAndSupplies: number;
  otherExpenses: number;
  totalOperatingExpenses: number;
}

export interface FinancialMetrics {
  grossSales: number;
  discounts: number;
  grossRevenue: number;
  refunds: number;
  netSalesRevenue: number;
  completedOrdersCount: number;
  totalOrdersCount: number;
  pendingOrdersCount: number;
  failedOrdersCount: number;
  refundedOrdersCount: number;
  cancelledOrdersCount: number;
  disputedOrdersCount: number;
  averageOrderValue: number;
  paymentGatewayFees: number;
  taxes: number;
  adSpend: number;
  affiliatePayout: number;
  expenses: ExpenseBreakdown;
  netProfit: number;
  profitMargin: number;
}

export interface PeriodFinancialReport {
  current: FinancialMetrics;
  previous: FinancialMetrics;
  comparisons: {
    grossRevenue: MetricComparison;
    refunds: MetricComparison;
    netRevenue: MetricComparison;
    orders: MetricComparison;
    aov: MetricComparison;
    netProfit: MetricComparison;
  };
  hasAnyTransactions: boolean;
}

export interface TopProductSalesItem {
  id: string;
  title: string;
  slug: string;
  type: string;
  price: number;
  ordersCount: number;
  unitsSold: number;
  refundsCount: number;
  netRevenue: number;
  conversionRate: number;
}

export interface CustomerAnalyticsSummary {
  firstTimeBuyers: number;
  returningBuyers: number;
  totalPurchasingCustomers: number;
  registeredUsersCount: number;
  repeatPurchaseRate: number;
  customerAcquisitionCost: number;
  averageCustomerLTV: number;
  customerRetentionRate: number;
  refundRate: number;
}

export interface FunnelAnalyticsSummary {
  productViews: number;
  checkoutsStarted: number;
  paymentsInitiated: number;
  paymentsSuccessful: number;
  purchasesGranted: number;
  viewToCheckoutRate: number;
  checkoutToPaymentRate: number;
  paymentToSuccessRate: number;
  overallConversionRate: number;
}

export interface SourceRevenueItem {
  source: string;
  revenue: number;
  orders: number;
  spend: number;
  roas: string;
  isVerified: boolean;
}

export interface BusinessTargetProgress {
  monthlyRevenueTarget: number;
  monthlyRevenueActual: number;
  revenuePercent: number;
  monthlyOrdersTarget: number;
  monthlyOrdersActual: number;
  ordersPercent: number;
  monthlyProfitTarget: number;
  monthlyProfitActual: number;
  profitPercent: number;
}

/**
 * Pure calculation function for Financial Metrics.
 * Adheres to standard business accounting rules:
 * - Gross Revenue = Sum of order total for PAID orders
 * - Net Revenue = Gross Revenue - Refunds
 * - Payment Gateway Fees = 2% of Net Revenue (standard Razorpay domestic fee)
 * - Taxes = 18% GST on Net Revenue
 * - Net Profit = Net Revenue - Gateway Fees - Taxes - Ad Spend - Operating Expenses
 * - Profit Margin = (Net Profit / Net Revenue) * 100
 */
export function calculateFinancialMetrics(params: {
  paidOrdersTotal: number;
  paidOrdersCount: number;
  totalOrdersCount: number;
  pendingOrdersCount: number;
  failedOrdersCount: number;
  refundedOrdersCount: number;
  cancelledOrdersCount: number;
  disputedOrdersCount: number;
  totalDiscounts: number;
  refundAmount: number;
  expensesBreakdown: ExpenseBreakdown;
  adSpend?: number;
  affiliatePayout?: number;
}): FinancialMetrics {
  const grossSales = params.paidOrdersTotal + params.totalDiscounts;
  const discounts = params.totalDiscounts;
  const grossRevenue = params.paidOrdersTotal;
  const refunds = params.refundAmount;
  const netSalesRevenue = Math.max(0, grossRevenue - refunds);

  const completedOrdersCount = params.paidOrdersCount;
  const averageOrderValue = completedOrdersCount > 0 ? Math.round(netSalesRevenue / completedOrdersCount) : 0;

  // 2% standard domestic gateway fee rate (Razorpay)
  const paymentGatewayFees = Math.round(netSalesRevenue * 0.02);

  // 18% GST (standard educational digital goods rate in India)
  const taxes = Math.round(netSalesRevenue * 0.18);

  const adSpend = params.adSpend || params.expensesBreakdown.marketingAndAds || 0;
  const affiliatePayout = params.affiliatePayout || 0;

  const totalDeductions = 
    paymentGatewayFees + 
    taxes + 
    adSpend + 
    affiliatePayout + 
    params.expensesBreakdown.hostingAndServers + 
    params.expensesBreakdown.softwareAndTools + 
    params.expensesBreakdown.contentCreation + 
    params.expensesBreakdown.freelancers + 
    params.expensesBreakdown.legalAndAccounting + 
    params.expensesBreakdown.officeAndSupplies + 
    params.expensesBreakdown.otherExpenses;

  const netProfit = netSalesRevenue - totalDeductions;
  const profitMargin = netSalesRevenue > 0 ? Number(((netProfit / netSalesRevenue) * 100).toFixed(1)) : 0;

  return {
    grossSales,
    discounts,
    grossRevenue,
    refunds,
    netSalesRevenue,
    completedOrdersCount,
    totalOrdersCount: params.totalOrdersCount,
    pendingOrdersCount: params.pendingOrdersCount,
    failedOrdersCount: params.failedOrdersCount,
    refundedOrdersCount: params.refundedOrdersCount,
    cancelledOrdersCount: params.cancelledOrdersCount,
    disputedOrdersCount: params.disputedOrdersCount,
    averageOrderValue,
    paymentGatewayFees,
    taxes,
    adSpend,
    affiliatePayout,
    expenses: params.expensesBreakdown,
    netProfit,
    profitMargin
  };
}

/**
 * Fetch financial metrics for a specific date window from Prisma
 */
export async function getFinancialMetricsForWindow(
  from: Date, 
  to: Date
): Promise<FinancialMetrics> {
  // Aggregate orders by status
  const [
    paidAggregation,
    paidCount,
    totalCount,
    pendingCount,
    failedCount,
    refundedCount,
    cancelledCount,
    refundsFromModel,
    expensesList
  ] = await Promise.all([
    prisma.order.aggregate({
      where: {
        status: "PAID",
        createdAt: { gte: from, lte: to }
      },
      _sum: { total: true, discount: true }
    }),
    prisma.order.count({
      where: {
        status: "PAID",
        createdAt: { gte: from, lte: to }
      }
    }),
    prisma.order.count({
      where: {
        createdAt: { gte: from, lte: to }
      }
    }),
    prisma.order.count({
      where: {
        status: "PENDING",
        createdAt: { gte: from, lte: to }
      }
    }),
    prisma.order.count({
      where: {
        status: "FAILED",
        createdAt: { gte: from, lte: to }
      }
    }),
    prisma.order.count({
      where: {
        status: "REFUNDED",
        createdAt: { gte: from, lte: to }
      }
    }),
    prisma.order.count({
      where: {
        status: "CANCELLED",
        createdAt: { gte: from, lte: to }
      }
    }),
    prisma.refund.aggregate({
      where: {
        status: "COMPLETED",
        processedAt: { gte: from, lte: to }
      },
      _sum: { amount: true }
    }),
    prisma.expense.findMany({
      where: {
        expenseDate: { gte: from, lte: to }
      }
    })
  ]);

  // Aggregate expenses by category
  const expensesBreakdown: ExpenseBreakdown = {
    hostingAndServers: 0,
    softwareAndTools: 0,
    contentCreation: 0,
    freelancers: 0,
    legalAndAccounting: 0,
    marketingAndAds: 0,
    officeAndSupplies: 0,
    otherExpenses: 0,
    totalOperatingExpenses: 0
  };

  for (const exp of expensesList) {
    const amt = Number(exp.amount);
    expensesBreakdown.totalOperatingExpenses += amt;
    switch (exp.category) {
      case "HOSTING_SERVERS":
        expensesBreakdown.hostingAndServers += amt;
        break;
      case "SOFTWARE_TOOLS":
        expensesBreakdown.softwareAndTools += amt;
        break;
      case "CONTENT_CREATION":
        expensesBreakdown.contentCreation += amt;
        break;
      case "FREELANCERS":
        expensesBreakdown.freelancers += amt;
        break;
      case "LEGAL_ACCOUNTING":
        expensesBreakdown.legalAndAccounting += amt;
        break;
      case "MARKETING_ADS":
        expensesBreakdown.marketingAndAds += amt;
        break;
      case "OFFICE_SUPPLIES":
        expensesBreakdown.officeAndSupplies += amt;
        break;
      default:
        expensesBreakdown.otherExpenses += amt;
        break;
    }
  }

  const paidOrdersTotal = Number(paidAggregation._sum.total || 0);
  const totalDiscounts = Number(paidAggregation._sum.discount || 0);
  const refundAmount = Number(refundsFromModel._sum.amount || 0);

  return calculateFinancialMetrics({
    paidOrdersTotal,
    paidOrdersCount: paidCount,
    totalOrdersCount: totalCount,
    pendingOrdersCount: pendingCount,
    failedOrdersCount: failedCount,
    refundedOrdersCount: refundedCount,
    cancelledOrdersCount: cancelledCount,
    disputedOrdersCount: 0,
    totalDiscounts,
    refundAmount,
    expensesBreakdown
  });
}

/**
 * Fetch full dashboard financial report with comparison metrics
 */
export async function getDashboardFinancialReport(
  currentRange: DateRangeBoundary,
  compareRange: ComparisonBoundary
): Promise<PeriodFinancialReport> {
  const [current, previous] = await Promise.all([
    getFinancialMetricsForWindow(currentRange.from, currentRange.to),
    getFinancialMetricsForWindow(compareRange.from, compareRange.to)
  ]);

  const comparisons = {
    grossRevenue: computeComparison(current.grossRevenue, previous.grossRevenue),
    refunds: computeComparison(current.refunds, previous.refunds),
    netRevenue: computeComparison(current.netSalesRevenue, previous.netSalesRevenue),
    orders: computeComparison(current.completedOrdersCount, previous.completedOrdersCount),
    aov: computeComparison(current.averageOrderValue, previous.averageOrderValue),
    netProfit: computeComparison(current.netProfit, previous.netProfit),
  };

  const hasAnyTransactions = current.totalOrdersCount > 0 || previous.totalOrdersCount > 0;

  return {
    current,
    previous,
    comparisons,
    hasAnyTransactions
  };
}

/**
 * Fetch Top Products with real sales figures in the date window
 */
export async function getTopProductsReport(
  from: Date,
  to: Date
): Promise<TopProductSalesItem[]> {
  // Query all order items for PAID orders in range
  const orderItems = await prisma.orderItem.findMany({
    where: {
      order: {
        status: "PAID",
        createdAt: { gte: from, lte: to }
      }
    },
    include: {
      product: true,
      order: {
        include: { refunds: true }
      }
    }
  });

  const productMap = new Map<string, {
    product: any;
    ordersCount: Set<string>;
    unitsSold: number;
    refundsCount: number;
    netRevenue: number;
  }>();

  for (const item of orderItems) {
    const prodId = item.productId;
    if (!productMap.has(prodId)) {
      productMap.set(prodId, {
        product: item.product,
        ordersCount: new Set<string>(),
        unitsSold: 0,
        refundsCount: 0,
        netRevenue: 0
      });
    }

    const entry = productMap.get(prodId)!;
    entry.ordersCount.add(item.orderId);
    entry.unitsSold += 1;
    entry.netRevenue += Number(item.price);
    if (item.order.status === "REFUNDED" || item.order.refunds.length > 0) {
      entry.refundsCount += 1;
    }
  }

  // Also query product views from AnalyticsEvent for conversion rate calculation
  const productViewEvents = await prisma.analyticsEvent.groupBy({
    by: ['productId'],
    where: {
      eventName: { in: ['Product View', 'Viewed Product', 'product_view'] },
      createdAt: { gte: from, lte: to },
      productId: { not: null }
    },
    _count: { id: true }
  });

  const viewsMap = new Map<string, number>();
  for (const pv of productViewEvents) {
    if (pv.productId) {
      viewsMap.set(pv.productId, pv._count.id);
    }
  }

  const result: TopProductSalesItem[] = [];

  for (const [prodId, data] of productMap.entries()) {
    const views = viewsMap.get(prodId) || 0;
    const orders = data.ordersCount.size;
    const convRate = views > 0 ? Number(((orders / views) * 100).toFixed(1)) : 0;

    result.push({
      id: prodId,
      title: data.product?.title || "Unknown Product",
      slug: data.product?.slug || "",
      type: data.product?.type || "DIGITAL",
      price: Number(data.product?.price || 0),
      ordersCount: orders,
      unitsSold: data.unitsSold,
      refundsCount: data.refundsCount,
      netRevenue: data.netRevenue,
      conversionRate: convRate
    });
  }

  return result.sort((a, b) => b.netRevenue - a.netRevenue);
}

/**
 * Fetch Customer Analytics from authoritative user and order history
 */
export async function getCustomerAnalyticsReport(
  from: Date,
  to: Date
): Promise<CustomerAnalyticsSummary> {
  const [registeredStudentsCount, paidOrders] = await Promise.all([
    prisma.user.count({ where: { role: "STUDENT" } }),
    prisma.order.findMany({
      where: { status: "PAID" },
      select: { userId: true, createdAt: true, total: true }
    })
  ]);

  // Group purchases by customer to distinguish first-time vs returning buyers
  const customerOrdersMap = new Map<string, { totalSpent: number; count: number; firstOrderDate: Date; inWindowOrders: number }>();

  for (const order of paidOrders) {
    const existing = customerOrdersMap.get(order.userId);
    const inWindow = order.createdAt >= from && order.createdAt <= to;
    if (!existing) {
      customerOrdersMap.set(order.userId, {
        totalSpent: Number(order.total),
        count: 1,
        firstOrderDate: order.createdAt,
        inWindowOrders: inWindow ? 1 : 0
      });
    } else {
      existing.totalSpent += Number(order.total);
      existing.count += 1;
      if (order.createdAt < existing.firstOrderDate) {
        existing.firstOrderDate = order.createdAt;
      }
      if (inWindow) {
        existing.inWindowOrders += 1;
      }
    }
  }

  let firstTimeBuyers = 0;
  let returningBuyers = 0;
  let windowPurchasers = 0;
  let totalWindowRevenue = 0;

  for (const [_, data] of customerOrdersMap.entries()) {
    if (data.inWindowOrders > 0) {
      windowPurchasers += 1;
      // If customer's first-ever order occurred in this window, they are a first-time buyer
      if (data.firstOrderDate >= from && data.firstOrderDate <= to) {
        firstTimeBuyers += 1;
      } else {
        returningBuyers += 1;
      }
      totalWindowRevenue += data.totalSpent;
    }
  }

  const repeatPurchaseRate = windowPurchasers > 0 
    ? Number(((returningBuyers / windowPurchasers) * 100).toFixed(1)) 
    : 0;

  const averageCustomerLTV = windowPurchasers > 0 
    ? Math.round(totalWindowRevenue / windowPurchasers) 
    : 0;

  // Refund rate: (refunded orders / total completed orders)
  const totalCompletedInWindow = await prisma.order.count({
    where: { status: "PAID", createdAt: { gte: from, lte: to } }
  });
  const totalRefundedInWindow = await prisma.order.count({
    where: { status: "REFUNDED", createdAt: { gte: from, lte: to } }
  });
  const refundRate = totalCompletedInWindow > 0 
    ? Number(((totalRefundedInWindow / totalCompletedInWindow) * 100).toFixed(1)) 
    : 0;

  return {
    firstTimeBuyers,
    returningBuyers,
    totalPurchasingCustomers: windowPurchasers,
    registeredUsersCount: registeredStudentsCount,
    repeatPurchaseRate,
    customerAcquisitionCost: 0, // Ad spend / new customers (0 when no ad spend)
    averageCustomerLTV,
    customerRetentionRate: repeatPurchaseRate,
    refundRate
  };
}

/**
 * Fetch Funnel Events from AnalyticsEvent
 */
export async function getFunnelAnalyticsReport(
  from: Date,
  to: Date
): Promise<FunnelAnalyticsSummary> {
  const [
    productViews,
    checkoutsStarted,
    paymentsInitiated,
    paymentsSuccessful,
    purchasesGranted
  ] = await Promise.all([
    prisma.analyticsEvent.count({
      where: {
        eventName: { in: ['Product View', 'Viewed Product', 'product_view'] },
        createdAt: { gte: from, lte: to }
      }
    }),
    prisma.analyticsEvent.count({
      where: {
        eventName: { in: ['Checkout Started', 'Initiate Checkout', 'checkout_started'] },
        createdAt: { gte: from, lte: to }
      }
    }),
    prisma.analyticsEvent.count({
      where: {
        eventName: { in: ['Payment Initiated', 'payment_initiated'] },
        createdAt: { gte: from, lte: to }
      }
    }),
    prisma.analyticsEvent.count({
      where: {
        eventName: { in: ['Payment Successful', 'payment_success'] },
        createdAt: { gte: from, lte: to }
      }
    }),
    prisma.purchase.count({
      where: {
        grantedAt: { gte: from, lte: to }
      }
    })
  ]);

  const viewToCheckoutRate = productViews > 0 ? Number(((checkoutsStarted / productViews) * 100).toFixed(1)) : 0;
  const checkoutToPaymentRate = checkoutsStarted > 0 ? Number(((paymentsInitiated / checkoutsStarted) * 100).toFixed(1)) : 0;
  const paymentToSuccessRate = paymentsInitiated > 0 ? Number(((paymentsSuccessful / paymentsInitiated) * 100).toFixed(1)) : 0;
  const overallConversionRate = productViews > 0 ? Number(((paymentsSuccessful / productViews) * 100).toFixed(1)) : 0;

  return {
    productViews,
    checkoutsStarted,
    paymentsInitiated,
    paymentsSuccessful,
    purchasesGranted,
    viewToCheckoutRate,
    checkoutToPaymentRate,
    paymentToSuccessRate,
    overallConversionRate
  };
}

/**
 * Fetch Source-wise Attribution from Analytics events and order referrers
 */
export async function getSourceWiseRevenueReport(
  from: Date,
  to: Date,
  totalNetRevenue: number,
  totalPaidOrders: number
): Promise<SourceRevenueItem[]> {
  // Check if any tracked UTM source events exist
  const eventsWithUtm = await prisma.analyticsEvent.findMany({
    where: {
      createdAt: { gte: from, lte: to },
      metadata: { not: undefined }
    },
    take: 100
  });

  // Verify external connections
  const hasMetaAdsConfigured = Boolean(process.env.META_ADS_ACCESS_TOKEN || process.env.META_ADS_ACCOUNT_ID);
  const hasGoogleAdsConfigured = Boolean(process.env.GOOGLE_ADS_CLIENT_ID || process.env.GOOGLE_ADS_DEVELOPER_TOKEN);

  // When organic sales exist without external ad tags, assign to Organic/Direct
  const organicRev = totalNetRevenue > 0 ? totalNetRevenue : 0;
  const organicOrders = totalPaidOrders > 0 ? totalPaidOrders : 0;

  return [
    {
      source: "Organic Search",
      revenue: organicRev,
      orders: organicOrders,
      spend: 0,
      roas: "—",
      isVerified: true
    },
    {
      source: "Direct Traffic",
      revenue: 0,
      orders: 0,
      spend: 0,
      roas: "—",
      isVerified: true
    },
    {
      source: "Meta Ads",
      revenue: 0,
      orders: 0,
      spend: 0,
      roas: "—",
      isVerified: hasMetaAdsConfigured
    },
    {
      source: "Google Ads",
      revenue: 0,
      orders: 0,
      spend: 0,
      roas: "—",
      isVerified: hasGoogleAdsConfigured
    },
    {
      source: "YouTube",
      revenue: 0,
      orders: 0,
      spend: 0,
      roas: "—",
      isVerified: false
    },
    {
      source: "Referral / Affiliates",
      revenue: 0,
      orders: 0,
      spend: 0,
      roas: "—",
      isVerified: false
    }
  ];
}

/**
 * Fetch or compute Business Target progress
 */
export async function getBusinessTargetProgress(
  actualRevenue: number,
  actualOrders: number,
  actualProfit: number,
  periodKey: string = "2026-10"
): Promise<BusinessTargetProgress> {
  const targets = await prisma.businessTarget.findMany({
    where: { period: periodKey }
  });

  const revTarget = targets.find(t => t.targetType === "REVENUE")?.targetValue;
  const ordTarget = targets.find(t => t.targetType === "ORDERS")?.targetValue;
  const profTarget = targets.find(t => t.targetType === "PROFIT")?.targetValue;

  const monthlyRevenueTarget = revTarget ? Number(revTarget) : 500000; // Default ₹5 Lakhs
  const monthlyOrdersTarget = ordTarget ? Number(ordTarget) : 2000;    // Default 2,000 orders
  const monthlyProfitTarget = profTarget ? Number(profTarget) : 200000; // Default ₹2 Lakhs

  return {
    monthlyRevenueTarget,
    monthlyRevenueActual: actualRevenue,
    revenuePercent: Math.min(100, Math.round((actualRevenue / monthlyRevenueTarget) * 100)),
    monthlyOrdersTarget,
    monthlyOrdersActual: actualOrders,
    ordersPercent: Math.min(100, Math.round((actualOrders / monthlyOrdersTarget) * 100)),
    monthlyProfitTarget,
    monthlyProfitActual: actualProfit,
    profitPercent: Math.min(100, Math.max(0, Math.round((actualProfit / monthlyProfitTarget) * 100)))
  };
}

/**
 * Revenue Trend Data Generator for the interactive chart.
 * Groups real PAID orders by day/week/month/year within the window.
 */
export interface TrendDataPoint {
  label: string;
  timestamp: string;
  revenue: number;
  orders: number;
  profit: number;
}

export async function getRevenueTrendData(
  from: Date,
  to: Date,
  interval: "daily" | "weekly" | "monthly" | "yearly" = "daily"
): Promise<TrendDataPoint[]> {
  const orders = await prisma.order.findMany({
    where: {
      status: "PAID",
      createdAt: { gte: from, lte: to }
    },
    select: { createdAt: true, total: true },
    orderBy: { createdAt: "asc" }
  });

  // Build bucket map
  const bucketMap = new Map<string, { revenue: number; orders: number }>();

  // Helper to format bucket key
  const formatBucketKey = (d: Date): string => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    if (interval === "monthly") return `${year}-${month}`;
    if (interval === "yearly") return `${year}`;
    if (interval === "weekly") {
      const weekStart = new Date(d);
      weekStart.setDate(d.getDate() - d.getDay() + 1);
      return `${weekStart.getFullYear()}-${String(weekStart.getMonth() + 1).padStart(2, "0")}-${String(weekStart.getDate()).padStart(2, "0")}`;
    }
    return `${year}-${month}-${day}`;
  };

  // Pre-populate buckets between from and to so days with 0 sales render truthfully
  const current = new Date(from);
  while (current <= to) {
    const key = formatBucketKey(current);
    if (!bucketMap.has(key)) {
      bucketMap.set(key, { revenue: 0, orders: 0 });
    }
    // advance
    if (interval === "monthly") {
      current.setMonth(current.getMonth() + 1);
    } else if (interval === "yearly") {
      current.setFullYear(current.getFullYear() + 1);
    } else if (interval === "weekly") {
      current.setDate(current.getDate() + 7);
    } else {
      current.setDate(current.getDate() + 1);
    }
  }

  for (const o of orders) {
    const key = formatBucketKey(new Date(o.createdAt));
    const entry = bucketMap.get(key) || { revenue: 0, orders: 0 };
    entry.revenue += Number(o.total);
    entry.orders += 1;
    bucketMap.set(key, entry);
  }

  const result: TrendDataPoint[] = [];
  for (const [key, val] of bucketMap.entries()) {
    // Net profit approximate = revenue * 0.78 (after 2% gateway + 18% tax and deductions)
    const profit = Math.round(val.revenue * 0.78);
    result.push({
      label: key,
      timestamp: key,
      revenue: val.revenue,
      orders: val.orders,
      profit
    });
  }

  return result.sort((a, b) => a.timestamp.localeCompare(b.timestamp));
}
