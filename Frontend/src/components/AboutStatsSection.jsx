import { Box, Container, Typography, Grid, Divider } from "@mui/material";
import StorefrontIcon from "@mui/icons-material/Storefront";
import PublicIcon from "@mui/icons-material/Public";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import SpaIcon from "@mui/icons-material/Spa";

const stats = [
  {
    icon: <StorefrontIcon />,
    value: "1",
    label: "Number of Stores",
  },
  {
    icon: <PublicIcon />,
    value: "1",
    label: "Countries",
  },
  {
    icon: <Inventory2Icon />,
    value: "50+",
    label: "Products",
  },
  {
    icon: <SpaIcon />,
    value: "10",
    label: "Varieties of Premium Dates",
  },
];

const AboutStatsSection = () => {
  return (
    <Box
      sx={{
        py: { xs: 6, md: 8 },
        backgroundColor: "#F5EDE3",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={6} alignItems="center">
          {/* LEFT CONTENT */}
          <Grid item xs={12} md={6}>
            <Typography
              sx={{
                fontWeight: 800,
                fontSize: 26,
                color: "#3B2416",
                mb: 0.5,
              }}
            >
              QARI KHAJOOR CENTRE
            </Typography>

            <Divider
              sx={{
                width: 200,
                borderColor: "#D4A373",
                borderBottomWidth: 4,
                mb: 3,
              }}
            />

            <Typography
              sx={{
                color: "#6F4E37",
                lineHeight: 1.8,
                fontSize: 15,
              }}
            >
              Welcome to QKC, where an unwavering commitment with a heritage of
              quality that spans over 40 years. Enjoy our unique assortment of
              dates, harvested from our own organic farm in the Middle East,
              featuring over 50+ varieties. Experience a world of luxury with
              our exquisitely curated collection of exotic fruits, nuts, and
              imported beverages.
            </Typography>
          </Grid>

          {/* RIGHT STATS */}
          <Grid item xs={12} md={6}>
            <Grid container spacing={4}>
              {stats.map((item, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <Box
                      sx={{
                        color: "#D4A373",
                        fontSize: 42,
                      }}
                    >
                      {item.icon}
                    </Box>

                    <Box>
                      <Typography
                        sx={{
                          fontWeight: 800,
                          fontSize: 24,
                          color: "#3B2416",
                        }}
                      >
                        {item.value}
                      </Typography>
                      <Typography
                        sx={{
                          color: "#6F4E37",
                          fontSize: 14,
                        }}
                      >
                        {item.label}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AboutStatsSection;
