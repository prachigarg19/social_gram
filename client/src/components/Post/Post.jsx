import React, { useContext, useEffect } from "react";
import { useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import "./post.css";
import { Link } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { format } from "timeago.js";

export const Post = ({ post }) => {
  const { user } = useContext(AuthContext);
  const [like, setLike] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(post.likes.includes(user._id));
  const [currentPostUser, setCurrentPostUser] = useState({});
  const [isReady, setIsReady] = useState(false);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  useEffect(() => {
    setIsReady(false);
    fetch(`http://localhost:8800/api/users?userId=${post.userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setCurrentPostUser(Object.assign(currentPostUser, data));
        setIsReady(true);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [post.userId, currentPostUser]);

  const likeHandler = () => {
    const data = {
      userId: user._id,
    };
    fetch(`http://localhost:8800/api/posts/${post._id}/like`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
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

  return isReady ? (
    <div className="post">
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            <Link to={`/profile/${currentPostUser.username}`}>
              <img
                className="postProfileImg"
                //find currentPostUser with id who posted the picture
                src={PF + currentPostUser?.profilePic || "/person/noAvatar.png"}
                alt=""
              />
            </Link>
            <span className="postUsername">{currentPostUser?.username}</span>
            <span className="postDate">{format(post.createdAt)}</span>
          </div>
          <div className="postTopRight">
            <MoreVertIcon />
          </div>
        </div>
        <div className="postCenter">
          <span className="postText">{post?.desc}</span>
          <img className="postImg" src={PF + post.img} alt="" />
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
