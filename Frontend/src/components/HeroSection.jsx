import { Box, Typography, Button, Container } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { heroSlides } from "./heroSlides";

const HeroSlider = () => {
  return (
    <Swiper
      modules={[Autoplay]}
      autoplay={{ delay: 3000, disableOnInteraction: false }}
      loop
      style={{ height: "85vh" }}
    >
      {heroSlides.map((slide, index) => (
        <SwiperSlide key={index}>
          <Box
            sx={{
              position: "relative",
              height: "85vh",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
            }}
          >
            {/* BLURRED BACKGROUND IMAGE */}
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                backgroundImage: `url(${slide.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                filter: "blur(3px)",
                transform: "scale(1.1)", // prevents blur edges
                zIndex: 0,
              }}
            />

            {/* ACTUAL IMAGE (sharp, contained) */}
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                // backgroundImage: `url(${slide.image})`,
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                zIndex: 1,
              }}
            />

            {/* Content */}
            <Container
              sx={{
                position: "relative",
                zIndex: 2,
                display: "flex",
                justifyContent: { xs: "center", md: "flex-end" },
              }}
            >
              <Box
                sx={{
                  maxWidth: 520,
                  color: "#3B2416",
                  border: "2px solid #3B2416",
                  p: { xs: 3, md: 5 },
                  textAlign: { xs: "center", md: "left" },
                  // backgroundColor:"whitesmoke"
                  // backdropFilter: "blur(10px)",
                  borderRadius: 4,
                  backgroundColor: "rgba(255,255,255,0.5)",
                }}
              >
                <Typography sx={{ fontSize: 15, mb: 1 }}>
                  {slide.subtitle}
                </Typography>

                <Typography
                  sx={{
                    fontSize: { xs: 28, md: 40 },
                    fontWeight: 600,
                    mb: 3,
                  }}
                >
                  {slide.title}
                </Typography>

                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "#3B2416",
                    // color: "#000",
                    fontWeight: 600,
                    px: 4,
                    py: 1.2,
                    color: "white",
                  }}
                >
                  {slide.cta}
                </Button>
              </Box>
            </Container>
          </Box>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default HeroSlider;
