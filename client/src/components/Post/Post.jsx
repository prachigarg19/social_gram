import React, { useLayoutEffect } from "react";
import { useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import "./post.css";
import { Link } from "react-router-dom";

export const Post = ({ post }) => {
  const [like, setLike] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(false);
  const [user, setUser] = useState({});
  const [isReady, setIsReady] = useState(false);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  useLayoutEffect(() => {
    setIsReady(false);
    fetch(`http://localhost:8800/api/users?userId=${post.userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setUser(Object.assign(user, data));
        setIsReady(true);
        // console.log(user);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [user]);
  const likeHandler = () => {
    setLike(isLiked ? like - 1 : like + 1);
    setIsLiked(!isLiked);
  };

  return isReady ? (
    <div className="post">
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            <Link to={`/profile/${user.username}`}>
              <img
                className="postProfileImg"
                //find user with id who posted the picture
                src={PF + user?.profilePic || "/person/noAvatar.png"}
                alt=""
              />
            </Link>
            <span className="postUsername">{user?.username}</span>
            <span className="postDate">{post.date}</span>
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
            <span className="postLikeCounter">{like} people liked it</span>
          </div>
          {/* <div className="postBottomRight">
            <span className="postCommentText">{post.comment} comments</span>
          </div> */}
        </div>
      </div>
    </div>
  ) : null;
};
