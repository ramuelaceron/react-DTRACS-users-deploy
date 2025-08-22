import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './TaskDetailPage.css';
import CommentBox from '../../components/CommentBox/CommentBox';
import AttachedFiles from '../../components/AttachedFiles/AttachedFiles';
import TaskActions from '../../components/TaskActions/TaskActions';
import { IoChevronBackOutline } from "react-icons/io5";
import { RiAccountPinBoxLine } from "react-icons/ri";
import { PiClipboardTextBold } from "react-icons/pi";
import { FaFilePdf, FaFileWord, FaFileImage, FaFile } from "react-icons/fa";

const TaskDetailPage = () => {
  const navigate = useNavigate();
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [comment, setComment] = useState('');

  const handleBack = () => {
    navigate(-1);
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    
    if (files.length + attachedFiles.length > 6) {
      alert("You can only attach up to 6 files.");
      return;
    }

    const newFiles = files.map(file => ({
      id: URL.createObjectURL(file),
      file,
      name: file.name,
      type: getFileType(file),
      icon: getFileIcon(file)
    }));

    setAttachedFiles(prev => [...prev, ...newFiles]);
  };

  const handleRemoveFile = (fileId) => {
    const fileToRemove = attachedFiles.find(f => f.id === fileId);
    if (fileToRemove) URL.revokeObjectURL(fileToRemove.id);
    setAttachedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const handleComplete = () => {
    if (attachedFiles.length === 0) {
      alert("Please attach at least one file before completing.");
      return;
    }
    setIsCompleted(true);
  };

  const handleCommentSubmit = () => {
    if (!comment.trim()) {
      alert("Please enter a comment.");
      return;
    }
    console.log("Comment submitted:", comment);
    setComment('');
    setShowCommentBox(false);
  };

  const toggleCommentBox = () => {
    setShowCommentBox(!showCommentBox);
  };

  const getFileIcon = (file) => {
    const ext = file?.name.split('.').pop().toLowerCase();
    if (ext === 'pdf') return <FaFilePdf />;
    if (ext === 'doc' || ext === 'docx') return <FaFileWord />;
    if (ext === 'jpg' || ext === 'jpeg' || ext === 'png') return <FaFileImage />;
    return <FaFile />;
  };

  const getFileType = (file) => {
    const ext = file?.name.split('.').pop().toLowerCase();
    if (ext === 'pdf') return 'PDF';
    if (ext === 'doc' || ext === 'docx') return 'DOC';
    if (ext === 'jpg' || ext === 'jpeg' || ext === 'png') return 'Image';
    return ext?.toUpperCase() || 'FILE';
  };

  return (
    <div className="task-detail-app">
      <main className="task-detail-main">
        {/* Back Button */}
        <button className="back-button" onClick={handleBack}>
          <IoChevronBackOutline className="icon-md" /> Back
        </button>

        {/* Header */}
        <div className="task-header">
          <div className="task-icon">
            <PiClipboardTextBold className="icon-lg" />
          </div>
          <h1 className="task-title">Project Proposal</h1>
          <div className="task-status">
            {isCompleted ? (
              <span style={{ color: '#4CAF50', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                </svg>
                Completed
              </span>
            ) : (
              'Assigned'
            )}
          </div>
        </div>

        {/* Meta Info */}
        <div className="task-meta">
          <div className="task-category">Research</div>
          <div className="task-due">Due August 4, 2025 11:59 PM</div>
        </div>

        {/* Author & Date */}
        <div className="task-author">
          Edward R. Manuel • Posted on August 3, 2025
        </div>

        {/* Description */}
        <div className="task-description">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </div>

        {/* Actions */}
        <TaskActions 
          onFileChange={handleFileChange} 
          onComplete={handleComplete} 
          isCompleted={isCompleted} 
        />

        {/* Attached Files */}
        {attachedFiles.length > 0 && (
          <AttachedFiles
            files={attachedFiles}
            onRemove={handleRemoveFile}
            isCompleted={isCompleted}
          />
        )}

        {/* Comment Link */}
        <div className="comment-link" onClick={toggleCommentBox}>
          <RiAccountPinBoxLine className="icon-md" /> Add comment
        </div>

        {/* Comment Box */}
        {showCommentBox && (
          <CommentBox
            comment={comment}
            setComment={setComment}
            onSubmit={handleCommentSubmit}
            disabled={isCompleted}
          />
        )}
      </main>
    </div>
  );
};

export default TaskDetailPage;