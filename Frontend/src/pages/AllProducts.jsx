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

const products = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  title: "Holy Ajwa Jumbo Dates Premium Quality",
  price: "From Rs. 525",
  image: firstImg,
  isNew: true,
}));

const AllProducts = () => {
  const isMobile = useMediaQuery("(max-width:900px)");
  const [openFilter, setOpenFilter] = useState(false);
  const [page, setPage] = useState(1);
  const [price, setPrice] = useState([0, 7500]);
  const [tempPrice, setTempPrice] = useState([0, 7500]);

  const productsPerPage = 12;
  const totalPages = Math.ceil(products.length / productsPerPage);

  const paginatedProducts = products.slice(
    (page - 1) * productsPerPage,
    page * productsPerPage,
  );

  const FilterContent = () => (
    <Box sx={{ p: 3, width: 280 }}>
      <Typography fontWeight={700} mb={2} sx={{ color: "#3B2416" }}>
        FILTER
      </Typography>
      <Divider sx={{ borderColor: "#d4a373b9", mt: -1, borderWidth: 1 }} />

      {/* <Typography fontSize={14} fontWeight={600}>
        Availability
      </Typography>
      <FormControlLabel control={<Checkbox />} label="In stock" />
      <FormControlLabel control={<Checkbox />} label="Out of stock" /> */}

      <Typography
        fontSize={16}
        fontWeight={600}
        mt={3}
        // sx={{ color: "#3B2416" }}
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
      <Button
        fullWidth
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
              color: "white",
              fontSize: { xs: 26, md: 36 },
              fontWeight: 800,
              letterSpacing: 2,
              // backgroundColor: "rgba(255,255,255,0.6)",
              backdropFilter: "blur(5px)",
              // textDecoration: "underline #6F4E37 5px",
              p: 2,
            }}
          >
            All Products
          </Typography>
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
            <Grid size={{ xs: 12, md: 9 }}>
              {/* Mobile Filter Button */}
              {isMobile && (
                <Box display="flex" justifyContent="flex-end" mb={2}>
                  <Button
                    startIcon={<FilterListIcon />}
                    onClick={() => setOpenFilter(true)}
                  >
                    Filter
                  </Button>
                </Box>
              )}

              <Grid container spacing={3}>
                {paginatedProducts.map((product) => (
                  <Grid key={product.id} size={{ xs: 6, md: 4 }}>
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
                          image={product.image}
                          alt={product.title}
                          className="product-image"
                          sx={{
                            maxHeight: 220,
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
                            // color: "#3B2416",
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

              {/* PAGINATION */}
              <Box display="flex" justifyContent="center" mt={5}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(e, value) => setPage(value)}
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
