
import React from "react";
import { PiClipboardTextBold } from "react-icons/pi";
import "./TaskDescription.css"

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

// Get status color and label
const getStatusConfig = (status, isLate, isCompleted) => {
  if (isCompleted) {
    return { color: "#4CAF50", label: "Completed", icon: "✅" };
  }
  if (isLate) {
    return { color: "#FF9800", label: "Late Submission", icon: "⚠️" };
  }

  switch (status) {
    case "Completed":
      return { color: "#333", label: "Completed", icon: "✅" };
    case "Incomplete":
      return { color: "#D32F2F", label: "Past Due", icon: "⚠️" };
    case "Ongoing":
    default:
      return { color: "#2196F3", label: "Assigned", icon: "" };
  }
};

const TaskDescription = ({ task, creator_name, creation_date, deadline, description, isCompleted, isLate }) => {
  const statusConfig = getStatusConfig(task?.task_status, isLate, isCompleted);

  return (
    <div className="task-description">
      <div className="task-header">
        <div
          className="task-icon"
          style={{ backgroundColor: statusConfig.color }}
        >
          <PiClipboardTextBold className="icon-lg" style={{ color: "white" }} />
        </div>
        <h1 className="task-title">{task?.title || "Untitled Task"}</h1>
      </div>

      {/* Meta Info */}
      <div className="task-meta">
        <div className="task-category">{task?.section || "General"}</div>
        <div className="task-due">
          Due {formatDate(deadline || task?.deadline)} at {formatTime(deadline || task?.deadline)}
        </div>
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
    </div>
  );
};

export default TaskDescription;