export type EventCategory = 
  | "Authentication" 
  | "Navigation" 
  | "Search" 
  | "Product" 
  | "Purchase" 
  | "Payment" 
  | "Library" 
  | "Download" 
  | "Error" 
  | "System";

interface TrackEventProps {
  eventName: string;
  category: EventCategory;
  productId?: string;
  metadata?: Record<string, any>;
}

export const trackEvent = async ({ eventName, category, productId, metadata }: TrackEventProps) => {
  try {
    // Asynchronous background fire-and-forget
    fetch("/api/analytics/track", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        eventName,
        category,
        productId,
        metadata,
      }),
      // keepalive to ensure it goes through even if page unloads
      keepalive: true, 
    }).catch(console.error); // Silent catch
  } catch (error) {
    // Analytics failure should never block UI
    console.error("Failed to track event:", error);
  }
};
