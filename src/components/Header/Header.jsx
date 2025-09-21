// src/components/Header/Header.jsx
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";
import { GiHamburgerMenu } from "react-icons/gi";
import logo from "../../assets/images/logo-w-text.png";
import { FaUser, FaSignOutAlt, FaUserCircle } from "react-icons/fa";
import { IoChevronDownCircle } from "react-icons/io5";
import { generateAvatar } from "../../utils/iconGenerator";

const Header = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [avatarProps, setAvatarProps] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const savedUser = sessionStorage.getItem("currentUser");
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setCurrentUser(user);
      
      if (!user.avatar) {
        const fullName = `${user.first_name} ${user.middle_name} ${user.last_name}`;
        setAvatarProps(generateAvatar(fullName));
      }
    }
  }, []);

  const handleLogoClick = () => {
    navigate("/");
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleViewAccount = () => {
    navigate("/manage-account");
    setIsDropdownOpen(false);
  };

  const handleSignOut = () => {
    sessionStorage.removeItem("currentUser");
    setCurrentUser(null);
    setAvatarProps(null);
    console.log("Signing out...");
    navigate("/");
    setIsDropdownOpen(false);
  };

  if (!currentUser) {
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
        <div className="header-right">
          <span className="profile-placeholder">Loading...</span>
        </div>
      </header>
    );
  }

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

      <div className="header-right" ref={dropdownRef}>
        <button className="profile-btn" onClick={toggleDropdown}>
          <div className="profile-icon-wrapper">
            {currentUser.avatar ? (
              <img
                src={currentUser.avatar}
                alt="Profile"
                className="header-profile-avatar-img"
              />
            ) : avatarProps ? (
              <div 
                className="generated-avatar"
                style={{ backgroundColor: avatarProps.color }}
              >
                {avatarProps.initials}
              </div>
            ) : (
              <FaUserCircle className="profile-main-icon" />
            )}
            <IoChevronDownCircle className="profile-sub-icon" />
          </div>
        </button>

        {isDropdownOpen && (
          <div className="prf-dropdown">
            <div className="prf-info">
              {currentUser.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt="Profile"
                  className="header-profile-avatar-img prf-avatar-generated"
                />
              ) : avatarProps ? (
                <div 
                  className="generated-avatar prf-avatar-generated"
                  style={{ backgroundColor: avatarProps.color }}
                >
                  {avatarProps.initials}
                </div>
              ) : (
                <FaUserCircle className="header-profile-avatar" />
              )}
              <div className="prf-details">
                <strong>{currentUser.first_name} {currentUser.middle_name} {currentUser.last_name}</strong>
                <div className="prf-email">{currentUser.email}</div>
              </div>
            </div>
            <hr />
            <button className="prf-dropdown-item" onClick={handleViewAccount}>
              <FaUser />
              View account
            </button>
            <hr />
            <button className="prf-dropdown-item" onClick={handleSignOut}>
              <FaSignOutAlt />
              Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;