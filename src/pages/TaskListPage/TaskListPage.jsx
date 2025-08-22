// TaskListPage.js
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './TaskListPage.css';

// Helper: Convert title to URL-friendly slug
const createSlug = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
    .replace(/\s+/g, '-');         // Replace spaces with -
};

const TaskListPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const pageTitle = location.state?.title || 'Task List';
  const focalPerson = location.state?.focalPerson || 'Unknown Focal';

  const tasks = [
    { id: 1, title: 'Project Proposal', dueTime: '3:30 PM' },
    { id: 2, title: 'Annual Report', dueTime: '5:00 PM' },
    { id: 3, title: 'Budget Planning', dueTime: '4:15 PM' },
  ];

  const handleViewTask = (task) => {
    const slug = createSlug(task.title);
    navigate(slug, {
      state: {
        ...location.state,
        taskId: task.id,
        taskTitle: task.title,
        dueTime: task.dueTime,
      },
    });
  };

  return (
    <div className="task-list-page">
      {/* Header */}
      <div className="header">
        <div className="avatar">
          <img src="https://via.placeholder.com/40" alt="Avatar" />
        </div>
        <div className="header-info">
          <h1>{pageTitle}</h1>
          <p>{focalPerson}</p>
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
            <button
              className="view-task-btn"
              onClick={() => handleViewTask(task)}
              aria-label={`View details for ${task.title}`}
            >
              View Task
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskListPage;