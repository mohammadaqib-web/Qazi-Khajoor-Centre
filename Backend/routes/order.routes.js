const express = require("express");
const router = express.Router();

const {
  createOrder,
  getMyOrders,
  updateOrderStatus,
} = require("../controllers/order.controller");

const auth = require("../middleware/auth.middleware");
const admin = require("../middleware/admin.middleware");

router.post("/", auth, createOrder);
router.get("/my", auth, getMyOrders);
router.put("/:id/status", auth, admin, updateOrderStatus);

module.exports = router;
