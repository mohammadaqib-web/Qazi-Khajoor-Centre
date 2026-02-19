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
  TextField,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import CircularProgress from "@mui/material/CircularProgress";
import { toast } from "react-toastify";
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
  clearCart,
} from "../features/auth/cartSlice";
import CloseIcon from "@mui/icons-material/Close";
import validator from "validator";
import userTokenValidity from "../utils/UserTokenValidity";

const Navbar = ({ categories }) => {
  const [loading, setLoading] = useState(false);
  const { token } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const location = useLocation();
  const isTokenValid = userTokenValidity();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [validatedCart, setValidatedCart] = useState([]);

  const [checkoutStep, setCheckoutStep] = useState("cart");
  // cart | address | payment

  const [address, setAddress] = useState({
    // fullName: "",
    // phone: "",
    addressLine1: "",
    // addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
  });

  const [addressError, setAddressError] = useState("");

  const isProductsActive = location.pathname.startsWith("/products");

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

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

  useEffect(() => {
    const fetchSearch = async () => {
      if (!searchTerm.trim()) {
        setSearchResults([]);
        return;
      }

      try {
        setSearchLoading(true);

        const res = await axios.get(
          `${import.meta.env.VITE_APP_API}/products/search?q=${searchTerm}`,
        );

        setSearchResults(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setSearchLoading(false);
      }
    };

    const debounce = setTimeout(fetchSearch, 300);
    return () => clearTimeout(debounce);
  }, [searchTerm]);

  /* ---------------- CALCULATIONS ---------------- */
  const subtotal = validatedCart.reduce(
    (acc, item) => acc + item.price * item.availableQty,
    0,
  );
  const totalAmount = subtotal;
  const API = import.meta.env.VITE_APP_API;
  const orderItems = validatedCart.map((item) => ({
    product: item.productId,
    name: item.name,
    size: item.size,
    quantity: item.availableQty,
    price: item.price,
  }));

  const hasOutOfStock = validatedCart.some((item) => item.stock === 0);

  const getVerifiedCityName = async (pincode, city) => {
    try {
      const res = await axios.get(
        `https://api.postalpincode.in/pincode/${pincode}`,
      );

      if (res.data[0].Status !== "Success") return false;

      return res.data[0].PostOffice.some(
        (po) =>
          po.Name.toLowerCase() === city.toLowerCase() ||
          po.District.toLowerCase() === city.toLowerCase(),
      );
    } catch {
      return false;
    }
  };

  const validateAddress = async () => {
    if (!address.city || !address.pincode) {
      return "City and Pincode required";
    }

    const isValid = await getVerifiedCityName(address.pincode, address.city);

    if (!isValid) {
      return "City does not match pincode";
    }

    return null;
  };

  const handlePayment = async () => {
    if (loading) return; // prevent multiple clicks
    setLoading(true);

    try {
      if (!token) {
        navigate("/auth");
        return;
      }

      if (validatedCart.length === 0) return;

      const { data } = await axios.post(
        `${API}/orders/razorpay`,
        { amount: totalAmount },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: data.amount,
        currency: "INR",
        order_id: data.id,
        handler: async function (response) {
          await axios.post(
            `${API}/orders`,
            {
              orderItems,
              totalAmount,
              shippingAddress: address,
              payment: {
                paymentId: response.razorpay_payment_id,
                paymentMethod: "razorpay",
                paymentStatus: "paid",
              },
            },
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          );

          handleCartClose();
          dispatch(clearCart());
          toast.success("Order placed successfully 🎉");
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCOD = async () => {
    if (loading) return;
    setLoading(true);

    try {
      if (address.city.toLowerCase() !== "ballia") {
        toast.warning("COD available only in Ballia");
        return;
      }

      await axios.post(
        `${API}/orders`,
        {
          orderItems,
          totalAmount,
          shippingAddress: address,
          payment: {
            paymentMethod: "cod",
            paymentStatus: "pending",
          },
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      handleCartClose();
      toast.success("Order placed successfully 🎉");
      dispatch(clearCart());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCartClose = () => {
    // handleCartClose();
    setCartOpen(false);
    setCheckoutStep("cart"); // reset step
    setAddressError(""); // optional reset
    setLoading(false); // safety reset
  };

  /* ---------------- UI ---------------- */
  return (
    <>
      <AppBar
        position="sticky"
        color="transparent"
        elevation={0}
        sx={{
          backgroundImage: `url(${bgPattern})`,
          backgroundRepeat: "repeat",
          backgroundColor: "#fff",
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
            <IconButton onClick={() => setSearchOpen(true)}>
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
        onClose={() => handleCartClose()}
        PaperProps={{
          sx: { width: { xs: "100%", sm: 420 }, p: 3 },
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight={700}>
            Shopping Cart ({validatedCart.length})
          </Typography>

          <IconButton onClick={() => handleCartClose()}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider sx={{ my: 3 }} />

        {checkoutStep === "cart" && (
          <>
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
                            color: "#3B2416",
                          }}
                        >
                          Remove
                        </Typography>
                      </Box>

                      <Typography mt={1} fontWeight={700} color="#3B2416">
                        Rs. {item.price * item.availableQty}
                      </Typography>
                    </Box>
                  </Box>

                  <Divider sx={{ mt: 3 }} />
                </Box>
              ))
            )}
          </>
        )}

        {/* SUBTOTAL */}
        {checkoutStep === "cart" && (
          <Box mt="auto">
            <Box display="flex" justifyContent="space-between">
              <Typography fontWeight={600}>Subtotal</Typography>
              <Typography fontWeight={700}>Rs. {subtotal}</Typography>
            </Box>

            <Button
              fullWidth
              variant="contained"
              disabled={hasOutOfStock || validatedCart.length === 0}
              sx={{
                backgroundColor: "#3B2416",
                mt: 2,
                py: 1.5,
              }}
              onClick={() => {
                if (!token || !isTokenValid) {
                  navigate("/auth");
                  return;
                }

                if (validatedCart.length === 0) {
                  toast.error("Your cart is empty");
                  return;
                }

                if (hasOutOfStock) {
                  toast.error("Some products are out of stock");
                  return;
                }

                setCheckoutStep("address");
              }}
            >
              Buy Now
            </Button>
          </Box>
        )}

        {checkoutStep === "address" && (
          <Box mt={2}>
            <Typography variant="h6" fontWeight={700} mb={3}>
              Shipping Address
            </Typography>

            <Box display="flex" flexDirection="column" gap={2}>
              {/* <TextField
                label="Full Name"
                fullWidth
                value={address.fullName}
                onChange={(e) =>
                  setAddress({ ...address, fullName: e.target.value })
                }
              />

              <TextField
                label="Phone Number"
                fullWidth
                value={address.phone}
                onChange={(e) =>
                  setAddress({ ...address, phone: e.target.value })
                }
              /> */}

              <TextField
                label="Address"
                fullWidth
                value={address.addressLine1}
                onChange={(e) =>
                  setAddress({ ...address, addressLine1: e.target.value })
                }
              />

              {/* <TextField
                label="Address Line 2"
                fullWidth
                value={address.addressLine2}
                onChange={(e) =>
                  setAddress({ ...address, addressLine2: e.target.value })
                }
              /> */}

              <Box display="flex" gap={2}>
                <TextField
                  label="City"
                  fullWidth
                  value={address.city}
                  onChange={(e) =>
                    setAddress({ ...address, city: e.target.value })
                  }
                />

                <TextField
                  label="State"
                  fullWidth
                  value={address.state}
                  onChange={(e) =>
                    setAddress({ ...address, state: e.target.value })
                  }
                />
              </Box>

              <TextField
                label="Pincode"
                fullWidth
                value={address.pincode}
                onChange={(e) =>
                  setAddress({ ...address, pincode: e.target.value })
                }
              />
            </Box>

            {addressError && (
              <Typography color="error" mt={2}>
                {addressError}
              </Typography>
            )}

            <Box display="flex" gap={2} mt={3}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => setCheckoutStep("cart")}
                sx={{
                  color: "#3B2416",
                  borderColor: "#3B2416",
                  "&:hover": {
                    borderColor: "#3B2416",
                    backgroundColor: "rgba(59,36,22,0.05)",
                  },
                }}
              >
                Back
              </Button>

              <Button
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{ backgroundColor: "#3B2416" }}
                onClick={async () => {
                  if (loading) return;
                  setLoading(true);

                  const error = await validateAddress();

                  if (error) {
                    setAddressError(error);
                    setLoading(false);
                    return;
                  }

                  setCheckoutStep("payment");
                  setLoading(false);
                }}
              >
                {loading ? (
                  <CircularProgress size={22} sx={{ color: "#3B2416" }} />
                ) : (
                  "Continue"
                )}
              </Button>
            </Box>
          </Box>
        )}

        {checkoutStep === "payment" && (
          <Box mt={2}>
            <Typography variant="h6" fontWeight={700} mb={3}>
              Payment Options
            </Typography>

            <Button
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                backgroundColor: "#3B2416",
                mb: 2,
                py: 1.5,
              }}
              onClick={handlePayment}
            >
              {loading ? (
                <CircularProgress size={22} sx={{ color: "#3B2416" }} />
              ) : (
                "Pay Online"
              )}
            </Button>

            {address.city.toLowerCase() === "ballia" && (
              <Button
                fullWidth
                variant="outlined"
                disabled={loading}
                onClick={handleCOD}
                sx={{
                  py: 1.5,
                  color: "#3B2416",
                  borderColor: "#3B2416",
                  "&:hover": {
                    borderColor: "#3B2416",
                    backgroundColor: "rgba(59,36,22,0.05)",
                  },
                }}
              >
                {loading ? <CircularProgress size={22} /> : "Cash On Delivery"}
              </Button>
            )}

            <Button
              fullWidth
              variant="text"
              sx={{ mt: 2, color: "#3B2416" }}
              onClick={() => setCheckoutStep("address")}
            >
              Back
            </Button>
          </Box>
        )}
        {loading && (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              backgroundColor: "rgba(255,255,255,0.6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 2000,
            }}
          >
            <CircularProgress />
          </Box>
        )}
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

      {/* SEARCH DRAWER */}
      <Drawer
        anchor="top"
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        PaperProps={{
          sx: {
            height: "70vh",
            backgroundColor: "#f5f0e6",
          },
        }}
      >
        {!isMobile && (
          <Box sx={{ textAlign: "right", pr: 2, pt: 1 }}>
            <IconButton onClick={() => setSearchOpen(false)}>
              <CloseIcon sx={{ fontSize: "30px" }} />
            </IconButton>
          </Box>
        )}
        <Box
          display="flex"
          height="100%"
          sx={{
            pt: 0,
            pl: { xs: 0, md: 2, xl: 30 },
            pr: { xs: 0, md: 2, xl: 30 },
          }}
        >
          {/* ---------------- LEFT CATEGORY PANEL ---------------- */}
          <Box
            sx={{
              width: "20%",
              pr: { xs: 0, xl: 4 },
              mr: 4,
              borderRight: "2px solid #ddd",
              mb: 4,
              display: { xs: "none", md: "flex" },
            }}
          >
            <List>
              <ListItem
                sx={{
                  cursor: "pointer",
                  py: 1,
                  px: 2,
                  borderRadius: 1,
                  backgroundColor: "transparent",
                  color: "#3B2416",
                  "&:hover": {
                    backgroundColor: "#D4A373",
                    color: "#000",
                  },
                }}
                onClick={() => {
                  navigate(`/allProducts`);
                  setSearchOpen(false);
                }}
              >
                <ListItemText primary={"ALL PRODUCTS"} />
              </ListItem>
              {categories.map((cat, index) => (
                <ListItem
                  key={cat._id}
                  sx={{
                    cursor: "pointer",
                    py: 1,
                    px: 2,
                    borderRadius: 1,
                    backgroundColor: "transparent",
                    color: "#3B2416",
                    "&:hover": {
                      backgroundColor: "#D4A373",
                      color: "#000",
                    },
                  }}
                  onClick={() => {
                    navigate(`/${encodeURIComponent(cat.name)}/${cat._id}`);
                    setSearchOpen(false);
                  }}
                >
                  <ListItemText primary={cat.name.toUpperCase()} />
                </ListItem>
              ))}
            </List>
          </Box>

          {/* ---------------- RIGHT SEARCH PANEL ---------------- */}
          <Box sx={{ flex: 1, pl: { xs: 0, md: 4 }, p: { xs: 3, md: 0 } }}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <TextField
                autoFocus
                fullWidth
                placeholder="Search"
                variant="standard"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  disableUnderline: true,
                  sx: {
                    fontSize: { xs: 16, md: 26 },
                    color: "#3B2416",
                  },
                }}
              />

              <IconButton onClick={() => setSearchTerm("")}>
                <CloseIcon sx={{ fontSize: { xs: 16, md: 26 } }} />
              </IconButton>
            </Box>

            <Divider
              sx={{
                my: { xs: 0, md: 2 },
                backgroundColor: "#D4A373",
                borderBottomWidth: 2,
              }}
            />

            {searchLoading && <CircularProgress />}

            <List>
              {searchResults.map((item) => (
                <ListItem
                  key={item._id}
                  sx={{ cursor: "pointer" }}
                  onClick={() => {
                    navigate(`/product/${item._id}`);
                    setSearchOpen(false);
                  }}
                >
                  <Box
                    component="img"
                    src={item.images?.url}
                    sx={{
                      width: 60,
                      height: 60,
                      objectFit: "cover",
                      borderRadius: 1,
                      mr: 2,
                    }}
                  />

                  <ListItemText
                    primary={item.name}
                    primaryTypographyProps={{
                      sx: {
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      },
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;
