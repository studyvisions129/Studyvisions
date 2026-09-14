"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";

export function MobileAdminSidebar({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg mr-2"
      >
        <Menu className="w-6 h-6" />
      </button>

      {isOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-slate-900/50" onClick={() => setIsOpen(false)} />
          <div className="relative flex w-64 flex-col bg-white">
            <button
              className="absolute -right-12 top-4 p-2 text-white bg-slate-800 rounded-full"
              onClick={() => setIsOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
            <div className="h-full overflow-y-auto" onClick={() => setIsOpen(false)}>
              {children}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
