const express = require("express");
const router = express.Router();

const {
  addReview,
  getProductReviews,
} = require("../controllers/review.controller");

const auth = require("../middleware/auth.middleware");

router.post("/:productId", auth, addReview);
router.get("/:productId", getProductReviews);

module.exports = router;
