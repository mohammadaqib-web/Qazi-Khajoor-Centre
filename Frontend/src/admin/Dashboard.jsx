import { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const Dashboard = () => {
  const { token } = useSelector((state) => state.auth);

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const res = await axios.get("http://localhost:5000/api/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setStats(res.data);
    } catch (error) {
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const formattedStats = stats
    ? [
        { title: "Total Products", value: stats.totalProducts },
        { title: "Total Orders", value: stats.totalOrders },
        { title: "Total Users", value: stats.totalUsers },
        {
          title: "Total Revenue",
          value: `₹ ${stats.totalRevenue.toLocaleString()}`,
        },
      ]
    : [];

  return (
    <>
      <Grid container spacing={3}>
        {formattedStats.map((item, index) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={3}
            key={index}
            display="flex"
            justifyContent="center"
          >
            <Paper
              sx={{
                p: 3,
                borderRadius: 3,
                boxShadow: 3,
                minWidth: { xs: "100%", sm: 250 },
                width: "100%",
                textAlign: "center",
              }}
            >
              <Typography color="text.secondary">{item.title}</Typography>

              <Typography variant="h5" fontWeight={700} mt={1}>
                {item.value}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

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

export default Dashboard;
