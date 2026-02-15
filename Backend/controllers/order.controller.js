const Order = require("../models/order.model");

exports.createOrder = async (req, res) => {
  try {
    const order = await Order.create({
      user: req.user.id,
      orderItems: req.body.orderItems,
      totalAmount: req.body.totalAmount,
      payment: req.body.payment,
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user.id })
    .populate("orderItems.product", "name price");

  res.json(orders);
};

exports.updateOrderStatus = async (req, res) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  );

  res.json(order);
};
