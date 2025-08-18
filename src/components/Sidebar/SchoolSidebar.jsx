import React from "react";
import "./SchoolSidebar.css";
import { FaHome, FaBriefcase } from "react-icons/fa";
import { FiCheckSquare } from "react-icons/fi";
import { MdOutlineManageAccounts } from "react-icons/md";
import { NavLink } from "react-router-dom";
import { useSidebar } from "../../context/SidebarContext";
import { IoChevronDown } from "react-icons/io5";

const SchoolSidebar = ({ isExpanded }) => {
  const { isExpanded: expanded, toggleSidebar, openDropdown, toggleDropdown } =
    useSidebar();

  const handleOfficesClick = () => {
    if (!isExpanded) toggleSidebar(true);
    toggleDropdown("offices"); // 👈 controlled by context
  };

  return (
    <aside className={`sidebar ${isExpanded ? "expanded" : ""}`}>
      <nav className="sidebar-nav">
        <ul>
          {/* Home */}
          <li>
            <NavLink
              to="/home"
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
              end
            >
              <FaHome className="sidebar-icon" />
              {isExpanded && <span className="sidebar-text">Home</span>}
            </NavLink>
          </li>

          {/* To-do */}
          <li>
            <NavLink
              to="/todo"
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
            >
              <FiCheckSquare className="sidebar-icon" />
              {isExpanded && <span className="sidebar-text">To-do</span>}
            </NavLink>
          </li>

          {/* Offices dropdown */}
          <li>
            <button
              className="sidebar-link dropdown-toggle"
              onClick={handleOfficesClick}
            >
              <FaBriefcase className="sidebar-icon" />
              {isExpanded && (
                <>
                  <span className="sidebar-text">Offices</span>
                  <IoChevronDown
                    className={`dropdown-icon ${
                      openDropdown === "offices" ? "open" : ""
                    }`}
                  />
                </>
              )}
            </button>

            {/* Dropdown items */}
            {isExpanded && openDropdown === "offices" && (
              <ul className="sidebar-submenu">
                <li>
                  <NavLink
                    to="/SGOD"
                    className={({ isActive }) =>
                      `sidebar-link sub-link ${isActive ? "active" : ""}`
                    }
                  >
                    SGOD (School Gover…)
                  </NavLink>
                </li>
              </ul>
            )}
          </li>

          {/* Manage Account */}
          <li>
            <NavLink
              to="/manage-account"
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
            >
              <MdOutlineManageAccounts className="sidebar-icon" />
              {isExpanded && (
                <span className="sidebar-text">Manage Account</span>
              )}
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default SchoolSidebar;
