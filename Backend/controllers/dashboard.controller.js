const Product = require("../models/product.model");
const Order = require("../models/order.model");
const User = require("../models/user.model");

exports.getDashboardStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments();

    // Calculate revenue (only paid orders)
    const revenueData = await Order.aggregate([
      {
        $match: { "payment.paymentStatus": "paid" }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" }
        }
      }
    ]);

    const totalRevenue =
      revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

    res.json({
      totalProducts,
      totalOrders,
      totalUsers,
      totalRevenue,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
