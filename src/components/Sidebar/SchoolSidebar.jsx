import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { FaHome, FaBriefcase } from "react-icons/fa";
import { FiCheckSquare } from "react-icons/fi";
import { MdManageAccounts } from "react-icons/md";
import { IoChevronDown } from "react-icons/io5";
import { useSidebar } from "../../context/SidebarContext";
import "./Sidebar.css";

const SchoolSidebar = ({ isExpanded }) => {
  const { toggleSidebar, openDropdown, toggleDropdown } = useSidebar();
  const location = useLocation(); // 👈 Central location

  const handleOfficesClick = () => {
    if (!isExpanded) toggleSidebar(true);
    toggleDropdown("offices");
  };

  // ✅ Helper: Check if path matches
  const isActive = (path, exact = true) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside className={`sidebar ${isExpanded ? "expanded" : ""}`}>
      <nav className="sidebar-nav">
        <ul>
          {/* Home */}
          <li>
            <NavLink
              to="/home"
              className={`sidebar-link ${isActive("/home") ? "active" : ""}`}
              end
            >
              <FaHome className="sidebar-icon" />
              {isExpanded && <span className="sidebar-text">Home</span>}
            </NavLink>
          </li>

          {/* To-do */}
          <li>
            <NavLink
              to="/to-do/upcoming"
              className={`sidebar-link ${isActive("/to-do/", false) ? "active" : ""}`}
            >
              <FiCheckSquare className="sidebar-icon" />
              {isExpanded && <span className="sidebar-text">To-do</span>}
            </NavLink>
          </li>

          {/* Offices dropdown */}
          <li>
            <button
              className="sidebar-link-dropdown-toggle"
              onClick={handleOfficesClick}
            >
              <FaBriefcase className="sidebar-icon" />
              {isExpanded && (
                <>
                  <span className="sidebar-text">Offices</span>
                  <IoChevronDown
                    className={`dropdown-icon ${openDropdown === "offices" ? "open" : ""}`}
                  />
                </>
              )}
            </button>

            {isExpanded && openDropdown === "offices" && (
              <ul className="sidebar-submenu">
                <li>
                  <NavLink
                    to="/SGOD"
                    className={`sidebar-link sub-link ${isActive("/SGOD") ? "active" : ""}`}
                  >
                    <span className="sidebar-text">SGOD (School Gover…)</span>
                  </NavLink>
                  <NavLink
                    to="/CID"
                    className={`sidebar-link sub-link ${isActive("/CID") ? "active" : ""}`}
                  >
                    <span className="sidebar-text">CID (Curriculum Imp...)</span>
                  </NavLink>
                  <NavLink
                    to="/OSDS"
                    className={`sidebar-link sub-link ${isActive("/OSDS") ? "active" : ""}`}
                  >
                    <span className="sidebar-text">OSDS (Office of the...)</span>
                  </NavLink>
                </li>
              </ul>
            )}
          </li>

          {/* Manage Account */}
          <li>
            <NavLink
              to="/s-manage-account"
              className={`sidebar-link ${isActive("/manage-account") ? "active" : ""}`}
            >
              <MdManageAccounts className="sidebar-icon" />
              {isExpanded && <span className="sidebar-text">Manage Account</span>}
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default SchoolSidebar;