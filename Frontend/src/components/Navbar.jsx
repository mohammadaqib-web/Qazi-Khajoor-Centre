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

              <NavButton to="/beirut-delights" label="BEIRUT DELIGHTS" />
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
            <IconButton>
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
    </>
  );
};

export default Navbar;
