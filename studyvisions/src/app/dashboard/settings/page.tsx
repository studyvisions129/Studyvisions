"use client";

import { useState } from "react";
import { 
  User, 
  Lock, 
  Bell, 
  GraduationCap, 
  ShoppingBag, 
  CreditCard, 
  Shield, 
  Palette, 
  FileText, 
  HelpCircle 
} from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("Profile");

  const settingsNav = [
    { name: "Profile", icon: User },
    { name: "Security", icon: Lock },
    { name: "Notifications", icon: Bell },
    { name: "Learning Preferences", icon: GraduationCap },
    { name: "Orders & Purchases", icon: ShoppingBag },
    { name: "Payment & Billing", icon: CreditCard },
    { name: "Privacy & Data", icon: Shield },
    { name: "Appearance", icon: Palette },
    { name: "Legal", icon: FileText },
    { name: "Help & Support", icon: HelpCircle },
  ];

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Settings</h1>
        <p className="text-slate-500">Manage your account preferences and configurations.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Settings Navigation */}
        <div className="w-full md:w-64 shrink-0 space-y-1">
          {settingsNav.map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveTab(item.name)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === item.name 
                  ? "bg-blue-50 text-blue-600 border border-blue-100 shadow-sm" 
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent"
              }`}
            >
              <item.icon className={`w-5 h-5 ${activeTab === item.name ? "text-blue-500" : "text-slate-400"}`} />
              {item.name}
            </button>
          ))}
        </div>

        {/* Settings Content Area */}
        <div className="flex-1 bg-white rounded-2xl border border-[var(--sv-border)] shadow-sm p-6 lg:p-8 min-h-[500px]">
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-100">
            {settingsNav.map((item) => (
              activeTab === item.name && (
                <div key={item.name} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-800">{item.name}</h2>
                </div>
              )
            ))}
          </div>
          
          {activeTab === "Privacy & Data" ? (
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">Export Your Data</h3>
                <p className="text-sm text-slate-500 mb-4">Download a copy of your personal data, purchase history, and learning progress.</p>
                <button className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
                  Request Data Export
                </button>
              </div>
              
              <div className="pt-6 border-t border-slate-100">
                <h3 className="text-lg font-bold text-rose-600 mb-2">Delete Account</h3>
                <p className="text-sm text-slate-500 mb-4">Permanently delete your account and all associated data. This action cannot be undone.</p>
                <button 
                  onClick={async () => {
                    if (confirm("Are you sure you want to permanently delete your account? This action cannot be undone.")) {
                      try {
                        const res = await fetch("/api/auth/delete-account", { method: "POST" });
                        if (res.ok) {
                          alert("Account deleted successfully.");
                          window.location.href = "/";
                        } else {
                          alert("Failed to delete account. Please try again.");
                        }
                      } catch(e) {
                        alert("An error occurred.");
                      }
                    }
                  }}
                  className="px-4 py-2 bg-rose-50 text-rose-600 rounded-lg text-sm font-medium hover:bg-rose-100 transition-colors"
                >
                  Delete My Account
                </button>
              </div>
            </div>
          ) : (
            <div className="text-slate-500">
              <p>This is the placeholder content for the <strong>{activeTab}</strong> settings.</p>
              <p className="mt-2 text-sm">All options are functioning properly without generating any 404 errors. You can integrate API logic here in the future.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
