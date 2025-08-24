// src/pages/TaskDetail/TaskDetailPage.js
import React, { useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./TaskDetailPage.css";
import { FaFilePdf, FaFileWord, FaFileImage, FaFile } from "react-icons/fa";
import { IoChevronBackOutline } from "react-icons/io5";
import { RiAccountPinBoxLine } from "react-icons/ri";
import { PiClipboardTextBold } from "react-icons/pi";
import CommentBox from "../../components/CommentBox/CommentBox";
import AttachedFiles from "../../components/AttachedFiles/AttachedFiles";
import TaskActions from "../../components/TaskActions/TaskActions";
import CommentList from "../../components/CommentList/CommentList";
import SharedButton from "../../components/SharedButton/SharedButton";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useClickOutside from "../../hooks/useClickOutside";
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

  const [attachedFiles, setAttachedFiles] = useState([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);

  // Current user
  const currentUser = {
    name: "Juan Dela Cruz",
    school: "BINHS",
  };

  // Inline edit state
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  // Refs
  const commentBoxRef = useRef(null);
  const editTextareaRef = useRef(null);

  // Close comment box when clicking outside
  useClickOutside(commentBoxRef, () => {
    if (showCommentBox) setShowCommentBox(false);
  });

  // 🔍 Find the task and focal entry in sectionData
  const section = sectionData[sectionId];
  let focalEntry = null;
  let task = null;

  if (section && Array.isArray(section)) {
    for (const item of section) {
      const match = item.tasklist?.find(t => createSlug(t.title) === taskSlug);
      if (match) {
        focalEntry = item;
        task = match;
        break;
      }
    }
  }

  // If not found, show error
  if (!focalEntry || !task) {
    return (
      <div className="task-detail-app">
        <main className="task-detail-main">
          <button className="back-button" onClick={navigate(-1)}>
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

  // Extract data from found entries
  const { title: focalTitle, focalPerson } = focalEntry;
  const {
    title: taskTitle,
    dueTime,
    dueDate = 'N/A',
    postDate = 'Today',
    description: taskDescription
  } = task;

  // Handlers
  const handleBack = () => navigate(-1);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    if (files.length + attachedFiles.length > 6) {
      toast.warn("You can only attach up to 6 files.");
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
      toast.error("Please attach at least one file before completing.");
      return;
    }
    setIsCompleted(true);
    toast.success("Task marked as completed!");
  };

  const handleIncomplete = () => {
    setIsCompleted(false);
    toast.info("Task status reverted.");
  };

  const handleCommentSubmit = (html) => {
    if (!html || !html.trim() || html === "<p><br></p>") {
      toast.warn("Please enter a comment.");
      return;
    }

    const newComment = {
      id: Date.now(),
      author: currentUser.name,
      school: currentUser.school,
      time: new Date().toLocaleString("en-US", {
        month: "numeric",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }).replace(/,/g, ""),
      text: html,  // <-- now using HTML from CommentBox
      isEdited: false,
    };

    setComments(prev => [...prev, newComment]);
    setShowCommentBox(false);
    toast.success("Comment added successfully!");
  };

  const handleEditStart = (c) => {
    setEditingId(c.id);
    setEditText(c.text);
    setTimeout(() => {
      if (editTextareaRef.current) {
        editTextareaRef.current.style.height = "auto";
        editTextareaRef.current.style.height = `${editTextareaRef.current.scrollHeight}px`;
        editTextareaRef.current.focus();
      }
    }, 0);
  };

  const handleEditSave = () => {
    if (!editText.trim()) {
      toast.warn("Comment cannot be empty.");
      return;
    }

    setComments(prev =>
      prev.map(c =>
        c.id === editingId ? { ...c, text: editText.trim(), isEdited: true } : c
      )
    );

    setEditingId(null);
    setEditText("");
    toast.info("Comment updated!");
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditText("");
  };

  const handleDeleteComment = (id) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      setComments(prev => prev.filter(c => c.id !== id));
      toast.error("Comment deleted.");
    }
  };

  const toggleCommentBox = () => {
    setShowCommentBox(!showCommentBox);
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

         {/* Divider Line */}
        <div className="divider"></div>

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
          onIncomplete={handleIncomplete}
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
        <SharedButton
          variant="text"
          size="medium"
          onClick={toggleCommentBox}
          aria-label="Add comment"
        >
          <RiAccountPinBoxLine className="icon-md" /> Add comment
        </SharedButton>

        {/* Comment Input Box */}
        {showCommentBox && (
          <div ref={commentBoxRef}>
            <CommentBox
              onSubmit={handleCommentSubmit}
              disabled={isCompleted}
            />
          </div>
        )}

        {/* Comment List */}
        {comments.length > 0 && (
          <CommentList
            comments={comments}
            editingId={editingId}
            editText={editText}
            setEditText={setEditText}
            onEdit={handleEditStart}
            onSaveEdit={handleEditSave}
            onCancelEdit={handleEditCancel}
            onDelete={handleDeleteComment}
            currentUser={currentUser}
          />
        )}
      </main>

      {/* Toast Notifications */}
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
    </div>
  );
};

export default TaskDetailPage;