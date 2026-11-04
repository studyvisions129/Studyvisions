# STUDYVISIONS — ADMIN PANEL FEATURE-BY-FEATURE STATUS MATRIX
**Document ID:** SV-DOC-AUDIT-002  
**Audit Date:** October 21, 2026  
**Auditor:** Antigravity Engineering Architecture & Security Audit System  
**Repository:** `studyvisions129/studyvisions`  

---

## 1. Status Legend
- **COMPLETE_AND_VERIFIED**: UI exists, backend action/API operational, persistent database model verified, real business logic active.
- **IMPLEMENTED_BUT_UNVERIFIED**: Code exists across frontend, backend, and DB, but live external connectivity or credentials are unverified in this environment.
- **PARTIALLY_IMPLEMENTED**: Core UI and partial backend exist, but critical workflows, edge cases, or sub-actions are incomplete.
- **UI_ONLY**: Visual interface rendered, but buttons/actions are inert or unlinked to backend handlers.
- **MOCK_DATA**: Interface renders hardcoded, simulated, or demo metrics/cards not sourced from database records.
- **BROKEN**: Route or component throws an error, links to a 404/placeholder, or contains logic preventing intended execution.
- **MISSING**: Feature requested in architecture but no file, route, or model exists in the codebase.
- **BLOCKED**: Implementation blocked by external environment or missing API secrets.
- **NOT_APPLICABLE**: Planned future expansion not targeted for current operational milestone.

---

## 2. Command Center & Executive Control

| Module | Feature | Route / File Path | UI Status | Frontend | Backend | Database | Integration | Testing | Actual Behaviour | Remaining Work | Status | Priority |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Command Center | Dashboard Overview | `/admin` (`page.tsx`) | Exists | Implemented | Implemented | Connected | Not Applicable | Tested | Aggregates real orders, refunds, fees, and expenses. Renders KPI cards, waterfall, alerts. | Refine comparison period picker presets | `COMPLETE_AND_VERIFIED` | P1 |
| Command Center | Global Date Range Filter | `/admin` (`GlobalDateFilter.tsx`) | Exists | Implemented | Implemented | Connected | Not Applicable | Tested | Synchronizes URL params (`range`, `from`, `to`, `compare`). Auto-submits on change. | Add custom calendar popup | `COMPLETE_AND_VERIFIED` | P1 |
| Command Center | Action Center Alerts | `/admin` (`page.tsx`, `action-center.ts`) | Exists | Implemented | Implemented | Connected | Not Applicable | Tested | Evaluates refund spikes, failing orders, pending sellers, and open support tickets dynamically. | Add one-click resolve actions | `COMPLETE_AND_VERIFIED` | P1 |
| Command Center | Revenue Trend Chart | `/admin` (`RevenueTrendChart.tsx`) | Exists | Implemented | Implemented | Connected | Not Applicable | Tested | Dynamic SVG interactive area chart showing daily revenue & orders with hover tooltips. | Add export as PNG | `COMPLETE_AND_VERIFIED` | P2 |
| Command Center | CSV Data Export | `/api/admin/export` (`route.ts`) | Exists | Implemented | Implemented | Connected | Not Applicable | Tested | Generates real CSV streams for Revenue, Orders, Products, and Customers. | Add Excel format | `COMPLETE_AND_VERIFIED` | P1 |
| Command Center | Global Search | TopBar (`AdminTopBar.tsx`) | Exists | Partial | Missing | Not Connected | Not Applicable | Not Tested | Shows static mockup dropdown ("BSEB Notes", "Rahul Kumar"). No live database search. | Implement `/api/admin/search` endpoint and debounce input | `UI_ONLY` | P1 |
| Command Center | Quick Add Dropdown | TopBar (`AdminTopBar.tsx`) | Exists | Broken | Missing | Not Connected | Not Applicable | Not Tested | Contains links to unbuilt routes (`/admin/courses/new`, `/admin/notes/new`, `/admin/coupons/new`). | Build missing routes or repoint links to valid pages | `BROKEN` | P0 |
| Command Center | Notifications Bell | TopBar (`AdminTopBar.tsx`) | Exists | Partial | Missing | Missing | Not Applicable | Not Tested | Visual button with red dot badge; clicking does nothing. No notifications panel or table. | Create `AdminNotification` model and popover drawer | `UI_ONLY` | P2 |
| Command Center | Admin Profile & Sign-Out | TopBar (`AdminTopBar.tsx`) | Exists | Missing | Missing | Missing | Not Applicable | Not Tested | Avatar renders static "AD" gradient square. No dropdown menu or sign-out button. | Connect to `/app/auth/actions.ts` `logout` server action | `UI_ONLY` | P1 |

