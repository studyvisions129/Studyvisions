# SV-SEC-001 Payment Verification & Webhook Security Hardening Report

**Task ID**: SV-SEC-001  
**Task Name**: Payment Verification and Webhook Security Hardening  
**Priority**: P0 — CRITICAL  
**Date**: November 4, 2026  
**Auditor/Implementer**: Antigravity Security Agent  
**Status**: FULLY VERIFIED (Task Scope)  

---

## 1. Original Vulnerability and Exact Evidence

During the StudyVisions Admin Panel security audit, insecure placeholder-secret fallbacks were identified in the payment verification and webhook handling paths. The affected files silently defaulted to `"xxx"` or `"rzp_test_xxx"` if environment variables were not configured.

### Evidence 1: Payment Verification Route
**File**: `src/app/api/checkout/verify/route.ts` (Line 28 prior to fix)
```typescript
// VULNERABLE CODE (PRE-FIX):
const secret = process.env.RAZORPAY_KEY_SECRET || "xxx";
const generated_signature = crypto
  .createHmac("sha256", secret)
  .update(razorpay_order_id + "|" + razorpay_payment_id)
  .digest("hex");

if (generated_signature !== razorpay_signature) {
  // ...
}
```
**Vulnerability Impact**: If `RAZORPAY_KEY_SECRET` was unconfigured or blank, the server computed the HMAC signature using `"xxx"`. An attacker knowing this fallback could compute `HMAC_SHA256(razorpay_order_id + "|" + razorpay_payment_id, "xxx")`, send it in the request payload, and successfully force the order status to `PAID`, record `paidAt`, and obtain persistent access (`Purchase` record) to premium products without paying. Furthermore, string comparison `generated_signature !== razorpay_signature` was vulnerable to timing side-channel attacks, and `razorpay_order_id` was not validated against the order's database record.

### Evidence 2: Razorpay Webhook Route
**File**: `src/app/api/checkout/webhook/route.ts` (Line 15 prior to fix)
```typescript
// VULNERABLE CODE (PRE-FIX):
const secret = process.env.RAZORPAY_WEBHOOK_SECRET || "xxx"; // Configure this in env
const expectedSignature = crypto
  .createHmac("sha256", secret)
  .update(bodyText)
  .digest("hex");

if (expectedSignature !== signature) {
  return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
}
```
**Vulnerability Impact**: If `RAZORPAY_WEBHOOK_SECRET` was unset (which was the case in the current `.env` configuration), any incoming HTTP request with `x-razorpay-signature` signed with `"xxx"` was accepted as legitimate. An attacker could forge `payment.captured` or `order.paid` events and remotely mark any customer order as `PAID` and grant digital course entitlements.

### Evidence 3: Order Creation Route
**File**: `src/app/api/checkout/create-order/route.ts` (Lines 10-11 prior to fix)
```typescript
// VULNERABLE CODE (PRE-FIX):
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_xxx",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "xxx",
});
```
**Vulnerability Impact**: The Razorpay SDK was statically instantiated with hardcoded dummy credentials if environment variables were missing, risking silent misconfiguration.

---

## 2. Files Inspected

1. `src/app/api/checkout/verify/route.ts`: Payment verification handler and entitlement creation.
2. `src/app/api/checkout/webhook/route.ts`: Razorpay webhook ingestion and event processing.
3. `src/app/api/checkout/create-order/route.ts`: Razorpay order creation and DB order staging.
4. `src/app/(public)/checkout/[productId]/CheckoutClient.tsx`: Client-side Razorpay modal launcher and handler.
5. `src/app/(public)/checkout/[productId]/page.tsx`: Server component for checkout page.
6. `src/lib/services/action-center.ts`: Action center system health checks for Razorpay keys.
7. `src/lib/logger.ts`: Centralized application and audit logging mechanism.
8. `prisma/schema.prisma`: Database schema for `Order`, `OrderItem`, `Purchase`, `User`, `SystemLog`, and `OrderStatus`.
9. `.env.example`, `.env`, and `.env.local`: Configuration schemas and active environment variable keys (without logging secrets).
10. `tests/e2e-workflow.test.mjs`: Existing end-to-end operational lifecycle and reconciliation test suite.
11. `tests/financial-calculations.test.mjs`: Existing financial metric calculations test suite.
12. `package.json`: Build scripts, dependencies, and test runner configurations.

---

## 3. Files Modified

1. **`src/app/api/checkout/verify/route.ts`**:
   - Removed insecure fallback `|| "xxx"`.
   - Added fail-closed secret validation: returns HTTP 500 (`Payment verification service is unavailable`) if `RAZORPAY_KEY_SECRET` is unset.
   - Enforced order association validation: verifies `order.razorpayOrderId === razorpay_order_id` to block cross-order signature substitution.
   - Replaced naive string equality with constant-time equality check via `crypto.timingSafeEqual`.
   - Added structured audit logging for security events and successful verifications.

