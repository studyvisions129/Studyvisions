'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProofItem {
  name: string;
  city: string;
  product: string;
  timeAgo: string;
}

export default function SocialProofToast() {
  const [currentNotification, setCurrentNotification] = useState<ProofItem | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;

    const fetchNotification = async () => {
      try {
        const res = await fetch('/api/public/social-proof');
        const data = await res.json();
        if (data.item) {
          setCurrentNotification(data.item);
          setTimeout(() => setCurrentNotification(null), 4500); // 4.5s display
        }
      } catch (err) {
        console.error('Social proof fetch error', err);
      }
    };

    const interval = setInterval(fetchNotification, 18000); // Every 18s
    return () => clearInterval(interval);
  }, [dismissed]);

  if (dismissed || !currentNotification) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        className="fixed bottom-6 left-6 z-40 bg-white border border-blue-100 shadow-xl rounded-xl p-3.5 flex items-center gap-3.5 max-w-sm"
      >
        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
          {currentNotification.name.charAt(0)}
        </div>
        <div className="text-xs text-gray-700 leading-tight">
          <p className="font-semibold text-gray-900">
            {currentNotification.name} <span className="font-normal text-gray-500">from {currentNotification.city}</span>
          </p>
          <p className="text-blue-600 font-medium truncate max-w-[210px]">
            Enrolled in {currentNotification.product}
          </p>
          <p className="text-[10px] text-gray-400 mt-0.5">{currentNotification.timeAgo}</p>
        </div>
        <button 
          onClick={() => setDismissed(true)} 
          className="text-gray-400 hover:text-gray-600 ml-1 text-xs"
        >
          ✕
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