---

## 3. Product Creation & Management

| Module | Feature | Route / File Path | UI Status | Frontend | Backend | Database | Integration | Testing | Actual Behaviour | Remaining Work | Status | Priority |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Products | Product List | `/admin/products` (`page.tsx`) | Exists | Implemented | Implemented | Connected | Not Applicable | Tested | Lists products from Prisma `Product` table with status badges and pricing. | Add search and category filters | `COMPLETE_AND_VERIFIED` | P1 |
| Products | Create Product | `/admin/products/new` (`actions.ts`) | Exists | Implemented | Implemented | Connected | Not Applicable | Tested | Form submits via `createProduct` server action with `requireAdmin()`. | Add rich description editor & asset uploader | `COMPLETE_AND_VERIFIED` | P1 |
| Products | Course Builder | `/admin/courses` (`page.tsx`) | Exists | Partial | Missing | Missing | Not Applicable | Not Tested | 31-line placeholder component (`CourseBuilderPlaceholder`). "Create Course" is an inert button. | Build Course/Module/Lesson schema and tree editor | `UI_ONLY` | P1 |
| Products | Notes Builder | `/admin/notes` (`page.tsx`) | Exists | Partial | Missing | Missing | Not Applicable | Not Tested | 30-line placeholder component (`NotesBuilderPlaceholder`). "Create Notes" is an inert button. | Build Notes bundle manager and PDF uploader | `UI_ONLY` | P1 |
| Products | Ebooks Manager | `/admin/ebooks` | Missing | Missing | Missing | Missing | Not Applicable | Not Tested | Route does not exist; falls into catch-all placeholder. | Build eBooks manager route and PDF attachment handler | `MISSING` | P2 |
| Products | Categories Manager | `/admin/categories` (`page.tsx`) | Exists | Partial | Missing | Missing | Not Applicable | Not Tested | 9-line stub ("This module is under construction"). | Implement Category CRUD connected to `Category` model | `UI_ONLY` | P1 |
| Products | Product Planner | `/admin/product-planner` (`page.tsx`) | Exists | Partial | Missing | Missing | Not Applicable | Not Tested | 10-stage Kanban board with hardcoded mock cards. No database storage. | Connect cards to database table `ProductPlan` | `MOCK_DATA` | P2 |
| Products | Free Content | `/admin/free-content` (`actions.ts`) | Exists | Implemented | Implemented | Connected | Not Applicable | Tested | Creates and updates free syllabus, PYQ, and guide articles. | Fix missing `requireAdmin()` security vulnerability | `PARTIALLY_IMPLEMENTED` | P0 |
| Products | Education Taxonomy | `/admin/boards`, `/classes`, `/subjects` | Exists | Implemented | Implemented | Connected | Not Applicable | Tested | Manages `AcademicLevel` records by type. Pagination works. | Add bulk re-ordering | `COMPLETE_AND_VERIFIED` | P1 |

---

## 4. Website Content & SEO

| Module | Feature | Route / File Path | UI Status | Frontend | Backend | Database | Integration | Testing | Actual Behaviour | Remaining Work | Status | Priority |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Content | Blog Articles | `/admin/blog` (`actions.ts`) | Exists | Implemented | Implemented | Connected | Not Applicable | Tested | Lists and creates articles in `Post` table. Edit & Delete buttons on table lack onClick forms. | Wire delete form button to `deletePost` action | `PARTIALLY_IMPLEMENTED` | P1 |
| Content | SEO Settings | `/admin/seo` (`page.tsx`) | Exists | Implemented | Implemented | Connected | Not Applicable | Tested | Edits global title prefix, meta description, keywords, and OG image URL in `SiteSetting`. | Add sitemap generator trigger | `COMPLETE_AND_VERIFIED` | P1 |
| Content | Media Library | `/admin/media` (`page.tsx`) | Exists | Partial | Missing | Missing | Blocked | Not Tested | 9-line stub ("This module is under construction"). | Implement Cloudinary/S3 uploader & asset browser | `UI_ONLY` | P2 |
| Content | Landing Page Builder | `/admin/landing-pages` (`actions.ts`) | Exists | Implemented | Implemented | Connected | Not Applicable | Tested | Creates landing page records with goal, audience, and JSON content blocks. | Complete frontend page renderer for all widget types | `PARTIALLY_IMPLEMENTED` | P1 |

