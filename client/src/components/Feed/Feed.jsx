import React, { useEffect, useState } from "react";
import "./feed.css";
import Share from "../Share/Share";
import { Post } from "../Post/Post";

const Feed = ({ username }) => {
  const [posts, setPosts] = useState(null);
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
        setPosts(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [username]);

  return (
    <div className="feed">
      <div className="feedWrapper">
        <Share />
        {posts && posts.map((p) => <Post key={p._id} post={p} />)}
      </div>
    </div>
  );
};

export default Feed;
