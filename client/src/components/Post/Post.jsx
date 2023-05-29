import React, { useContext, useEffect } from "react";
import { useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import "./post.css";
import { Link } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { format } from "timeago.js";

export const Post = ({ post }) => {
  const { user, token } = useContext(AuthContext);
  const [like, setLike] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(post.likes.includes(user?._id));
  const [currentPostUser, setCurrentPostUser] = useState({});
  const [isReady, setIsReady] = useState(false);
  const [postImg, setpostImg] = useState("");
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  useEffect(() => {
    //fetch user who has posted the post
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
  //fetch image from firebase server
  const fetchImage = async (fileName) => {
    const imageResponse = await fetch(
      `http://localhost:8800/api/images/${fileName}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (imageResponse.ok) {
      const imageBlob = await imageResponse.blob();
      setpostImg(URL.createObjectURL(imageBlob));
    } else {
      setpostImg(null);
    }
  };

  useEffect(() => {
    const fileName = decodeURIComponent(post.img).split("/").pop();
    fetchImage(fileName);
  }, []);

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
          <img className="postImg" src={postImg} alt="" />
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