---

## 5. Commerce, Payments & Fulfillment

| Module | Feature | Route / File Path | UI Status | Frontend | Backend | Database | Integration | Testing | Actual Behaviour | Remaining Work | Status | Priority |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Commerce | Orders Management | `/admin/orders` (`page.tsx`) | Exists | Implemented | Implemented | Connected | Not Applicable | Tested | Lists orders with status filtering pills, customer emails, amounts, and dates. | Add manual status override and refund trigger | `COMPLETE_AND_VERIFIED` | P1 |
| Commerce | Payment Verification | `/api/checkout/verify` (`route.ts`) | Not Applicable | Implemented | Implemented | Connected | Connected | Partial | Verifies Razorpay HMAC signature and updates order to `PAID`. | Fix "xxx" fallback secret & multi-item purchase upsert | `PARTIALLY_IMPLEMENTED` | P0 |
| Commerce | Webhook Capture | `/api/checkout/webhook` (`route.ts`) | Not Applicable | Implemented | Implemented | Connected | Connected | Partial | Handles `payment.captured` and `order.paid` async webhook events. | Fix "xxx" fallback secret & multi-item purchase upsert | `PARTIALLY_IMPLEMENTED` | P0 |
| Commerce | Student Downloads | `/dashboard/downloads` (`page.tsx`) | Exists | Broken | Missing | Missing | Not Applicable | Not Tested | Displays static "No Downloads Yet" empty state (`const downloads = []`). | Fetch real user purchases and provide signed PDF URLs | `BROKEN` | P0 |
| Commerce | Coupons & Discounts | `/admin/promotions` (`actions.ts`) | Exists | Implemented | Implemented | Connected | Not Applicable | Tested | Creates discount coupons in `Promotion` table with max uses and expiry. | Add `requireAdmin()` check | `PARTIALLY_IMPLEMENTED` | P0 |
| Commerce | Refunds Processing | `/admin/expenses`, `schema.prisma` | Partial | Implemented | Implemented | Connected | Not Applicable | Tested | `Refund` model exists in DB and is aggregated in dashboard net profit waterfall. | Build dedicated `/admin/refunds` modal and Razorpay API trigger | `PARTIALLY_IMPLEMENTED` | P1 |

---

## 6. Business Management & Financial Analytics

| Module | Feature | Route / File Path | UI Status | Frontend | Backend | Database | Integration | Testing | Actual Behaviour | Remaining Work | Status | Priority |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Business | Command Center KPIs | `/admin` (`financial-calculations.ts`) | Exists | Implemented | Implemented | Connected | Not Applicable | Tested | Calculates Gross Sales, Net Sales, Gateway Fees, Expenses, Net Profit, Profit Margin. | None for Phase 1 | `COMPLETE_AND_VERIFIED` | P1 |
| Business | Business Analytics Tabs | `/admin/analytics` (`page.tsx`) | Exists | Implemented | Mocked | Not Connected | Not Applicable | Not Tested | Shows "Demo / Testing Data" banner and hardcoded static figures (`₹1,50,000`, `142 orders`). | Refactor to query `financial-calculations.ts` | `MOCK_DATA` | P1 |
| Business | Business Targets | `/admin/targets` (`actions.ts`) | Exists | Implemented | Implemented | Connected | Not Applicable | Tested | CRUD for Monthly Revenue, Net Profit, and Order Volume targets with live progress bars. | Add target completion alert notifications | `COMPLETE_AND_VERIFIED` | P1 |
| Business | Expense Tracking | `/admin/expenses` (`actions.ts`) | Exists | Implemented | Implemented | Connected | Not Applicable | Tested | Categorized expense entries (Ads, Software, Hosting, Content, Other). Feeds into net profit. | Add recurring expense auto-generation | `COMPLETE_AND_VERIFIED` | P1 |

---

## 7. Marketing & Advertising

