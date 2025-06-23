import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import GlobalState from "./context/index.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <GlobalState>
        <App />
      </GlobalState>
    </BrowserRouter>
  </StrictMode>
);
