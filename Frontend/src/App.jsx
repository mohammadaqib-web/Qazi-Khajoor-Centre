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
import './App.css'

function App() {
  return (
    <>
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

          {/* <Route path="*" element={<NotFound />} /> */}
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
