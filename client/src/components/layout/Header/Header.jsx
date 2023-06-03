import "./header.css";
import SearchIcon from "@mui/icons-material/Search";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../../contexts/AuthContext";
import MenuIcon from "@mui/icons-material/Menu";
import { useEffect, useState } from "react";
import { LayoutContext } from "../../../contexts/LayoutContext";
import MailIcon from "@mui/icons-material/Mail";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";

export default function Header() {
  const { user, profileImg } = useContext(AuthContext);
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
            <PermIdentityIcon onClick={() => handleRightBar()} />
            <span className="topbarIconBadge">1</span>
          </div>
          <div className="topbarIconItem">
            <ChatBubbleOutlineIcon color={"#516677"} />
            <span className="topbarIconBadge">2</span>
          </div>
          <div className="topbarIconItem">
            <NotificationsNoneIcon />
            <span className="topbarIconBadge">1</span>
          </div>
          <Link to={user?.username ? `/profile/${user?.username}` : "/"}>
            <img
              src={profileImg ? profileImg : `${PF}/person/noAvatar.png`}
              alt=""
              className="topbarImg topbarIconItem"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}
