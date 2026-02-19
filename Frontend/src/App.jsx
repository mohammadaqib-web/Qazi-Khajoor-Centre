import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import NavbarLayout from "./layout/NavbarLayout";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";
import Account from "./pages/Account";
import AllProducts from "./pages/AllProducts";
import SingleProduct from "./pages/SingleProduct";
import AdminLayout from "./admin/AdminLayout";
import Dashboard from "./admin/Dashboard";
import Products from "./admin/Products";
import Orders from "./admin/Orders";
import Users from "./admin/Users";
import Category from "./admin/Category";
import PublicRoute from "./layout/PublicRoute";
import AdminProtectedRoute from "./utils/AdminProtectedRoute";
import ScrollToTop from "./utils/ScrollToTop";
import "./App.css";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import PageLoader from "./components/PageLoader";

function App() {
  const location = useLocation();
  const [loadingPage, setLoadingPage] = useState(false);

  const isAdminRoute = location.pathname.startsWith("/admin");

  useEffect(() => {
    if (isAdminRoute) return;

    setLoadingPage(true);

    const timer = setTimeout(() => {
      setLoadingPage(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [location.pathname, isAdminRoute]);

  return (
    <>
      {loadingPage && <PageLoader />}

      <ScrollToTop />

      <Routes>
        <Route element={<NavbarLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route element={<PublicRoute />}>
            <Route path="/auth" element={<Auth />} />
          </Route>
          <Route path="/profile" element={<Account />} />
          <Route path="/allProducts" element={<AllProducts />} />
          <Route path="/:category/:id" element={<AllProducts />} />
          <Route path="/product/:id" element={<SingleProduct />} />
        </Route>

        <Route element={<AdminProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="orders" element={<Orders />} />
            <Route path="users" element={<Users />} />
            <Route path="category" element={<Category />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
