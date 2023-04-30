import React from "react";
import "./feed.css";
import Share from "../Share/Share";
import { Posts } from "../../dummyData";
import { Post } from "../Post/Post";

const Feed = () => {
  return (
    <div className="feed">
      <div className="feedWrapper">
        <Share />
        {Posts.map((p) => (
          <Post key={p.id} post={p} />
        ))}
      </div>
    </div>
  );
};

export default Feed;
