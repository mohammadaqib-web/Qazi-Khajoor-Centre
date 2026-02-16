const express = require("express");
const router = express.Router();

const {
  createOrder,
  getMyOrders,
  updateOrderStatus,
  getAllOrders,
} = require("../controllers/order.controller");

const auth = require("../middleware/auth.middleware");
const admin = require("../middleware/admin.middleware");

router.post("/", auth, createOrder);
router.get("/my", auth, getMyOrders);
router.put("/:id/status", auth, admin, updateOrderStatus);
router.get("/", auth, admin, getAllOrders);

module.exports = router;
