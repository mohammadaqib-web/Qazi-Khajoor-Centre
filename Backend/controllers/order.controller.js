const Order = require("../models/order.model");
const Razorpay = require("razorpay");
const Product = require("../models/product.model");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

exports.createRazorpayOrder = async (req, res) => {
  try {
    const options = {
      amount: req.body.amount * 100, // convert to paisa
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createOrder = async (req, res) => {
  try {
    const { orderItems, totalAmount, payment, shippingAddress } = req.body;

    if (shippingAddress.country !== "India") {
      return res.status(400).json({
        message: "We only deliver inside India",
      });
    }

    const isBallia = shippingAddress.city.toLowerCase() === "ballia";

    if (payment.paymentMethod === "cod" && !isBallia) {
      return res.status(400).json({
        message: "Cash on Delivery is available only in Ballia",
      });
    }

    for (const item of orderItems) {
      const product = await Product.findById(item.product);

      if (!product) {
        return res.status(404).json({
          message: `Product not found`,
        });
      }

      const sizeIndex = product.sizes.findIndex((s) => s.size === item.size);

      if (sizeIndex === -1) {
        return res.status(400).json({
          message: `Size not available`,
        });
      }

      if (product.sizes[sizeIndex].stock < item.quantity) {
        return res.status(400).json({
          message: `Not enough stock for ${product.name}`,
        });
      }

      product.sizes[sizeIndex].stock -= item.quantity;

      product.stock -= item.quantity;

      await product.save();
    }

    const order = await Order.create({
      user: req.user.id,
      orderItems,
      totalAmount,
      shippingAddress,
      payment,
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user.id }).populate(
    "orderItems.product",
    "name images",
  );

  res.json(orders);
};

// Admin
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name number")
      .populate("orderItems.product", "name");

    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true },
  );

  res.json(order);
};
