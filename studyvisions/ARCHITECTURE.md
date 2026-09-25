# StudyVisions Architecture & Operations Guide

## 1. Infrastructure Overview
**Frontend & API Hosting**: Vercel
**Database**: Supabase PostgreSQL
**File Storage**: Cloudinary
**Email Service**: Resend
**Payment Gateway**: Razorpay
**Analytics**: Google Analytics & Internal DB

## 2. Environments
- **Development**: Feature development aur local testing (`develop` branch).
- **Staging**: Pre-production validation. Vercel automatically creates preview deployments.
- **Production**: Live application (`main` branch). Strictly isolated from other environments.

## 3. CI/CD Pipeline
We use **GitHub Actions** for Continuous Integration (CI) and **Vercel** for Continuous Deployment (CD).

### CI Workflow
Triggered on push/PR to `main` and `develop`.
- **Quality Gates**: `npm ci`, `npx prisma generate`, `tsc --noEmit`, `npm run lint`.
- **Build Validation**: `npm run build`. Pipeline failure blocks deployment.

### CD Workflow (Vercel)
- Vercel automatically deploys the `main` branch to Production if the CI pipeline succeeds.
- Preview deployments are automatically created for PRs.

## 4. Configuration & Secrets Management
- Application configurations are managed via `.env`. See `.env.example`.
- Secrets are NEVER stored in source control.
- Production secrets are managed within the Vercel and Supabase dashboards.

## 5. Maintenance & Monitoring
- **Health Checks**: Available at `/api/health`.
- **Logs**: Critical system events are logged in the `SystemLog` table.
- **Data Retention**: Old logs and analytics are automatically purged via `/api/cron/data-retention`.

## 6. Disaster Recovery & Rollback
- **Database Backups**: Supabase automatically manages PITR (Point-in-Time Recovery) and daily backups.
- **Rollback Strategy**: If a critical issue is detected post-deployment, rollback is performed via the Vercel Dashboard to the last stable deployment.
