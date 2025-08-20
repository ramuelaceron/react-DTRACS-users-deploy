// src/components/TaskActions/TaskActions.jsx
import React from 'react';
import { FaPaperclip } from "react-icons/fa";
import './TaskActions.css';

const TaskActions = ({ onFileChange, onComplete, isCompleted }) => {
  return (
    <div className="task-actions">
      <label htmlFor="file-upload" className="attach-button">
        <FaPaperclip className="icon-sm" /> Add new
      </label>
      <input
        id="file-upload"
        type="file"
        multiple
        onChange={onFileChange}
        style={{ display: 'none' }}
        disabled={isCompleted}
      />
      <button
        className="complete-button"
        onClick={onComplete}
        disabled={isCompleted}
      >
        {isCompleted ? 'Cancel' : 'Complete'}
      </button>
    </div>
  );
};

export default TaskActions;