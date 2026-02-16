const express = require("express");
const router = express.Router();

const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
} = require("../controllers/product.controller");

const auth = require("../middleware/auth.middleware");
const admin = require("../middleware/admin.middleware");
const upload = require("../middleware/upload.middleware");

router.post("/", auth, admin, upload.single("image"), createProduct);
router.put("/:id", auth, admin, upload.single("image"), updateProduct);
router.delete("/:id", auth, admin, deleteProduct);

router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.get("/category/:categoryId", getProductsByCategory);

module.exports = router;
