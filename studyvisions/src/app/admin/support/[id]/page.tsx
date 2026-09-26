import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, User, Mail, Tag, Calendar, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import TicketControls from "./TicketControls";

export default async function SupportTicketDetailsPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const ticket = await prisma.supportTicket.findUnique({
    where: { id: params.id }
  });

  if (!ticket) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/support" 
          className="p-2 hover:bg-slate-200 bg-slate-100 text-slate-600 rounded-full transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Ticket {ticket.ticketId}
          </h1>
          <p className="text-sm text-slate-500 mt-1">Viewing support ticket details.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">
            <h2 className="text-xl font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">
              {ticket.subject}
            </h2>
            
            <div className="prose prose-slate max-w-none">
              <div className="whitespace-pre-wrap text-slate-700 bg-slate-50 p-6 rounded-2xl border border-slate-100 leading-relaxed">
                {ticket.description}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100">
              <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-indigo-500" /> Administrative Actions
              </h3>
              <TicketControls 
                ticketId={ticket.id} 
                initialStatus={ticket.status} 
                initialPriority={ticket.priority} 
              />
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
            <h3 className="font-bold text-slate-900 mb-4">Ticket Information</h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Sender</p>
                  <p className="text-sm font-medium text-slate-900 mt-1">{ticket.fullName}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</p>
                  <a href={`mailto:${ticket.email}`} className="text-sm font-medium text-indigo-600 hover:underline mt-1 block">
                    {ticket.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Tag className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</p>
                  <p className="text-sm font-medium text-slate-900 mt-1">{ticket.category}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Submitted On</p>
                  <p className="text-sm font-medium text-slate-900 mt-1">
                    {format(new Date(ticket.createdAt), "MMMM d, yyyy 'at' h:mm a")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
