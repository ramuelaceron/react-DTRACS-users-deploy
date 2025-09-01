// TaskDetailPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import "./TaskDetailPage.css";
import { IoChevronBackOutline } from "react-icons/io5";
import { PiClipboardTextBold } from "react-icons/pi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { taskData } from "../../data/taskData";

const TaskDetailPage = () => {
  const navigate = useNavigate();
  const { sectionId, taskSlug } = useParams();
  const { state } = useLocation(); // Get state from navigation

  // State
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLate, setIsLate] = useState(false); // New state for late tasks

  // Get task data from navigation state or find it in taskData
  const taskTitle = state?.taskTitle;
  const taskDeadline = state?.deadline;
  const taskCreationDate = state?.creation_date;
  const taskDescription = state?.taskDescription;
  const taskId = state?.taskId;

  // 🔍 Find the task and focal entry using the task ID from state
  const section = taskData[sectionId];
  let focalEntry = null;
  let task = null;

  if (section && Array.isArray(section) && taskId) {
    for (const item of section) {
      const match = item.tasklist?.find(t => t.task_id === taskId);
      if (match) {
        focalEntry = item;
        task = match;
        break;
      }
    }
  }

  // If task not found by ID, try to find it by title (fallback)
  if (!task && taskTitle && section && Array.isArray(section)) {
    for (const item of section) {
      const match = item.tasklist?.find(t => t.title === taskTitle);
      if (match) {
        focalEntry = item;
        task = match;
        break;
      }
    }
  }

  // Extract task and focal data
  const creator_name = task?.creator_name || state?.creator_name || "Unknown Creator";

  // Format date functions
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return "Invalid date";
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      console.error('Error formatting time:', error);
      return "Invalid time";
    }
  };

  // Get status color based on task status
  const getStatusColor = (status) => {
    switch (status) {
      case "Incomplete":
        return "#D32F2F"; // Red for incomplete
      case "Completed":
        return "#333"; // Dark gray for completed
      case "Ongoing":
        return "#2196F3"; // Blue for ongoing
      case "Late":
        return "#FF9800"; // Orange for late
      default:
        return "#333"; // Default dark gray
    }
  };

  // Get status display text
  const getStatusText = (status) => {
    switch (status) {
      case "Incomplete":
        return "Past Due";
      case "Completed":
        return "Completed";
      case "Ongoing":
        return "Assigned";
      case "Late":
        return "Late Submission";
      default:
        return status || "Assigned";
    }
  };

  // Sync completion status from data
  useEffect(() => {
    if (task?.task_status === "Completed") {
      setIsCompleted(true);
    } else if (task?.task_status === "Incomplete") {
      setIsLate(false);
    }
  }, [task?.task_status]);

  // Handlers
  const handleBack = () => navigate(-1);

  const handleIncomplete = () => {
    setIsCompleted(false);
    setIsLate(false);
    toast.info("Task status reverted.");
  };

  // Handle task not found
  if (!task) {
    return (
      <div className="task-detail-app">
        <main className="task-detail-main">
          <button className="back-button" onClick={() => navigate(-1)}>
            <IoChevronBackOutline className="icon-md" /> Back
          </button>
          <div className="error-container">
            <p>⚠️ Task not found.</p>
            <small>Please go back and try again.</small>
          </div>
        </main>
      </div>
    );
  }

  const taskStatus = task.task_status || "Ongoing";
  const statusColor = getStatusColor(isLate ? "Late" : isCompleted ? "Completed" : taskStatus);
  const statusText = getStatusText(isLate ? "Late" : isCompleted ? "Completed" : taskStatus);

  return (
    <div className="task-detail-app">
      <main className="task-detail-main">
        {/* Back Button */}
        <button className="back-button" onClick={handleBack}>
          <IoChevronBackOutline className="icon-md" /> Back
        </button>

        {/* Header */}
        <div className="task-header">
          <div 
            className="task-icon" 
            style={{ 
              background: statusColor,
              transition: "background 0.3s ease"
            }}
          >
            <PiClipboardTextBold 
              className="icon-lg" 
              style={{ 
                color: "white" 
              }} 
            />
          </div>
          <h1 className="task-title">{task.title || taskTitle}</h1>
          <div className="task-status">
            {isCompleted ? (
              // Completed
              <span style={{ color: "#4CAF50", display: "flex", alignItems: "center", gap: "4px" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                </svg>
                Completed
              </span>
            ) : isLate ? (
              // Late submission
              <span style={{ color: "#FF9800", display: "flex", alignItems: "center", gap: "4px", fontWeight: "bold" }}>
                ⚠️ Late Submission
              </span>
            ) : (
              // Status based on task_status
              <span style={{ color: statusColor, display: "flex", alignItems: "center", gap: "4px", fontWeight: "bold" }}>
                {taskStatus === "Incomplete" && "⚠️ "}
                {statusText}
              </span>
            )}
          </div>
        </div>

        {/* Meta Info */}
        <div className="task-meta">
          <div className="task-category">{task.section}</div>
          <div className="task-due">
            Due {formatDate(task.deadline || taskDeadline)} at {formatTime(task.deadline || taskDeadline)}
          </div>
        </div>

        <div className="divider" />

        {/* Author & Date */}
        <div className="task-author">
          {creator_name} • Posted on {formatDate(task.creation_date || taskCreationDate)}
        </div>

        {/* Description */}
        <div className="task-description">{task.description || taskDescription}</div>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </main>
    </div>
  );
};

export default TaskDetailPage;