"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

export default function ProductViewTracker({ productId }: { productId: string }) {
  useEffect(() => {
    trackEvent({
      eventName: "Product Viewed",
      category: "Product",
      productId,
    });
  }, [productId]);

  return null; // Invisible tracker
}
