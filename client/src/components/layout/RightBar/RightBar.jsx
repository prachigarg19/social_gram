import React, { useState, useEffect, useContext } from "react";
import "./rightbar.css";
import { AuthContext } from "../../../contexts/AuthContext";
import { LayoutContext } from "../../../contexts/LayoutContext";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import fetchImage from "../../../imageUtils";
import { Link } from "react-router-dom";

const RightBar = ({ user }) => {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const { user: currentUser, dispatch, token } = useContext(AuthContext);
  const [friends, setFriends] = useState([]);
  const { isMobile, openRightMenu } = useContext(LayoutContext);
  const [isFollowing, setIsFollowing] = useState(
    currentUser?.following?.includes(user?._id)
  );
  const [friendsImg, setFriendsImg] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:8800/api/users/friends`, {
      method: "GET", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
        "auth-token": token,
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

  const fetchData = async (img) => {
    const postName = decodeURIComponent(img).split("/").pop();
    const postImageUrl = await fetchImage(postName, token);
    setFriendsImg((prevFriendsImg) => [
      ...(prevFriendsImg || []),
      postImageUrl,
    ]);
  };

  useEffect(() => {
    friends.map((friend) => fetchData(friend.profilePic));
  }, [friends]);

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
          {friends.length > 0 &&
            friends?.map((u, index) => (
              <li className="rightbarFriend">
                <div className="rightbarProfileImgContainer">
                  <img
                    className="rightbarProfileImg"
                    src={
                      friendsImg[index]
                        ? friendsImg[index]
                        : `${PF}/person/noAvatar.png`
                    }
                    alt=""
                  />
                  <span className="rightbarOnline"></span>
                </div>
                <span className="rightbarUsername">{u.username}</span>
              </li>
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
        <h4 className="rightbarTitle">Your friends</h4>
        <div className="rightbarFollowings">
          {friends.length > 0 &&
            friends?.map((u, index) => (
              <div className="rightbarFollowing" key={u._id}>
                <Link to={`/profile/${u?.username}`}>
                  <img
                    src={
                      friendsImg[index]
                        ? friendsImg[index]
                        : `${PF}/person/noAvatar.png`
                    }
                    alt=""
                    className="rightbarFollowingImg"
                  />
                </Link>
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
