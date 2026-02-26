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

      const res = await axios.get(`${import.meta.env.VITE_APP_API}/orders`, {
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
        `${import.meta.env.VITE_APP_API}/orders/${orderId}/status`,
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

  const handlePaymentStatusChange = async (orderId, newStatus) => {
    try {
      setLoading(true);

      await axios.put(
        `${import.meta.env.VITE_APP_API}/orders/${orderId}/payment-status`,
        { paymentStatus: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      toast.success("Payment status updated");
      fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Box
        sx={{
          backgroundColor: "#f4f6f9",
          minHeight: "100vh",
          p: 4,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            p: 3,
            border: "1px solid #e0e0e0",
          }}
        >
          <Typography variant="h5" fontWeight={600} mb={3}>
            Orders Management
          </Typography>

          <Box sx={{ overflowX: "auto" }}>
            <Table size="small">
              <TableHead>
                <TableRow
                  sx={{
                    backgroundColor: "#fafafa",
                  }}
                >
                  {[
                    "Order ID",
                    "Customer",
                    "Address",
                    "Products",
                    "Total",
                    "Payment",
                    "Delivery",
                  ].map((head) => (
                    <TableCell
                      key={head}
                      sx={{
                        fontWeight: 600,
                        fontSize: 13,
                        color: "#555",
                        textAlign: "center",
                      }}
                    >
                      {head}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {orders.map((order) => (
                  <TableRow
                    key={order._id}
                    hover
                    sx={{
                      "& td": { py: 2 },
                      textAlign: "center",
                    }}
                  >
                    {/* ORDER ID */}
                    <TableCell sx={{ fontWeight: 600, textAlign: "center" }}>
                      #{order._id.slice(-6)}
                    </TableCell>

                    {/* CUSTOMER */}
                    <TableCell>
                      <Typography fontWeight={600}>
                        {order.user?.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {order.user?.number}
                      </Typography>
                    </TableCell>

                    {/* ADDRESS */}
                    <TableCell>
                      <Box
                        sx={{
                          p: 1.5,
                          borderRadius: 2,
                          backgroundColor: "#f9fafb",
                          border: "1px solid #eee",
                          minWidth: 100,
                        }}
                      >
                        <Typography variant="body2">
                          {order.shippingAddress?.addressLine1}
                        </Typography>
                        <Typography variant="body2">
                          {order.shippingAddress?.city},{" "}
                          {order.shippingAddress?.state}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {order.shippingAddress?.pincode},{" "}
                          {order.shippingAddress?.country}
                        </Typography>
                      </Box>
                    </TableCell>

                    {/* PRODUCTS */}
                    <TableCell>
                      {order.orderItems.map((item) => (
                        <Box
                          key={item._id}
                          sx={{
                            mb: 1,
                            p: 1.5,
                            borderRadius: 2,
                            backgroundColor: "#fff",
                            border: "1px solid #eee",
                          }}
                        >
                          <Typography fontWeight={600}>
                            {item.product?.name}
                          </Typography>
                          <Typography variant="body2">
                            {item.size} • Qty {item.quantity}
                          </Typography>
                          <Typography variant="body2" fontWeight={600}>
                            ₹ {item.price}
                          </Typography>
                        </Box>
                      ))}
                    </TableCell>

                    {/* TOTAL */}
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        minWidth: 100,
                        textAlign: "center",
                      }}
                    >
                      ₹ {order.totalAmount}
                    </TableCell>

                    {/* PAYMENT */}
                    <TableCell>
                      <Box display="flex" flexDirection="column" gap={1}>
                        <Chip
                          label={order.payment?.paymentStatus}
                          color={getPaymentColor(order.payment?.paymentStatus)}
                          size="small"
                          sx={{ fontWeight: 600 }}
                        />

                        {order.payment?.paymentMethod === "cod" ? (
                          <>
                            <Typography
                              variant="caption"
                              sx={{
                                // color: "green",
                                fontWeight: 600,
                                textAlign: "center",
                                mt: -0.5,
                              }}
                            >
                              COD
                            </Typography>
                            <Select
                              size="small"
                              value={order.payment?.paymentStatus}
                              disabled={loading}
                              onChange={(e) =>
                                handlePaymentStatusChange(
                                  order._id,
                                  e.target.value,
                                )
                              }
                              sx={{ mt: -1 }}
                            >
                              <MenuItem value="pending">Pending</MenuItem>
                              <MenuItem value="paid">Paid</MenuItem>
                              <MenuItem value="failed">Failed</MenuItem>
                            </Select>
                          </>
                        ) : (
                          <Typography
                            variant="caption"
                            sx={{
                              // color: "green",
                              fontWeight: 600,
                              textAlign: "center",
                            }}
                          >
                            RAZORPAY
                          </Typography>
                        )}
                      </Box>
                    </TableCell>

                    {/* DELIVERY */}
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Chip
                          label={order.status}
                          color={getDeliveryColor(order.status)}
                          size="small"
                          sx={{ fontWeight: 600 }}
                        />

                        <Select
                          size="small"
                          value={order.status}
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
          </Box>
        </Paper>
      </Box>

      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 999,
        }}
        open={loading}
      >
        <CircularProgress size={50} />
      </Backdrop>
    </>
  );
};

export default Orders;
