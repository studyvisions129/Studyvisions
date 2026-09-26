"use client";

import { useState } from "react";
import { Mail, MessageSquare, HelpCircle } from "lucide-react";
import Link from "next/link";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    subject: "",
    category: "GENERAL",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      
      if (res.ok) {
        setSuccess(true);
        setFormData({ fullName: "", email: "", subject: "", category: "GENERAL", description: "" });
      } else {
        setErrorMsg(data.error || "Failed to submit request.");
      }
    } catch (e) {
      setErrorMsg("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">Get in Touch</h1>
          <p className="mt-4 text-lg text-slate-500">Have a question about our products, need help with your account, or just want to say hi? We're here to help.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Info Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                <HelpCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Help Center</h3>
              <p className="text-slate-500 text-sm mb-4">Find quick answers in our frequently asked questions.</p>
              <Link href="/faq" className="text-blue-600 font-medium hover:text-blue-700 text-sm">Visit Help Center &rarr;</Link>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Email Support</h3>
              <p className="text-slate-500 text-sm mb-4">Drop us an email and we'll get back to you within 24 hours.</p>
              <a href="mailto:support@studyvisions.com" className="text-emerald-600 font-medium hover:text-emerald-700 text-sm">support@studyvisions.com</a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 sm:p-10">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <MessageSquare className="w-6 h-6 text-blue-600" />
                Send us a Message
              </h2>
              
              {success ? (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-6 rounded-2xl text-center">
                  <h3 className="text-lg font-bold mb-2">Message Sent Successfully!</h3>
                  <p className="text-sm">Thank you for reaching out. We have received your support ticket and will get back to you shortly.</p>
                  <button onClick={() => setSuccess(false)} className="mt-6 text-emerald-700 font-semibold text-sm hover:underline">Send another message</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {errorMsg && (
                    <div className="p-4 bg-rose-50 text-rose-600 text-sm rounded-xl border border-rose-100">
                      {errorMsg}
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                      <input 
                        type="text" required
                        value={formData.fullName}
                        onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                      <input 
                        type="email" required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Subject</label>
                      <input 
                        type="text" required
                        value={formData.subject}
                        onChange={(e) => setFormData({...formData, subject: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        placeholder="How can we help?"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                      <select 
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      >
                        <option value="GENERAL">General Inquiry</option>
                        <option value="ACCOUNT_LOGIN">Account & Login</option>
                        <option value="PURCHASES">Purchases</option>
                        <option value="PAYMENTS">Payments</option>
                        <option value="DOWNLOADS">Downloads</option>
                        <option value="REFUND_POLICY">Refund Request</option>
                        <option value="TECHNICAL_ISSUES">Technical Issue</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Message</label>
                    <textarea 
                      required rows={5}
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-y"
                      placeholder="Please describe your issue or question in detail..."
                    ></textarea>
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 focus:ring-4 focus:ring-blue-100 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Sending..." : "Submit Support Request"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}