import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import NavbarLayout from "./layout/NavbarLayout";
// import About from "./pages/about";
// import Gallery from "./pages/gallery";
// import NotFound from "./pages/NotFound";

function App() {
  return (
    <Routes>
      <Route element={<NavbarLayout />}>
        <Route path="/" element={<Home />} />
        {/* <Route path="/about" element={<Home />} /> */}
        {/* <Route path="*" element={<NotFound />} /> */}
      </Route>
    </Routes>
  );
}

export default App;
