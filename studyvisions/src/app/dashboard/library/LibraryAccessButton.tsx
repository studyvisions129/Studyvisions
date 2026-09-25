"use client";

import { trackEvent } from "@/lib/analytics";
import { useRouter } from "next/navigation";

export default function LibraryAccessButton({ productId, href }: { productId: string, href: string }) {
  const router = useRouter();

  const handleAccess = () => {
    trackEvent({
      eventName: "Product Opened",
      category: "Library",
      productId,
    });
    // In future, redirect to the actual viewer
    // router.push(href);
    alert("Content viewer is under construction! Event tracked.");
  };

  return (
    <button 
      onClick={handleAccess}
      className="w-full py-2 bg-blue-50 text-blue-600 font-medium rounded-lg text-sm hover:bg-blue-100 transition-colors"
    >
      Access Content
    </button>
  );
}
