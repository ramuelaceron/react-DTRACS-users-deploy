import React from "react";
import "./SchoolSidebar.css";
import { FaHome, FaBriefcase } from "react-icons/fa";
import { FiCheckSquare } from "react-icons/fi";
import { MdOutlineManageAccounts } from "react-icons/md";

const SchoolSidebar = ({ isExpanded }) => {
  return (
    <aside className={`sidebar ${isExpanded ? "expanded" : ""}`}>
      <nav className="sidebar-nav">
        <ul>
          <li>
            <a href="" className="sidebar-link" title="Home">
              <FaHome className="sidebar-icon" />
              {isExpanded && <span className="sidebar-text">Home</span>}
            </a>
          </li>
          <li>
            <a href="#" className="sidebar-link" title="To-do">
              <FiCheckSquare className="sidebar-icon" />
              {isExpanded && <span className="sidebar-text">To-do</span>}
            </a>
          </li>
          <li>
            <a href="#" className="sidebar-link" title="Offices">
              <FaBriefcase className="sidebar-icon" />
              {isExpanded && <span className="sidebar-text">Offices</span>}
            </a>
          </li>
          <li>
            <a href="#" className="sidebar-link" title="Manage Account">
              <MdOutlineManageAccounts className="sidebar-icon" />
              {isExpanded && <span className="sidebar-text">Manage Account</span>}
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default SchoolSidebar;
