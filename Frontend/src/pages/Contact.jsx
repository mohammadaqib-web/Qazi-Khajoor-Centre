import {
  Box,
  Container,
  Grid,
  Typography,
  TextField,
  Button,
  Divider,
} from "@mui/material";
import bgPattern from "../assets/bg.webp";

const Contact = () => {
  return (
    <Box sx={{ backgroundImage: `url(${bgPattern})` }}>
      {/* HERO */}
      <Box
        sx={{
          height: 280,
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url('https://images.unsplash.com/photo-1674066253665-4d2553a3bcb8?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
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
            color: "#fff",
            fontSize: { xs: 26, md: 36 },
            fontWeight: 800,
            letterSpacing: 2,
            backdropFilter: "blur(5px)",
            p: 2,
          }}
        >
          CONTACT US
        </Typography>
        <Divider
          sx={{
            width: { xs: 200, md: 270 },
            borderColor: "#d4a373b9",
            borderBottomWidth: 35,
            mt: { xs: -6.8, md: -7.5 },
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

      {/* FORM */}
      <Container maxWidth="md" sx={{ py: { xs: 6, md: 8 } }}>
        <Typography
          sx={{
            fontSize: { xs: 24, md: 32 },
            fontWeight: 800,
            color: "#3B2416",
            mb: 5,
            textAlign: "center",
          }}
        >
          Send Us Your Questions!
        </Typography>

        <Grid container spacing={4} columns={12}>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              label="Name*"
              sx={{ backgroundColor: "#fff", borderRadius: 1 }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              label="Email*"
              sx={{ backgroundColor: "#fff", borderRadius: 1 }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              label="Phone*"
              sx={{ backgroundColor: "#fff", borderRadius: 1 }}
            />
          </Grid>

          <Grid size={12}>
            <TextField
              fullWidth
              label="Message*"
              multiline
              rows={6}
              sx={{ backgroundColor: "#fff", borderRadius: 1 }}
            />
          </Grid>

          <Grid size={12} sx={{ textAlign: "center", mt: 2 }}>
            <Button
              sx={{
                backgroundColor: "#D4A373",
                color: "#3B2416",
                fontWeight: 700,
                px: 4,
                py: 1.5,
                "&:hover": { backgroundColor: "#c18f5c" },
              }}
            >
              Send Message
            </Button>
          </Grid>
        </Grid>
      </Container>

      {/* CONTACT INFO */}
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Grid container spacing={4} columns={12} textAlign="center">
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography fontWeight={800}>CUSTOMER SERVICE</Typography>
            <Typography sx={{ color: "#6F4E37", mt: 1 }}>
              Monday to Saturday
              <br />
              9:00 AM – 5:30 PM
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Typography fontWeight={800}>PHONE</Typography>
            <Typography sx={{ color: "#6F4E37", mt: 1 }}>
              +91 88587 37598
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Typography fontWeight={800}>EMAIL</Typography>
            <Typography sx={{ color: "#6F4E37", mt: 1 }}>
              qkcinfo@gmail.com
            </Typography>
          </Grid>
        </Grid>
      </Container>

      {/* MAP */}
      <Box sx={{ height: 420, mt: 6 }}>
        <iframe
          title="Qari Book Depot"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d10139.304984980581!2d84.14361008901638!3d25.753217339194933!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399264def55002f7%3A0x627424cca011587a!2sQari%20Book%20Depot!5e1!3m2!1sen!2sin!4v1770569839465!5m2!1sen!2sin"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
        />
      </Box>
    </Box>
  );
};

export default Contact;
