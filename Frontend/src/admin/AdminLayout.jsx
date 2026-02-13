import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Toolbar,
  AppBar,
  Typography,
  IconButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";

const drawerWidth = 240;

const AdminLayout = () => {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();

  return (
    <Box sx={{ display: "flex" }}>
      
      {/* Topbar */}
      <AppBar
        position="fixed"
        sx={{ zIndex: 1300, backgroundColor: "#2E3A8C" }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            onClick={() => setOpen(!open)}
            edge="start"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" noWrap>
            QKC Admin Dashboard
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer
        variant="persistent"
        open={open}
        sx={{
          width: drawerWidth,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            backgroundColor: "#1e293b",
            color: "#fff",
          },
        }}
      >
        <Toolbar />
        <List>
          <ListItemButton onClick={() => navigate("/admin")}>
            <ListItemText primary="Dashboard" />
          </ListItemButton>

          <ListItemButton onClick={() => navigate("/admin/products")}>
            <ListItemText primary="Products" />
          </ListItemButton>

          <ListItemButton onClick={() => navigate("/admin/orders")}>
            <ListItemText primary="Orders" />
          </ListItemButton>

          <ListItemButton onClick={() => navigate("/admin/users")}>
            <ListItemText primary="Users" />
          </ListItemButton>
        </List>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          backgroundColor: "#f1f5f9",
          minHeight: "100vh",
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminLayout;
