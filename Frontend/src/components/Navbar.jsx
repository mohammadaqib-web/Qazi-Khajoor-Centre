import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useTheme,
  useMediaQuery,
  Divider,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";

import bgPattern from "../assets/bg.png";

import ProductsMegaMenu from "./ProductsMegaMenu";
import { productsMenuData } from "./productsMenuData";

import { NavLink, useLocation, useNavigate } from "react-router-dom";

/* ---------------- NAV BUTTON ---------------- */
const NavButton = ({ to, label, end }) => {
  return (
    <Button
      component={NavLink}
      to={to}
      end={end}
      sx={{
        color: "#3B2416",
        fontWeight: "bold",
        px: 2,
        borderRadius: 1,
        textTransform: "uppercase",
        "&.active": {
          backgroundColor: "#D4A373",
          color: "#3B2416",
        },
        "&:hover": {
          backgroundColor: "#D4A373",
        },
      }}
    >
      {label}
    </Button>
  );
};

const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const location = useLocation();
  const isProductsActive = location.pathname.startsWith("/products");

  const navigate = useNavigate();
  const [cartOpen, setCartOpen] = useState(false);
  const [qty, setQty] = useState(1);

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backgroundImage: `url(${bgPattern})`,
          color: "#3B2416",
        }}
      >
        <Toolbar
          sx={{
            justifyContent: "space-between",
            ml: { xs: 0, md: 2 },
            mr: { xs: 0, md: 2 },
          }}
        >
          {/* LEFT */}
          <Box display="flex" alignItems="center" gap={2}>
            {isMobile && (
              <IconButton onClick={() => setDrawerOpen(true)}>
                <MenuIcon />
              </IconButton>
            )}

            <Typography variant="h6" fontWeight="bold">
              QKC
            </Typography>
          </Box>

          {/* CENTER MENU (Desktop) */}
          {!isMobile && (
            <Box display="flex" gap={2} alignItems="center">
              <NavButton to="/" label="HOME" end />
              <NavButton to="/about" label="ABOUT US" />

              {/* PRODUCTS */}
              <Box
                sx={{
                  borderRadius: 1,
                  backgroundColor: isProductsActive ? "#D4A373" : "transparent",
                }}
              >
                <ProductsMegaMenu />
              </Box>

              {/* <NavButton to="/beirut-delights" label="BEIRUT DELIGHTS" /> */}
              <NavButton to="/contact" label="CONTACT" />
            </Box>
          )}

          {/* RIGHT ICONS */}
          <Box display="flex" gap={1}>
            <IconButton>
              <SearchIcon sx={{ color: "#3B2416" }} />
            </IconButton>
            <IconButton>
              <PersonOutlineIcon
                sx={{ color: "#3B2416" }}
                onClick={() => navigate("/auth")}
              />
            </IconButton>
            <IconButton onClick={() => setCartOpen(true)}>
              <ShoppingBagOutlinedIcon sx={{ color: "#3B2416" }} />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* MOBILE DRAWER */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box width={280} p={2}>
          <Typography variant="h6" mb={2}>
            QKC
          </Typography>

          <List>
            <ListItem
              component={NavLink}
              to="/"
              end
              sx={{
                "&.active": { backgroundColor: "#D4A373" },
                color: "#3B2416",
              }}
            >
              <ListItemText primary="HOME" />
            </ListItem>

            <ListItem
              component={NavLink}
              to="/about"
              sx={{
                "&.active": { backgroundColor: "#D4A373" },
                color: "#3B2416",
              }}
            >
              <ListItemText primary="ABOUT US" />
            </ListItem>

            {/* PRODUCTS */}
            {productsMenuData.map((col) => (
              <Box key={col.title} mb={1}>
                <Typography fontWeight={600}>{col.title}</Typography>
                {col.items.map((item) => (
                  <ListItem key={item} sx={{ pl: 2 }}>
                    <ListItemText primary={item} />
                  </ListItem>
                ))}
              </Box>
            ))}

            <ListItem
              component={NavLink}
              to="/contact"
              sx={{
                "&.active": { backgroundColor: "#D4A373" },
                color: "#3B2416",
              }}
            >
              <ListItemText primary="CONTACT" />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      <Drawer
        anchor="right"
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        PaperProps={{
          sx: {
            width: { xs: "100%", sm: 420 },
            // backgroundImage: `url(${bgPattern})`,
            p: 3,
          },
        }}
      >
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight={700}>
            Shopping Cart (1 Item)
          </Typography>
          <IconButton onClick={() => setCartOpen(false)}>✕</IconButton>
        </Box>
        <Divider sx={{ my: 3 }} />
        {/* Cart Item */}
        <Box display="flex" gap={2}>
          {/* Product Image */}
          <Box
            component="img"
            src="https://images.unsplash.com/photo-1607664608695-45aaa6d621fc"
            sx={{
              width: 90,
              height: 90,
              objectFit: "cover",
              borderRadius: 2,
            }}
          />

          {/* Product Details */}
          <Box flex={1}>
            <Typography fontWeight={600}>
              Medjoul Jordan Premium Dates
            </Typography>

            <Typography fontSize={14} color="text.secondary">
              Weight: 500G
            </Typography>

            {/* Quantity + Remove Row */}
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              mt={1.5}
            >
              {/* QTY Section */}
              <Box
                display="flex"
                alignItems="center"
                border="1px solid #ddd"
                borderRadius={1}
              >
                <IconButton
                  size="small"
                  onClick={() => setQty((prev) => Math.max(prev - 1, 1))}
                >
                  −
                </IconButton>

                <Typography px={1.5}>{qty}</Typography>

                <IconButton
                  size="small"
                  onClick={() => setQty((prev) => prev + 1)}
                >
                  +
                </IconButton>
              </Box>

              {/* Remove Button */}
              <Typography
                sx={{
                  cursor: "pointer",
                  fontSize: 14,
                  textDecoration: "underline",
                  color: "#2E3A8C",
                  "&:hover": { opacity: 0.7 },
                }}
              >
                Remove
              </Typography>
            </Box>

            {/* Price */}
            <Typography mt={1} fontWeight={700} color="#2E3A8C">
              Rs. 1,050.00
            </Typography>
          </Box>
        </Box>
        <Divider sx={{ my: 3 }} />
        {/* Subtotal */}
        <Box mt="auto">
          <Box display="flex" justifyContent="space-between" mb={2}>
            <Typography fontWeight={600}>Subtotal</Typography>
            <Typography fontWeight={700}>Rs. 1,050.00</Typography>
          </Box>

          <Button
            fullWidth
            variant="contained"
            sx={{
              backgroundColor: "#2E3A8C",
              py: 1.5,
              borderRadius: 2,
            }}
          >
            Buy Now
          </Button>
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;
