import React, { useContext, useRef, useState } from "react";
import "../Login/login.css";
import { AuthContext } from "../../contexts/AuthContext";
import { LoginCall } from "../../apiCalls";
import { CircularProgress } from "@mui/material";
import { Link } from "react-router-dom";
import CustomSnackbar from "../../components/Snackbar/CustomSnackbar";

const Register = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const usernameRef = useRef();
  const repeatPasswordRef = useRef();
  const { dispatch, isFetching } = useContext(AuthContext);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [error, setError] = useState();
  const [customBarText, setCustomBarText] = useState("");

  const closeSnackBar = () => {
    setError(false);
    setCustomBarText("");
    setShowSnackbar(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let status = 200;
    const username = usernameRef.current.value;
    const password = passwordRef.current.value;
    const email = emailRef.current.value;
    if (passwordRef.current.value !== repeatPasswordRef.current.value) {
      setError(true);
      setCustomBarText("Password do not match!");
      setShowSnackbar(true);
      return;
    }
    if (!username || !email || !password) return;
    const data = {
      username: username,
      password: password,
      email: email,
    };

    fetch("http://localhost:8800/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          status = response.status;
          throw new Error("HTTP status " + response.status);
        }
        return response.json();
      })
      .then((data) => {
        addContextValue(emailRef.current.value, passwordRef.current.value);
        setCustomBarText("Account Created Successfully");
        setShowSnackbar(true);
      })
      .catch((error) => {
        setError(true);
        setShowSnackbar(true);
        if (status === 409) setCustomBarText("User Already Exists!");
        else if (status === 500) setCustomBarText("Server Error!");
        else setCustomBarText("Check your Internet Connection");
      });
  };

  const addContextValue = async (email, password) => {
    const userCredentials = {
      email: email,
      password: password,
    };
    try {
      await LoginCall(userCredentials, dispatch);
    } catch (e) {
      console.log(e);
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
        <div className="loginRight">
          <div className="loginBox">
            <input
              placeholder="Username"
              className="loginInput"
              ref={usernameRef}
            />
            <input placeholder="Email" className="loginInput" ref={emailRef} />
            <input
              placeholder="Password"
              className="loginInput"
              type="password"
              ref={passwordRef}
            />
            <input
              placeholder="Password Again"
              className="loginInput"
              type="password"
              ref={repeatPasswordRef}
            />
            <button className="loginButton" onClick={handleSubmit}>
              {isFetching ? (
                <CircularProgress color="inherit" size={20} />
              ) : (
                "Sign Up"
              )}
            </button>
            <Link
              to="/login"
              style={{ display: "flex", justifyContent: "center" }}
            >
              <button className="loginRegisterButton">Log into Account</button>
            </Link>
          </div>
        </div>
      </div>
      <CustomSnackbar
        snackbarText={customBarText}
        isVisible={showSnackbar}
        status={error ? "error" : "success"}
        onCloseFunction={closeSnackBar}
      />
    </div>
  );
};

export default Register;
