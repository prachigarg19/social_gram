import React from "react";
import ReactDOM from "react-dom";
import { AuthContextProvider } from "./contexts/AuthContext";
import App from "./App";
import { LayoutContextProvider } from "./contexts/LayoutContext";
import { ErrorHandlingContextProvider } from "./contexts/ErrorHandlingContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AuthContextProvider>
    <LayoutContextProvider>
      <ErrorHandlingContextProvider>
        <App />
      </ErrorHandlingContextProvider>
    </LayoutContextProvider>
  </AuthContextProvider>
);
