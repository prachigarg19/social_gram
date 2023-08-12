import { createContext, useState } from "react";

export const ErrorHandlingContext = createContext(null);

export const ErrorHandlingContextProvider = ({ children }) => {
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [error, setError] = useState();
  const [customBarText, setCustomBarText] = useState("");

  const closeSnackBar = () => {
    setError(false);
    setCustomBarText("");
    setShowSnackbar(false);
  };

  return (
    <ErrorHandlingContext.Provider
      value={{
        showSnackbar,
        setShowSnackbar,
        customBarText,
        setCustomBarText,
        error,
        setError,
        closeSnackBar,
      }}
    >
      {children}
    </ErrorHandlingContext.Provider>
  );
};
