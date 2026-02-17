import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Chip,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const DatesMain = ({ name, id, products = [], loading }) => {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        py: { xs: 6, md: 8 },
      }}
    >
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
            {name || "Products"}
          </Typography>

          <Button
            variant="contained"
            sx={{
              backgroundColor: "#D4A373",
              color: "#3B2416",
              fontWeight: 600,
              "&:hover": {
                backgroundColor: "#D4A373",
              },
            }}
            onClick={() => navigate(`/${encodeURIComponent(name)}/${id}`)}
          >
            View All
          </Button>
        </Box>

        {/* LOADING */}
        {loading ? (
          <Box textAlign="center" py={4}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={2} justifyContent="center">
            {products.map((product) => (
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
                    {/* Optional NEW badge */}
                    {product.createdAt &&
                      new Date(product.createdAt) >
                        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) && (
                        <Chip
                          label="NEW STOCK"
                          size="small"
                          sx={{
                            position: "absolute",
                            top: 10,
                            left: 10,
                            backgroundColor: "#E53935",
                            color: "#fff",
                            fontSize: 11,
                            zIndex: 2,
                          }}
                        />
                      )}

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
                      From Rs. {product.sizes?.[0]?.price || 0}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default DatesMain;