| Module | Feature | Route / File Path | UI Status | Frontend | Backend | Database | Integration | Testing | Actual Behaviour | Remaining Work | Status | Priority |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Marketing | Ads Placements | `/admin/ads` (`actions.ts`) | Exists | Implemented | Implemented | Connected | Not Applicable | Tested | Configures on-site ad banner slots on free content pages. | Add `requireAdmin()` check to server actions | `PARTIALLY_IMPLEMENTED` | P1 |
| Marketing | Meta Pixel Tracking | `/admin/settings` (`actions.ts`) | Exists | Implemented | Implemented | Connected | Not Applicable | Tested | Stores Meta Pixel ID in `SiteSetting`. | Verify frontend tag injection in public layout | `IMPLEMENTED_BUT_UNVERIFIED` | P1 |
| Marketing | Google Ads Tracking | `/admin/settings` (`actions.ts`) | Exists | Implemented | Implemented | Connected | Not Applicable | Tested | Stores Google Ads Tag ID in `SiteSetting`. | Verify frontend tag injection in public layout | `IMPLEMENTED_BUT_UNVERIFIED` | P1 |
| Marketing | External Ad Spend Sync | None | Missing | Missing | Missing | Missing | Blocked | Not Tested | No integration code for Meta Marketing API or Google Ads API exists. Ad spend is logged via Expenses. | Build optional API sync connector | `MISSING` | P2 |

---

## 8. Customers & Support

| Module | Feature | Route / File Path | UI Status | Frontend | Backend | Database | Integration | Testing | Actual Behaviour | Remaining Work | Status | Priority |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Customers | Student Directory | `/admin/students` (`page.tsx`) | Exists | Implemented | Implemented | Connected | Not Applicable | Tested | Lists registered students with purchase counts and join dates. | Add search by email/name and purchase export | `PARTIALLY_IMPLEMENTED` | P1 |
| Customers | Student Profile View | `/admin/students/[id]` (`page.tsx`) | Exists | Implemented | Implemented | Connected | Not Applicable | Tested | Shows student enrollments, order history, and account activity. | Add manual password reset or access grant | `COMPLETE_AND_VERIFIED` | P1 |
| Customers | Support Desk | `/admin/support` (`actions.ts`) | Exists | Implemented | Implemented | Connected | Not Applicable | Tested | Lists support tickets with status filter (`NEW`, `IN_PROGRESS`, `RESOLVED`, `CLOSED`). | Standardize auth check using `requireAdmin` | `COMPLETE_AND_VERIFIED` | P1 |

---

## 9. Administration & Security

| Module | Feature | Route / File Path | UI Status | Frontend | Backend | Database | Integration | Testing | Actual Behaviour | Remaining Work | Status | Priority |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Security | Admin Layout Guard | `src/app/admin/layout.tsx` | Exists | Implemented | Implemented | Connected | Connected | Tested | Verifies Supabase session and user role (`ADMIN` or `SUPER_ADMIN`). Redirects unauthorized visitors. | None | `COMPLETE_AND_VERIFIED` | P0 |
| Security | Audit Trail Viewer | `/admin/security` (`page.tsx`) | Exists | Implemented | Implemented | Connected | Not Applicable | Tested | Displays system action logs from `AdminAuditLog` table. | Add IP address and user-agent filters | `COMPLETE_AND_VERIFIED` | P1 |
| Security | System Settings | `/admin/settings` (`actions.ts`) | Exists | Implemented | Implemented | Connected | Not Applicable | Tested | Updates website brand name, Razorpay credentials, and tracking keys. | Mask secret keys in UI display | `COMPLETE_AND_VERIFIED` | P0 |

---

## 10. Future Marketplace

| Module | Feature | Route / File Path | UI Status | Frontend | Backend | Database | Integration | Testing | Actual Behaviour | Remaining Work | Status | Priority |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Marketplace | Seller Applications | `/admin/sellers` (`actions.ts`) | Exists | Implemented | Implemented | Connected | Not Applicable | Tested | Displays seller applications with approve/reject action. | Add `requireAdmin()` check | `PARTIALLY_IMPLEMENTED` | P2 |
| Marketplace | Seller Payouts | None | Missing | Missing | Missing | Missing | Not Applicable | Not Tested | No payout calculation, ledger, or bank transfer integration exists. | Defer to Phase 3 Marketplace development | `NOT_APPLICABLE` | P3 |
| Marketplace | Commission Rules | None | Missing | Missing | Missing | Missing | Not Applicable | Not Tested | No tiered commission logic exists in checkout. | Defer to Phase 3 Marketplace development | `NOT_APPLICABLE` | P3 |
