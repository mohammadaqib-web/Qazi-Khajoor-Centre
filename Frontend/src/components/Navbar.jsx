import { useEffect, useState } from "react";
import axios from "axios";
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
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";

import bgPattern from "../assets/bg.png";
import ProductsMegaMenu from "./ProductsMegaMenu";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import logoDark from "../assets/logo-dark.png";

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

import {
  increaseQty,
  decreaseQty,
  removeFromCart,
} from "../features/auth/cartSlice";
import CloseIcon from "@mui/icons-material/Close";

const Navbar = ({ categories }) => {
  const { token } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const location = useLocation();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [validatedCart, setValidatedCart] = useState([]);

  const isProductsActive = location.pathname.startsWith("/products");

  /* ---------------- VALIDATE CART ---------------- */
  useEffect(() => {
    const validateCart = async () => {
      if (cartItems.length === 0) {
        setValidatedCart([]);
        return;
      }

      try {
        const res = await axios.post(
          `${import.meta.env.VITE_APP_API}/products/cart/validate`,
          { items: cartItems },
        );

        setValidatedCart(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    if (cartOpen) validateCart();
  }, [cartOpen, cartItems]);

  /* ---------------- CALCULATIONS ---------------- */
  const subtotal = validatedCart.reduce(
    (acc, item) => acc + item.price * item.availableQty,
    0,
  );

  const hasOutOfStock = validatedCart.some((item) => item.stock === 0);

  /* ---------------- UI ---------------- */
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
        <Toolbar sx={{ justifyContent: "space-between" }}>
          {/* LEFT */}
          <Box display="flex" alignItems="center" gap={2}>
            {isMobile && (
              <IconButton onClick={() => setDrawerOpen(true)}>
                <MenuIcon />
              </IconButton>
            )}
            <Box
              component="img"
              src={logoDark}
              sx={{
                height: { xs: 75, sm: 70, md: 100 },
                width: "auto",
                objectFit: "contain",
                ml: { xs: -2, md: 0 },
                pt: 1,
              }}
            />
          </Box>

          {/* CENTER */}
          {!isMobile && (
            <Box display="flex" gap={2}>
              <NavButton to="/" label="HOME" end />
              <NavButton to="/about" label="ABOUT US" />

              <Box
                sx={{
                  backgroundColor: isProductsActive ? "#D4A373" : "transparent",
                }}
              >
                <ProductsMegaMenu categories={categories} />
              </Box>

              <NavButton to="/contact" label="CONTACT" />
            </Box>
          )}

          {/* RIGHT */}
          <Box display="flex" gap={1}>
            <IconButton>
              <SearchIcon sx={{ color: "#3B2416" }} />
            </IconButton>

            <IconButton
              onClick={() => (token ? navigate("/profile") : navigate("/auth"))}
            >
              <PersonOutlineIcon sx={{ color: "#3B2416" }} />
            </IconButton>

            <IconButton onClick={() => setCartOpen(true)}>
              <ShoppingCartOutlinedIcon sx={{ color: "#3B2416" }} />
              {cartItems.length > 0 && (
                <Box
                  sx={{
                    position: "absolute",
                    top: -7,
                    right: 10,
                    backgroundColor: "#D4A373",
                    color: "#fff",
                    fontSize: 12,
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {cartItems.length}
                </Box>
              )}
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* ---------------- CART DRAWER ---------------- */}
      <Drawer
        anchor="right"
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        PaperProps={{
          sx: { width: { xs: "100%", sm: 420 }, p: 3 },
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight={700}>
            Shopping Cart ({validatedCart.length})
          </Typography>

          <IconButton onClick={() => setCartOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider sx={{ my: 3 }} />

        {validatedCart.length === 0 ? (
          <Typography textAlign="center">Your cart is empty</Typography>
        ) : (
          validatedCart.map((item) => (
            <Box key={item.productId + item.sizeId} mb={3}>
              <Box display="flex" gap={2}>
                <Box
                  component="img"
                  src={item.image}
                  sx={{
                    width: 90,
                    height: 90,
                    borderRadius: 2,
                    objectFit: "cover",
                  }}
                />

                <Box flex={1}>
                  <Typography fontWeight={600}>{item.name}</Typography>

                  <Typography fontSize={14}>Weight: {item.size}</Typography>

                  {/* STOCK STATUS */}
                  {item.stock === 0 && (
                    <Typography
                      color="error"
                      fontSize={13}
                      fontWeight={600}
                      mt={1}
                    >
                      Out of Stock
                    </Typography>
                  )}

                  {item.stock > 0 && item.stock < 5 && (
                    <Typography color="warning.main" fontSize={13} mt={1}>
                      Only {item.stock} left
                    </Typography>
                  )}

                  {/* QTY CONTROLS */}
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    mt={2}
                  >
                    <Box
                      display="flex"
                      alignItems="center"
                      border="1px solid #ddd"
                      borderRadius={1}
                    >
                      <IconButton
                        size="small"
                        onClick={() =>
                          dispatch(
                            decreaseQty({
                              productId: item.productId,
                              sizeId: item.sizeId,
                            }),
                          )
                        }
                      >
                        −
                      </IconButton>

                      <Typography px={1.5}>{item.availableQty}</Typography>

                      <IconButton
                        size="small"
                        disabled={item.availableQty >= item.stock}
                        onClick={() =>
                          dispatch(
                            increaseQty({
                              productId: item.productId,
                              sizeId: item.sizeId,
                            }),
                          )
                        }
                      >
                        +
                      </IconButton>
                    </Box>

                    <Typography
                      onClick={() =>
                        dispatch(
                          removeFromCart({
                            productId: item.productId,
                            sizeId: item.sizeId,
                          }),
                        )
                      }
                      sx={{
                        cursor: "pointer",
                        fontSize: 14,
                        textDecoration: "underline",
                        color: "#2E3A8C",
                      }}
                    >
                      Remove
                    </Typography>
                  </Box>

                  <Typography mt={1} fontWeight={700} color="#2E3A8C">
                    Rs. {item.price * item.availableQty}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ mt: 3 }} />
            </Box>
          ))
        )}

        {/* SUBTOTAL */}
        <Box mt="auto">
          <Box display="flex" justifyContent="space-between">
            <Typography fontWeight={600}>Subtotal</Typography>
            <Typography fontWeight={700}>Rs. {subtotal}</Typography>
          </Box>

          <Button
            fullWidth
            variant="contained"
            disabled={hasOutOfStock}
            sx={{
              backgroundColor: "#2E3A8C",
              mt: 2,
              py: 1.5,
            }}
          >
            Buy Now
          </Button>
        </Box>
      </Drawer>

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
              onClick={() => setDrawerOpen(false)}
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
              onClick={() => setDrawerOpen(false)}
            >
              <ListItemText primary="ABOUT US" />
            </ListItem>

            {/* PRODUCTS */}
            {/* {productsMenuData.map((col) => ( */}
            <Box mb={1} ml={2} mt={1}>
              <Typography
                fontSize={"medium"}
                sx={{
                  // "&.active": { backgroundColor: "#D4A373" },
                  color: "#3B2416",
                }}
                onClick={() => {
                  navigate("/allProducts");
                  setDrawerOpen(false);
                }}
              >
                {"ALL PRODUCTS"}
              </Typography>
              {categories.map((item, index) => (
                <ListItem
                  key={item._id}
                  sx={{
                    pl: 2,
                    cursor: "pointer",
                    textTransform: "capitalize",
                    "&:hover": { color: "#C59A3D" },
                    mt: index === 0 ? 1 : 0,
                  }}
                >
                  <ListItemText
                    primary={item.name}
                    onClick={() => {
                      navigate(`/${encodeURIComponent(item.name)}/${item._id}`);
                      setDrawerOpen(false);
                    }}
                  />
                </ListItem>
              ))}
            </Box>
            {/* ))} */}

            <ListItem
              component={NavLink}
              to="/contact"
              sx={{
                "&.active": { backgroundColor: "#D4A373" },
                color: "#3B2416",
              }}
              onClick={() => setDrawerOpen(false)}
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
