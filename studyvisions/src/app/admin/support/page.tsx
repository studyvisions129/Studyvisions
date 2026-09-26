import prisma from "@/lib/prisma";
import Link from "next/link";
import { format } from "date-fns";
import { Eye, Search, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function SupportTicketsPage(props: { searchParams: Promise<{ query?: string }> }) {
  const searchParams = await props.searchParams;
  const query = searchParams.query || "";

  const whereClause = query ? {
    OR: [
      { ticketId: { contains: query, mode: "insensitive" } },
      { fullName: { contains: query, mode: "insensitive" } },
      { email: { contains: query, mode: "insensitive" } },
      { subject: { contains: query, mode: "insensitive" } },
    ],
  } : {};

  const tickets = await prisma.supportTicket.findMany({
    where: whereClause,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Support Tickets</h1>
          <p className="text-sm text-slate-500 mt-1">Manage user inquiries, issues, and feedback.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/50">
          <form className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              name="query" 
              defaultValue={query} 
              placeholder="Search by ID, name, email or subject..." 
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm"
            />
          </form>
          <div className="text-sm font-medium text-slate-500">
            Total Tickets: {tickets.length}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">Ticket ID</th>
                <th className="px-6 py-4 font-semibold">User</th>
                <th className="px-6 py-4 font-semibold">Subject</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Priority</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tickets.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    No tickets found matching your search.
                  </td>
                </tr>
              ) : (
                tickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md text-xs">
                        {ticket.ticketId}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{ticket.fullName}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{ticket.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-800 line-clamp-1 max-w-[250px]">
                        {ticket.subject}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">{ticket.category}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold",
                        ticket.status === 'NEW' && "bg-blue-100 text-blue-700",
                        ticket.status === 'IN_PROGRESS' && "bg-amber-100 text-amber-700",
                        ticket.status === 'RESOLVED' && "bg-emerald-100 text-emerald-700",
                        ticket.status === 'CLOSED' && "bg-slate-100 text-slate-700"
                      )}>
                        {ticket.status === 'NEW' && <AlertCircle className="w-3 h-3" />}
                        {ticket.status === 'IN_PROGRESS' && <Clock className="w-3 h-3" />}
                        {ticket.status === 'RESOLVED' && <CheckCircle className="w-3 h-3" />}
                        {ticket.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider",
                        ticket.priority === 'HIGH' && "bg-rose-100 text-rose-700",
                        ticket.priority === 'MEDIUM' && "bg-amber-100 text-amber-700",
                        ticket.priority === 'LOW' && "bg-slate-100 text-slate-600"
                      )}>
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500 whitespace-nowrap">
                      {format(new Date(ticket.createdAt), "MMM d, yyyy")}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link 
                        href={`/admin/support/${ticket.id}`}
                        className="inline-flex items-center justify-center p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-5 h-5" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
