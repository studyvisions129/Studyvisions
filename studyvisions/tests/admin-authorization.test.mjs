import { test, describe, before, after } from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { PrismaClient } from "@prisma/client";
import { createJiti } from "jiti";

const prisma = new PrismaClient();
const jiti = createJiti(import.meta.url, {
  alias: {
    "@": path.resolve("./src"),
  },
});

// Import auth-utils and test session setter
const {
  requireAdmin,
  requireSuperAdmin,
  __setTestSessionUser,
  logAdminAudit,
} = await jiti.import(path.resolve("./src/lib/auth-utils.ts"));

// Import Admin Server Actions
const { createPromotion, togglePromotion } = await jiti.import(path.resolve("./src/app/admin/promotions/actions.ts"));
const { createFreeContent, deleteFreeContent } = await jiti.import(path.resolve("./src/app/admin/free-content/actions.ts"));
const { updateSellerStatus } = await jiti.import(path.resolve("./src/app/admin/sellers/actions.ts"));
const { createAdPlacement, toggleAdPlacement } = await jiti.import(path.resolve("./src/app/admin/ads/actions.ts"));
const { updateLandingPage } = await jiti.import(path.resolve("./src/app/admin/products/[id]/landing-page/actions.ts"));
const { updateUserRole, sendNotification } = await jiti.import(path.resolve("./src/app/admin/students/actions.ts"));
const { updateTicketStatus, updateTicketPriority } = await jiti.import(path.resolve("./src/app/admin/support/actions.ts"));
const { saveBusinessTargets } = await jiti.import(path.resolve("./src/app/admin/targets/actions.ts"));
const { saveSettings } = await jiti.import(path.resolve("./src/app/admin/settings/actions.ts"));

// Import API routes
const { GET: exportApi } = await jiti.import(path.resolve("./src/app/api/admin/export/route.ts"));
const { GET: seedApi } = await jiti.import(path.resolve("./src/app/api/seed/route.ts"));
const { GET: cronApi } = await jiti.import(path.resolve("./src/app/api/cron/data-retention/route.ts"));

