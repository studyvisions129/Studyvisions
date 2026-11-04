# STUDYVISIONS — IMMEDIATE NEXT DEVELOPMENT ACTIONS
**Document ID:** SV-DOC-AUDIT-006  
**Audit Date:** October 21, 2026  
**Auditor:** Antigravity Engineering Architecture & Security Audit System  
**Repository:** `studyvisions129/studyvisions`  

---

## 1. Actionable Next Steps Summary

Before launching live commercial operations or marketing campaigns, the following 5 tasks must be executed in exact sequential order:

```
[ACTION-1: Payment Security Patch] 
      ⬇
[ACTION-2: Server Action Authorization Lock] 
      ⬇
[ACTION-3: Multi-Item Entitlement Loop] 
      ⬇
[ACTION-4: Student Downloads Fulfillment Engine] 
      ⬇
[ACTION-5: Business Analytics Real Data Hookup]
```

---

## 2. Action Items Specification

### ACTION-1: Payment Verification & Webhook Insecure Fallback Patch
- **Kya karna hai?**
  - `src/app/api/checkout/verify/route.ts` aur `src/app/api/checkout/webhook/route.ts` se fallback string `"xxx"` ko completely remove karna hai.
  - Secret missing hone par strict error (500) throw karna hai taaki bina secret ke koi endpoint execute na ho sake.
- **Kyon karna hai?**
  - Agar environment variable missing ho, to koi bhi attacker HMAC hash `"xxx"` bhejkar orders ko free mein `PAID` mark karwa sakta hai (`BUG-SEC-001`).
- **Kaun-si problem solve hogi?**
  - Critical financial forgery vulnerability permanently eliminate hogi.
- **Kis task par depend karta hai?**
  - Independent. Koi dependency nahi hai.
- **Kaise verify hoga?**
  - Secret env variable ko unset karke endpoint par test POST bhejna; endpoint ko immediately 500 error return karna chahiye. Valid secret ke sath verify karne par signature match hona chahiye.
- **Complete hone ka evidence kya hoga?**
  - Code mein `process.env.RAZORPAY_KEY_SECRET || "xxx"` completely absent hoga, aur automated test pass hoga.

---

### ACTION-2: Admin Server Actions Security Lock (`requireAdmin`)
- **Kya karna hai?**
  - Char files mein `await requireAdmin();` add karna:
    1. `src/app/admin/ads/actions.ts` (`toggleAdPlacement`, `createAdPlacement`)
    2. `src/app/admin/sellers/actions.ts` (`updateSellerStatus`)
    3. `src/app/admin/free-content/actions.ts` (`createFreeContent`, `updateFreeContent`, `deleteFreeContent`)
    4. `src/app/admin/promotions/actions.ts` (`createPromotion`, `togglePromotion`)
- **Kyon karna hai?**
  - Next.js server actions public POST endpoints hote hain. Bina admin check ke koi bhi unauthorized request promotions create kar sakti hai ya educational content delete kar sakti hai (`BUG-SEC-002`).
- **Kaun-si problem solve hogi?**
  - Unauthorized database tampering aur privilege escalation risk fix hoga.
- **Kis task par depend karta hai?**
  - `src/lib/auth-utils.ts` (Already available).
- **Kaise verify hoga?**
  - Unauthenticated request bhejkar check karna ki server action `Forbidden: Admin access required` throw karta hai ya nahi.
- **Complete hone ka evidence kya hoga?**
  - Har action ke start mein `await requireAdmin()` present hoga aur unauthorized test fail nahi hoga.

---

### ACTION-3: Multi-Item Order Purchase Entitlement Loop
- **Kya karna hai?**
  - `src/app/api/checkout/verify/route.ts` aur `src/app/api/checkout/webhook/route.ts` mein single `items[0]` logic ko replace karke poore `order.items` array par loop chalana.
- **Kyon karna hai?**
  - Jab customer bundle ya multi-product cart order karega, to abhi sirf pehla product unlock hota hai, baki products lock reh jate hain (`BUG-COM-001`).
- **Kaun-si problem solve hogi?**
  - Customer purchase fulfillment failure aur subsequent support disputes solve honge.
- **Kis task par depend karta hai?**
  - Prisma schema `Purchase` model (Already available).
- **Kaise verify hoga?**
  - 2 products ka test order create karke verify route call karna; dono products student ke `Purchase` table mein `isActive: true` hone chahiye.
- **Complete hone ka evidence kya hoga?**
  - Loop execution log aur database assert: `purchases.length === order.items.length`.

---

### ACTION-4: Student Downloads Fulfillment Engine Implementation
- **Kya karna hai?**
  - `src/app/dashboard/downloads/page.tsx` mein real student purchase fetch query likhna.
  - Digital assets (PDFs, Notes) ke liye secure download handler create karna.
- **Kyon karna hai?**
  - Abhi student dashboard downloads page par `const downloads = []` hardcoded hai; purchase karne ke baad bhi student file download nahi kar sakta (`BUG-COM-002`).
- **Kaun-si problem solve hogi?**
  - StudyVisions ka core business value deliver hoga (Students will actually receive what they paid for).
- **Kis task par depend karta hai?**
  - ACTION-3 (Purchases correctly recorded).
- **Kaise verify hoga?**
  - Test student account se login karke `/dashboard/downloads` par visit karna; purchased file cards aur download buttons active hone chahiye.
- **Complete hone ka evidence kya hoga?**
  - Student downloads table dynamically populates with real purchases and download links return valid files.

---

### ACTION-5: Business Analytics Real Data Hookup
- **Kya karna hai?**
  - `src/app/admin/analytics/page.tsx` aur `src/app/admin/analytics/_components/RevenueTab.tsx` ko `src/lib/services/financial-calculations.ts` se connect karna.
  - Demo data banner aur hardcoded figures (`₹1,50,000`, `142 orders`) ko remove karna.
- **Kyon karna hai?**
  - Admin ko accurate, unified financial picture chahiye jo dashboard (`/admin`) ke sath 100% reconcile kare.
- **Kaun-si problem solve hogi?**
  - Misleading demo data aur inconsistent financial reporting solve hoga.
- **Kis task par depend karta hai?**
  - `src/lib/services/financial-calculations.ts` (Already available and verified with 20 unit tests).
- **Kaise verify hoga?**
  - `/admin` aur `/admin/analytics` dono pages par same date range mein Revenue, Net Profit, Orders, aur AOV exact match hone chahiye.
- **Complete hone ka evidence kya hoga?**
  - Demo banner absent hoga; metrics live database state se dynamically calculate honge.
