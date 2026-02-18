import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tabs,
  Tab,
  Divider,
  IconButton,
  Rating,
  CircularProgress,
} from "@mui/material";
import { useParams } from "react-router-dom";
import axios from "axios";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import bgPattern from "../assets/bg.png";
import SuggestedProducts from "../components/SuggestedProducts";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import VerifiedIcon from "@mui/icons-material/Verified";
import { addToCart } from "../features/auth/cartSlice";
import ProductCheckoutModal from "../components/ProductCheckoutModal";

const API = import.meta.env.VITE_APP_API;

const SingleProduct = () => {
  const { id } = useParams();
  const { token } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [selectedSize, setSelectedSize] = useState(null);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingReview, setLoadingReview] = useState(false);

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const totalReviews = reviews.length;

  const ratingCounts = [5, 4, 3, 2, 1].map(
    (star) => reviews.filter((r) => r.rating === star).length,
  );

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const productRes = await axios.get(`${API}/products/${id}`);
      const reviewsRes = await axios.get(`${API}/reviews/${id}`);

      setProduct(productRes.data);
      setReviews(reviewsRes.data);

      // Default select first size
      if (productRes.data.sizes.length > 0) {
        setSelectedSize(productRes.data.sizes[0]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );
  }

  if (!product) {
    return <Typography align="center">Product not found</Typography>;
  }

  return (
    <Box sx={{ backgroundImage: `url(${bgPattern})` }}>
      <Container maxWidth="lg" sx={{ py: { xs: 2, md: 6 } }}>
        <Grid container spacing={6}>
          {/* LEFT IMAGE */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              component="img"
              src={product.images?.url}
              sx={{
                width: "100%",
                borderRadius: 3,
                objectFit: "contain",
                minHeight: 200,
                maxHeight: 400,
              }}
            />
          </Grid>

          {/* RIGHT DETAILS */}
          <Grid size={{ xs: 12, md: 6 }} sx={{ mt: { xs: -3.5, md: 0 } }}>
            <Typography variant="h4" fontWeight={700}>
              {product.name}
            </Typography>

            {/* Price from selected size */}
            <Typography
              variant="h5"
              sx={{ color: "#C9A227", mt: 2, fontWeight: 700 }}
            >
              Rs. {selectedSize?.price}
            </Typography>

            {/* Rating from backend */}
            <Box display="flex" alignItems="center" mt={2}>
              <Rating
                value={product.averageRating || 0}
                precision={0.1}
                readOnly
              />
              <Typography ml={1}>
                {product.averageRating?.toFixed(1) || 0} ({reviews.length}{" "}
                reviews)
              </Typography>
            </Box>

            {/* Weight + Quantity */}
            <Box
              mt={3}
              display="flex"
              gap={4}
              flexDirection={{ xs: "column", sm: "row" }}
              alignItems={{ xs: "flex-start", sm: "center" }}
            >
              {/* Dynamic Size Dropdown */}
              <FormControl sx={{ width: { xs: "100%", sm: 200 } }}>
                <InputLabel>Weight</InputLabel>
                <Select
                  value={selectedSize?._id || ""}
                  label="Weight"
                  onChange={(e) => {
                    const size = product.sizes.find(
                      (s) => s._id === e.target.value,
                    );
                    setSelectedSize(size);
                  }}
                >
                  {product.sizes.map((size) => (
                    <MenuItem key={size._id} value={size._id}>
                      {size.size}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Quantity */}
              <Box display="flex" alignItems="center">
                <Typography mr={2}>QTY</Typography>
                <Box
                  display="flex"
                  alignItems="center"
                  // border="1px solid #ddd"
                  // borderRadius={2}
                >
                  <IconButton
                    onClick={() => setQty((prev) => (prev > 1 ? prev - 1 : 1))}
                  >
                    <RemoveIcon
                      sx={{
                        border: "1px solid rgba(0,0,0,0.2)",
                        borderRadius: 24,
                        p: 0.5,
                        fontSize: 30,
                      }}
                    />
                  </IconButton>
                  <Typography px={2}>{qty}</Typography>
                  <IconButton
                    onClick={() => {
                      if (qty < selectedSize?.stock) setQty((prev) => prev + 1);
                    }}
                  >
                    <AddIcon
                      sx={{
                        border: "1px solid rgba(0,0,0,0.2)",
                        borderRadius: 24,
                        p: 0.5,
                        fontSize: 30,
                      }}
                    />
                  </IconButton>
                </Box>
              </Box>
            </Box>

            {/* Stock Info */}
            <Typography mt={2} color="text.secondary">
              {selectedSize?.stock > 0
                ? `${selectedSize.stock} items in stock`
                : "Out of stock"}
            </Typography>

            <Box mt={4} display="flex" gap={2}>
              <Button
                variant="contained"
                sx={{ backgroundColor: "#D4A373" }}
                disabled={selectedSize?.stock === 0}
                onClick={() =>
                  dispatch(
                    addToCart({
                      cartId: `${product._id}-${selectedSize._id}`,
                      productId: product._id,
                      sizeId: selectedSize._id,
                      name: product.name,
                      image: product.images.url,
                      size: selectedSize.size,
                      price: selectedSize.price,
                      quantity: qty,
                    }),
                  )
                }
              >
                Add to Cart
              </Button>

              <Button
                variant="contained"
                disabled={selectedSize?.stock === 0}
                sx={{ backgroundColor: "#2E3A8C" }}
                onClick={() => setCheckoutOpen(true)}
              >
                Buy Now
              </Button>
            </Box>
          </Grid>
        </Grid>

        {/* Tabs */}
        <Box mt={8}>
          <Tabs value={tab} onChange={(e, val) => setTab(val)}>
            <Tab label="Description" />
            <Tab label="Customer Reviews" />
          </Tabs>

          <Divider sx={{ mb: 4 }} />

          {tab === 0 && (
            <Typography lineHeight={1.8} mb={6}>
              {product.description || "NO DESCRIPTION"}
            </Typography>
          )}

          {tab === 1 && (
            <Box>
              {/* ⭐ SUMMARY SECTION */}
              <Box
                display="flex"
                justifyContent="space-between"
                flexWrap="wrap"
                alignItems="center"
                mb={6}
              >
                {/* LEFT */}
                <Box textAlign="center" flex={1} minWidth={250}>
                  <Rating
                    value={product.averageRating || 0}
                    precision={0.1}
                    readOnly
                    size="large"
                  />
                  <Typography fontWeight={600} mt={1}>
                    {product.averageRating?.toFixed(2) || 0} out of 5
                  </Typography>
                  <Typography color="text.secondary">
                    Based on {totalReviews} reviews
                  </Typography>
                </Box>

                {/* CENTER - STAR BREAKDOWN */}
                <Box flex={1} minWidth={300} px={4}>
                  {[5, 4, 3, 2, 1].map((star, index) => {
                    const count = ratingCounts[index];
                    const percent =
                      totalReviews > 0 ? (count / totalReviews) * 100 : 0;

                    return (
                      <Box
                        key={star}
                        display="flex"
                        alignItems="center"
                        mb={1.5}
                        gap={1}
                      >
                        <Typography width={20}>{star}</Typography>
                        <Rating value={star} readOnly size="small" />

                        <Box
                          flex={1}
                          height={8}
                          sx={{
                            background: "#e0e0e0",
                            borderRadius: 5,
                            overflow: "hidden",
                          }}
                        >
                          <Box
                            sx={{
                              width: `${percent}%`,
                              height: "100%",
                              background: "#1f7a68",
                            }}
                          />
                        </Box>

                        <Typography width={30}>{count}</Typography>
                      </Box>
                    );
                  })}
                </Box>

                {/* RIGHT - BUTTON */}
                {token && (
                  <Box flex={1} minWidth={200} textAlign="center">
                    <Button
                      variant="contained"
                      sx={{ backgroundColor: "#3B2416" }}
                      onClick={() => setShowReviewForm(!showReviewForm)}
                    >
                      {showReviewForm ? "Cancel review" : "Write a review"}
                    </Button>
                  </Box>
                )}
              </Box>

              <Divider sx={{ mb: 4 }} />

              {/* ✍️ REVIEW FORM */}
              {showReviewForm && (
                <Box mb={6}>
                  <Typography variant="h6" fontWeight={700} mb={2}>
                    Write a review
                  </Typography>

                  <Typography>Rating</Typography>
                  <Rating
                    value={rating}
                    onChange={(e, newValue) => setRating(newValue)}
                    sx={{ mb: 2 }}
                  />

                  <Typography>Review</Typography>
                  <textarea
                    rows={5}
                    style={{
                      width: "100%",
                      padding: 12,
                      borderRadius: 8,
                      border: "1px solid #ccc",
                      marginBottom: 16,
                    }}
                    placeholder="Start writing here..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />

                  <Button
                    variant="contained"
                    sx={{ backgroundColor: "#3B2416" }}
                    disabled={rating > 0 || loadingReview ? false : true}
                    onClick={async () => {
                      if (rating > 0) {
                        try {
                          setLoadingReview(true);
                          await axios.post(
                            `${API}/reviews/${id}`,
                            {
                              rating,
                              comment,
                            },
                            {
                              headers: { Authorization: `Bearer ${token}` },
                            },
                          );

                          setShowReviewForm(false);
                          setRating(0);
                          setComment("");

                          // Refetch reviews data
                          fetchData();
                        } catch (err) {
                          toast.error(err?.response?.data?.message);
                          console.error({ err });
                        } finally {
                          setLoadingReview(false);
                        }
                      }
                    }}
                  >
                    Submit Review
                  </Button>
                </Box>
              )}

              {/* 📝 REVIEW LIST */}
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <Box key={review._id} mb={4}>
                    <Rating value={review.rating} readOnly />

                    <Box display={"flex"} alignItems={"center"}>
                      <Typography fontWeight={600} mt={1}>
                        {review.user?.name}
                      </Typography>
                      <span>
                        {" "}
                        <VerifiedIcon
                          sx={{
                            fontSize: "16px",
                            color: "green",
                            mt: 1.5,
                            ml: 0.5,
                          }}
                        />
                      </span>
                    </Box>
                    <Typography color="text.secondary">
                      {review.comment}
                    </Typography>

                    <Divider sx={{ mt: 2 }} />
                  </Box>
                ))
              ) : (
                <Typography sx={{ textAlign: "center" }}>
                  NO REVIEWS YET
                </Typography>
              )}
            </Box>
          )}
        </Box>
      </Container>

      <SuggestedProducts currentProductId={id} />

      <ProductCheckoutModal
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        product={product}
        selectedSize={selectedSize}
        qty={qty}
      />
    </Box>
  );
};

export default SingleProduct;
