import React, { useContext, useEffect, useState } from "react";
import "./feed.css";
import Share from "../Share/Share";
import { Post } from "../Post/Post";
import { LayoutContext } from "../../contexts/LayoutContext";

const Feed = ({ username }) => {
  const [posts, setPosts] = useState(null);
  const { isMobile, openLeftMenu, openRightMenu } = useContext(LayoutContext);
  useEffect(() => {
    fetch(
      `${
        username
          ? `http://localhost:8800/api/posts/profile/${username}`
          : "http://localhost:8800/api/posts/timeline/643283848c419483abc8e1df"
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
        // setPosts(
        //   data.sort(
        //     (post1, post2) =>
        //       new Date(post2.createdAt) - new Date(post1.createdAt)
        //   )
        // );
        setPosts(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [username]);

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
