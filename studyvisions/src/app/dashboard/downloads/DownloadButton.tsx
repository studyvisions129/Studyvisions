"use client";

import { useState } from "react";
import { Download, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

interface DownloadButtonProps {
  productId: string;
  isAvailable: boolean;
  fileName?: string;
}

export default function DownloadButton({
  productId,
  isAvailable,
  fileName,
}: DownloadButtonProps) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  if (!isAvailable) {
    return (
      <button
        disabled
        className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-slate-100 text-slate-400 cursor-not-allowed flex items-center justify-center gap-2 border border-slate-200"
      >
        <AlertCircle className="w-4 h-4 text-slate-400" />
        Asset Unavailable
      </button>
    );
  }

  const handleDownload = async () => {
    try {
      setLoading(true);
      setStatus("idle");
      setErrorMessage("");

      const response = await fetch(`/api/downloads/${productId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate download link");
      }

      // Trigger file download via generated short-lived signed link
      const downloadAnchor = document.createElement("a");
      downloadAnchor.href = data.downloadUrl;
      downloadAnchor.setAttribute("download", data.fileName || fileName || "download");
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      setStatus("success");
      setTimeout(() => setStatus("idle"), 3000);
    } catch (err: any) {
      setStatus("error");
      setErrorMessage(err.message || "Download failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-1.5">
      <button
        onClick={handleDownload}
        disabled={loading}
        className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
          status === "success"
            ? "bg-emerald-600 text-white shadow-sm"
            : status === "error"
            ? "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
            : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow"
        }`}
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Generating Link...
          </>
        ) : status === "success" ? (
          <>
            <CheckCircle2 className="w-4 h-4" />
            Download Started
          </>
        ) : status === "error" ? (
          <>
            <AlertCircle className="w-4 h-4" />
            Retry Download
          </>
        ) : (
          <>
            <Download className="w-4 h-4" />
            Download Now
          </>
        )}
      </button>

      {status === "error" && errorMessage && (
        <p className="text-[11px] text-red-600 text-center">{errorMessage}</p>
      )}
    </div>
  );
}
