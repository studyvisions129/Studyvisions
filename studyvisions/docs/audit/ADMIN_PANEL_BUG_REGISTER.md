# STUDYVISIONS — ADMIN PANEL BUG & ISSUE REGISTER
**Document ID:** SV-DOC-AUDIT-003  
**Audit Date:** October 21, 2026  
**Auditor:** Antigravity Engineering Architecture & Security Audit System  
**Repository:** `studyvisions129/studyvisions`  

---

## 1. Bug Summary Table

| Issue ID | Severity | Module | Description | Status |
|---|---|---|---|---|
| `BUG-SEC-001` | **P0 - Critical** | Payments / Security | Razorpay Verification & Webhook fallback to `"xxx"` secret | **OPEN** |
| `BUG-SEC-002` | **P1 - High** | Security / RBAC | Missing `requireAdmin()` in 4 Admin Server Actions | **OPEN** |
| `BUG-COM-001` | **P1 - High** | Commerce / Delivery | Multi-item checkout grants entitlement only to `items[0]` | **OPEN** |
| `BUG-COM-002` | **P0 - Critical** | Student Dashboard | Downloads page has unwritten fulfillment (`downloads = []`) | **OPEN** |
| `BUG-NAV-001` | **P1 - High** | Admin TopBar | Dead links in Quick Add dropdown (`/admin/courses/new`, etc.) | **OPEN** |
| `BUG-NAV-002` | **P2 - Medium** | Admin TopBar | Global Search dropdown displays hardcoded static mockups | **OPEN** |
| `BUG-NAV-003` | **P1 - High** | Admin Sidebar | 15+ navigation targets point to uncreated placeholder routes | **OPEN** |
| `BUG-ANL-001` | **P1 - High** | Business Analytics | `/admin/analytics` renders hardcoded mock data and demo warning | **OPEN** |
| `BUG-CNT-001` | **P2 - Medium** | Blog Management | Blog table edit & delete buttons lack active form bindings | **OPEN** |
| `BUG-BLD-001` | **P2 - Medium** | Course/Notes Builder | `/admin/courses` and `/admin/notes` are non-functional placeholders | **OPEN** |
| `BUG-TST-001` | **P2 - Medium** | Testing / Database | Direct Supabase port 5432 causes connection timeout in tests | **OPEN** |

---

## 2. Detailed Bug Profiles

### BUG-SEC-001: Razorpay Verification & Webhook Insecure Fallback Secret
- **Issue ID:** `BUG-SEC-001`
- **Module:** Payments / Security
- **Severity:** **P0 - Critical**
- **Description:** Both the payment verification endpoint and webhook endpoint use `"xxx"` as a fallback when secret environment variables are undefined:
  ```ts
  const secret = process.env.RAZORPAY_KEY_SECRET || "xxx";
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET || "xxx";
  ```
- **Reproduction Steps:**
  1. Remove or leave `RAZORPAY_KEY_SECRET` unset in environment.
  2. Send a POST request to `/api/checkout/verify` with payload signed using HMAC secret `"xxx"`.
  3. Signature check passes; order is updated to `PAID` without any payment occurring.
- **Evidence:**
  - `src/app/api/checkout/verify/route.ts` (Line 28)
  - `src/app/api/checkout/webhook/route.ts` (Line 15)
- **Root Cause:** Placeholder developer strings were committed without strict production validation.
- **Recommended Fix:** Enforce strict checking:
  ```ts
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) {
    logger.error("RAZORPAY_KEY_SECRET is not configured");
    return NextResponse.json({ error: "Payment verification misconfigured" }, { status: 500 });
  }
  ```
- **Dependencies:** None.
- **Verification Method:** Send verification request with missing env var and confirm 500 error is thrown.
- **Status:** **OPEN**

---

