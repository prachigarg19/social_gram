import React, { useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const CustomSnackbar = ({
  snackbarText,
  isVisible,
  status,
  onCloseFunction,
}) => {
  return (
    <>
      <Snackbar
        open={isVisible}
        autoHideDuration={3000}
        onClose={onCloseFunction}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <div>
          <Alert
            elevation={6}
            variant="filled"
            onClose={onCloseFunction}
            severity={status}
          >
            {snackbarText}
          </Alert>
        </div>
      </Snackbar>
    </>
  );
};

export default CustomSnackbar;
