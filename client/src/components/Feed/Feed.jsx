import React, { useContext, useEffect, useState } from "react";
import "./feed.css";
import Share from "../Share/Share";
import { Post } from "../Post/Post";
import { LayoutContext } from "../../contexts/LayoutContext";
import { AuthContext } from "../../contexts/AuthContext";
import { CircularProgress } from "@mui/material";

const Feed = ({ username }) => {
  const [posts, setPosts] = useState([]);
  const { user } = useContext(AuthContext);
  const { isMobile, openLeftMenu, openRightMenu } = useContext(LayoutContext);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTimelinePosts = () => {
    setIsLoading(true);
    fetch(
      `${
        username
          ? `http://localhost:8800/api/posts/profile/${username}?page=${page}`
          : `http://localhost:8800/api/posts/timeline/${user?._id}?page=${page}`
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
        setIsLoading(false);
        setPosts((prevPosts) => [...prevPosts, ...data]);
      })
      .catch((error) => {
        setIsLoading(false);
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    fetchTimelinePosts();
  }, [username, user?.id, page]);

  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  return (
    <div
      className={
        isMobile && (openLeftMenu || openRightMenu) ? "hideFeed" : "feed"
      }
    >
      <div className="feedWrapper">
        <Share />
        {posts.map((p) => (
          <Post key={p._id} post={p} />
        ))}
        {posts.length > 0 && (
          <div className="loadMorebuttonContainer">
            <button
              className="loadMoreButton"
              onClick={handleLoadMore}
              disabled={isLoading}
            >
              {isLoading ? (
                <CircularProgress color="inherit" size={20} />
              ) : (
                "Load more"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Feed;