### BUG-SEC-002: Missing `requireAdmin()` in Admin Server Actions
- **Issue ID:** `BUG-SEC-002`
- **Module:** Security / Authorization
- **Severity:** **P1 - High**
- **Description:** Several server actions within the `/admin` module perform database mutations without authenticating the user role. In Next.js App Router, server actions can be invoked directly via HTTP POST requests by unauthenticated clients.
- **Reproduction Steps:**
  1. Use curl or Postman to send a Next.js server action POST call to `createPromotion` or `deleteFreeContent`.
  2. Do not supply session cookies.
  3. The database record is successfully created or deleted.
- **Evidence:**
  - `src/app/admin/ads/actions.ts` (`toggleAdPlacement`, `createAdPlacement`)
  - `src/app/admin/sellers/actions.ts` (`updateSellerStatus`)
  - `src/app/admin/free-content/actions.ts` (`createFreeContent`, `updateFreeContent`, `deleteFreeContent`)
  - `src/app/admin/promotions/actions.ts` (`createPromotion`, `togglePromotion`)
- **Root Cause:** Developer omitted `await requireAdmin();` during initial scaffolding of these actions.
- **Recommended Fix:** Import and call `await requireAdmin();` at the first line of each exported server action.
- **Dependencies:** `src/lib/auth-utils.ts`
- **Verification Method:** Automated test asserting that calling these actions without admin session throws `Forbidden: Admin access required`.
- **Status:** **OPEN**

---

### BUG-COM-001: Multi-Item Order Entitlement Bug
- **Issue ID:** `BUG-COM-001`
- **Module:** Commerce / Purchase Fulfillment
- **Severity:** **P1 - High**
- **Description:** When an order contains multiple products (e.g. course bundle, cart checkout), only the first product in `order.items[0]` is granted access in `prisma.purchase.upsert`. All subsequent products purchased in the same order are omitted.
- **Reproduction Steps:**
  1. Create an order with 2 items (`productId: "prod_1"`, `productId: "prod_2"`).
  2. Verify payment or trigger webhook.
  3. Query `prisma.purchase.findMany({ where: { userId } })`.
  4. Only `prod_1` exists; `prod_2` is not unlocked for the student.
- **Evidence:**
  - `src/app/api/checkout/verify/route.ts` (Lines 57-75)
  - `src/app/api/checkout/webhook/route.ts` (Lines 49-66)
- **Root Cause:** Hardcoded assumption `const productId = order.items[0]?.productId;` from early "single-item Buy Now" prototyping.
- **Recommended Fix:** Iterate over all items in `order.items`:
  ```ts
  for (const item of order.items) {
    if (item.productId) {
      await prisma.purchase.upsert({
        where: { userId_productId: { userId: order.userId, productId: item.productId } },
        create: { userId: order.userId, productId: item.productId },
        update: { isActive: true },
      });
    }
  }
  ```
- **Dependencies:** None.
- **Verification Method:** Create a multi-item order in test suite and verify all products exist in `Purchase` table.
- **Status:** **OPEN**

---

### BUG-COM-002: Student Downloads Fulfillment Unimplemented
- **Issue ID:** `BUG-COM-002`
- **Module:** Student Dashboard / Digital Fulfillment
- **Severity:** **P0 - Critical**
- **Description:** When a student purchases notes or an eBook and navigates to `/dashboard/downloads`, the page renders a static empty state because the downloads array is hardcoded to empty (`const downloads: any[] = [];`). No download links or file access are rendered.
- **Reproduction Steps:**
  1. Complete a purchase for a digital product with an attached PDF.
  2. Log in as the student and go to `/dashboard/downloads`.
  3. UI displays "Aapne abhi tak koi bhi file download nahi ki hai" despite the active purchase.
- **Evidence:** `src/app/dashboard/downloads/page.tsx` (Lines 10-12)
- **Root Cause:** Feature was left as a frontend mockup during customer dashboard construction.
- **Recommended Fix:** Fetch student's active purchases from `prisma.purchase` including `product`, verify product assets, and provide secure signed download links.
- **Dependencies:** `prisma.purchase`, `prisma.product`
- **Verification Method:** Sign in as student with purchase and verify file card and download button render.
- **Status:** **OPEN**

