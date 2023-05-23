import React, { useContext, useRef } from "react";
import "../Login/login.css";
import { AuthContext } from "../../contexts/AuthContext";
import { LoginCall } from "../../apiCalls";
import { CircularProgress } from "@mui/material";
import { Link } from "react-router-dom";

const Register = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const usernameRef = useRef();
  const repeatPasswordRef = useRef();
  const { dispatch, isFetching } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const username = usernameRef.current.value;
    const password = passwordRef.current.value;
    const email = emailRef.current.value;
    if (passwordRef.current.value !== repeatPasswordRef.current.value) {
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
      .then((response) => response.json())
      .then((data) => {
        addContextValue(emailRef.current.value, passwordRef.current.value);
      })
      .catch((error) => {
        console.error("Error:", error);
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
    </div>
  );
};

export default Register;
