import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Divider,
} from "@mui/material";
import bgPattern from "../assets/bg.png";

const About = () => {
  return (
    <Box sx={{ backgroundImage: `url(${bgPattern})` }}>
      {/* HERO */}
      <Box
        sx={{
          height: 280,
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('https://images.unsplash.com/photo-1769081655407-25b437599f06?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
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
          ABOUT US
        </Typography>
        <Divider
          sx={{
            width: { xs: 160, md: 220 },
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

      <Box>
        {/* VISION / MISSION */}
        <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
          <Box
            alignItems="center"
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              p: 4,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1552471701-a4d29e7ae8d8?w=600&auto=format&fit=crop&q=60"
                alt="Founder"
                sx={{
                  // width: { xs: "70%", md: "60%" },
                  // maxWidth: 300,
                  borderRadius: 2,
                  boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
                  width: "300px",
                  height: "400px",
                  zIndex: 2,
                }}
              />

              <Box
                sx={{
                  backgroundColor: "#D4A373",
                  mt: -1,
                  px: 3,
                  py: 1.5,
                  textAlign: "center",
                  width: "100%",
                }}
              >
                <Typography sx={{ fontWeight: 700 }}>
                  Dr. Mohamed Kutty Nechikatte
                </Typography>
                <Typography fontSize={13}>Chairman</Typography>
              </Box>
            </Box>
            <Box sx={{ pl: { xs: 0, md: 10 }, mt: { xs: 5, md: 0 } }}>
              <Typography
                sx={{ fontWeight: 800, fontSize: 22, mb: 0, color: "#3B2416" }}
              >
                OUR VISION
              </Typography>
              <Divider
                sx={{
                  width: 60,
                  borderColor: "#D4A373",
                  borderBottomWidth: 4,
                  mb: 2,
                }}
              />
              <Typography sx={{ color: "#6F4E37", lineHeight: 1.8 }}>
                To become the first choice of customers for dates, dry fruits,
                nuts and premium delicacies by delivering unmatched quality
                across India.
              </Typography>

              <Typography
                sx={{
                  fontWeight: 800,
                  fontSize: 22,
                  mt: 4,
                  mb: 0,
                  color: "#3B2416",
                }}
              >
                OUR MISSION
              </Typography>
              <Divider
                sx={{
                  width: 100,
                  borderColor: "#D4A373",
                  borderBottomWidth: 4,
                  mb: 2,
                }}
              />
              <Typography sx={{ color: "#6F4E37", lineHeight: 1.8 }}>
                To source, process and deliver products with honesty, purity and
                care — without compromising on taste or quality.
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* IMAGE + CONTENT */}
      <Box
        sx={{
          backgroundColor: "#F5EDE3",
          py: { xs: 6, md: 10 },
          borderTop: "3px solid #6F4E37",
          borderBottom: "3px solid #6F4E37",
          mb: 5,
        }}
      >
        <Container maxWidth="lg">
          <Box
            alignItems="center"
            display={"flex"}
            sx={{ flexDirection: { xs: "column", md: "row" } }}
          >
            <Grid item xs={12} md={4}>
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1645869794108-400133a0c1c6?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Store"
                sx={{
                  width: "80%",
                  borderRadius: 2,
                }}
              />
            </Grid>

            <Grid
              item
              xs={12}
              md={6}
              sx={{ width: "100%", mt: { xs: 3, md: 0 } }}
            >
              <Typography
                sx={{ fontWeight: 800, fontSize: 22, color: "#3B2416" }}
              >
                NUTTIEST PEOPLE AROUND
              </Typography>
              <Divider
                sx={{
                  width: 150,
                  borderColor: "#D4A373",
                  borderBottomWidth: 4,
                  mb: 2,
                }}
              />
              <Typography sx={{ color: "#6F4E37", lineHeight: 1.8, mb: 3 }}>
                We respect nature and believe in delivering products that are
                hygienic, organic and responsibly sourced from the finest
                regions across the world.
              </Typography>

              <Button
                sx={{
                  backgroundColor: "#3B2416",
                  color: "white",
                  fontWeight: 700,
                  px: 4,
                  "&:hover": { backgroundColor: "#3B2416" },
                }}
              >
                Check Out The Store
              </Button>
            </Grid>
          </Box>
        </Container>
      </Box>

      {/* WATCH OUR STORY */}
      <Box
        sx={{
          height: 380,
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url('/assets/story.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <Container>
          <Typography
            sx={{
              color: "#fff",
              fontSize: 26,
              fontWeight: 800,
              mb: 2,
            }}
          >
            WATCH OUR STORY
          </Typography>

          <Typography
            sx={{
              color: "#eee",
              maxWidth: 600,
              mx: "auto",
              lineHeight: 1.8,
            }}
          >
            An exclusive brand delivering premium dates and dry fruits with
            love, honesty and tradition since 2013.
          </Typography>

          <Box
            sx={{
              mt: 4,
              width: 60,
              height: 60,
              borderRadius: "50%",
              backgroundColor: "#fff",
              mx: "auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            ▶
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default About;
