// src/components/Header/Header.jsx
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";
import { GiHamburgerMenu } from "react-icons/gi";
import logo from "../../assets/images/logo-w-text.png";
import { FaUser, FaSignOutAlt, FaUserCircle } from "react-icons/fa";
import { IoChevronDownCircle } from "react-icons/io5";

const Header = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null); // ✅ Dynamic user
  const dropdownRef = useRef(null);

  // ✅ Load user from sessionStorage on mount
  useEffect(() => {
    const savedUser = sessionStorage.getItem("currentUser");
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    } else {
      // Optional: redirect to login if no user
      // navigate("/");
    }
  }, []);

  const handleLogoClick = () => {
    navigate("/");
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  // Close dropdown when clicking outside
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
    // ✅ Clear session and state
    sessionStorage.removeItem("currentUser");
    setCurrentUser(null);
    console.log("Signing out...");
    navigate("/");
    setIsDropdownOpen(false);
  };

  // ✅ Fallback if no user
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

      {/* Profile Dropdown */}
      <div className="header-right" ref={dropdownRef}>
        <button className="profile-btn" onClick={toggleDropdown}>
          <div className="profile-icon-wrapper">
            {currentUser.avatar ? (
              <img
                src={currentUser.avatar}
                alt="Profile"
                className="header-profile-avatar-img"
              />
            ) : (
              <FaUserCircle className="profile-main-icon" />
            )}
            <IoChevronDownCircle className="profile-sub-icon" />
          </div>
        </button>

        {isDropdownOpen && (
          <div className="profile-dropdown">
            <div className="profile-info">
              {currentUser.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt="Profile"
                  className="header-profile-avatar-img dropdown-avatar"
                />
              ) : (
                <FaUserCircle className="header-profile-avatar" />
              )}
              <div className="header-profile-details">
                <strong>{currentUser.firstName} {currentUser.lastName}</strong>
                <div className="profile-email">{currentUser.email}</div>
              </div>
            </div>
            <hr />
            <button className="dropdown-item" onClick={handleViewAccount}>
              <FaUser />
              View account
            </button>
            <hr />
            <button className="dropdown-item" onClick={handleSignOut}>
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