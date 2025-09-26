// src/components/TaskDetailComponents/TaskDescription/TaskDescription.jsx
import React, { useState, useRef } from "react";
import { PiClipboardTextBold } from "react-icons/pi";
import { SlOptionsVertical } from "react-icons/sl";
import useClickOutside from "../../../hooks/useClickOutside";
import TaskForm from "../../../components/TaskForm/TaskForm";
import { toast } from "react-toastify";
import config from "../../../config";
import { useNavigate } from "react-router-dom";
import DOMPurify from 'dompurify';
import "./TaskDescription.css";

// Utility to format date
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid Date";
  }
};

// Utility to format time
const formatTime = (dateString) => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch (error) {
    console.error("Error formatting time:", error);
    return "Invalid Time";
  }
};

// ✅ Safe date parser for backend formats like "2025-09-20 15:09:00"
const parseDate = (str) => {
  if (!str) return null;
  if (str.includes('T')) return new Date(str);
  const parts = str.split(' ');
  if (parts.length === 2) {
    const [datePart, timePart] = parts;
    const [year, month, day] = datePart.split('-').map(Number);
    const normalized = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T${timePart}`;
    return new Date(normalized);
  }
  return new Date(str);
};

// ✅ Determine icon color: green (on time), orange (late), red (incomplete)
const getIconColor = ({ isCompleted, completion_date, deadline }) => {
  if (isCompleted) {
    if (!completion_date || !deadline) {
      return "#4CAF50"; // Green by default
    }
    const completed = parseDate(completion_date);
    const due = parseDate(deadline);
    if (isNaN(completed.getTime()) || isNaN(due.getTime())) {
      return "#4CAF50";
    }
    return completed > due ? "#FF9800" : "#4CAF50"; // Orange or Green
  }

  // ✅ All incomplete tasks = red
  return "#D32F2F";
};

const TaskDescription = ({ 
  task, 
  creator_name, 
  creation_date, 
  completion_date, 
  deadline, 
  description, 
  isCompleted,
  onTaskUpdated,
  schools_required = [],
  accounts_required = [],
  token,
}) => {

  const navigate = useNavigate();
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const optionsMenuRef = useRef(null);
  
  useClickOutside(optionsMenuRef, () => {
    if (showOptionsMenu) setShowOptionsMenu(false);
  });

  const iconColor = getIconColor({ isCompleted, completion_date, deadline });

  // ✅ Check if task is future incomplete (for pulsing effect)
  const isFutureIncomplete = !isCompleted && deadline && (() => {
    const now = new Date();
    const due = parseDate(deadline);
    return !isNaN(due.getTime()) && now <= due;
  })();

  const toggleOptionsMenu = () => {
    setShowOptionsMenu(!showOptionsMenu);
  };

  const handleEditTask = () => {
    setShowOptionsMenu(false);
    setShowEditForm(true);
  };

  const handleDeleteTask = async () => {
    setShowOptionsMenu(false);
    const effectiveTaskId = task?.task_id;
    if (!effectiveTaskId) {
      toast.error("Task ID is missing.");
      return;
    }

    try {
      const response = await fetch(
        `${config.API_BASE_URL}/focal/task/delete/id/?task_id=${encodeURIComponent(effectiveTaskId)}`,
        {
          method: "DELETE",
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || "Failed to delete task");
      }

      const deletedTask = await response.json();
      toast.success(`✅ Task "${deletedTask.title}" deleted successfully!`);
      navigate(-1);
    } catch (err) {
      console.error("❌ Error deleting task:", err);
      toast.error(`Failed to delete task: ${err.message}`);
    }
  };

  const handleCopyLink = async () => {
    setShowOptionsMenu(false);
    const currentUrl = window.location.href;
    try {
      await navigator.clipboard.writeText(currentUrl);
      toast.success("📋 Link copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy link:", err);
      toast.error("Failed to copy link. Please try again.");
    }
  };

  const handleTaskSave = (updatedTaskData) => {
    if (onTaskUpdated) {
      onTaskUpdated(updatedTaskData);
    }
    setShowEditForm(false);
  };

  return (
    <div className="task-description">
      <div className="task-header">
        <div 
          className={`task-description-icon ${isFutureIncomplete ? 'task-icon-pulse' : ''}`}
          style={{ backgroundColor: iconColor }}
        >
          <PiClipboardTextBold className="icon-lg" style={{ color: "white" }} />
        </div>
        
        <div className="task-title-container">
          <h1 className="task-title">{task?.title || "Untitled Task"}</h1>
          
          <div className="task-actions-container">
            <button 
              className="task-options-button"
              onClick={toggleOptionsMenu}
              aria-label="Task options"
            >
              <SlOptionsVertical className="icon-md" />
            </button>
            
            {showOptionsMenu && (
              <div ref={optionsMenuRef} className="options-dropdown">
                <button onClick={handleEditTask} className="dropdown-item">
                  Edit Task
                </button>
                <button onClick={handleDeleteTask} className="dropdown-item delete">
                  Delete Task
                </button>
                <button onClick={handleCopyLink} className="dropdown-item">
                  Copy Link
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="task-meta">
        <div className="task-category">{task?.section || task?.sectionName || "Unknown Section"}</div>
        {isCompleted && completion_date ? (
          <div className="task-completed">
            Completed on {formatDate(completion_date)} at {formatTime(completion_date)}
            {iconColor === "#FF9800" && (
              <span className="task-late-badge"> (Late)</span>
            )}
          </div>
        ) : (
          <div className="task-due">
            Due {formatDate(deadline || task?.deadline)} at {formatTime(deadline || task?.deadline)}
          </div>
        )}
      </div>

      <div className="divider" />

      <div className="task-author">
        <span className="author">{creator_name || task?.creator_name || "Unknown Creator"}</span>
        <span className="dot-space">•</span>
        <span className="posted">Posted on {formatDate(creation_date || task?.creation_date)}</span>
      </div>

      <div 
        className="task-body"
        dangerouslySetInnerHTML={{ 
          __html: DOMPurify.sanitize(description || task?.description || "<em>No description</em>") 
        }}
      />

      {task?.links && (
        (Array.isArray(task.links)
          ? task.links.length > 0
          : typeof task.links === 'string' && task.links.trim() !== ""
        ) && (
          <div className="task-links-container">
            <span className="task-link-label">
              Links{Array.isArray(task.links) && task.links.length > 1 ? 's' : ''}:
            </span>
            {Array.isArray(task.links) ? (
              task.links.map((link, index) => (
                <a
                  key={index}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="task-link"
                  title="Open link in new tab"
                >
                  {link}
                </a>
              ))
            ) : (
              <a
                href={task.links}
                target="_blank"
                rel="noopener noreferrer"
                className="task-link"
                title="Open link in new tab"
              >
                {task.links}
              </a>
            )}
          </div>
        )
      )}

      {showEditForm && (
        <TaskForm
          initialData={{
            task_id: task.task_id,
            title: task.title,
            description: task.description,
            deadline: task.deadline,
            links: task.links,
            for: task.accounts_required || [],
            assignedTo: task.schools_required || [],
          }}
          onClose={() => setShowEditForm(false)}
          onTaskCreated={handleTaskSave}
        />
      )}
    </div>
  );
};

export default TaskDescription;