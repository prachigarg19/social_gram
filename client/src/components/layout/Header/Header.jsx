import "./header.css";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../../contexts/AuthContext";
import MenuIcon from "@mui/icons-material/Menu";
import { useEffect, useState } from "react";
import { LayoutContext } from "../../../contexts/LayoutContext";

export default function Header() {
  const { user } = useContext(AuthContext);
  const {
    isMobile,
    openLeftMenu,
    setOpenLeftMenu,
    openRightMenu,
    setOpenRightMenu,
  } = useContext(LayoutContext);

  const handleLeftBar = () => {
    setOpenLeftMenu(!openLeftMenu);
    setOpenRightMenu(false);
  };

  const handleRightBar = () => {
    setOpenRightMenu(!openRightMenu);
    setOpenLeftMenu(false);
  };

  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  return (
    <div className="topbarContainer">
      <div className="topbarLeft">
        <Link to="/">
          <span className="logo">SocialGram</span>
        </Link>

        <div className="searchbar">
          <SearchIcon className="searchIcon" />
          <input
            placeholder="Search for friend, post or video"
            className="searchInput"
          />
        </div>
      </div>
      <div className="topbarRight">
        {/* <div className="topbarLinks">
          <span className="topbarLink">Homepage</span>
          <span className="topbarLink">Timeline</span>
        </div> */}
        <div className="topbarIcons">
          {isMobile && (
            <div className="topbarIconItem">
              <MenuIcon onClick={() => handleLeftBar()} />
            </div>
          )}
          <div className="topbarIconItem">
            <PersonIcon onClick={() => handleRightBar()} />
            <span className="topbarIconBadge">1</span>
          </div>
          <div className="topbarIconItem">
            <ChatBubbleIcon />
            <span className="topbarIconBadge">2</span>
          </div>
          <div className="topbarIconItem">
            <NotificationsIcon />
            <span className="topbarIconBadge">1</span>
          </div>
          <Link to={user?.username ? `/profile/${user?.username}` : "/"}>
            <img
              src={
                user?.profilePic
                  ? PF + user.profilePic
                  : PF + "person/noAvatar.png"
              }
              alt=""
              className="topbarImg topbarIconItem"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}
