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

  const handleSignOut = async () => {
    try {
      // Get the access token from wherever you store it (e.g., sessionStorage or a context)
      const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
      const accessToken = currentUser?.access_token; // assuming you store it here

      if (!accessToken) {
        console.warn("No access token found. Proceeding with local logout.");
      } else {
        // Call the backend logout endpoint
        const response = await fetch("/api/auth/logout", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          credentials: "include", // Important: to send cookies with the request
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error("Logout API error:", errorData.detail || "Unknown error");
          // Optionally show a toast/notification about partial logout
        }
      }
    } catch (error) {
      console.error("Failed to call logout API:", error);
      // Still proceed to clear local state — better to log out locally than leave user stuck
    } finally {
      // Clear frontend session regardless of API success
      sessionStorage.removeItem("currentUser");
      setCurrentUser(null);
      setAvatarProps(null);

      // Redirect based on role
      const role = currentUser?.role;
      if (role === "office") {
        window.location.replace("/login/office");
      } else {
        window.location.replace("/login/school");
      }

      setIsDropdownOpen(false);
    }
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