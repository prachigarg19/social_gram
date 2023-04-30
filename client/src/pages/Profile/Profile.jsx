import React, { useEffect, useState } from "react";
import "./profile.css";
import Feed from "../../components/Feed/Feed";
import Header from "../../components/layout/Header/Header";
import LeftBar from "../../components/layout/LeftBar/LeftBar";
import RightBar from "../../components/layout/RightBar/RightBar";
import { useParams } from "react-router-dom";

const Profile = () => {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [user, setUser] = useState({});
  const [isReady, setIsReady] = useState(false);
  const { username } = useParams();

  //display user information
  useEffect(() => {
    setIsReady(false);
    fetch(`http://localhost:8800/api/users?username=${username}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setUser(Object.assign(user, data));
        setIsReady(true);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [username]);
  return (
    isReady && (
      <>
        <Header />
        <div className="profile">
          <LeftBar />
          <div className="profileRight">
            <div className="profileRightTop">
              <div className="profileCover">
                <img
                  className="profileCoverImg"
                  src={`${PF}/${
                    user?.coverPic ? user.coverPic : "person/noCover.png"
                  }`}
                  alt=""
                />
                <img
                  className="profileUserImg"
                  src={`${PF}/${
                    user?.profilePic ? user.profilePic : "person/noAvatar.png"
                  }`}
                  alt=""
                />
              </div>
              <div className="profileInfo">
                <h4 className="profileInfoName">{user?.username}</h4>
                <span className="profileInfoDesc">{user?.desc}</span>
              </div>
            </div>
            <div className="profileRightBottom">
              <Feed username={username} />
              <RightBar profile />
            </div>
          </div>
        </div>
      </>
    )
  );
};

export default Profile;
