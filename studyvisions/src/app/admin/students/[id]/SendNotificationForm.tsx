"use client";

import { useState } from "react";
import { Send, Bell } from "lucide-react";
import { sendNotification } from "../actions";
import { useRouter } from "next/navigation";

export function SendNotificationForm({ userId }: { userId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) return;
    
    setLoading(true);
    const res = await sendNotification(userId, title, message);
    setLoading(false);
    
    if (res.success) {
      alert("Notification sent successfully!");
      setIsOpen(false);
      setTitle("");
      setMessage("");
      router.refresh();
    } else {
      alert(res.error || "Failed to send notification.");
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-all shadow-sm"
      >
        <Bell className="w-4 h-4" /> Send Notification
      </button>
    );
  }

  return (
    <form onSubmit={handleSend} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mt-4 w-full sm:w-96 absolute right-0 top-full z-10">
      <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
        <Send className="w-4 h-4" /> Send Message
      </h4>
      <input 
        type="text" 
        placeholder="Notification Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full px-3 py-2 rounded-lg border border-slate-200 mb-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
      <textarea 
        placeholder="Type your message here..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full px-3 py-2 rounded-lg border border-slate-200 mb-3 text-sm h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
      <div className="flex justify-end gap-2">
        <button 
          type="button" 
          onClick={() => setIsOpen(false)}
          className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100"
        >
          Cancel
        </button>
        <button 
          type="submit" 
          disabled={loading}
          className="px-3 py-1.5 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </div>
    </form>
  );
}
