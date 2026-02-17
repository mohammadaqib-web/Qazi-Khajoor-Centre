import {
  Box,
  Container,
  Grid,
  Typography,
  IconButton,
  Divider,
} from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import logoDark from "../assets/logo-dark.png";
import { useNavigate } from "react-router-dom";

const Footer = ({ categories, setCategories }) => {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        backgroundColor: "#D4A373",
        backgroundImage: "url('/assets/bg.png')",
        backgroundRepeat: "repeat",
        color: "#3B2416",
        pt: 6,
      }}
    >
      <Container maxWidth="lg">
        {/* TOP FOOTER */}
        <Grid container spacing={6} justifyContent="space-between">
          {/* LOGO */}
          <Grid
            item
            xs={12}
            md={3}
            sx={{
              display: "flex",
              justifyContent: { xs: "center", md: "flex-start" },
            }}
          >
            <Box
              component="img"
              src={logoDark}
              alt="QKC logo"
              sx={{ width: "150px" }}
            />
          </Grid>

          {/* COMPANY */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography fontWeight={700} mb={2}>
              COMPANY
            </Typography>
            {["Contact Us", "About Us"].map((item) => (
              <Typography
                key={item}
                sx={{ mb: 1, fontSize: 14, cursor: "pointer" }}
                onClick={() => {
                  if (item === "Contact Us") navigate("/contact");
                  if (item === "About Us") navigate("/about");
                }}
              >
                {item}
              </Typography>
            ))}
          </Grid>

          {/* PRODUCTS */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography fontWeight={700} mb={2}>
              PRODUCTS
            </Typography>
            {categories?.slice(0, 4).map((item) => (
              <Typography
                key={item._id}
                sx={{
                  mb: 1,
                  fontSize: 14,
                  cursor: "pointer",
                  textTransform: "capitalize",
                }}
                onClick={() =>
                  navigate(`/${encodeURIComponent(item.name)}/${item._id}`)
                }
              >
                {item.name}
              </Typography>
            ))}
          </Grid>

          {/* CATEGORIES */}
          {/* <Grid item xs={12} sm={6} md={2}>
            <Typography fontWeight={700} mb={2}>
              CATEGORIES
            </Typography>
            {["Dates", "Nuts", "Dry Fruits", "Seeds"].map((item) => (
              <Typography
                key={item}
                sx={{ mb: 1, fontSize: 14, cursor: "pointer" }}
              >
                {item}
              </Typography>
            ))}
          </Grid> */}

          {/* SOCIAL */}
          <Grid
            item
            xs={12}
            sm={6}
            md={2}
            sx={{
              textAlign: { xs: "center", md: "left" },
            }}
          >
            <Typography fontWeight={700} mb={2}>
              FOLLOW US ON
            </Typography>
            <Box>
              <IconButton sx={{ color: "#3B2416" }}>
                <FacebookIcon />
              </IconButton>
              <IconButton sx={{ color: "#3B2416" }}>
                <InstagramIcon />
              </IconButton>
              <IconButton sx={{ color: "#3B2416" }}>
                <YouTubeIcon />
              </IconButton>
            </Box>
          </Grid>
        </Grid>

        {/* DIVIDER */}
        <Divider sx={{ my: 4, borderColor: "rgba(0,0,0,0.25)" }} />

        {/* BOTTOM BAR */}
        <Grid
          container
          alignItems="center"
          justifyContent={{ xs: "center", md: "space-between" }}
          spacing={2}
          sx={{ pb: 3 }}
        >
          <Grid
            // item
            // xs={12}
            // md={12}
            size={{ xs: 12 }}
            sx={{ textAlign: { xs: "center", md: "center" } }}
          >
            <Typography fontSize={14}>
              © 2026 Qari Khajoor Centre. All Rights Reserved.
            </Typography>
          </Grid>

          {/* <Grid
            item
            xs={12}
            md={6}
            sx={{
              display: "flex",
              justifyContent: { xs: "center", md: "flex-end" },
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            {[
              "Delivery",
              "Refunds",
              "Cancellation",
              "Returns",
              "Terms & Conditions",
              "Privacy Policy",
              "Careers",
            ].map((item) => (
              <Typography key={item} sx={{ fontSize: 14, cursor: "pointer" }}>
                {item}
              </Typography>
            ))}
          </Grid> */}
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;
