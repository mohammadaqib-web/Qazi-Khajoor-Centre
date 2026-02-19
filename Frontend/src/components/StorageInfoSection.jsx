import { Box, Container, Grid, Typography } from "@mui/material";

const StorageInfoSection = () => {
  return (
    <Box
      sx={{
        backgroundColor: "#F5EDE3",
        backgroundImage: "url('/assets/bg.webp')",
        backgroundRepeat: "repeat",
        py: { xs: 6, md: 10 },
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={6} alignItems="center">
          {/* LEFT CONTENT */}
          <Grid item xs={12} md={6}>
            <Typography
              sx={{
                color: "#3B2416",
                fontWeight: 900,
                fontSize: { xs: 22, md: 28 },
                textTransform: "uppercase",
                mb: 2,
              }}
            >
              Storing your favourite
              <br />
              dates, dry fruits and nuts!
            </Typography>

            <Typography
              sx={{
                color: "#3B2416",
                fontSize: 15,
                lineHeight: 1.8,
                mb: 2,
                maxWidth: "540px",
              }}
            >
              For immediate usage, store these products in airtight containers
              at cool, dark spot reducing the exposure of light, oxygen and
              moisture.
            </Typography>

            <Typography
              sx={{
                color: "#3B2416",
                fontSize: 15,
                lineHeight: 1.8,
                mb: 2,
                maxWidth: "500px",
              }}
            >
              Do not expose to heat as it may go rancid or create grounds for
              soft bodied animals.
            </Typography>

            <Typography
              sx={{
                color: "#3B2416",
                fontSize: 15,
                lineHeight: 1.8,
                maxWidth: "500px",
              }}
            >
              For longer use, keep it refrigerated giving it the right taste and
              more flavourful vibrant to these tasteful products.
            </Typography>
          </Grid>

          {/* RIGHT IMAGE */}
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src="https://images.unsplash.com/photo-1612981499283-c98b772c0e3f"
              alt="Dry fruits storage"
              sx={{
                width: "100%",
                maxWidth: 540,
                display: "block",
                marginLeft: "auto",
                borderRadius: 2,
                boxShadow: "0 20px 50px rgba(0,0,0,0.15)",
              }}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default StorageInfoSection;
