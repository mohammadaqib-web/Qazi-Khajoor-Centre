import { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Drawer,
  IconButton,
  Button,
  Pagination,
  Slider,
  Checkbox,
  FormControlLabel,
  useMediaQuery,
  Grid,
  Divider,
  Card,
  CardMedia,
  Chip,
  CardContent,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import CloseIcon from "@mui/icons-material/Close";
import bgPattern from "../assets/bg.png";
import firstImg from "../assets/dates.png";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useOutletContext } from "react-router-dom";

const API = import.meta.env.VITE_APP_API;

const AllProducts = () => {
  const { categories } = useOutletContext();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const { category, id } = useParams();
  const isMobile = useMediaQuery("(max-width:900px)");
  const [openFilter, setOpenFilter] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();

  const pageParam = parseInt(searchParams.get("page")) || 1;
  const minParam = parseInt(searchParams.get("minPrice")) || 0;
  const maxParam = parseInt(searchParams.get("maxPrice")) || 7500;
  const inStockParam = searchParams.get("inStock");

  const [page, setPage] = useState(pageParam);
  const [price, setPrice] = useState([minParam, maxParam]);
  const [tempPrice, setTempPrice] = useState([minParam, maxParam]);

  useEffect(() => {
    fetchProducts();
  }, [searchParams, id]);

  const FilterContent = () => (
    <Box sx={{ p: 3, width: 280 }}>
      <Typography fontWeight={700} mb={2} sx={{ color: "#3B2416" }}>
        FILTER
      </Typography>
      <Divider sx={{ borderColor: "#d4a373b9", mt: -1, borderWidth: 1 }} />
      <Typography
        fontSize={16}
        fontWeight={600}
        mt={3}
        sx={{ textTransform: "uppercase", color: "#3B2416" }}
      >
        Price
      </Typography>
      <Slider
        value={tempPrice}
        onChange={(e, newValue) => {
          if (!Array.isArray(newValue)) return;
          setTempPrice(newValue);
        }}
        onChangeCommitted={(e, newValue) => {
          if (!Array.isArray(newValue)) return;
          setPrice(newValue);
        }}
        min={0}
        max={7500}
        step={500}
        valueLabelDisplay="auto"
        sx={{
          color: "#3B2416",
          width: "90%",
        }}
      />
      <Typography sx={{ mt: 0 }}>
        Price: ₹ {tempPrice[0]} – ₹ {tempPrice[1]}
      </Typography>

      <Typography
        fontSize={16}
        fontWeight={600}
        mt={4}
        sx={{ textTransform: "uppercase", color: "#3B2416" }}
      >
        Availability
      </Typography>

      <FormControlLabel
        control={
          <Checkbox
            checked={searchParams.get("inStock") === "true"}
            sx={{
              color: "#3B2416",
              "&.Mui-checked": { color: "#3B2416" },
            }}
            onChange={() => {
              const params = new URLSearchParams(searchParams);

              if (searchParams.get("inStock") === "true") {
                params.delete("inStock");
              } else {
                params.set("inStock", "true");
              }

              params.set("page", 1);

              setSearchParams(params);
            }}
          />
        }
        label="In Stock"
      />

      {!id && (
        <>
          <Typography
            fontSize={16}
            fontWeight={600}
            mt={3}
            sx={{ textTransform: "uppercase", color: "#3B2416" }}
          >
            Category
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", mt: 1 }}>
            {categories?.map((cat) => (
              <FormControlLabel
                key={cat._id}
                control={
                  <Checkbox
                    checked={searchParams.get("category") === cat._id}
                    sx={{
                      color: "#3B2416",
                      "&.Mui-checked": {
                        color: "#3B2416",
                      },
                    }}
                    onChange={() => {
                      const params = new URLSearchParams(searchParams);
                      const currentCategory = searchParams.get("category");

                      if (currentCategory === cat._id) {
                        params.delete("category");
                      } else {
                        params.set("category", cat._id);
                      }

                      params.set("page", 1);

                      setSearchParams(params);
                    }}
                  />
                }
                label={cat.name
                  .split(" ")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}
              />
            ))}
          </Box>
        </>
      )}

      <Button
        fullWidth
        onClick={() => {
          setPage(1);
          setPrice(tempPrice);

          setSearchParams({
            page: 1,
            minPrice: tempPrice[0],
            maxPrice: tempPrice[1],
          });
        }}
        sx={{
          mt: 3,
          backgroundColor: "#3B2416",
          color: "#fff",
          fontWeight: "bold",
        }}
      >
        Apply
      </Button>
    </Box>
  );

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const pageParam = searchParams.get("page") || 1;
      const minParam = searchParams.get("minPrice") || 0;
      const maxParam = searchParams.get("maxPrice") || 7500;
      const categoryParam = searchParams.get("category");

      let url = "";

      if (id) {
        url = `${API}/products/category/${id}?page=${pageParam}&limit=12&minPrice=${minParam}&maxPrice=${maxParam}`;
      } else {
        url = `${API}/products/user?page=${pageParam}&limit=12&minPrice=${minParam}&maxPrice=${maxParam}`;

        if (categoryParam) {
          url += `&category=${categoryParam}`;
        }

        if (inStockParam === "true") {
          url += `&inStock=true`;
        }
      }

      const { data } = await axios.get(url);

      setProducts(data.products);
      setTotalPages(data.totalPages);
      setPage(Number(pageParam));
      setPrice([Number(minParam), Number(maxParam)]);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        backgroundImage: `url(${bgPattern})`,
        backgroundRepeat: "repeat",
        position: "relative",
      }}
    >
      <Box sx={{ position: "relative", zIndex: 1 }}>
        <Box
          sx={{
            height: 280,
            backgroundImage:
              "linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('https://images.unsplash.com/photo-1648288725055-5ba4063355b9?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <Typography
            sx={{
              position: "relative",
              color: "white",
              fontSize: { xs: 26, md: 36 },
              fontWeight: 800,
              letterSpacing: 2,
              backdropFilter: "blur(5px)",
              p: 1.5,
              textTransform: "uppercase",
              display: "inline-block",
            }}
          >
            {/* TOP 20% from LEFT */}
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "40%",
                height: "3px",
                backgroundColor: "#d4a373b9",
              }}
            />

            {/* RIGHT 20% from TOP */}
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                right: 0,
                width: "3px",
                height: "40%",
                backgroundColor: "#d4a373b9",
              }}
            />

            {/* BOTTOM 20% from RIGHT */}
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                right: 0,
                width: "40%",
                height: "3px",
                backgroundColor: "#d4a373b9",
              }}
            />

            {/* LEFT 20% from TOP */}
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "3px",
                height: "40%",
                backgroundColor: "#d4a373b9",
              }}
            />

            {category || "All Products"}
          </Typography>

          {/* {!category && (
            <>
              <Divider
                sx={{
                  width: { xs: 190, md: 250 },
                  borderColor: "#d4a373b9",
                  borderBottomWidth: 35,
                  mt: { xs: -6.5, md: -7.5 },
                }}
              />
              <Divider
                sx={{
                  width: { xs: 150, md: 200 },
                  borderColor: "#d4a373b9",
                  borderBottomWidth: 4,
                  mt: 0.5,
                  zIndex: 2,
                }}
              />
            </>
          )} */}
        </Box>
        <Container maxWidth="lg" sx={{ py: 6 }}>
          <Grid container spacing={4}>
            {/* DESKTOP SIDEBAR */}
            {!isMobile && (
              <Grid size={{ md: 3 }}>
                <Paper>
                  <FilterContent />
                </Paper>
              </Grid>
            )}

            {/* PRODUCTS AREA */}
            <Grid size={{ xs: 12, md: 9 }} mt={-2}>
              {/* Mobile Filter Button */}
              {isMobile && (
                <Box display="flex" justifyContent="flex-end" mb={2}>
                  <Button
                    startIcon={<FilterListIcon />}
                    onClick={() => setOpenFilter(true)}
                    sx={{ color: "#3B2416" }}
                  >
                    Filter
                  </Button>
                </Box>
              )}

              <Grid container spacing={3}>
                {products?.map((product) => (
                  <Grid
                    key={product._id}
                    size={{ xs: 6, md: 4 }}
                    onClick={() => {
                      navigate(`/product/${product._id}`);
                    }}
                  >
                    <Card
                      elevation={4}
                      sx={{
                        backgroundColor: "transparent",
                        // width: "300px",
                        // maxWidth: "350px",
                        overflow: "hidden", // important
                        transition: "all 0.3s ease",
                        "&:hover .product-image": {
                          transform: "scale(1.05)",
                        },
                        height: "290px",
                        maxHeight: "290px",
                        cursor: "pointer",
                      }}
                    >
                      <Box
                        sx={{
                          position: "relative",
                          overflow: "hidden", // keeps zoom inside card
                          borderRadius: 1,
                          backgroundColor: "#fff",
                        }}
                      >
                        <CardMedia
                          component="img"
                          image={product.images?.url}
                          alt={product.name}
                          className="product-image"
                          sx={{
                            minHeight: 200,
                            maxHeight: 200,
                            objectFit: "contain",
                            p: 2,
                            transition: "transform 0.4s ease",
                          }}
                        />
                      </Box>

                      <CardContent
                        sx={{
                          px: 2,
                          textAlign: "center",
                          mt: { xs: 0, md: -2 },
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: 14,
                            fontWeight: 700,
                            minHeight: 42,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            color: "#3B2416",
                          }}
                        >
                          {product.name}
                        </Typography>

                        <Typography
                          sx={{
                            mt: 1,
                            fontSize: 18,
                            fontWeight: 900,
                            color: "#3B2416",
                          }}
                        >
                          {`From ₹ ${Math.min(...product.sizes.map((s) => s.price))}`}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              {/* PAGINATION */}
              <Box display="flex" justifyContent="center" mt={5}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(e, value) => {
                    setPage(value);
                    setSearchParams({
                      page: value,
                      minPrice: price[0],
                      maxPrice: price[1],
                    });
                  }}
                  sx={{
                    "& .Mui-selected": {
                      backgroundColor: "#d4a373 !important",
                      color: "#000",
                    },
                  }}
                />
              </Box>
            </Grid>
          </Grid>

          {/* MOBILE DRAWER FILTER */}
          <Drawer
            anchor="right"
            open={openFilter}
            onClose={() => setOpenFilter(false)}
          >
            <Box display="flex" justifyContent="space-between" p={2}>
              <Typography fontWeight={700}>Filter</Typography>
              <IconButton onClick={() => setOpenFilter(false)}>
                <CloseIcon />
              </IconButton>
            </Box>
            <FilterContent />
          </Drawer>
        </Container>
      </Box>
    </Box>
  );
};

export default AllProducts;
