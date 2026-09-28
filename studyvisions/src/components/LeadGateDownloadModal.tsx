'use client';
import { useState } from 'react';

export default function LeadGateDownloadModal({ 
  productSlug, 
  title, 
  onSuccess 
}: { 
  productSlug: string; 
  title: string; 
  onSuccess: (url: string) => void;
}) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length !== 10) {
      setError('Please enter a valid 10-digit WhatsApp number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/public/leads/capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          fullName: name, 
          whatsappNumber: phone, 
          resourceSlug: productSlug 
        }),
      });

      const data = await res.json();
      if (res.ok) {
        onSuccess(data.downloadUrl);
      } else {
        setError(data.message || 'Something went wrong. Try again.');
      }
    } catch {
      setError('Connection failed. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-1">
          📥 Download Printable PDF
        </h3>
        <p className="text-xs text-gray-500 mb-4 truncate">
          {title}
        </p>
        
        {error && <p className="text-xs text-red-500 mb-3">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Student Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Manish Kumar"
              className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">WhatsApp Number</label>
            <div className="flex">
              <span className="inline-flex items-center px-3 border border-r-0 rounded-l-lg bg-gray-50 text-gray-500 text-sm">
                +91
              </span>
              <input
                type="tel"
                required
                maxLength={10}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\\D/g, ''))}
                placeholder="9876543210"
                className="w-full px-3 py-2 border rounded-r-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <p className="text-[11px] text-gray-400 mt-1">We will send a backup copy directly to your WhatsApp.</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition flex items-center justify-center gap-2"
          >
            {loading ? 'Generating Link...' : 'Download PDF Now ⚡'}
          </button>
        </form>
      </div>
    </div>
  );
}
