import React from "react";
import "./SchoolSidebar.css";
import { FaHome, FaBriefcase } from "react-icons/fa";
import { FiCheckSquare } from "react-icons/fi";
import { MdOutlineManageAccounts } from "react-icons/md";
import { NavLink } from "react-router-dom";

const SchoolSidebar = ({ isExpanded }) => {
  return (
    <aside className={`sidebar ${isExpanded ? "expanded" : ""}`}>
      <nav className="sidebar-nav">
        <ul>
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
          <li>
            <NavLink
              to="/home/todo"
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
            >
              <FiCheckSquare className="sidebar-icon" />
              {isExpanded && <span className="sidebar-text">To-do</span>}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/home/offices"
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
            >
              <FaBriefcase className="sidebar-icon" />
              {isExpanded && <span className="sidebar-text">Offices</span>}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/home/manage-account"
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
