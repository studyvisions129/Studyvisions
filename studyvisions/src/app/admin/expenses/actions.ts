"use server";

import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-utils";
import { revalidatePath } from "next/cache";

export async function createExpense(formData: FormData) {
  await requireAdmin();

  const title = formData.get("title") as string;
  const category = (formData.get("category") as any) || "OTHER";
  const amountStr = formData.get("amount") as string;
  const isRecurring = formData.get("isRecurring") === "true";
  const frequency = (formData.get("frequency") as any) || "ONE_TIME";
  const vendor = formData.get("vendor") as string;
  const notes = formData.get("notes") as string;
  const expenseDateStr = formData.get("expenseDate") as string;

  if (!title || !amountStr) {
    throw new Error("Title and amount are required");
  }

  const amount = parseFloat(amountStr);
  if (isNaN(amount) || amount <= 0) {
    throw new Error("Amount must be a positive number");
  }

  const expenseDate = expenseDateStr ? new Date(expenseDateStr) : new Date();

  await prisma.expense.create({
    data: {
      title,
      category,
      amount,
      isRecurring,
      frequency,
      vendor: vendor || null,
      notes: notes || null,
      expenseDate,
      status: "PAID"
    }
  });

  revalidatePath("/admin");
  revalidatePath("/admin/expenses");
}

export async function deleteExpense(id: string) {
  await requireAdmin();

  if (!id) {
    throw new Error("Expense ID is required");
  }

  await prisma.expense.delete({
    where: { id }
  });

  revalidatePath("/admin");
  revalidatePath("/admin/expenses");
}
