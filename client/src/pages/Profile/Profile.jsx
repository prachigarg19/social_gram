import React from "react";
import "./profile.css";
import Feed from "../../components/Feed/Feed";
import Header from "../../components/layout/Header/Header";
import LeftBar from "../../components/layout/LeftBar/LeftBar";
import RightBar from "../../components/layout/RightBar/RightBar";
const Profile = () => {
  return (
    <>
      <Header />
      <div className="profile">
        <LeftBar />
        <div className="profileRight">
          <div className="profileRightTop">
            <div className="profileCover">
              <img
                className="profileCoverImg"
                src="assets/post/3.jpeg"
                alt=""
              />
              <img
                className="profileUserImg"
                src="assets/person/7.jpeg"
                alt=""
              />
            </div>
            <div className="profileInfo">
              <h4 className="profileInfoName">Safak Kocaoglu</h4>
              <span className="profileInfoDesc">Hello my friends!</span>
            </div>
          </div>
          <div className="profileRightBottom">
            <Feed />
            <RightBar profile />
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