2. **`src/app/api/checkout/webhook/route.ts`**:
   - Removed insecure fallback `|| "xxx"`.
   - Added fail-closed secret validation: returns HTTP 500 (`Webhook verification service is unavailable`) if `RAZORPAY_WEBHOOK_SECRET` is unset.
   - Replaced naive string equality with constant-time equality check via `crypto.timingSafeEqual`.
   - Hardened JSON payload parsing and null safety on nested payload entities (`event.payload?.payment?.entity`).
   - Standardized audit logging via `logger` instead of unformatted `console.error`.

3. **`src/app/api/checkout/create-order/route.ts`**:
   - Removed static placeholder initialization (`|| "rzp_test_xxx"`, `|| "xxx"`).
   - Created `getRazorpayClient()` factory that checks for required credentials and fails closed with HTTP 500 (`Payment service is unavailable`) if unconfigured.

4. **`package.json`**:
   - Updated test runner script to `node --test --test-concurrency=1 tests/*.test.mjs` to ensure reliable sequential execution across DB-backed test suites.

5. **`tests/payment-security.test.mjs`** (NEW):
   - Comprehensive test suite covering all 11 required security, failure, and idempotency scenarios.

---

## 4. Exact Nature of the Fix

### A. Fail-Closed Secret Validation
Before any signature calculation is attempted, the respective secret is verified:
```typescript
const secret = process.env.RAZORPAY_KEY_SECRET;
if (!secret) {
  logger.critical("Payment verification configuration error: RAZORPAY_KEY_SECRET is not configured", {
    orderId,
  });
  return NextResponse.json(
    { error: "Payment verification service is unavailable" },
    { status: 500 }
  );
}
```
If the secret is missing, execution terminates immediately. The database order remains in its current state (`PENDING`), no product access is created, and the failure is logged to `SystemLog` without exposing secret values.

### B. Constant-Time Signature Comparison
To mitigate timing side-channel attacks, signatures are compared using `crypto.timingSafeEqual`:
```typescript
const isSignatureValid =
  typeof razorpay_signature === "string" &&
  generated_signature.length === razorpay_signature.length &&
  crypto.timingSafeEqual(
    Buffer.from(generated_signature, "utf-8"),
    Buffer.from(razorpay_signature, "utf-8")
  );
```

### C. Cross-Order Signature Binding
In `verify/route.ts`, the order being verified must match the Razorpay order ID registered in the database:
```typescript
if (order.razorpayOrderId && order.razorpayOrderId !== razorpay_order_id) {
  logger.error("Payment verification failed: razorpay_order_id mismatch", {
    orderId: order.id,
  });
  await prisma.order.update({
    where: { id: order.id },
    data: { status: "FAILED" }
  });
  return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
}
```

### D. Idempotency & Webhook Protection
- Duplicate `payment.captured` or `order.paid` webhook events check `order.status !== "PAID"`. If the order is already marked `PAID`, the webhook does not re-modify the order and returns HTTP 200 `{ status: "ok" }`, preventing duplicate entitlement records.
- `payment.failed` webhooks verify `order.status !== "PAID"`, preventing late or out-of-order failure events from downgrading an already-paid order.
- In `verify/route.ts`, if `order.status === "PAID"`, the endpoint returns HTTP 400 `{ error: "Order already paid" }`.

---

## 5. Environment Variables Required

| Variable Name | Environment | Description |
|---|---|---|
| `RAZORPAY_KEY_ID` | Server | Razorpay Key ID used for SDK initialization and order creation. |
| `RAZORPAY_KEY_SECRET` | Server | Razorpay Key Secret used for verifying checkout payment signatures and order creation. |
| `RAZORPAY_WEBHOOK_SECRET` | Server | Secret key configured in Razorpay Dashboard for signing incoming webhook payloads. |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Client / Browser | Public key ID exposed to the browser to launch the Razorpay Checkout modal. |

*(Note: In accordance with security protocols, no actual secret values are recorded in this report or repository logs).*

---

## 6. Tests Executed and Actual Results

All tests were executed against the live test database using Node.js built-in test runner (`node:test`).

### Security Suite: `tests/payment-security.test.mjs`

