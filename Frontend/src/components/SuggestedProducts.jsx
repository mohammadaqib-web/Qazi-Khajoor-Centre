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
} from "@mui/material";
import firstImg from "../assets/dates.png";

const products = [
  {
    id: 1,
    title: "Medjoul Jordan Premium Super Jumbo Dates",
    price: "From Rs. 475",
    image: firstImg,
    isNew: true,
  },
  {
    id: 2,
    title: "Holy Ajwa Jumbo Dates Premium Quality",
    price: "From Rs. 525",
    image: firstImg,
    isNew: true,
  },
  {
    id: 3,
    title: "Chile Walnut Without Shell Akhrot",
    price: "From Rs. 259",
    image: firstImg,
    isNew: false,
  },
  {
    id: 4,
    title: "Super Premium Figs Afghan Anjeer",
    price: "From Rs. 215",
    image: firstImg,
    isNew: false,
  },
];

const SuggestedProducts = () => {
  return (
    <Box
      sx={{
        mb: 12,
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
            Suggested Products
          </Typography>

          {/* <Button
            variant="contained"
            sx={{
              backgroundColor: "#D4A373",
              color: "#3B2416",
              fontWeight: 600,
              "&:hover": {
                backgroundColor: "#D4A373",
              },
            }}
          >
            View All
          </Button> */}
        </Box>

        {/* PRODUCTS GRID */}
        <Grid container spacing={2} display={"flex"} justifyContent={"center"}>
          {products.map((product) => (
            <Grid item xs={12} sm={6} md={3} key={product.id}>
              <Card
                elevation={4}
                sx={{
                  backgroundColor: "transparent",
                  width: "300px",
                  maxWidth: "350px",
                  overflow: "hidden", // important
                  transition: "all 0.3s ease",

                  "&:hover .product-image": {
                    transform: "scale(1.05)",
                  },
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
                    image={product.image}
                    alt={product.title}
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
                    {product.title}
                  </Typography>

                  <Typography
                    sx={{
                      mt: 1,
                      fontSize: 18,
                      fontWeight: 900,
                      color: "#3B2416",
                    }}
                  >
                    {product.price}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default SuggestedProducts;
