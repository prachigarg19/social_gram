import { createContext, useEffect, useReducer, useState } from "react";
import AuthReducer from "./AuthReducer";

const INITIAL_STATE = {
  user: null,
  isFetching: false,
  error: false,
};

export const AuthContext = createContext(INITIAL_STATE);

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [token, setToken] = useState(null);
  const [profileImg, setProfileImg] = useState("");
  const [coverImg, setCoverImg] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    setToken(token);
    fetch("http://localhost:8800/api/auth/user", {
      headers: {
        "auth-token": token,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle the user information
        setLoggedInUser(data.user);
      })
      .catch((error) => {
        // Handle any errors
        console.error(error);
      });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user: state.user || loggedInUser,
        isFetching: state.isFetching,
        error: state.error,
        dispatch,
        token: token,
        profileImg: profileImg,
        coverImg: coverImg,
        setProfileImg: setProfileImg,
        setCoverImg: setCoverImg,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