---

### BUG-NAV-001: Quick Add Links Lead to Non-Existent Routes
- **Issue ID:** `BUG-NAV-001`
- **Module:** Admin TopBar
- **Severity:** **P1 - High**
- **Description:** The Quick Add dropdown in `AdminTopBar.tsx` contains 4 dead links:
  - `+ Course` -> `/admin/courses/new` (Does not exist -> lands on `[...placeholder]`)
  - `+ Ebook` -> `/admin/ebooks/new` (Does not exist -> lands on `[...placeholder]`)
  - `+ Note` -> `/admin/notes/new` (Does not exist -> lands on `[...placeholder]`)
  - `+ Coupon` -> `/admin/coupons/new` (Does not exist; real route is `/admin/promotions`)
- **Reproduction Steps:**
  1. Click "Quick Add" in admin top navigation.
  2. Click "+ Course" or "+ Coupon".
  3. Page redirects to under-construction placeholder page.
- **Evidence:** `src/app/admin/_components/AdminTopBar.tsx` (Lines 50-56)
- **Root Cause:** TopBar links were created before the target pages were implemented.
- **Recommended Fix:** Update valid routes (e.g. repoint `+ Coupon` to `/admin/promotions`) and build forms for courses and notes.
- **Status:** **OPEN**

---

### BUG-ANL-001: Business Analytics Displays Hardcoded Mock Data
- **Issue ID:** `BUG-ANL-001`
- **Module:** Business Analytics
- **Severity:** **P1 - High**
- **Description:** Navigating to `/admin/analytics` displays a red banner: "This is Demo / Testing Data. Not real business data." All KPI cards (`₹1,50,000`, `142 orders`, `4,289 customers`) are hardcoded strings.
- **Reproduction Steps:**
  1. Go to `/admin/analytics`.
  2. Review figures in Overview and Revenue tabs.
  3. Create an order or expense in `/admin/expenses`.
  4. Figures in `/admin/analytics` do not change.
- **Evidence:** `src/app/admin/analytics/page.tsx` (Lines 20-24, 71-115) and `src/app/admin/analytics/_components/RevenueTab.tsx`
- **Root Cause:** Command Center (`/admin`) was updated to use `financial-calculations.ts`, but `/admin/analytics` was not yet migrated.
- **Recommended Fix:** Refactor `src/app/admin/analytics/page.tsx` and `RevenueTab.tsx` to accept calculated metrics from `calculateFinancials()`.
- **Status:** **OPEN**

---

### BUG-TST-001: Database Direct Port 5432 Connection Timeout
- **Issue ID:** `BUG-TST-001`
- **Module:** Database / Testing
- **Severity:** **P2 - Medium**
- **Description:** `DIRECT_URL` in `.env` connects to Supabase direct port 5432 (`db.hlxhsaomjoaxmfllvdzp.supabase.co:5432`), which experiences network timeouts in certain environments, causing `e2e-workflow.test.mjs` to fail during initial connection.
- **Reproduction Steps:**
  1. Run `node --test tests/e2e-workflow.test.mjs`.
  2. Test halts with `PrismaClientInitializationError: Can't reach database server at db.hlxhsaomjoaxmfllvdzp.supabase.co:5432`.
- **Evidence:** Node test execution log from `task-491`.
- **Root Cause:** Supabase direct port 5432 is IPv6-only or filtered by some ISPs; Supabase transaction pooler port 6543 (`aws-0-ap-south-1.pooler.supabase.com:6543`) is reliable across all networks.
- **Recommended Fix:** Configure Prisma client to use the pooler connection URL or pooler direct connection for tests.
- **Status:** **OPEN**
