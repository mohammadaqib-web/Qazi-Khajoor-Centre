// import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import { Box } from "@mui/material";
import bgPattern from "../assets/bg.png";
import DatesMain from "../components/DatesMain";
import AboutStatsSection from "../components/AboutStatsSection";
import StorageInfoSection from "../components/StorageInfoSection";
// import Footer from "../components/Footer";
import TestimonialsSection from "../components/TestimonialsSection";

const Home = () => {
  return (
    <Box sx={{ backgroundImage: `url(${bgPattern})` }}>
      {/* <Navbar /> */}
      <HeroSection />
      <DatesMain />
      <AboutStatsSection />
      <DatesMain />
      <DatesMain />
      <StorageInfoSection />
      <DatesMain />
      <TestimonialsSection />
      {/* <Footer /> */}
    </Box>
  );
};

export default Home;
