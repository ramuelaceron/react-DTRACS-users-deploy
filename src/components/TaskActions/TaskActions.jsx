// src/components/TaskActions/TaskActions.jsx
import React from "react";
import "./TaskActions.css";

// Icons
import { FaPaperclip } from "react-icons/fa";
import { MdOutlineDoneOutline, MdCancel } from "react-icons/md";

// Components
import SharedButton from "../SharedButton/SharedButton";

const TaskActions = ({
  onFileChange,
  onComplete,
  onIncomplete,
  isCompleted,
}) => {
  return (
    <div className="task-actions">
      {/* Conditional File Input */}
      {isCompleted ? (
        <div className="task-actions-file-plain">
          <FaPaperclip className="task-actions-icon" />
          Add file
        </div>
      ) : (
        <label htmlFor="file-upload" className="task-actions-file-label">
          <SharedButton
            variant="default"
            size="medium"
            as="div"
            className="task-actions-file-button"
          >
            <FaPaperclip className="task-actions-icon" />
            Add file
          </SharedButton>
        </label>
      )}

      {/* Hidden File Input */}
      <input
        id="file-upload"
        type="file"
        multiple
        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
        onChange={onFileChange}
        disabled={isCompleted}
      />

      {/* Complete / Cancel Buttons */}
      {isCompleted ? (
        <>
          <div className="task-actions-status-completed">
            <MdOutlineDoneOutline className="task-actions-icon" />
            Completed
          </div>
          <SharedButton
            variant="danger"
            size="medium"
            onClick={onIncomplete}
            className="task-actions-cancel-btn"
          >
            <MdCancel className="task-actions-icon" />
            Cancel
          </SharedButton>
        </>
      ) : (
        <SharedButton
          variant="primary"
          size="medium"
          onClick={onComplete}
          className="task-actions-complete-btn"
        >
          <MdOutlineDoneOutline className="task-actions-icon" />
          Complete
        </SharedButton>
      )}
    </div>
  );
};

export default TaskActions;
