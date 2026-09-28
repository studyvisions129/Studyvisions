# StudyVisions Admin Upgrade Plan

## Existing Functionality
Currently, the admin panel uses a single vertical list of navigation items including Dashboard, Free Content, Ads Manager, Products, Categories, Boards, Classes, Subjects, Landing Pages, Media Library, Orders, Students, Promotions, Support Tickets, Blog, SEO, Settings. It has a marketplace section and a security center.

## Required Changes
Restructure the admin sidebar into 6 distinct groups as per the Master Implementation Prompt:
1. **COMMAND CENTER**: Dashboard, Business Analytics, Growth Center, Alerts
2. **CREATE**: Product Planner, Products, Courses, Notes, Ebooks, Free Content, Blog, Media Library
3. **SELL**: Landing Pages, Offers & Bundles, Checkout, Orders, Payments, Coupons
4. **MARKETING**: Ads Manager, Ads Tracker, Campaigns, Attribution, Funnels, Leads, Abandoned Checkout, Marketing Automation
5. **CUSTOMERS**: Students, CRM, Segments, Reviews, Support
6. **CONTENT / SEO**: Blog, SEO, Free Resources
7. **MARKETPLACE**: Sellers Hub
8. **SYSTEM**: Integrations, Security Center, Audit Logs, Expenses, Backups, Settings

*Note*: Since we are asked to preserve the visual design (Dark sidebar, purple accent), we will upgrade the `AdminSidebar.tsx` to group these items properly. We will implement "PHASE 1" modules first.

## Database Changes
New entities will be needed for Phase 1:
- Product Planner (Idea validation, research, launch plan)
- Courses (Sections, Lessons, Modules)
- Notes (structured hierarchical content)
- Landing Pages (Blocks, Tracking)
- Settings

## API Changes
New backend routes and Supabase server actions for CRUD operations on the newly created database tables (Product Planner, Courses, Notes, etc.).

## UI Changes
- Update `AdminSidebar.tsx` to render nested or grouped sections.
- Add UI placeholders for unimplemented features.

## Dependencies
- Prisma for DB schema updates
- Lucide-react for new icons

## Migration Risks
- Updating Prisma schema might require handling existing records carefully.
- Changing Sidebar links shouldn't break existing active routes if they are preserved.
