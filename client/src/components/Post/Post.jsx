import React, { useContext, useEffect } from "react";
import { useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import "./post.css";
import { Link } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { format } from "timeago.js";
import fetchImage from "../../imageUtils";
import { CircularProgress } from "@mui/material";

export const Post = ({ post }) => {
  const { user, token } = useContext(AuthContext);
  const [like, setLike] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(post.likes.includes(user?._id));
  const [isReady, setIsReady] = useState(true);
  const [postImg, setpostImg] = useState("");
  const [localProfileImg, setLocalProfileImg] = useState("");
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  const likeHandler = () => {
    //like-dislike post
    fetch(`http://localhost:8800/api/posts/${post._id}/like`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "auth-token": token,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (isLiked) {
          setLike(like - 1);
        } else {
          setLike(like + 1);
        }
        setIsLiked(!isLiked);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const fetchData = async () => {
    const postName = decodeURIComponent(post.img).split("/").pop();
    const postImageUrl = await fetchImage(postName, token);
    setpostImg(postImageUrl);
    const profileName = decodeURIComponent(post.user.profilePic)
      .split("/")
      .pop();
    const profileImgUrl = await fetchImage(profileName, token);
    setLocalProfileImg(profileImgUrl);
  };
  useEffect(() => {
    fetchData();
    setIsReady(true);
  }, []);

  return isReady ? (
    <div className="post">
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            <Link to={`/profile/${post.user.username}`}>
              <img
                className="postProfileImg"
                //find currentPostUser with id who posted the picture
                src={
                  localProfileImg
                    ? localProfileImg
                    : `${PF}/person/noAvatar.png`
                }
                alt=""
              />
            </Link>
            <span className="postUsername">{post.user?.username}</span>
            <span className="postDate">{format(post.createdAt)}</span>
          </div>
          <div className="postTopRight">
            <MoreVertIcon />
          </div>
        </div>
        <div className="postCenter">
          <span className="postText">{post?.desc}</span>
          {postImg ? (
            <img className="postImg" src={postImg} alt="" />
          ) : (
            <CircularProgress size={12} className="circularProgress" />
          )}
        </div>
        <div className="postBottom">
          <div className="postBottomLeft">
            <img
              className="likeIcon"
              src={`${PF}like.png`}
              onClick={likeHandler}
              alt=""
            />
            <img
              className="likeIcon"
              src={`${PF}heart.png`}
              onClick={likeHandler}
              alt=""
            />
            <span className="postLikeCounter">
              {isLiked
                ? `You and ${like - 1} people liked this post`
                : `${like} people liked this post`}{" "}
            </span>
          </div>
          {/* <div className="postBottomRight">
            <span className="postCommentText">{post.comment} comments</span>
          </div> */}
        </div>
      </div>
    </div>
  ) : null;
};
