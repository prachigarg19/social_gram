import React, { useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const CustomSnackbar = ({ snackbarText, isVisible }) => {
  const [showSnackbar, setShowSnackbar] = useState(isVisible);
  return (
    <>
      <Snackbar
        open={showSnackbar}
        autoHideDuration={3000}
        onClose={() => setShowSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <div>
          <Alert
            elevation={6}
            variant="filled"
            onClose={() => setShowSnackbar(false)}
            severity="success"
          >
            {snackbarText}
          </Alert>
        </div>
      </Snackbar>
    </>
  );
};

export default CustomSnackbar;
