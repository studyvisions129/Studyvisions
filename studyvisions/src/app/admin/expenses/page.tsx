import prisma from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, Box, Plus, Trash2, Calendar, DollarSign, Tag, Building2, FileText } from "lucide-react";
import { createExpense, deleteExpense } from "./actions";

export default async function ExpensesPage() {
  const expenses = await prisma.expense.findMany({
    orderBy: { expenseDate: "desc" }
  });

  const totalExpenses = expenses.reduce((acc, e) => acc + Number(e.amount), 0);

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href="/admin" className="text-slate-400 hover:text-indigo-600 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Expense Tracking</h1>
          </div>
          <p className="text-xs text-slate-500">
            Log and manage operational expenses, software tools, hosting, and marketing costs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-indigo-50 border border-indigo-100 px-4 py-2 rounded-2xl text-right">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Recorded</span>
            <span className="text-lg font-black text-indigo-700">₹{totalExpenses.toLocaleString("en-IN")}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* New Expense Form */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5 text-indigo-600" />
            Record New Expense
          </h2>

          <form action={createExpense} className="space-y-4 text-xs font-semibold">
            <div>
              <label className="text-slate-600 block mb-1">Expense Title</label>
              <input 
                name="title" 
                required 
                placeholder="e.g. Supabase Pro Plan, Vercel Pro"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-600 block mb-1">Amount (₹)</label>
                <input 
                  type="number" 
                  step="0.01" 
                  name="amount" 
                  required 
                  placeholder="e.g. 2100"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
                />
              </div>

              <div>
                <label className="text-slate-600 block mb-1">Date</label>
                <input 
                  type="date" 
                  name="expenseDate" 
                  defaultValue={new Date().toISOString().split("T")[0]}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-600 block mb-1">Category</label>
                <select 
                  name="category"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 cursor-pointer"
                >
                  <option value="HOSTING_SERVERS">Hosting & Servers</option>
                  <option value="SOFTWARE_TOOLS">Software & Tools</option>
                  <option value="CONTENT_CREATION">Content Creation</option>
                  <option value="FREELANCERS">Freelancers</option>
                  <option value="LEGAL_ACCOUNTING">Legal & Accounting</option>
                  <option value="MARKETING_ADS">Marketing & Ads</option>
                  <option value="OFFICE_SUPPLIES">Office Supplies</option>
                  <option value="OTHER">Other Expenses</option>
                </select>
              </div>

              <div>
                <label className="text-slate-600 block mb-1">Frequency</label>
                <select 
                  name="frequency"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 cursor-pointer"
                >
                  <option value="ONE_TIME">One-time</option>
                  <option value="MONTHLY">Monthly</option>
                  <option value="QUARTERLY">Quarterly</option>
                  <option value="YEARLY">Yearly</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-slate-600 block mb-1">Vendor (Optional)</label>
              <input 
                name="vendor" 
                placeholder="e.g. AWS, Cloudinary, OpenAI"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
              />
            </div>

            <div>
              <label className="text-slate-600 block mb-1">Notes (Optional)</label>
              <textarea 
                name="notes" 
                rows={2}
                placeholder="Reference invoice # or purpose"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl transition-all shadow-sm active:scale-95"
            >
              Add Expense
            </button>
          </form>
        </div>

        {/* Expenses List */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex justify-between items-center">
            <h2 className="font-bold text-slate-800 text-sm">All Recorded Expenses ({expenses.length})</h2>
          </div>

          {expenses.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <Box className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p className="font-semibold text-sm text-slate-600">No expenses recorded yet</p>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Add hosting, software subscriptions, and operating costs using the form on the left to accurately calculate net profit.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="px-5 py-3">Expense</th>
                    <th className="px-5 py-3">Category</th>
                    <th className="px-5 py-3">Frequency</th>
                    <th className="px-5 py-3">Date</th>
                    <th className="px-5 py-3 text-right">Amount</th>
                    <th className="px-5 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {expenses.map((exp) => (
                    <tr key={exp.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-5 py-3">
                        <div className="font-bold text-slate-900">{exp.title}</div>
                        {exp.vendor && <div className="text-[10px] text-slate-400 font-normal">Vendor: {exp.vendor}</div>}
                      </td>
                      <td className="px-5 py-3">
                        <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-bold">
                          {exp.category.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-slate-500 capitalize">{exp.frequency.toLowerCase()}</td>
                      <td className="px-5 py-3 text-slate-500">{new Date(exp.expenseDate).toLocaleDateString()}</td>
                      <td className="px-5 py-3 text-right font-black text-slate-900">₹{Number(exp.amount).toLocaleString("en-IN")}</td>
                      <td className="px-5 py-3 text-right">
                        <form action={deleteExpense.bind(null, exp.id)}>
                          <button 
                            type="submit" 
                            className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                            title="Delete expense"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </form>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
