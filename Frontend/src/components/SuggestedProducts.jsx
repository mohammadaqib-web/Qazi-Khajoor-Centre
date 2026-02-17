import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_APP_API;

const SuggestedProducts = ({ currentProductId }) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRandomProducts = async () => {
      try {
        const res = await axios.get(
          `${API}/products/random?exclude=${currentProductId}`,
        );
        setProducts(res.data);
      } catch (error) {
        console.error("Error fetching random products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRandomProducts();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={6}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ pb: 12, mt: 5 }}>
      <Container maxWidth="xl" sx={{ width: "92%" }}>
        {/* HEADER */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              letterSpacing: 1,
              color: "#3B2416",
            }}
          >
            Suggested Products
          </Typography>
        </Box>

        {/* PRODUCTS GRID */}
        <Grid container spacing={2} justifyContent="center">
          {products.map((product) => {
            const firstSize = product.sizes?.[0];

            return (
              <Grid
                item
                xs={12}
                sm={6}
                md={3}
                key={product._id}
                onClick={() => navigate(`/product/${product._id}`)}
              >
                <Card
                  elevation={4}
                  sx={{
                    backgroundColor: "transparent",
                    width: "300px",
                    maxWidth: "350px",
                    overflow: "hidden",
                    transition: "all 0.3s ease",
                    "&:hover .product-image": {
                      transform: "scale(1.05)",
                    },
                    cursor: "pointer",
                  }}
                >
                  <Box
                    sx={{
                      position: "relative",
                      overflow: "hidden",
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
                        height: 220,
                        objectFit: "contain",
                        p: 2,
                        transition: "transform 0.4s ease",
                      }}
                    />
                  </Box>

                  <CardContent sx={{ px: 2, textAlign: "center" }}>
                    <Typography
                      sx={{
                        fontSize: 14,
                        fontWeight: 700,
                        minHeight: 42,
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
                      From Rs. {firstSize?.price}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </Box>
  );
};

export default SuggestedProducts;
