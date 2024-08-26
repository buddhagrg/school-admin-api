const express = require("express");
const router = express.Router();
const { authenticateToken, handle404Error, csrfProtection } = require("../middlewares");
const { studentsRoutes } = require("../modules/students/sudents-router.js");
const { authRoutes } = require("../modules/auth/auth-router.js");
const menuController = require("../modules/menus/menus-controller.js");
const { rpRoutes } = require("../modules/roles-and-permissions/rp-router.js");
const dashboardController = require("../modules/dashboard/dashboard-controller.js");
const { leaveRoutes } = require("../modules/leave/leave-router.js");
const { classesRoutes } = require("../modules/classes/classes-router.js");
const { classTeacherRoutes } = require("../modules/class-teacher/class-teacher-router.js");
const { noticesRoutes } = require("../modules/notices/notices-router.js");
const { handleGetAllTeachers } = require("../modules/class-teacher/class-teacher-controller.js");
const { staffsRoutes } = require("../modules/staffs/staffs-router.js");
const { accountRoutes } = require("../modules/account/account-router.js");

router.use("/auth", authRoutes);
router.use("/account", authenticateToken, csrfProtection, accountRoutes);
router.get("/menus", authenticateToken, csrfProtection, menuController.handleGetMenus);
router.get("/dashboard", authenticateToken, csrfProtection, dashboardController.handleGetDashboardData);
router.get("/teachers", authenticateToken, csrfProtection, handleGetAllTeachers);
router.use("/classes", authenticateToken, csrfProtection, classesRoutes);
router.use("/class-teachers", authenticateToken, csrfProtection, classTeacherRoutes);
router.use("/leave", authenticateToken, csrfProtection, leaveRoutes);
router.use("/notices", authenticateToken, csrfProtection, noticesRoutes);
router.use("/roles", authenticateToken, csrfProtection, rpRoutes);
router.use("/staffs", authenticateToken, csrfProtection, staffsRoutes);
router.use("/students", authenticateToken, csrfProtection, studentsRoutes);

router.use(handle404Error);

module.exports = { v1Routes: router };
