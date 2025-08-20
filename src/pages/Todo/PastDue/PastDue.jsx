import React from 'react';
import TaskTabs from '../../../components/TaskTabs/TaskTabs.jsx'; // ✅ 3 dots
import './PastDue.css';

const PastDue = () => {
  return (
    <div className="pastdue-app">
      <main className="pastdue-main">
        <TaskTabs />

        <div className="pastdue-date-header">
          August 5, 2025 <span className="pastdue-weekday">Due 3 days ago</span>
        </div>

        <div className="pastdue-card">
          <div className="pastdue-card-title">Project Proposal</div>
          <div className="pastdue-card-time">Due at 3:30 PM</div>
        </div>
      </main>
    </div>
  );
};

export default PastDue;