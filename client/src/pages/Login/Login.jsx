import React, { useContext, useRef } from "react";
import "./login.css";
import { AuthContext } from "../../contexts/AuthContext";
import { LoginCall } from "../../apiCalls";
import { CircularProgress } from "@mui/material";
import { Link } from "react-router-dom";
import { ErrorHandlingContext } from "../../contexts/ErrorHandlingContext";
import CustomSnackbar from "../../components/Snackbar/CustomSnackbar";

const Login = () => {
  //use ref to access dom element input
  const emailRef = useRef();
  const passwordRef = useRef();
  const { dispatch, isFetching, user } = useContext(AuthContext);
  const {
    error,
    setError,
    customBarText,
    setCustomBarText,
    showSnackbar,
    setShowSnackbar,
    closeSnackBar,
  } = useContext(ErrorHandlingContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userCredentials = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };
    try {
      if (userCredentials.email && userCredentials.password) {
        await LoginCall(userCredentials, dispatch);
      }
    } catch (e) {
      console.log(e);
    }
    if (!user) {
      setError(true);
      setCustomBarText("Invalid Credentials!");
      setShowSnackbar(true);
    }
  };
  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo">SocialGram</h3>
          <span className="loginDesc">
            Connect with friends and the world around you on SocialGram.
          </span>
        </div>
        <form className="loginRight">
          <div className="loginBox">
            <input
              placeholder="Email"
              type="email"
              className="loginInput"
              ref={emailRef}
            />
            <input
              placeholder="Password"
              type="password"
              className="loginInput"
              ref={passwordRef}
            />
            <button
              className="loginButton"
              onClick={handleSubmit}
              disabled={isFetching}
            >
              {isFetching ? (
                <CircularProgress color="inherit" size={20} />
              ) : (
                "Log In"
              )}
            </button>
            <span className="loginForgot">Forgot Password?</span>
            <Link
              to="/register"
              style={{ display: "flex", justifyContent: "center" }}
            >
              <button className="loginRegisterButton">
                Create a New Account
              </button>
            </Link>
          </div>
        </form>
        <CustomSnackbar
          snackbarText={customBarText}
          isVisible={showSnackbar}
          status={error ? "error" : "success"}
          onCloseFunction={closeSnackBar}
        />
      </div>
    </div>
  );
};

export default Login;
