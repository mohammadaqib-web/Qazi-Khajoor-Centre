const express = require("express");
const router = express.Router();

const { getDashboardStats } = require("../controllers/dashboard.controller");
const auth = require("../middleware/auth.middleware");
const admin = require("../middleware/admin.middleware");

router.get("/", auth, admin, getDashboardStats);

module.exports = router;
