import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import NavbarLayout from "./layout/NavbarLayout";
import About from "./pages/About";
import Contact from "./pages/Contact";
function App() {
  return (
    <Routes>
      <Route element={<NavbarLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        {/* <Route path="*" element={<NotFound />} /> */}
      </Route>
    </Routes>
  );
}

export default App;
