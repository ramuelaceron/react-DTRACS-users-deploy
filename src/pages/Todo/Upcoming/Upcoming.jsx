import React from 'react';
import TaskTabs from '../../../components/TaskTabs/TaskTabs.jsx';
import { Link } from 'react-router-dom'; // Import Link
import './Upcoming.css';

const Upcoming = () => {
  return (
    <div className="upcoming-app">
      <main className="upcoming-main">
        {/* Reusable Tabs */}
        <TaskTabs />

        {/* Date Header */}
        <div className="upcoming-date-header">
          August 5, 2025 <span className="upcoming-weekday">( Tuesday )</span>
        </div>

        {/* Clickable Task Card */}
        <Link to="/todo/task/1" className="upcoming-task-link">
          <div className="upcoming-card">
            <div className="upcoming-card-title">Project Proposal</div>
            <div className="upcoming-card-time">Due at 3:30 PM</div>
          </div>
        </Link>
      </main>
    </div>
  );
};

export default Upcoming;