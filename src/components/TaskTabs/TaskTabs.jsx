// src/components/TaskTabs/TaskTabs.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './TaskTabs.css';

const TaskTabs = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="task-tabs-container">
      <div className="task-tabs">
        <Link to="/todo" className={`task-tab ${isActive('/todo') ? 'active' : ''}`}>
          Upcoming
          <span className="task-indicator task-green"></span>
        </Link>
        <Link to="/todo/past-due" className={`task-tab ${isActive('/todo/past-due') ? 'active' : ''}`}>
          Past due
          <span className="task-indicator task-red"></span>
        </Link>
        <Link to="/todo/completed" className={`task-tab ${isActive('/todo/completed') ? 'active' : ''}`}>
          Completed
        </Link>
      </div>

      <select className="task-dropdown">
        <option>All Offices</option>
        <option>Office A</option>
        <option>Office B</option>
      </select>
    </div>
  );
};

export default TaskTabs;