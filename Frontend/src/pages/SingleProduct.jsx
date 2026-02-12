import { useState } from "react";
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
  Paper,
  Divider,
  IconButton,
  Rating,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import bgPattern from "../assets/bg.png";
import SuggestedProducts from "../components/SuggestedProducts";

const SingleProduct = () => {
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState(0);

  return (
    <Box
      sx={{
        // backgroundColor: "white",
        backgroundImage: `url(${bgPattern})`,
      }}
    >
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={6}>
          {/* LEFT - IMAGE */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              component="img"
              src="https://images.unsplash.com/photo-1607664608695-45aaa6d621fc"
              sx={{
                width: "100%",
                borderRadius: 3,
                objectFit: "contain",
                maxHeight: "400px",
              }}
            />
          </Grid>

          {/* RIGHT - DETAILS */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="h4" fontWeight={700}>
              Medjoul Jordan Premium / Super Jumbo Dates
            </Typography>

            <Typography
              variant="h5"
              sx={{ color: "#C9A227", mt: 2, fontWeight: 700 }}
            >
              Rs. 1,050.00
            </Typography>

            {/* Rating */}
            <Box display="flex" alignItems="center" mt={2}>
              <Rating value={4.2} precision={0.1} readOnly />
              <Typography ml={1}>4.2 (322 reviews)</Typography>
            </Box>

            {/* Weight Dropdown */}
            <FormControl sx={{ mt: 3, width: { xs: "100%", sm: "20%" } }}>
              <InputLabel>Weight</InputLabel>
              <Select defaultValue="500g" label="Weight">
                <MenuItem value="500g">500g</MenuItem>
                <MenuItem value="1kg">1kg</MenuItem>
              </Select>
            </FormControl>

            {/* Size Dropdown */}
            {/* <FormControl fullWidth sx={{ mt: 3 }}>
            <InputLabel>Size</InputLabel>
            <Select defaultValue="Super Jumbo" label="Size">
              <MenuItem value="Super Jumbo">Super Jumbo</MenuItem>
              <MenuItem value="Large">Large</MenuItem>
            </Select>
          </FormControl> */}

            {/* Quantity */}
            <Box display="flex" alignItems="center" mt={3}>
              <Typography mr={2}>QTY</Typography>
              <Box
                display="flex"
                alignItems="center"
                border="1px solid #ddd"
                borderRadius={2}
              >
                <IconButton
                  onClick={() => setQty((prev) => (prev > 1 ? prev - 1 : 1))}
                >
                  <RemoveIcon />
                </IconButton>
                <Typography px={2}>{qty}</Typography>
                <IconButton onClick={() => setQty((prev) => prev + 1)}>
                  <AddIcon />
                </IconButton>
              </Box>
            </Box>

            {/* Buttons */}
            <Box mt={4} display="flex" gap={2}>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#D4A373",
                  px: 4,
                  py: 1.5,
                }}
              >
                Add to Cart
              </Button>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#2E3A8C",
                  px: 4,
                  py: 1.5,
                }}
              >
                Buy Now
              </Button>
            </Box>
          </Grid>
        </Grid>

        {/* Tabs Section */}
        <Box mt={8}>
          <Tabs
            value={tab}
            onChange={(e, newValue) => setTab(newValue)}
            textColor="inherit"
            indicatorColor="primary"
          >
            <Tab label="Description" />
            <Tab label="Customer Reviews" />
          </Tabs>

          <Divider sx={{ mb: 4 }} />

          {tab === 0 && (
            <Typography lineHeight={1.8} mb={6}>
              Medjoul Jordan Premium Dates are known as the King of Dates.
              Naturally sweet, juicy and packed with fiber, antioxidants and
              essential minerals.
            </Typography>
          )}

          {tab === 1 && (
            <Box>
              {/* TOP SUMMARY SECTION */}
              <Box
                display="flex"
                justifyContent="space-between"
                flexWrap="wrap"
                alignItems="center"
                mb={6}
              >
                {/* LEFT - Overall Rating */}
                <Box textAlign="center" flex={1} minWidth={250}>
                  <Rating value={4.3} precision={0.1} readOnly size="large" />
                  <Typography fontWeight={600} mt={1}>
                    4.27 out of 5
                  </Typography>
                  <Typography color="text.secondary">
                    Based on 322 reviews
                  </Typography>
                </Box>

                {/* CENTER - Rating Breakdown */}
                <Box flex={1} minWidth={300} px={4}>
                  {[5, 4, 3, 2, 1].map((star, index) => {
                    const data = [231, 27, 20, 7, 37];
                    const total = 322;
                    const value = (data[index] / total) * 100;

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
                              width: `${value}%`,
                              height: "100%",
                              background: "#1f7a68",
                            }}
                          />
                        </Box>
                        <Typography width={30}>{data[index]}</Typography>
                      </Box>
                    );
                  })}
                </Box>

                {/* RIGHT - Write Review Button */}
                <Box flex={1} minWidth={200} textAlign="center">
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: "#1f7a68",
                      px: 4,
                      py: 1.2,
                      borderRadius: 1,
                    }}
                  >
                    Write a review
                  </Button>
                </Box>
              </Box>

              <Divider sx={{ mb: 4 }} />

              {/* REVIEWS LIST */}
              {[1, 2].map((item, index) => (
                <Box key={index} mb={4}>
                  <Rating value={index === 0 ? 1 : 5} readOnly />

                  <Box display="flex" alignItems="center" gap={1} mt={1}>
                    <Typography fontWeight={600}>
                      {index === 0 ? "zee ahmed" : "Gagan"}
                    </Typography>
                    <Box
                      sx={{
                        background: "#1f7a68",
                        color: "#fff",
                        px: 1,
                        fontSize: 12,
                        borderRadius: 1,
                      }}
                    >
                      Verified
                    </Box>
                    <Typography ml="auto" fontSize={13} color="text.secondary">
                      {index === 0 ? "02/05/2026" : "02/04/2026"}
                    </Typography>
                  </Box>

                  <Typography fontWeight={600} mt={1}>
                    {index === 0
                      ? "I ordered by mistake and these guys wont refund for me two same orders"
                      : "Items delivered were fresh"}
                  </Typography>

                  <Typography color="text.secondary" mt={0.5}>
                    {index === 0
                      ? "horrible service"
                      : "Very good quality and fresh dates."}
                  </Typography>

                  <Divider sx={{ mt: 3 }} />
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </Container>
      <SuggestedProducts />
    </Box>
  );
};

export default SingleProduct;
