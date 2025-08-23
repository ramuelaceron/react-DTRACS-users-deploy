// src/pages/TaskDetail/TaskDetailPage.js
import React, { useState } from 'react';
import { useNavigate, useParams, useMatch } from 'react-router-dom';
import './TaskDetailPage.css';
import CommentBox from '../../components/CommentBox/CommentBox';
import AttachedFiles from '../../components/AttachedFiles/AttachedFiles';
import TaskActions from '../../components/TaskActions/TaskActions';
import { IoChevronBackOutline } from "react-icons/io5";
import { RiAccountPinBoxLine } from "react-icons/ri";
import { PiClipboardTextBold } from "react-icons/pi";
import { FaFilePdf, FaFileWord, FaFileImage, FaFile } from "react-icons/fa";
import { sectionData } from "../../data/focals";

// Utility to create slug
const createSlug = (str) => {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
};

const TaskDetailPage = () => {
  const navigate = useNavigate();
  const { sectionId, taskSlug } = useParams(); // e.g., SMME, project-proposal

  // Find the section
  const section = sectionData[sectionId];

  // Recover task and focal from sectionData
  let focalEntry = null;
  let task = null;

  if (section && Array.isArray(section)) {
    for (const item of section) {
      const matchingTask = item.tasklist?.find(t => createSlug(t.title) === taskSlug);
      if (matchingTask) {
        focalEntry = item;
        task = matchingTask;
        break;
      }
    }
  }

  // If not found, show error
  if (!focalEntry || !task) {
    return (
      <div className="task-detail-app">
        <main className="task-detail-main">
          <button className="back-button" onClick={() => navigate(-1)}>
            <IoChevronBackOutline className="icon-md" /> Back
          </button>
          <div className="error-container">
            <p>⚠️ Task not found.</p>
            <small>Check the URL or go back to the task list.</small>
          </div>
        </main>
      </div>
    );
  }

  // Extract data from found entries
  const { title: focalTitle, focalPerson } = focalEntry;
  const { title: taskTitle, dueTime, dueDate = 'N/A', postDate = 'Today', description: taskDescription } = task;

  // Local state
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
      icon: getFileIcon(file),
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
    setShowCommentBox(prev => !prev);
  };

  const getFileIcon = (file) => {
    const ext = file?.name.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') return <FaFilePdf />;
    if (['doc', 'docx'].includes(ext)) return <FaFileWord />;
    if (['jpg', 'jpeg', 'png'].includes(ext)) return <FaFileImage />;
    return <FaFile />;
  };

  const getFileType = (file) => {
    const ext = file?.name.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') return 'PDF';
    if (['doc', 'docx'].includes(ext)) return 'DOC';
    if (['jpg', 'jpeg', 'png'].includes(ext)) return 'Image';
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
          <h1 className="task-title">{taskTitle}</h1>
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
          <div className="task-category">{focalTitle}</div>
          <div className="task-due">Due {dueDate} at {dueTime}</div>
        </div>

        {/* Author & Date */}
        <div className="task-author">
          {focalPerson} • Posted on {postDate}
        </div>

        {/* Description */}
        <div className="task-description">
          {taskDescription}
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

        {/* Add Comment Button */}
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