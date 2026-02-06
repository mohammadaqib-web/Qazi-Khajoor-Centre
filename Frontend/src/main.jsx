import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { CssBaseline, ThemeProvider } from "@mui/material";
import theme from "./theme.js";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <ThemeProvider theme={theme}>
    <BrowserRouter>
      <CssBaseline />
      <App />
    </BrowserRouter>
  </ThemeProvider>,
);
