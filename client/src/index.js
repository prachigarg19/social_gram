import React from "react";
import ReactDOM from "react-dom";
import { AuthContextProvider } from "./contexts/AuthContext";
import App from "./App";
import { LayoutContextProvider } from "./contexts/LayoutContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AuthContextProvider>
    <LayoutContextProvider>
      <App />
    </LayoutContextProvider>
  </AuthContextProvider>
);
