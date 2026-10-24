import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { initTheme } from './components/ThemeToggle';
import { BrowserRouter } from "react-router-dom";
import { SiteContentProvider } from "./context/SiteContentContext";

import "./index.css";
import App from "./App.jsx";

// Apply dark/light theme before initial paint to eliminate flash
initTheme();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <SiteContentProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </SiteContentProvider>
  </StrictMode>
);