import HeroSection from "../components/HeroSection";
import { Box } from "@mui/material";
import bgPattern from "../assets/bg.png";
import DatesMain from "../components/DatesMain";
import AboutStatsSection from "../components/AboutStatsSection";
import StorageInfoSection from "../components/StorageInfoSection";
import TestimonialsSection from "../components/TestimonialsSection";
import { useEffect, useState } from "react";
import axios from "axios";
import { useOutletContext } from "react-router-dom";

const API = import.meta.env.VITE_APP_API;

const Home = () => {
  const { categories } = useOutletContext();
  // const [categories, setCategories] = useState([]);
  const [productsByCategory, setProductsByCategory] = useState({});
  const [loading, setLoading] = useState(true);

  /* ---------------- FETCH CATEGORIES ---------------- */
  // useEffect(() => {
  //   const fetchCategories = async () => {
  //     try {
  //       const res = await axios.get(`${API}/categories`);
  //       setCategories(res.data.categories);
  //     } catch (error) {
  //       console.error("Error fetching categories", error);
  //     }
  //   };

  //   fetchCategories();
  // }, []);

  /* ---------------- FETCH PRODUCTS FOR EACH CATEGORY ---------------- */
  useEffect(() => {
    const fetchProductsForCategories = async () => {
      if (categories.length === 0) return;

      try {
        setLoading(true);

        const firstFour = categories.slice(0, 4);

        const responses = await Promise.all(
          firstFour.map((category) =>
            axios.get(
              `${API}/products/category/${category._id}?page=1&limit=8`,
            ),
          ),
        );

        const updatedProducts = {};

        responses.forEach((res, index) => {
          updatedProducts[firstFour[index]._id] = res.data.products;
        });

        setProductsByCategory(updatedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductsForCategories();
  }, [categories]);

  return (
    <Box sx={{ backgroundImage: `url(${bgPattern})` }}>
      <HeroSection />

      {categories.slice(0, 1).map((category) => (
        <DatesMain
          key={category._id}
          name={category.name.toUpperCase()}
          id={category._id}
          products={productsByCategory[category._id] || []}
          loading={loading}
        />
      ))}

      <AboutStatsSection />
      {categories.slice(1, 3).map((category) => (
        <DatesMain
          key={category._id}
          name={category.name.toUpperCase()}
          id={category._id}
          products={productsByCategory[category._id] || []}
          loading={loading}
        />
      ))}
      <StorageInfoSection />
      {categories.slice(3, 4).map((category) => (
        <DatesMain
          key={category._id}
          name={category.name.toUpperCase()}
          id={category._id}
          products={productsByCategory[category._id] || []}
          loading={loading}
        />
      ))}
      <TestimonialsSection />
    </Box>
  );
};

export default Home;
