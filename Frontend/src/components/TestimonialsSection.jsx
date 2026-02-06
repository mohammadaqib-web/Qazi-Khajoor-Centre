import { Box, Container, Typography } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";
import { testimonials } from "./testimonialsData";

const TestimonialsSection = () => {
  return (
    <Box
      sx={{
        backgroundColor: "#F5EDE3",
        backgroundImage: "url('/assets/bg.png')",
        backgroundRepeat: "repeat",
        py: { xs: 6, md: 10 },
        textAlign: "center",
      }}
    >
      <Container maxWidth="md">
        {/* HEADING */}
        <Typography
          sx={{
            fontWeight: 900,
            fontSize: { xs: 22, md: 28 },
            color: "#000",
            mb: 2,
            letterSpacing: 1,
          }}
        >
          WHAT OUR CUSTOMER SAY
        </Typography>

        {/* SLIDER */}
        <Swiper
          modules={[Autoplay]}
          autoplay={{
            delay: 3500,
            disableOnInteraction: false,
          }}
          loop
        >
          {testimonials.map((item, index) => (
            <SwiperSlide key={index}>
              {/* QUOTE ICON */}
              <Typography
                sx={{
                  fontSize: 100,
                  color: "rgba(0,0,0,0.15)",
                  lineHeight: 1,
                  mt: -1,
                }}
              >
                “
              </Typography>

              {/* TESTIMONIAL TEXT */}
              <Typography
                sx={{
                  fontStyle: "italic",
                  fontSize: { xs: 14, md: 16 },
                  lineHeight: 1,
                  color: "#6F4E37",
                  mb: 3,
                  mt: -4,
                }}
              >
                {item.text}
              </Typography>

              {/* AUTHOR */}
              <Typography
                sx={{
                  fontWeight: 800,
                  color: "#3B2416",
                  letterSpacing: 1,
                }}
              >
                {item.author}
              </Typography>
            </SwiperSlide>
          ))}
        </Swiper>
      </Container>
    </Box>
  );
};

export default TestimonialsSection;
