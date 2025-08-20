// TaskListPage.js
import React from 'react';
import { useLocation } from 'react-router-dom';
import './TaskListPage.css';

const TaskListPage = () => {
  const location = useLocation();

  // Get dynamic data from state, with fallbacks
  const pageTitle = location.state?.title || 'Task List';
  const focalPerson = location.state?.focalPerson || 'Unknown Focal';

  const tasks = [
    { id: 1, title: 'Task Title', dueTime: '3:30 PM' },
    { id: 2, title: 'Task Title', dueTime: '3:30 PM' },
    { id: 3, title: 'Task Title', dueTime: '3:30 PM' },
  ];

  return (
    <div className="task-list-page">
      {/* Header */}
      <div className="header">
        <div className="avatar">
          <img src="https://via.placeholder.com/40" alt="Avatar" />
        </div>
        <div className="header-info">
          <h1>{pageTitle}</h1>
          <p>{focalPerson}</p> {/* Now dynamic */}
        </div>
      </div>

      {/* Task List */}
      <div className="task-list">
        {tasks.map((task) => (
          <div key={task.id} className="task-item">
            <div className="task-content">
              <h3>{task.title}</h3>
              <p className="due-time">Due at {task.dueTime}</p>
            </div>
            <button className="view-task-btn">View Task</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskListPage;