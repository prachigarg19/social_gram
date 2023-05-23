export const LoginCall = async (userCredentials, dispatch) => {
  dispatch({ type: "LOGIN_START" });
  try {
    const response = await fetch("http://localhost:8800/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userCredentials),
    });
    const data = await response.json();
    localStorage.setItem("token", data.token);
    dispatch({ type: "LOGIN_SUCCESSFUL", payload: data.user });
  } catch (err) {
    dispatch({ type: "LOGIN_ERROR", payload: err });
  }
};

// http://localhost:8800/api/auth/login
