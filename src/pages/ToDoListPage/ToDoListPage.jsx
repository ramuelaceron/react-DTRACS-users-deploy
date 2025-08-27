// src/pages/TaskList/TaskListPage.js
import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { sectionData } from '../../data/focals';
import { createSlug } from '../../utils/idGenerator';
import './ToDoListPage.css';

const TaskListPage = () => {
  const { sectionId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  // Fallback values
  const { title: focalTitle, focalPerson } = state || {};
  const pageTitle = focalTitle || 'Task List';
  const person = focalPerson || 'Unknown Focal';

  // 🔍 Find the section and the correct focal entry
  const section = sectionData[sectionId];
  let tasks = [];
  let avatar = null;

  if (section && Array.isArray(section)) {
    const focalEntry = section.find(
      (item) => item.title === focalTitle && item.focalPerson === focalPerson
    );

    if (focalEntry) {
      tasks = focalEntry.tasklist || [];
      avatar = focalEntry.avatar; // ✅ Use the real avatar
    }
  }

  // Fallback avatar if not found
  if (!avatar) {
    console.warn(`Avatar not found for ${focalTitle} - ${focalPerson}`);
    avatar = "https://via.placeholder.com/40"; // fallback
  }

  const handleViewTask = (task) => {
    const slug = createSlug(task.title);
    navigate(`${slug}`, {
      state: {
        ...state,
        taskTitle: task.title,
        dueTime: task.dueTime,
        dueDate: task.dueDate,
        postDate: task.postDate,
        taskDescription: task.description,
      },
    });
  };

  return (
    <div className="task-list-page">
      {/* ✅ Header with real avatar */}
      <div className="header">
        <div className="avatar">
          <img src={avatar} alt={`${person}'s avatar`} />
        </div>
        <div className="header-info">
          <h1>{pageTitle}</h1>
          <p>{person}</p>
        </div>
      </div>

      {/* Task List or Empty State */}
      {tasks.length === 0 ? (
        <div className="no-tasks-container">
          <p className="no-tasks">No tasks assigned for this focal area.</p>
        </div>
      ) : (
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
      )}
    </div>
  );
};

export default TaskListPage;