import { useContext, useEffect } from "react";
import "./App.css";
import Home from "./pages/Home/Home";
import { AuthContext } from "./contexts/AuthContext";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Register from "./pages/Register/Register";
import Login from "./pages/Login/Login";
import Profile from "./pages/Profile/Profile";
import fetchImage from "./imageUtils";

function App() {
  const { user, token, setCoverImg, setProfileImg } = useContext(AuthContext);

  const fetchData = async () => {
    const coverfileName = decodeURIComponent(user?.coverPic).split("/").pop();
    if (coverfileName !== undefined) {
      const coverImg = await fetchImage(coverfileName, token);
      setCoverImg(coverImg);
    }

    const profilefileName = decodeURIComponent(user?.profilePic)
      .split("/")
      .pop();
    if (profilefileName !== undefined) {
      const profileImg = await fetchImage(profilefileName, token);
      setProfileImg(profileImg);
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchData();
  }, [user]);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={user ? <Home /> : <Navigate to="/register" />}
        />
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route
          path="/register"
          element={user ? <Navigate to="/" /> : <Register />}
        />
        <Route path="/profile/:username" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;
