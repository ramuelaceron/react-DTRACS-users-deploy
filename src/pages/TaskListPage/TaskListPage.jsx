// src/pages/TaskList/TaskListPage.js
import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { sectionData } from '../../data/focals'; // Adjust path as needed
import './TaskListPage.css';

// Utility to create URL-friendly slug
const createSlug = (str) => {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
};

const TaskListPage = () => {
  const { sectionId } = useParams(); // e.g., "SMME"
  const { state } = useLocation();
  const navigate = useNavigate();

  console.log("📍 TaskListPage Debug");
  console.log("→ sectionId:", sectionId);
  console.log("→ location.state:", state);
  console.log("→ sectionData[sectionId]:", sectionData[sectionId]);

  const { title: focalTitle, focalPerson } = state || {};

  // Default fallbacks
  const pageTitle = focalTitle || 'Task List';
  const person = focalPerson || 'Unknown Focal';

  // Find the correct focal entry in sectionData[sectionId] that matches the title
  const section = sectionData[sectionId];
  let tasks = [];

  if (section && Array.isArray(section)) {
    const focalEntry = section.find(
      (item) => item.title === focalTitle && item.focalPerson === focalPerson
    );
    tasks = focalEntry?.tasklist || [];
  }

  if (tasks.length === 0) {
    return (
      <div className="task-list-page">
        <div className="header">
          <h1>{pageTitle}</h1>
          <p>{person}</p>
        </div>
        <p className="no-tasks">No tasks assigned for this focal area.</p>
      </div>
    );
  }

  const handleViewTask = (task) => {
    const slug = createSlug(task.title);
      navigate(`${slug}`, {
        state: {
          ...location.state, // forwards section, focalPerson, etc.
          taskTitle: task.title,
          dueTime: task.dueTime,
          dueDate: task.dueDate,
          postDate: task.postDate,
          taskDescription: task.description,
        }
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
          <p>{person}</p>
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