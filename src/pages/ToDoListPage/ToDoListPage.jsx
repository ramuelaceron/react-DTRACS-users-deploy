import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { taskData } from '../../data/taskData';
import { createSlug } from '../../utils/idGenerator';
import './ToDoListPage.css';

const ToDoListPage = () => {
  const { sectionId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  // Fallback values
  const { section_designation, full_name } = state || {};
  const pageTitle = section_designation || 'Task List';
  const person = full_name || 'Unknown Focal';

  // 🔍 Find the section and the correct focal entry
  const section = taskData[sectionId]; 
  let tasks = [];
  let avatar = null;

  if (section && Array.isArray(section)) {
    const focalEntry = section.find(
      (item) => item.section_designation === section_designation && item.full_name === full_name
    );

    if (focalEntry) {
      tasks = focalEntry.tasklist || [];
      avatar = focalEntry.avatar;
    }
  }

  // Fallback avatar if not found
  if (!avatar) {
    console.warn(`Avatar not found for ${section_designation} - ${full_name}`);
    avatar = "https://via.placeholder.com/40"; // fallback
  }

  // Function to extract time from ISO date string
  const extractTimeFromDate = (dateString) => {
    if (!dateString) return 'No deadline';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (error) {
      console.error('Error parsing date:', error);
      return 'Invalid date';
    }
  };

  const handleViewTask = (task) => {
    // Use the section_designation from state instead of task.section_designation
    const slug = createSlug(section_designation);
    navigate(`${slug}`, {
      state: {
        ...state,
        taskTitle: task.title,
        deadline: task.deadline,
        creation_date: task.creation_date,
        taskDescription: task.description,
        taskId: task.task_id, // Include the task ID
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
            <div key={task.task_id} className="task-item">
              <div className="task-content">
                <h3>{task.title}</h3>
                <p className="due-time">Due at {extractTimeFromDate(task.deadline)}</p>
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

export default ToDoListPage;