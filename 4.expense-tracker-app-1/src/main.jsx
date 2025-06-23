import { Provider } from "@/components/ui/provider";

import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import theme from "./theme";
import GlobalState from "./context";

createRoot(document.getElementById("root")).render(
  <GlobalState>
    <Provider theme={theme}>
      <App />
    </Provider>
  </GlobalState>
);
