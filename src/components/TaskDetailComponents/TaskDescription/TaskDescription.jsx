import React, { useState, useRef } from "react";
import { PiClipboardTextBold } from "react-icons/pi";
import { SlOptionsVertical } from "react-icons/sl";
import useClickOutside from "../../../hooks/useClickOutside";
import TaskForm from "../../../components/TaskForm/TaskForm";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../../api/api";
import { useNavigate } from "react-router-dom"; // 👈 ADD THIS
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

// Get status color based on task status
const getStatusColor = (status) => {
  switch (status) {
    case "COMPLETE":
      return "#4CAF50"; // Green for completed
    case "INCOMPLETE":
      return "#D32F2F"; // Red for incomplete
    case "ONGOING":
    default:
      return "#2196F3"; // Blue for ongoing 
  }
};

const TaskDescription = ({ 
  task, 
  task_id,
  creator_name, 
  creation_date, 
  completion_date, 
  deadline, 
  description, 
  isCompleted,
  onEditTask,
  onDeleteTask,
  onCopyLink,
  onTaskUpdated,
  schools_required = [],
  accounts_required = [],
  token
}) => {

  const navigate = useNavigate();
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const optionsMenuRef = useRef(null);
  
  useClickOutside(optionsMenuRef, () => {
    if (showOptionsMenu) setShowOptionsMenu(false);
  });

  const actualStatus = isCompleted ? "COMPLETE" : (task?.task_status || "ONGOING");
  const statusColor = getStatusColor(actualStatus);

  const toggleOptionsMenu = () => {
    setShowOptionsMenu(!showOptionsMenu);
  };

  const handleEditTask = () => {
    setShowOptionsMenu(false);
    console.log('📋 Preparing to edit task:', {
      title: task?.title,
      description: task?.description,
      deadline: task?.deadline,
      links: task?.links,
      assignedTo: task?.assignedTo, // ← This must exist!
      for: task?.for
    });
    setShowEditForm(true);
  };

  // Inside TaskDescription.jsx or TaskDetailPage.jsx
  const handleDeleteTask = async () => {
    setShowOptionsMenu(false);

    const effectiveTaskId = task?.task_id;
    if (!effectiveTaskId) {
      toast.error("Task ID is missing.");
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/focal/task/delete/id/?task_id=${encodeURIComponent(effectiveTaskId)}`,
        {
          method: "DELETE", // 👈 Make sure it's DELETE
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

  const handleCopyLink = () => {
    setShowOptionsMenu(false);
    onCopyLink();
  };

  const handleTaskSave = (updatedTaskData) => {
    if (onTaskUpdated) {
      onTaskUpdated(updatedTaskData);
    }
    setShowEditForm(false);
  };

  const getInitialFormData = () => {
    if (!task) return {};

    let dueDate = '';
    let dueTime = '17:00';

    // ✅ Parse deadline using Date object (handles both ISO and your backend format)
    const parseDeadline = (str) => {
      if (!str) return null;

      if (str.includes('T')) {
        return new Date(str);
      }

      const parts = str.split(' ');
      if (parts.length === 2) {
        const [datePart, timePart] = parts;
        const [year, month, day] = datePart.split('-').map(Number);
        const paddedMonth = String(month).padStart(2, '0');
        const paddedDay = String(day).padStart(2, '0');
        const normalized = `${year}-${paddedMonth}-${paddedDay}T${timePart}`;
        return new Date(normalized);
      }

      return null;
    };

    if (task.deadline) {
      const dateObj = parseDeadline(task.deadline);
      if (dateObj && !isNaN(dateObj.getTime())) {
        dueDate = dateObj.toISOString().split('T')[0];
        dueTime = dateObj.toTimeString().substring(0, 5);
      }
    }

    // ✅ Extract links as an array of strings (if it's an array) or as a single string
    const linkUrl = Array.isArray(task.links) && task.links.length > 0 
      ? task.links[0] // Use first link for input field
      : task.link || ''; // Fallback to single string

    return {
      title: task.title || '',
      description: task.description || '',
      dueDate,
      dueTime,
      for: task.schools_required || [],     // ✅ Pre-fill selected schools
      assignedTo: task.accounts_required || [], // ✅ Pre-fill assigned accounts
      linkUrl,                      // ✅ Pre-fill link URL (first one)
    };
  };

  return (
    <div className="task-description">
      <div className="task-header">
        <div
          className="task-icon"
          style={{ backgroundColor: statusColor }}
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

      {/* Meta Info */}
      <div className="task-meta">
        <div className="task-category">{task?.section || task?.sectionName || "Unknown Section"}</div>
        {actualStatus === "COMPLETE" && completion_date ? (
          <div className="task-completed">
            Completed on {formatDate(completion_date)} at {formatTime(completion_date)}
          </div>
        ) : (
          <div className="task-due">
            Due {formatDate(deadline || task?.deadline)} at {formatTime(deadline || task?.deadline)}
          </div>
        )}
      </div>

      <div className="divider" />

      {/* Author & Date */}
      <div className="task-author">
        <span className="author">{creator_name || task?.creator_name || "Unknown Creator"}</span>
        <span className="dot-space">•</span>
        <span className="posted">Posted on {formatDate(creation_date || task?.creation_date)}</span>
      </div>

      {/* Description */}
      <div className="task-body">
        {description || task?.description || "No description provided."}
      </div>

      {/* ✅ ADDED: Display task-level link (matches ADMIN version) */}
      {/* ✅ Display Links — Handle both single string and array */}
      {task?.links && (
        <div className="task-links-container">
          <span className="task-link-label">Link{Array.isArray(task.links) && task.links.length > 1 ? 's' : ''}:</span>
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
      )}

      {/* Task Form Modal */}
      {showEditForm && (
        <>
          {console.log('📝 TaskDescription -> Passing to TaskForm - accounts_required:', task?.task_id)}
          <TaskForm
            initialData={{
              task_id: task.task_id, // 👈 Critical!
              title: task.title,
              description: task.description,
              deadline: task.deadline,
              links: task.links,
              for: task.accounts_required || [], // ✅ This is the key line
              assignedTo: task.schools_required || [],
            }}
            onClose={() => setShowEditForm(false)}
            onTaskCreated={handleTaskSave}
          />
        </>
      )}
    </div>
  );
};

export default TaskDescription;