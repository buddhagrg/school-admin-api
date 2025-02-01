const express = require("express");
const router = express.Router();

const {
  authenticateToken,
  csrfProtection,
  checkApiAccess,
  isUserAdminOrSuperAdmin,
} = require("../middlewares");
const { studentRoutes } = require("../modules/students/sudent-router.js");
const { authRoutes } = require("../modules/auth/auth-router.js");
const { leaveRoutes } = require("../modules/leave/leave-router.js");
const { classRoutes } = require("../modules/classes/class-router.js");
const {
  classTeacherRoutes,
} = require("../modules/class-teacher/class-teacher-router.js");
const { noticeRoutes } = require("../modules/notices/notice-router.js");
const {
  handleGetAllTeachers,
} = require("../modules/class-teacher/class-teacher-controller.js");
const { staffRoutes } = require("../modules/staffs/staff-router.js");
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
const {
  academicPeriodRoutes,
} = require("../modules/academic-periods/ap-router.js");

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
router.use("/leaves", authenticateToken, csrfProtection, leaveRoutes);
router.use("/classes", authenticateToken, csrfProtection, classRoutes);
router.use(
  "/class-teachers",
  authenticateToken,
  csrfProtection,
  classTeacherRoutes
);
router.use("/sections", authenticateToken, csrfProtection, sectionRoutes);
router.use("/students", authenticateToken, csrfProtection, studentRoutes);
router.use("/notices", authenticateToken, csrfProtection, noticeRoutes);
router.use("/staffs", authenticateToken, csrfProtection, staffRoutes);
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
  "/academic-levels",
  authenticateToken,
  csrfProtection,
  isUserAdminOrSuperAdmin([1, 2]),
  academicLevelRoutes
);
router.use(
  "/academic-years",
  authenticateToken,
  csrfProtection,
  isUserAdminOrSuperAdmin([1, 2]),
  academicYearRoutes
);
router.use(
  "/fiscal-years",
  authenticateToken,
  csrfProtection,
  isUserAdminOrSuperAdmin([1, 2]),
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
  isUserAdminOrSuperAdmin([1, 2]),
  academicPeriodRoutes
);

module.exports = { v1Routes: router };
