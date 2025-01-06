const express = require("express");
const router = express.Router();

const {
  authenticateToken,
  csrfProtection,
  checkApiAccess,
  isUserAdminOrSuperAdmin,
} = require("../middlewares");
const { studentsRoutes } = require("../modules/students/sudents-router.js");
const { authRoutes } = require("../modules/auth/auth-router.js");
const { leaveRoutes } = require("../modules/leave/leave-router.js");
const { classesRoutes } = require("../modules/classes/classes-router.js");
const {
  classTeacherRoutes,
} = require("../modules/class-teacher/class-teacher-router.js");
const { noticesRoutes } = require("../modules/notices/notices-router.js");
const {
  handleGetAllTeachers,
} = require("../modules/class-teacher/class-teacher-controller.js");
const { staffsRoutes } = require("../modules/staffs/staffs-router.js");
const { accountRoutes } = require("../modules/account/account-router.js");
const { sectionRoutes } = require("../modules/sections/section-router.js");
const {
  departmentRoutes,
} = require("../modules/departments/department-router.js");
const {
  handleGetDashboardData,
} = require("../modules/dashboard/dashboard-controller.js");
const {
  accessControlRoutes,
} = require("../modules/access-control/access-control-router.js");
const {
  attendanceRoutes,
} = require("../modules/attendance/attendance-router.js");
const { subjectRoutes } = require("../modules/subjects/subject-router.js");
const { examRoutes } = require("../modules/exams/exam-router.js");
const { invoiceRoutes } = require("../modules/invoices/invoice-router.js");
const { depositRoutes } = require("../modules/deposit/deposit-router.js");
const { feeRoutes } = require("../modules/fees/fee-router.js");
const { schoolRoutes } = require("../modules/schools/school-router.js");
const {
  academicLevelRoutes,
} = require("../modules/academic-levels/level-router.js");
const {
  academicYearRoutes,
} = require("../modules/academic-years/academic-year-router.js");
const { fiscalYearRoutes } = require("../modules/fiscal-years/fy-router.js");
const { roleRoutes } = require("../modules/roles/role-router.js");
const { paymentRoutes } = require("../modules/payments/payment-router.js");
const { academicPeriods } = require("../modules/academic-periods/ap-router.js");

router.get(
  "/teachers",
  authenticateToken,
  csrfProtection,
  checkApiAccess,
  handleGetAllTeachers
);
router.get(
  "/dashboard",
  authenticateToken,
  csrfProtection,
  checkApiAccess,
  handleGetDashboardData
);
router.use(
  "/access-controls",
  authenticateToken,
  csrfProtection,
  accessControlRoutes
);
router.use("/auth", authRoutes);
router.use("/account", authenticateToken, csrfProtection, accountRoutes);
router.use("/leave", authenticateToken, csrfProtection, leaveRoutes);
router.use("/classes", authenticateToken, csrfProtection, classesRoutes);
router.use(
  "/class-teachers",
  authenticateToken,
  csrfProtection,
  classTeacherRoutes
);
router.use("/sections", authenticateToken, csrfProtection, sectionRoutes);
router.use("/students", authenticateToken, csrfProtection, studentsRoutes);
router.use("/notices", authenticateToken, csrfProtection, noticesRoutes);
router.use("/staffs", authenticateToken, csrfProtection, staffsRoutes);
router.use("/departments", authenticateToken, csrfProtection, departmentRoutes);
router.use("/roles", authenticateToken, csrfProtection, roleRoutes);
router.use(
  "/schools",
  authenticateToken,
  csrfProtection,
  isUserAdminOrSuperAdmin([1]),
  schoolRoutes
);
router.use(
  "/academic_levels",
  authenticateToken,
  csrfProtection,
  isUserAdminOrSuperAdmin([1]),
  academicLevelRoutes
);
router.use(
  "/academic_years",
  authenticateToken,
  csrfProtection,
  isUserAdminOrSuperAdmin([1]),
  academicYearRoutes
);
router.use(
  "/fiscal_years",
  authenticateToken,
  csrfProtection,
  isUserAdminOrSuperAdmin([1]),
  fiscalYearRoutes
);
router.use("/attendances", authenticateToken, csrfProtection, attendanceRoutes);
router.use("/subjects", authenticateToken, csrfProtection, subjectRoutes);
router.use("/exams", authenticateToken, csrfProtection, examRoutes);
router.use("/invoices", authenticateToken, csrfProtection, invoiceRoutes);
router.use("/deposits", authenticateToken, csrfProtection, depositRoutes);
router.use("/fees", authenticateToken, csrfProtection, feeRoutes);
router.use("/payments", authenticateToken, csrfProtection, paymentRoutes);
router.use(
  "/academic-periods",
  authenticateToken,
  csrfProtection,
  academicPeriods
);

module.exports = { v1Routes: router };
