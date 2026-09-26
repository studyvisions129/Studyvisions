"use client";

import { useState } from "react";
import { updateTicketStatus, updateTicketPriority } from "../actions";

export default function TicketControls({ ticketId, initialStatus, initialPriority }: { ticketId: string, initialStatus: string, initialPriority: string }) {
  const [status, setStatus] = useState(initialStatus);
  const [priority, setPriority] = useState(initialPriority);
  const [loading, setLoading] = useState(false);

  const handleStatusChange = async (newStatus: any) => {
    setStatus(newStatus);
    setLoading(true);
    await updateTicketStatus(ticketId, newStatus);
    setLoading(false);
  };

  const handlePriorityChange = async (newPriority: any) => {
    setPriority(newPriority);
    setLoading(true);
    await updateTicketPriority(ticketId, newPriority);
    setLoading(false);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Status</label>
        <select 
          value={status}
          onChange={(e) => handleStatusChange(e.target.value)}
          disabled={loading}
          className="bg-white border border-slate-200 text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
        >
          <option value="NEW">New</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="RESOLVED">Resolved</option>
          <option value="CLOSED">Closed</option>
        </select>
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Priority</label>
        <select 
          value={priority}
          onChange={(e) => handlePriorityChange(e.target.value)}
          disabled={loading}
          className="bg-white border border-slate-200 text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
        >
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </select>
      </div>
    </div>
  );
}
