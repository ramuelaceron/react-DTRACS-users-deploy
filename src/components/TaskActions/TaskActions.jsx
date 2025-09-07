// src/components/TaskActions/TaskActions.jsx
import React, { useState, useRef } from "react";
import "./TaskActions.css";

// Icons
import { FaPaperclip } from "react-icons/fa";
import { MdOutlineDoneOutline, MdCancel } from "react-icons/md";
import { IoMdLink, IoMdArrowDropdown } from "react-icons/io";

// Components
import SharedButton from "../SharedButton/SharedButton";
import useClickOutside from "../../hooks/useClickOutside";

const TaskActions = ({
  onFileChange,
  onComplete,
  onIncomplete,
  isCompleted,
  onLinkChange,
  linkUrl
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLinkInputVisible, setIsLinkInputVisible] = useState(false);
  const [isLinkValid, setIsLinkValid] = useState(true);
  const dropdownRef = useRef(null);
  const linkInputRef = useRef(null); // Add ref for link input

  // Close dropdown when clicking outside
  useClickOutside(dropdownRef, (event) => { // Add event parameter
    if (isDropdownOpen) setIsDropdownOpen(false);
    // Check if click is outside both dropdown and link input
    if (isLinkInputVisible && linkInputRef.current && !linkInputRef.current.contains(event.target)) {
      setIsLinkInputVisible(false);
    }
  });

  const toggleDropdown = () => {
    if (isCompleted) return;
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleFileClick = () => {
    document.getElementById("file-upload").click();
    setIsDropdownOpen(false);
  };

  const handleLinkClick = () => {
    setIsLinkInputVisible(true);
    setIsDropdownOpen(false);
  };

  const handleLinkInputChange = (e) => {
    const value = e.target.value;
    onLinkChange(value);
    
    // Validate URL format (optional, can be empty)
    if (value && !/^(https?:\/\/)/i.test(value.trim())) {
      setIsLinkValid(false);
    } else {
      setIsLinkValid(true);
    }
  };

  const handleRemoveLink = () => {
    onLinkChange("");
    setIsLinkInputVisible(false);
    setIsLinkValid(true);
  };

  const handleLinkSubmit = () => {
    if (linkUrl && !/^(https?:\/\/)/i.test(linkUrl.trim())) {
      setIsLinkValid(false);
      return;
    }
    setIsLinkInputVisible(false);
  };

  return (
    <div className="task-actions">
      {/* Attachment Dropdown */}
      {isCompleted ? (
        <div className="task-actions-attachment-plain">
          <FaPaperclip className="task-actions-icon" />
          Add attachment
        </div>
      ) : (
        <div className="task-actions-attachment-dropdown" ref={dropdownRef}>
          <button
            type="button"
            className="task-actions-attachment-toggle"
            onClick={toggleDropdown}
            disabled={isCompleted}
          >
            <FaPaperclip className="task-actions-icon" />
            Add attachment
            <IoMdArrowDropdown className="dropdown-arrow" />
          </button>

          {isDropdownOpen && (
            <div className="attachment-dropdown-menu">
              <button
                type="button"
                className="attach-dropdown-item"
                onClick={handleFileClick}
              >
                <FaPaperclip className="dropdown-icon" />
                Upload file
              </button>
              <button
                type="button"
                className="attach-dropdown-item"
                onClick={handleLinkClick}
              >
                <IoMdLink className="dropdown-icon" />
                Add link
              </button>
            </div>
          )}
        </div>
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

      {/* Link Input Section - Add ref here */}
      {isLinkInputVisible && !isCompleted && (
        <div className="link-input-section" ref={linkInputRef}>
          <div className="link-input-container">
            <input
              type="text"
              placeholder="https://example.com"
              value={linkUrl || ""}
              onChange={handleLinkInputChange}
              className={`link-input ${!isLinkValid ? 'invalid' : ''}`}
            />
            <div className="link-input-actions">
              <button
                type="button"
                className="link-submit-btn"
                onClick={handleLinkSubmit}
              >
                Add
              </button>
              <button
                type="button"
                className="link-cancel-btn"
                onClick={handleRemoveLink}
              >
                Cancel
              </button>
            </div>
          </div>
          {!isLinkValid && (
            <p className="link-error">
              Please enter a valid URL starting with http:// or https://
            </p>
          )}
        </div>
      )}

      {/* Link Preview (when link is added but input is hidden) */}
      {linkUrl && !isLinkInputVisible && !isCompleted && (
        <div className="link-preview">
          <IoMdLink className="link-preview-icon" />
          <span className="link-preview-text">Link attached</span>
          <button
            type="button"
            className="link-remove-btn"
            onClick={handleRemoveLink}
          >
            ×
          </button>
        </div>
      )}

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