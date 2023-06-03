import React, { useEffect, useState, useContext } from "react";
import "./profile.css";
import Feed from "../../components/Feed/Feed";
import Header from "../../components/layout/Header/Header";
import LeftBar from "../../components/layout/LeftBar/LeftBar";
import RightBar from "../../components/layout/RightBar/RightBar";
import { useParams } from "react-router-dom";
import { LayoutContext } from "../../contexts/LayoutContext";
import { AuthContext } from "../../contexts/AuthContext";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { CircularProgress } from "@mui/material";
import fetchImage from "../../imageUtils";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  // bgcolor: "trans",
  border: "2px solid ",
  boxShadow: 24,
  zIndex: 999,
  pt: 2,
  px: 4,
  pb: 3,
};

const Profile = () => {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [user, setUser] = useState({});
  const [isReady, setIsReady] = useState(false);
  const { user: currentUser, token } = useContext(AuthContext);
  const { isMobile, openLeftMenu, openRightMenu } = useContext(LayoutContext);
  const { username } = useParams();
  const [isAdmin, setIsAdmin] = useState(false);
  const [profileFile, setProfileFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [open, setOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [profileImg, setProfileImg] = useState("");
  const [coverImg, setCoverImg] = useState("");
  const navigate = useNavigate();

  //display user information
  useEffect(() => {
    setIsReady(false);
    fetch(`http://localhost:8800/api/users?username=${username}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setUser(Object.assign(user, data));
        setIsReady(true);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [username]);

  useEffect(() => {
    setIsAdmin(currentUser?.username === username);
  }, [username, currentUser]);

  const updateProfile = async (type, file) => {
    console.log(type, file);
    if (!file) {
      alert("No file selected");
      return;
    }
    setIsUploading(true);
    const formData = new FormData();
    formData.append("img", file);
    formData.append("isAdmin", isAdmin);
    try {
      const response = await fetch(
        `http://localhost:8800/api/users/upload/${type}/${user?._id}`,
        {
          method: "PUT", // or 'PUT'
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );
      navigate(0);
      setIsUploading(false);
    } catch (err) {
      console.log(err);
      setIsUploading(false);
    }
    setProfileFile(null);
    setCoverFile(null);
  };

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
    if (!isReady) return;
    fetchData();
  }, [isReady]);

  const handleClose = () => {
    setOpen(false);
  };
  return (
    isReady && (
      <>
        <Header />
        <div className="profile">
          <LeftBar />
          <div className="profileRight">
            <div
              className={
                isMobile && (openLeftMenu || openRightMenu)
                  ? "hideProfile"
                  : "profileRightTop"
              }
            >
              <div className="profileCover">
                <div>
                  <img
                    className="profileCoverImg"
                    src={coverImg ? coverImg : `${PF}/person/noCover.png`}
                    alt=""
                  />
                  {isAdmin && (
                    <label htmlFor="coverFile" className="updateCoverPic">
                      <span>
                        <CameraAltIcon fontSize="small" />
                        Update Photo
                      </span>
                      <input
                        style={{ display: "none" }}
                        type="file"
                        id="coverFile"
                        accept=".png .jpg .jpeg"
                        onChange={(e) => {
                          setCoverFile(e.target.files[0]);
                          setProfileFile(null);
                          setOpen(true);
                        }}
                      />
                    </label>
                  )}
                </div>
                <div className="profilePicContainer">
                  <img
                    className="profileUserImg"
                    src={profileImg ? profileImg : `${PF}/person/noAvatar.png`}
                    alt=""
                  />
                </div>
              </div>

              <div className="profileInfo">
                <h4 className="profileInfoName">{user?.username}</h4>
                <span className="profileInfoDesc">{user?.desc}</span>
              </div>
              <div className="updateProfilePic">
                {isAdmin && (
                  <label htmlFor="profileFile">
                    <span>
                      <CameraAltIcon />
                      Upload Profile Photo
                    </span>
                    <input
                      style={{ display: "none" }}
                      type="file"
                      id="profileFile"
                      accept=".png .jpg .jpeg"
                      onChange={(e) => {
                        setProfileFile(e.target.files[0]);
                        setCoverFile(null);
                        setOpen(true);
                      }}
                    />
                  </label>
                )}
              </div>
              {(coverFile || profileFile) && (
                <Modal
                  open={open}
                  onClose={() => handleClose}
                  aria-labelledby="parent-modal-title"
                  aria-describedby="parent-modal-description"
                >
                  <Box sx={{ ...style, width: 400 }}>
                    <div className="postCenter">
                      {/* create pseudo url to preview image */}
                      <img
                        className="postImg"
                        src={URL.createObjectURL(coverFile || profileFile)}
                        alt=""
                      />

                      <button
                        onClick={() => {
                          if (profileFile)
                            updateProfile("profilePic", profileFile);
                          else if (coverFile)
                            updateProfile("coverPic", coverFile);
                        }}
                      >
                        {isUploading ? (
                          <CircularProgress color="inherit" size={13} />
                        ) : (
                          "Share"
                        )}
                      </button>
                      <button onClick={handleClose}>Cancel</button>
                    </div>
                  </Box>
                </Modal>
              )}
            </div>
            <div className="profileRightBottom">
              <Feed username={username} />
              <RightBar user={user} />
            </div>
          </div>
        </div>
      </>
    )
  );
};

export default Profile;
