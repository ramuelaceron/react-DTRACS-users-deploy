import React from 'react';
import TaskTabs from '../../../components/TaskTabs/TaskTabs.jsx';
import './Completed.css';

const Completed = () => {
  return (
    <div className="completed-app">
      <main className="completed-main">
        {/* Reusable Tabs */}
        <TaskTabs />

        {/* Date Header */}
        <div className="completed-date-header">
          August 5, 2025 <span className="completed-weekday">( Completed on Tuesday )</span>
        </div>

        {/* Task Card */}
        <div className="completed-card">
          <div className="completed-card-title">Project Proposal</div>
          <div className="completed-card-time">Completed at 10:15 AM</div>
        </div>
      </main>
    </div>
  );
};

export default Completed;