import React, { useContext, useEffect, useState } from "react";
import "./feed.css";
import Share from "../Share/Share";
import { Post } from "../Post/Post";
import { LayoutContext } from "../../contexts/LayoutContext";
import { AuthContext } from "../../contexts/AuthContext";

const Feed = ({ username }) => {
  const [posts, setPosts] = useState(null);
  const { user } = useContext(AuthContext);
  const { isMobile, openLeftMenu, openRightMenu } = useContext(LayoutContext);
  useEffect(() => {
    fetch(
      `${
        username
          ? `http://localhost:8800/api/posts/profile/${username}`
          : `http://localhost:8800/api/posts/timeline/${user?._id}`
      }`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setPosts(
          data.sort(
            (post1, post2) =>
              new Date(post2.createdAt) - new Date(post1.createdAt)
          )
        );
        setPosts(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [username, user?.id]);

  return (
    <div
      className={
        isMobile && (openLeftMenu || openRightMenu) ? "hideFeed" : "feed"
      }
    >
      <div className="feedWrapper">
        <Share />
        {posts && posts.map((p) => <Post key={p._id} post={p} />)}
      </div>
    </div>
  );
};

export default Feed;
