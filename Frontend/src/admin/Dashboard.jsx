import { Box, Grid, Paper, Typography } from "@mui/material";

const Dashboard = () => {
  const stats = [
    { title: "Total Products", value: 120 },
    { title: "Total Orders", value: 340 },
    { title: "Total Users", value: 560 },
    { title: "Revenue", value: "₹ 2,45,000" },
  ];

  return (
    <Grid container spacing={3}>
      {stats.map((item, index) => (
        <Grid item xs={12} md={3} key={index}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography color="text.secondary">
              {item.title}
            </Typography>
            <Typography variant="h5" fontWeight={700}>
              {item.value}
            </Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default Dashboard;
