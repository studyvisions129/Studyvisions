"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowLeft, ShieldCheck, CreditCard, Lock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { trackEvent } from "@/lib/analytics";

export default function CheckoutClient({ product, user }: { product: any, user: any }) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const basePrice = Number(product.compareAtPrice || product.price);
  const finalPrice = Number(product.price);
  const discount = basePrice - finalPrice;

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    setErrorMsg("");

    try {
      const res = await loadRazorpay();
      if (!res) {
        setErrorMsg("Failed to load Razorpay SDK. Please check your connection.");
        setIsProcessing(false);
        return;
      }

      // 1. Create Order
      const orderRes = await fetch("/api/checkout/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id }),
      });
      const orderData = await orderRes.json();

      if (!orderRes.ok) {
        throw new Error(orderData.error || "Failed to create order");
      }

      // 2. Setup Razorpay Options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_xxx", // Set in env
        amount: orderData.amount,
        currency: orderData.currency,
        name: "StudyVisions",
        description: product.title,
        order_id: orderData.razorpayOrderId,
        handler: async function (response: any) {
          try {
            setIsProcessing(true);
            const verifyRes = await fetch("/api/checkout/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderId: orderData.id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
            const verifyData = await verifyRes.json();

            if (verifyRes.ok && verifyData.success) {
              trackEvent({
                eventName: "Payment Successful",
                category: "Payment",
                productId: product.id,
                metadata: { orderId: orderData.id, amount: finalPrice }
              });
              router.push(`/checkout/success?orderId=${orderData.id}`);
            } else {
              setErrorMsg(verifyData.error || "Payment verification failed.");
              trackEvent({
                eventName: "Checkout Failed",
                category: "Error",
                productId: product.id,
                metadata: { error: verifyData.error || "Payment verification failed" }
              });
              setIsProcessing(false);
            }
          } catch (e: any) {
             setErrorMsg("An error occurred during verification.");
             trackEvent({
                eventName: "Checkout Failed",
                category: "Error",
                productId: product.id,
                metadata: { error: e.message || "Unknown error during verification" }
             });
             setIsProcessing(false);
          }
        },
        prefill: {
          name: user.fullName,
          email: user.email,
        },
        theme: {
          color: "#2563eb",
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.on("payment.failed", function (response: any) {
        setErrorMsg(response.error.description || "Payment failed");
        trackEvent({
          eventName: "Checkout Failed",
          category: "Error",
          productId: product.id,
          metadata: { error: response.error.description || "Payment failed" }
        });
        setIsProcessing(false);
      });
      paymentObject.open();

    } catch (error: any) {
      setErrorMsg(error.message || "An unexpected error occurred.");
      trackEvent({
        eventName: "Checkout Failed",
        category: "Error",
        productId: product.id,
        metadata: { error: error.message || "An unexpected error occurred." }
      });
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <Link href={`/products/${product.slug}`} className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Product
        </Link>

        <h1 className="text-3xl font-extrabold text-slate-900 mb-8">Secure Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Section - Product Details */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200">
              <h2 className="text-xl font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4">Product Details</h2>
              
              <div className="flex flex-col sm:flex-row gap-6">
                <div className={`w-full sm:w-40 h-40 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center p-4 shadow-inner shrink-0`}>
                   <span className="text-white font-bold text-center leading-tight">{product.title}</span>
                </div>
                <div>
                  <div className="mb-2">
                    <span className="inline-block text-xs font-bold px-2.5 py-1 rounded bg-slate-100 text-slate-600 uppercase tracking-wider">
                      {product.type}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{product.title}</h3>
                  <p className="text-sm text-slate-500 mb-4">{product.shortDescription || product.description}</p>
                  
                  <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-600">
                    <span className="font-medium">• CBSE Board</span>
                    <span className="font-medium">• {product.academicLevel?.name || "General"}</span>
                    {product.totalPages && <span className="font-medium">• {product.totalPages} Pages</span>}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200">
               <h2 className="text-xl font-bold text-slate-800 mb-4 border-b border-slate-100 pb-4">Customer Information</h2>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Full Name</label>
                    <div className="font-medium text-slate-900">{user.fullName}</div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Email Address</label>
                    <div className="font-medium text-slate-900">{user.email}</div>
                  </div>
               </div>
            </div>
          </div>

          {/* Right Section - Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl shadow-slate-200/50 border border-slate-200 sticky top-8">
              <h2 className="text-xl font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center text-slate-600">
                  <span>Base Price</span>
                  <span className="font-medium">₹{basePrice.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between items-center text-green-600">
                    <span>Discount</span>
                    <span className="font-medium">-₹{discount.toFixed(2)}</span>
                  </div>
                )}
                
                {/* Future Coupon Section */}
                <div className="border-t border-dashed border-slate-200 pt-4 mt-4">
                  <div className="flex justify-between items-center text-lg font-bold text-slate-900">
                    <span>Final Amount</span>
                    <span>₹{finalPrice.toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-slate-500 text-right mt-1">Including GST</p>
                </div>
              </div>

              {errorMsg && (
                <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100">
                  {errorMsg}
                </div>
              )}

              <button 
                onClick={handlePayment} 
                disabled={isProcessing}
                className="btn-primary w-full !py-4 text-lg shadow-blue-500/25 shadow-lg flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    Pay ₹{finalPrice.toFixed(2)}
                  </>
                )}
              </button>

              <div className="mt-6 flex flex-col items-center gap-3">
                <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                  <ShieldCheck className="w-4 h-4 text-green-500" />
                  Secured by Razorpay
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Lock className="w-3 h-3" />
                  256-bit encrypted checkout
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