| # | Test Case Description | Result | Status |
|---|---|---|---|
| 1 | **Missing payment verification secret**: Fails closed, returns HTTP 500, order remains PENDING, no purchase granted | 2930.4ms | **PASS** |
| 2 | **Missing webhook secret**: Fails closed, returns HTTP 500, order remains PENDING, unverified webhook rejected | 1540.3ms | **PASS** |
| 3 | **Valid payment signature**: Verifies server-side, transitions to PAID, records paidAt & paymentId, grants purchase | 3561.0ms | **PASS** |
| 4 | **Invalid payment signature**: Rejected with HTTP 400, order transitions to FAILED, no product access granted | 2652.4ms | **PASS** |
| 5 | **Valid webhook signature**: Verifies with `RAZORPAY_WEBHOOK_SECRET`, transitions to PAID, grants purchase | 4458.5ms | **PASS** |
| 6 | **Invalid webhook signature**: Rejected with HTTP 400, order remains PENDING, no product access granted | 2049.4ms | **PASS** |
| 7 | **Duplicate webhook event**: Idempotent delivery returns HTTP 200 ok, does not duplicate orders or entitlements | 4403.3ms | **PASS** |
| 8 | **Repeated payment verification**: Second verification call on already PAID order rejected with HTTP 400 | 6539.0ms | **PASS** |
| 9 | **Failed payment**: Webhook `payment.failed` transitions order to FAILED without granting access; does not overwrite PAID | 3225.3ms | **PASS** |
| 10 | **Order status cannot be changed to PAID without verification**: Parameter tampering, header bypass, and key secret misuse rejected | 7729.7ms | **PASS** |
| 11 | **Product access is not granted after failed verification**: Queries `prisma.purchase` to confirm null entitlement after failure | 2293.3ms | **PASS** |

### Regression Suites: `tests/e2e-workflow.test.mjs` & `tests/financial-calculations.test.mjs`

| Suite Name | Tests Run | Pass | Fail | Status |
|---|---|---|---|---|
| End-to-End Operational Lifecycle & Reconciliation Test | 6 | 6 | 0 | **PASS** |
| Command Center Financial & Operational Suite | 20 | 20 | 0 | **PASS** |
| SV-SEC-001 Payment Verification & Webhook Hardening Suite | 11 | 11 | 0 | **PASS** |
| **Total Test Execution** | **37** | **37** | **0** | **PASS** |

---

## 7. Build, Type-Check, and Lint Results

| Check | Command | Output / Summary | Status |
|---|---|---|---|
| TypeScript Compilation | `npx tsc --noEmit` | Clean exit (code 0), 0 errors | **PASS** |
| ESLint Check | `npm run lint` | Clean exit (code 0), 0 errors, 2 pre-existing image warnings in admin | **PASS** |
| Next.js Production Build | `npx next build` | Successfully compiled all 75 routes and generated static pages | **PASS** |

---

## 8. Remaining Limitations

1. **Single-Item Entitlement Logic**: `verify/route.ts` and `webhook/route.ts` currently extract `order.items[0]?.productId` based on the single-product "Buy Now" flow. If multi-product cart checkout is introduced in the future, entitlement creation must iterate over all items in `order.items`.
2. **Replay Window Verification**: While HMAC signatures prevent payload tampering, Razorpay includes timestamps in the payload. Adding a replay threshold cache (e.g., rejecting events older than 5 minutes) would further harden against delayed replay attacks if network boundaries are compromised.
3. **Database Concurrency Under High Load**: In high-concurrency environments, receiving a webhook and a user redirect verification simultaneously could theoretically attempt concurrent updates. The database unique constraint on `[userId, productId]` prevents duplicate purchases, but distributed locking or database row locking (`SELECT FOR UPDATE`) could be considered under high traffic.

---

## 9. Manual Configuration Required

Prior to production deployment, the following manual steps are required:
1. **Set `RAZORPAY_WEBHOOK_SECRET`**:
   Generate a secret in the Razorpay Dashboard under **Settings -> Webhooks** and add it to the production environment variables (e.g. Vercel / Railway / Docker `.env`).
2. **Configure Webhook Endpoint**:
   In the Razorpay Dashboard, add the webhook endpoint:
   `https://studyvisions.in/api/checkout/webhook` (or production domain)
   and subscribe to:
   - `payment.captured`
   - `order.paid`
   - `payment.failed`
3. **Verify Production Keys**:
   Ensure `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, and `NEXT_PUBLIC_RAZORPAY_KEY_ID` are updated with production keys (`rzp_live_...`) instead of test mode keys (`rzp_test_...`).

---

## 10. Verification Scope Summary

- **Task SV-SEC-001 Verification**: **FULLY VERIFIED**
  All insecure fallback secrets have been completely removed from payment verification, webhook ingestion, and order creation. Server-side verification, timing-safe checks, order-id binding, fail-closed handling, and audit logging are fully implemented and verified with 11 automated security tests and 26 regression tests passing with zero failures.
- **Production Payment System Readiness**: **PARTIALLY VERIFIED**
  The reported code vulnerabilities have been remediated. However, live payment processing in production requires the operational configuration steps described in Section 9 (setting live Razorpay keys and webhook secrets in the production environment).

