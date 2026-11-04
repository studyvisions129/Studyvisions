import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-utils";
import prisma from "@/lib/prisma";
import { getDateRangeBoundaries } from "@/lib/date-utils";

export async function GET(req: Request) {
  try {
    // 1. Enforce RBAC / Admin session
    await requireAdmin();

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || "revenue";
    const range = searchParams.get("range") || "This Month";
    const customFrom = searchParams.get("from");
    const customTo = searchParams.get("to");

    const boundaries = getDateRangeBoundaries(range, customFrom, customTo);
    const { from, to } = boundaries;

    if (type === "orders") {
      const orders = await prisma.order.findMany({
        where: { createdAt: { gte: from, lte: to } },
        include: { user: true, items: { include: { product: true } } },
        orderBy: { createdAt: "desc" }
      });

      const header = ["Order Number", "Date", "Customer Name", "Customer Email", "Status", "Items", "Subtotal (INR)", "Discount (INR)", "Total (INR)", "Razorpay Payment ID"];
      const rows = orders.map(o => [
        `"${o.orderNumber}"`,
        `"${o.createdAt.toISOString()}"`,
        `"${(o.user?.fullName || "").replace(/"/g, '""')}"`,
        `"${o.user?.email || ""}"`,
        `"${o.status}"`,
        `"${o.items.map(i => i.product.title).join("; ").replace(/"/g, '""')}"`,
        Number(o.subtotal),
        Number(o.discount),
        Number(o.total),
        `"${o.razorpayPaymentId || ""}"`
      ]);

      const csvContent = [header.join(","), ...rows.map(r => r.join(","))].join("\n");

      return new NextResponse(csvContent, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="studyvisions-orders-${range.toLowerCase().replace(/ /g, "-")}.csv"`
        }
      });
    }

    if (type === "products") {
      const products = await prisma.product.findMany({
        include: {
          orderItems: {
            where: {
              order: { status: "PAID", createdAt: { gte: from, lte: to } }
            }
          }
        }
      });

      const header = ["Product ID", "Title", "Type", "Status", "Price (INR)", "Units Sold", "Total Revenue (INR)"];
      const rows = products.map(p => {
        const units = p.orderItems.length;
        const rev = p.orderItems.reduce((acc, i) => acc + Number(i.price), 0);
        return [
          `"${p.id}"`,
          `"${p.title.replace(/"/g, '""')}"`,
          `"${p.type}"`,
          `"${p.status}"`,
          Number(p.price),
          units,
          rev
        ];
      });

      const csvContent = [header.join(","), ...rows.map(r => r.join(","))].join("\n");

      return new NextResponse(csvContent, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="studyvisions-products.csv"`
        }
      });
    }

    if (type === "customers") {
      const customers = await prisma.user.findMany({
        where: { role: "STUDENT" },
        include: {
          orders: {
            where: { status: "PAID" },
            select: { total: true }
          }
        }
      });

      const header = ["User ID", "Full Name", "Email", "Phone", "Registration Date", "Paid Orders Count", "Total Spent (INR)"];
      const rows = customers.map(c => {
        const orderCount = c.orders.length;
        const totalSpent = c.orders.reduce((acc, o) => acc + Number(o.total), 0);
        return [
          `"${c.id}"`,
          `"${c.fullName.replace(/"/g, '""')}"`,
          `"${c.email}"`,
          `"${c.phone || ""}"`,
          `"${c.createdAt.toISOString()}"`,
          orderCount,
          totalSpent
        ];
      });

      const csvContent = [header.join(","), ...rows.map(r => r.join(","))].join("\n");

      return new NextResponse(csvContent, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="studyvisions-customers.csv"`
        }
      });
    }

    // Default: Revenue / Financial Summary Report
    const [paidOrders, expenses] = await Promise.all([
      prisma.order.findMany({
        where: { status: "PAID", createdAt: { gte: from, lte: to } },
        select: { total: true, discount: true, createdAt: true }
      }),
      prisma.expense.findMany({
        where: { expenseDate: { gte: from, lte: to } }
      })
    ]);

    const grossSales = paidOrders.reduce((acc, o) => acc + Number(o.total) + Number(o.discount), 0);
    const discounts = paidOrders.reduce((acc, o) => acc + Number(o.discount), 0);
    const grossRevenue = paidOrders.reduce((acc, o) => acc + Number(o.total), 0);
    const refunds = 0;
    const netRevenue = grossRevenue - refunds;
    const gatewayFees = Math.round(netRevenue * 0.02);
    const taxes = Math.round(netRevenue * 0.18);
    const totalExpenses = expenses.reduce((acc, e) => acc + Number(e.amount), 0);
    const netProfit = netRevenue - gatewayFees - taxes - totalExpenses;

    const summaryRows = [
      ["Metric", "Value (INR)", "Accounting Definition"],
      ["Date Window", `"${boundaries.label}"`, "Time range in Asia/Kolkata (IST)"],
      ["Gross Sales", grossSales, "Gross customer sales before discounts"],
      ["Discounts", discounts, "Sum of coupon discounts"],
      ["Gross Revenue", grossRevenue, "Captured payments for completed orders"],
      ["Refunds", refunds, "Processed customer refunds"],
      ["Net Sales Revenue", netRevenue, "Gross Revenue minus Refunds"],
      ["Payment Gateway Fees (Razorpay 2%)", gatewayFees, "Standard 2% domestic transaction fee"],
      ["Taxes (GST 18%)", taxes, "18% GST applicable on digital services"],
      ["Operating Expenses", totalExpenses, "Sum of logged business operating expenses"],
      ["Net Profit", netProfit, "Net Sales Revenue - Fees - Taxes - Expenses"],
      ["Orders Count", paidOrders.length, "Total successful paid orders"]
    ];

    const csvContent = summaryRows.map(r => r.join(",")).join("\n");

    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="studyvisions-revenue-${range.toLowerCase().replace(/ /g, "-")}.csv"`
      }
    });

  } catch (error: any) {
    const status = error.message === "Unauthorized" ? 401 : error.message?.includes("Forbidden") ? 403 : 500;
    return NextResponse.json({ error: error.message || "Unauthorized" }, { status });
  }
}