describe("SV-SEC-002 Admin Server Actions Authorization & Security Suite", () => {
  let studentUser;
  let adminUser;
  let superAdminUser;

  // Track created entities for clean teardown
  const createdUserIds = [];
  const createdPromotionIds = [];
  const createdFreeContentIds = [];
  const createdSellerIds = [];
  const createdAdPlacementIds = [];
  const createdTicketIds = [];

  before(async () => {
    const timestamp = Date.now();

    // 1. Create test Student user
    studentUser = await prisma.user.create({
      data: {
        email: `sec_student_${timestamp}@studyvisions.internal`,
        fullName: "Test Student Auditor",
        role: "STUDENT",
      },
    });
    createdUserIds.push(studentUser.id);

    // 2. Create test Admin user
    adminUser = await prisma.user.create({
      data: {
        email: `sec_admin_${timestamp}@studyvisions.internal`,
        fullName: "Test Admin Auditor",
        role: "ADMIN",
      },
    });
    createdUserIds.push(adminUser.id);

    // 3. Create test Super Admin user
    superAdminUser = await prisma.user.create({
      data: {
        email: `sec_superadmin_${timestamp}@studyvisions.internal`,
        fullName: "Test SuperAdmin Auditor",
        role: "SUPER_ADMIN",
      },
    });
    createdUserIds.push(superAdminUser.id);
  });

  after(async () => {
    // Reset session override
    __setTestSessionUser(null);

    // Cleanup promotions
    if (createdPromotionIds.length > 0) {
      await prisma.promotion.deleteMany({ where: { id: { in: createdPromotionIds } } });
    }

    // Cleanup free content
    if (createdFreeContentIds.length > 0) {
      await prisma.freeContent.deleteMany({ where: { id: { in: createdFreeContentIds } } });
    }

    // Cleanup sellers
    if (createdSellerIds.length > 0) {
      await prisma.sellerProfile.deleteMany({ where: { id: { in: createdSellerIds } } });
    }

    // Cleanup ad placements
    if (createdAdPlacementIds.length > 0) {
      await prisma.adPlacement.deleteMany({ where: { id: { in: createdAdPlacementIds } } });
    }

    // Cleanup support tickets
    if (createdTicketIds.length > 0) {
      await prisma.supportTicket.deleteMany({ where: { id: { in: createdTicketIds } } });
    }

    // Cleanup audit logs created during test
    if (createdUserIds.length > 0) {
      await prisma.adminAuditLog.deleteMany({ where: { adminId: { in: createdUserIds } } });
      await prisma.notification.deleteMany({ where: { userId: { in: createdUserIds } } });
      await prisma.user.deleteMany({ where: { id: { in: createdUserIds } } });
    }
  });

  // Helper to construct FormData
  function makeFormData(obj) {
    const fd = new FormData();
    for (const [k, v] of Object.entries(obj)) {
      if (v !== undefined && v !== null) {
        fd.append(k, String(v));
      }
    }
    return fd;
  }

  // 1. Unauthenticated user attempts admin action
  test("1. Unauthenticated user attempts admin action: rejects with Unauthorized", async () => {
    __setTestSessionUser(null);

    await assert.rejects(
      async () => await requireAdmin(),
      { message: "Unauthorized" },
      "requireAdmin must throw Unauthorized when session is missing"
    );

    const fd = makeFormData({ code: "UNAUTH10", discountAmount: "10" });
    await assert.rejects(
      async () => await createPromotion(fd),
      { message: "Unauthorized" },
      "createPromotion must reject unauthenticated requests"
    );

    await assert.rejects(
      async () => await deleteFreeContent("fake-id"),
      { message: "Unauthorized" },
      "deleteFreeContent must reject unauthenticated requests"
    );

    await assert.rejects(
      async () => await updateSellerStatus("fake-seller", "ACTIVE"),
      { message: "Unauthorized" },
      "updateSellerStatus must reject unauthenticated requests"
    );

    await assert.rejects(
      async () => await createAdPlacement(makeFormData({ name: "Banner", identifier: "banner_1" })),
      { message: "Unauthorized" },
      "createAdPlacement must reject unauthenticated requests"
    );
  });

  // 2. Normal STUDENT attempts admin action
  test("2. Normal STUDENT attempts admin action: rejects with Forbidden", async () => {
    __setTestSessionUser({ email: studentUser.email });

    await assert.rejects(
      async () => await requireAdmin(),
      { message: "Forbidden: Admin access required" },
      "requireAdmin must throw Forbidden for STUDENT role"
    );

    const fd = makeFormData({ code: "STUDENT10", discountAmount: "10" });
    await assert.rejects(
      async () => await createPromotion(fd),
      { message: "Forbidden: Admin access required" },
      "createPromotion must reject STUDENT role"
    );

    await assert.rejects(
      async () => await deleteFreeContent("fake-id"),
      { message: "Forbidden: Admin access required" },
      "deleteFreeContent must reject STUDENT role"
    );

    await assert.rejects(
      async () => await updateSellerStatus("fake-seller", "ACTIVE"),
      { message: "Forbidden: Admin access required" },
      "updateSellerStatus must reject STUDENT role"
    );

    await assert.rejects(
      async () => await createAdPlacement(makeFormData({ name: "Banner", identifier: "banner_1" })),
      { message: "Forbidden: Admin access required" },
      "createAdPlacement must reject STUDENT role"
    );
  });

  // 3. Invalid session attempts admin action
  test("3. Invalid session attempts admin action: rejects with Forbidden", async () => {
    __setTestSessionUser({ email: "phantom_ghost_nonexistent@studyvisions.internal" });

    await assert.rejects(
      async () => await requireAdmin(),
      { message: "Forbidden: Admin access required" },
      "Non-existent database user must be rejected with Forbidden"
    );
  });

  // 4. ADMIN executes permitted action
  test("4. ADMIN executes permitted action: succeeds and creates audit log", async () => {
    __setTestSessionUser({ email: adminUser.email });

    // Verify requireAdmin resolves admin
    const authedAdmin = await requireAdmin();
    assert.equal(authedAdmin.id, adminUser.id);
    assert.equal(authedAdmin.role, "ADMIN");

    // Execute createPromotion
    const promoCode = `ADM_${Date.now()}`;
    const fd = makeFormData({ code: promoCode, discountAmount: "25", type: "LAUNCH_OFFER" });
    await createPromotion(fd);

    const dbPromo = await prisma.promotion.findUnique({ where: { code: promoCode } });
    assert.ok(dbPromo, "Promotion must be created by ADMIN");
    createdPromotionIds.push(dbPromo.id);

    // Verify AdminAuditLog entry
    const auditLog = await prisma.adminAuditLog.findFirst({
      where: { adminId: adminUser.id, action: "CREATE_PROMOTION", entityId: dbPromo.id },
    });
    assert.ok(auditLog, "AdminAuditLog must record promotion creation");
    assert.equal(auditLog.adminId, adminUser.id);
    assert.equal(auditLog.entityType, "Promotion");
  });

  // 5. SUPER_ADMIN executes permitted action
  test("5. SUPER_ADMIN executes permitted action (updateUserRole): succeeds and logs audit", async () => {
    __setTestSessionUser({ email: superAdminUser.email });

    const authedSuper = await requireSuperAdmin();
    assert.equal(authedSuper.id, superAdminUser.id);
    assert.equal(authedSuper.role, "SUPER_ADMIN");

    // Update student to ADMIN
    const result = await updateUserRole(studentUser.id, "ADMIN");
    assert.equal(result.success, true);

    const updatedUser = await prisma.user.findUnique({ where: { id: studentUser.id } });
    assert.equal(updatedUser.role, "ADMIN");

    // Verify AdminAuditLog entry
    const auditLog = await prisma.adminAuditLog.findFirst({
      where: { adminId: superAdminUser.id, action: "UPDATE_USER_ROLE", entityId: studentUser.id },
    });
    assert.ok(auditLog, "AdminAuditLog must record user role update");

    // Revert student's role back to STUDENT
    await updateUserRole(studentUser.id, "STUDENT");
    const revertedUser = await prisma.user.findUnique({ where: { id: studentUser.id } });
    assert.equal(revertedUser.role, "STUDENT");
  });

  // 6. Client attempts to manipulate role information
  test("6. Client attempts to manipulate role information: DB truth wins, access denied", async () => {
    // Student claims to be SUPER_ADMIN in client request
    __setTestSessionUser({ email: studentUser.email });

    // Ensure student DB record is strictly STUDENT
    const dbCheck = await prisma.user.findUnique({ where: { id: studentUser.id } });
    assert.equal(dbCheck.role, "STUDENT");

    // Attempt SuperAdmin action (e.g. updateUserRole)
    const res = await updateUserRole(studentUser.id, "SUPER_ADMIN");
    assert.equal(res.error, "Only Super Admins can change roles.");

    // Attempt admin action
    await assert.rejects(
      async () => await requireAdmin(),
      { message: "Forbidden: Admin access required" }
    );
  });

  // 7. Unauthorized user attempts promotion creation
  test("7. Unauthorized user attempts promotion creation: rejected, DB untouched", async () => {
    __setTestSessionUser({ email: studentUser.email });

    const promoCode = `ATTACK_PROMO_${Date.now()}`;
    const fd = makeFormData({ code: promoCode, discountAmount: "90" });

    await assert.rejects(
      async () => await createPromotion(fd),
      { message: "Forbidden: Admin access required" }
    );

    const check = await prisma.promotion.findUnique({ where: { code: promoCode } });
    assert.equal(check, null, "Attacker promotion must NOT be created in database");
  });

  // 8. Unauthorized user attempts free-content deletion
  test("8. Unauthorized user attempts free-content deletion: rejected, content preserved", async () => {
    // Setup a free content item as admin
    __setTestSessionUser({ email: adminUser.email });
    const content = await prisma.freeContent.create({
      data: {
        title: "Protected CBSE Guide",
        slug: `protected-cbse-guide-${Date.now()}`,
        contentType: "NOTES",
        contentHtml: "<p>Protected study content</p>",
      },
    });
    createdFreeContentIds.push(content.id);

    // Switch to Student
    __setTestSessionUser({ email: studentUser.email });

    await assert.rejects(
      async () => await deleteFreeContent(content.id),
      { message: "Forbidden: Admin access required" }
    );

    // Verify content still exists
    const preserved = await prisma.freeContent.findUnique({ where: { id: content.id } });
    assert.ok(preserved, "Content must NOT be deleted by unauthorized user");
  });

  // 9. Unauthorized user attempts seller status modification
  test("9. Unauthorized user attempts seller status modification: rejected, status preserved", async () => {
    // Setup a seller profile
    const seller = await prisma.sellerProfile.create({
      data: {
        userId: studentUser.id,
        businessName: "Unverified Seller",
        status: "PENDING",
      },
    });
    createdSellerIds.push(seller.id);

    // Switch to Student
    __setTestSessionUser({ email: studentUser.email });

    await assert.rejects(
      async () => await updateSellerStatus(seller.id, "ACTIVE"),
      { message: "Forbidden: Admin access required" }
    );

    const preservedSeller = await prisma.sellerProfile.findUnique({ where: { id: seller.id } });
    assert.equal(preservedSeller.status, "PENDING", "Seller status must remain PENDING");
  });

  // 10. Unauthorized user attempts ad placement creation
  test("10. Unauthorized user attempts ad placement creation: rejected, placement not created", async () => {
    __setTestSessionUser({ email: studentUser.email });

    const identifier = `ad_attack_${Date.now()}`;
    const fd = makeFormData({ name: "Malicious Ad", identifier });

    await assert.rejects(
      async () => await createAdPlacement(fd),
      { message: "Forbidden: Admin access required" }
    );

    const check = await prisma.adPlacement.findUnique({ where: { identifier } });
    assert.equal(check, null, "Unauthorized ad placement must NOT be created");
  });

  // 11. Existing authorized functionality continues working
  test("11. Existing authorized functionality continues working for ADMIN", async () => {
    __setTestSessionUser({ email: adminUser.email });

    // 11a. Ad placement creation & toggle
    const adIdentifier = `auth_ad_${Date.now()}`;
    await createAdPlacement(makeFormData({ name: "Hero Leaderboard", identifier: adIdentifier }));
    const ad = await prisma.adPlacement.findUnique({ where: { identifier: adIdentifier } });
    assert.ok(ad);
    createdAdPlacementIds.push(ad.id);

    await toggleAdPlacement(ad.id, false);
    const updatedAd = await prisma.adPlacement.findUnique({ where: { id: ad.id } });
    assert.equal(updatedAd.isActive, false);

    // 11b. Support ticket updates
    const ticket = await prisma.supportTicket.create({
      data: {
        fullName: "Inquiring Student",
        email: "student@test.com",
        subject: "Chapter issue",
        category: "TECHNICAL_ISSUES",
        description: "Page 4 error",
        status: "NEW",
        priority: "LOW",
      },
    });
    createdTicketIds.push(ticket.id);

    const resStatus = await updateTicketStatus(ticket.id, "RESOLVED");
    assert.equal(resStatus.success, true);

    const resPriority = await updateTicketPriority(ticket.id, "HIGH");
    assert.equal(resPriority.success, true);

    const updatedTicket = await prisma.supportTicket.findUnique({ where: { id: ticket.id } });
    assert.equal(updatedTicket.status, "RESOLVED");
    assert.equal(updatedTicket.priority, "HIGH");

    // 11c. Business targets
    await saveBusinessTargets(makeFormData({ period: "2026-11", revenueTarget: "100000", ordersTarget: "200", profitTarget: "60000" }));

    // 11d. Settings
    await saveSettings(makeFormData({ setting_site_test_toggle: "active" }));
    const setting = await prisma.siteSetting.findUnique({ where: { key: "site_test_toggle" } });
    assert.equal(setting?.value, "active");
  });

  // 12. Sensitive API mutation routes reject unauthorized requests
  test("12. Sensitive API mutation routes reject unauthorized requests (401/403)", async () => {
    // 12a. /api/admin/export
    __setTestSessionUser(null);
    const resExportUnauth = await exportApi(new Request("http://localhost/api/admin/export"));
    assert.equal(resExportUnauth.status, 401, "Export API must return 401 when unauthenticated");

    __setTestSessionUser({ email: studentUser.email });
    const resExportForbidden = await exportApi(new Request("http://localhost/api/admin/export"));
    assert.equal(resExportForbidden.status, 403, "Export API must return 403 for non-admin");

    __setTestSessionUser({ email: adminUser.email });
    const resExportAdmin = await exportApi(new Request("http://localhost/api/admin/export"));
    assert.equal(resExportAdmin.status, 200, "Export API must return 200 for ADMIN");

    // 12b. /api/seed
    __setTestSessionUser(null);
    const resSeedUnauth = await seedApi();
    assert.equal(resSeedUnauth.status, 401, "Seed API must return 401 when unauthenticated");

    __setTestSessionUser({ email: studentUser.email });
    const resSeedForbidden = await seedApi();
    assert.equal(resSeedForbidden.status, 403, "Seed API must return 403 for non-admin");

    // 12c. /api/cron/data-retention (CRON secret enforcement)
    const originalCronSecret = process.env.CRON_SECRET;
    process.env.CRON_SECRET = "test_cron_secret_key_12345";

    const reqNoAuth = new Request("http://localhost/api/cron/data-retention");
    const resNoAuth = await cronApi(reqNoAuth);
    assert.equal(resNoAuth.status, 401, "Cron API must return 401 without auth header");

    const reqWrongAuth = new Request("http://localhost/api/cron/data-retention", {
      headers: { authorization: "Bearer wrong_token" },
    });
    const resWrongAuth = await cronApi(reqWrongAuth);
    assert.equal(resWrongAuth.status, 401, "Cron API must return 401 with invalid secret");

    const reqValidAuth = new Request("http://localhost/api/cron/data-retention", {
      headers: { authorization: "Bearer test_cron_secret_key_12345" },
    });
    const resValidAuth = await cronApi(reqValidAuth);
    assert.equal(resValidAuth.status, 200, "Cron API must return 200 with valid secret");

    if (originalCronSecret !== undefined) {
      process.env.CRON_SECRET = originalCronSecret;
    } else {
      delete process.env.CRON_SECRET;
    }
  });
});

