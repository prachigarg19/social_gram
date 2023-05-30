import "./share.css";
import React, { useContext, useRef, useState } from "react";
import PermMediaIcon from "@mui/icons-material/PermMedia";
import LabelIcon from "@mui/icons-material/Label";
import RoomIcon from "@mui/icons-material/Room";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import { AuthContext } from "../../contexts/AuthContext";
import CustomSnackbar from "../Snackbar/CustomSnackbar";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";

const Share = () => {
  const { user, token } = useContext(AuthContext);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const descRef = useRef();
  const [file, setFile] = useState(null);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const clearFields = () => {
    setFile(null);
    descRef.current.value = "";
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("img", file);
    formData.append("desc", descRef.current.value || "");
    formData.append("userId", user._id);
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:8800/api/posts", {
        method: "POST", // or 'PUT'
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      setShowSnackbar(true);
      setIsLoading(false);
      navigate(0);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };

  return (
    <div className="share">
      <div className="shareWrapper">
        <div className="shareTop">
          <img
            className="shareProfileImg"
            src={
              user?.profilePic
                ? PF + user.profilePic
                : PF + "person/noAvatar.png"
            }
            alt=""
          />
          <input
            placeholder={`What's in your mind ${user?.username || ""}?`}
            className="shareInput"
            ref={descRef}
          />
        </div>
        {file && (
          <div className="postCenter">
            {/* create pseudo url to preview image */}
            <img className="postImg" src={URL.createObjectURL(file)} alt="" />
          </div>
        )}
        <hr className="shareHr" />
        <form className="shareBottom" onSubmit={(e) => handlePostSubmit(e)}>
          <div className="shareOptions">
            <label htmlFor="file" className="shareOption">
              <PermMediaIcon htmlColor="tomato" className="shareIcon" />
              <span className="shareOptionText">Photo or Video</span>
              <input
                style={{ display: "none" }}
                type="file"
                id="file"
                accept=".png .jpg .jpeg"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </label>
            <div className="shareOption">
              <LabelIcon htmlColor="blue" className="shareIcon" />
              <span className="shareOptionText">Tag</span>
            </div>
            <div className="shareOption">
              <RoomIcon htmlColor="green" className="shareIcon" />
              <span className="shareOptionText">Location</span>
            </div>
            <div className="shareOption">
              <EmojiEmotionsIcon htmlColor="goldenrod" className="shareIcon" />
              <span className="shareOptionText">Feelings</span>
            </div>
          </div>
          <div className="shareButtonContainer">
            <button
              className={`shareButton${file ? "" : " disabledShareButton"}`}
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <CircularProgress color="inherit" size={13} />
              ) : (
                "Share"
              )}
            </button>
            <button className="shareButton" onClick={clearFields}>
              Cancel
            </button>
          </div>
        </form>
      </div>
      {showSnackbar && (
        <CustomSnackbar
          snackbarText={"Post has been shared successfully!"}
          isVisible={showSnackbar}
        />
      )}
    </div>
  );
};

export default Share;
