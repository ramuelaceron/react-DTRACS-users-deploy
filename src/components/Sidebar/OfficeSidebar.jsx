import React from "react";
import "./OfficeSidebar.css";
import { FaTasks } from "react-icons/fa"; // Task icon
import { RiSchoolFill } from "react-icons/ri"; // Schools icon
import { MdManageAccounts } from "react-icons/md"; // Manage Account icon
import { NavLink } from "react-router-dom";
import { useSidebar } from "../../context/SidebarContext";

const OfficeSidebar = ({ isExpanded }) => {
  const { isExpanded: expanded } = useSidebar();

  return (
    <aside className={`sidebar ${isExpanded ? "expanded" : ""}`}>
      <nav className="sidebar-nav">
        <ul>
          {/* Task */}
          <li>
            <NavLink
              to="/task"
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
              end
            >
              <FaTasks className="sidebar-icon" />
              {isExpanded && <span className="sidebar-text">Task</span>}
            </NavLink>
          </li>

          {/* Schools */}
          <li>
            <NavLink
              to="/schools"
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
            >
              <RiSchoolFill className="sidebar-icon" />
              {isExpanded && <span className="sidebar-text">Schools</span>}
            </NavLink>
          </li>

          {/* Manage Account */}
          <li>
            <NavLink
              to="/manage-account"
              className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
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

export default OfficeSidebar;
