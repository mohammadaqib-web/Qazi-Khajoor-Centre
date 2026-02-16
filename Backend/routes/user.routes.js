const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/user.controller");

const auth = require("../middleware/auth.middleware");
const admin = require("../middleware/admin.middleware");

// Admin Routes
router.get("/", auth, admin, getAllUsers);
router.get("/:id", auth, admin, getUserById);
router.put("/:id", auth, admin, updateUser);
router.delete("/:id", auth, admin, deleteUser);

module.exports = router;
