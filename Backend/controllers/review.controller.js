const Review = require("../models/review.model");
const Product = require("../models/product.model");

exports.addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    // Check if user already reviewed
    const existingReview = await Review.findOne({
      user: req.user.id,
      product: req.params.productId,
    });

    if (existingReview) {
      return res
        .status(400)
        .json({ message: "You already reviewed this product" });
    }

    // Create review
    const review = await Review.create({
      user: req.user.id,
      product: req.params.productId,
      rating,
      comment,
    });

    // 🔥 Recalculate average rating
    const stats = await Review.aggregate([
      {
        $match: {
          product: review.product,
        },
      },
      {
        $group: {
          _id: "$product",
          avgRating: { $avg: "$rating" },
        },
      },
    ]);

    // Update product averageRating
    await Product.findByIdAndUpdate(req.params.productId, {
      averageRating: stats[0]?.avgRating || 0,
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
