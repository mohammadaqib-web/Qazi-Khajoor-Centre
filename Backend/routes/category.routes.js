const express = require("express");
const router = express.Router();

const {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} = require("../controllers/category.controller");

const auth = require("../middleware/auth.middleware");
const admin = require("../middleware/admin.middleware");

// Admin
router.post("/", auth, admin, createCategory);
router.put("/:id", auth, admin, updateCategory);
router.delete("/:id", auth, admin, deleteCategory);

// Public
router.get("/", getCategories);

module.exports = router;
