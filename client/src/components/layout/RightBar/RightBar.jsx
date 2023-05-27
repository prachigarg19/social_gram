import React, { useState, useEffect, useContext } from "react";
import "./rightbar.css";
import { Users } from "../../../dummyData";
import OnlineFriend from "../../OnlineFriend/OnlineFriend";
import { AuthContext } from "../../../contexts/AuthContext";
import { LayoutContext } from "../../../contexts/LayoutContext";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

const RightBar = ({ user }) => {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const { user: currentUser, dispatch, token } = useContext(AuthContext);
  const [friends, setFriends] = useState([]);
  const { isMobile, openRightMenu } = useContext(LayoutContext);
  const [isFollowing, setIsFollowing] = useState(
    currentUser?.following?.includes(user?._id)
  );

  useEffect(() => {
    fetch(`http://localhost:8800/api/users/friends/${user?._id}`, {
      method: "GET", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setFriends(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  const friendRequest = async () => {
    try {
      const response = await fetch(
        `http://localhost:8800/api/users/${user?._id}/${
          isFollowing ? "unfollow" : "follow"
        }`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "auth-token": token,
          },
        }
      );
      const data = await response.json();
      dispatch({
        type: `${isFollowing ? "UNFOLLOW" : "FOLLOW"}`,
        payload: user._id,
      });
      setIsFollowing(!isFollowing);
    } catch (err) {
      console.log(err);
    }
  };

  const HomeRightbar = () => {
    return (
      <>
        <div className="birthdayContainer">
          <img className="birthdayImg" src={`${PF}/gift.png`} alt="" />
          <span className="birthdayText">
            <b>Pola Foster</b> and <b>3 other friends</b> have a birhday today.
          </span>
        </div>
        <img className="rightbarAd" src={`${PF}/ad.png`} alt="" />
        <h4 className="rightbarTitle">Online Friends</h4>
        <ul className="rightbarFriendList">
          {Users.map((u) => (
            <OnlineFriend key={u.id} user={u} />
          ))}
        </ul>
      </>
    );
  };
  const ProfileRightbar = () => {
    return (
      <>
        {user?.username !== currentUser?.username && (
          <button className="followButton" onClick={friendRequest}>
            {isFollowing ? "Unfollow" : "Follow"}
            {isFollowing ? <RemoveIcon /> : <AddIcon />}
          </button>
        )}
        <h4 className="rightbarTitle">User information</h4>
        <div className="rightbarInfo">
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">City:</span>
            <span className="rightbarInfoValue">{user?.city}</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">From:</span>
            <span className="rightbarInfoValue">{user?.from}</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">Relationship status:</span>
            <span className="rightbarInfoValue">{user?.relationship}</span>
          </div>
        </div>
        <h4 className="rightbarTitle">User friends</h4>
        <div className="rightbarFollowings">
          {friends?.map((u) => (
            <div className="rightbarFollowing" key={u._id}>
              <img
                src={
                  u.profilePic ? PF + u.profilePic : PF + "person/noAvatar.png"
                }
                alt=""
                className="rightbarFollowingImg"
              />
              <span className="rightbarFollowingName">{u?.username}</span>
            </div>
          ))}
        </div>
      </>
    );
  };
  return (
    <div
      className={
        isMobile
          ? openRightMenu
            ? "fullScreenSidebar"
            : "hideRightSidebar"
          : "rightbar"
      }
    >
      <div className="rightbarWrapper">
        {user ? <ProfileRightbar /> : <HomeRightbar />}
      </div>
    </div>
  );
};

export default RightBar;
