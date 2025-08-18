import React from "react";
import { useNavigate } from "react-router-dom";
import "./SchoolHeader.css";
import { GiHamburgerMenu } from "react-icons/gi";
import logo from "../../assets/images/logo-w-text.png";
import { FaUserCircle } from "react-icons/fa";
import { IoChevronDownCircle } from "react-icons/io5";

const SchoolHeader = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const handleLogoClick = () => {
    navigate("/"); // Navigates to the startup page
  };

  return (
    <header className="app-header">
      <div className="header-left">
        <button className="menu-btn" onClick={toggleSidebar}>
          <GiHamburgerMenu className="menu-icon" />
        </button>
        <div className="header-logo">
          <div className="header-logo-container" onClick={handleLogoClick}>
            <img src={logo} className="logo-w-text" alt="Logo" />
          </div>
        </div>
      </div>

      {/* Profile Button */}
      <div className="header-right">
        <button className="profile-btn">
          <div className="profile-icon-wrapper">
            <FaUserCircle className="profile-main-icon" />
            <IoChevronDownCircle className="profile-sub-icon" />
          </div>
        </button>
      </div>
    </header>
  );
};

export default SchoolHeader;
