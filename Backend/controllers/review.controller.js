const Review = require("../models/review.model");
const Product = require("../models/product.model");

exports.addReview = async (req, res) => {
  try {
    const existingReview = await Review.findOne({
      user: req.user.id,
      product: req.params.productId,
    });

    if (existingReview) {
      return res.status(400).json({ message: "You already reviewed this product" });
    }

    const review = await Review.create({
      user: req.user.id,
      product: req.params.productId,
      rating: req.body.rating,
      comment: req.body.comment,
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProductReviews = async (req, res) => {
  const reviews = await Review.find({
    product: req.params.productId,
  }).populate("user", "name");

  res.json(reviews);
};
