import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import NavbarLayout from "./layout/NavbarLayout";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";
import Account from "./pages/Account";

function App() {
  return (
    <Routes>
      <Route element={<NavbarLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/profile" element={<Account />} />
        {/* <Route path="*" element={<NotFound />} /> */}
      </Route>
    </Routes>
  );
}

export default App;
