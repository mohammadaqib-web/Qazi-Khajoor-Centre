import { useEffect, useState } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Select,
  MenuItem,
  Paper,
  Backdrop,
  CircularProgress,
  Box,
  Typography,
  Chip,
} from "@mui/material";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const Orders = () => {
  const { token } = useSelector((state) => state.auth);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const res = await axios.get("http://localhost:5000/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setOrders(res.data);
    } catch (error) {
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setLoading(true);

      await axios.put(
        `http://localhost:5000/api/orders/${orderId}/status`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      toast.success("Delivery status updated");
      fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  // 🎨 Delivery Status Color
  const getDeliveryColor = (status) => {
    switch (status) {
      case "delivered":
        return "success";
      case "shipped":
        return "info";
      case "processing":
        return "warning";
      default:
        return "default";
    }
  };

  // 💳 Payment Status Color
  const getPaymentColor = (status) => {
    switch (status) {
      case "paid":
        return "success";
      case "failed":
        return "error";
      default:
        return "warning";
    }
  };

  return (
    <>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" mb={2}>
          Orders
        </Typography>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Products</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Payment</TableCell>
              <TableCell>Delivery</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {orders.map((order) => (
              <TableRow key={order._id}>
                <TableCell>{order._id.slice(-6)}</TableCell>

                <TableCell>
                  <Typography fontWeight={600}>{order.user?.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {order.user?.number}
                  </Typography>
                </TableCell>

                {/* PRODUCTS */}
                <TableCell>
                  {order.orderItems.map((item) => (
                    <Box
                      key={item._id}
                      mb={1}
                      p={1}
                      sx={{
                        backgroundColor: "#f9f9f9",
                        borderRadius: "6px",
                      }}
                    >
                      <Typography fontWeight={600}>
                        {item.product?.name}
                      </Typography>

                      <Typography variant="body2">Size: {item.size}</Typography>

                      <Typography variant="body2">
                        Qty: {item.quantity}
                      </Typography>

                      <Typography variant="body2">
                        Price: ₹ {item.price}
                      </Typography>
                    </Box>
                  ))}
                </TableCell>

                <TableCell>₹ {order.totalAmount}</TableCell>

                {/* 💳 PAYMENT STATUS */}
                <TableCell>
                  <Chip
                    label={order.payment?.paymentStatus || "pending"}
                    color={getPaymentColor(order.payment?.paymentStatus)}
                    size="small"
                  />
                </TableCell>

                {/* 🚚 DELIVERY STATUS */}
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Chip
                      label={order.status}
                      color={getDeliveryColor(order.status)}
                      size="small"
                    />

                    <Select
                      value={order.status}
                      size="small"
                      disabled={loading}
                      onChange={(e) =>
                        handleStatusChange(order._id, e.target.value)
                      }
                    >
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="processing">Processing</MenuItem>
                      <MenuItem value="shipped">Shipped</MenuItem>
                      <MenuItem value="delivered">Delivered</MenuItem>
                    </Select>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* FULL SCREEN LOADER */}
      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 999,
        }}
        open={loading}
      >
        <CircularProgress size={60} thickness={5} />
      </Backdrop>
    </>
  );
};

export default Orders;
