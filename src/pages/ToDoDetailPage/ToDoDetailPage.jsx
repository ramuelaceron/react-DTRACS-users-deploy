// src/pages/ToDoDetailPage/ToDoDetailPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { IoChevronBackOutline } from "react-icons/io5";
import { PiClipboardTextBold, PiLinkSimple } from "react-icons/pi";
import AttachedFiles from "../../components/AttachedFiles/AttachedFiles";
import TaskActions from "../../components/TaskActions/TaskActions";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ToDoDetailPage.css";
import { formatDate, formatTime } from "../../utils/dateUtils";
import { getRemarksStatusInfo } from "../../utils/taskStatusUtils";
import { fetchTaskDetails, updateTaskStatus, revertTaskStatus } from "../../api/taskApi";

const ToDoDetailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;

  // Extract task info from state
  const taskId = state?.taskId;
  const taskinks = state?.links || []; // may be array of strings or objects
  const taskTitle = state?.taskTitle;
  const taskLinks = state?.links || [];
  const taskDeadline = state?.deadline;
  const taskCreationDate = state?.creation_date;
  const taskDescription = state?.taskDescription;

  console.log("📍 Location state:", state);

  // Normalize taskinks: ensure it's array of { url: string }
  const normalizedTaskLinks = Array.isArray(taskinks)
    ? taskinks.map(item =>
        typeof item === "string" ? { url: item } : item?.url ? item : { url: "" }
      ).filter(item => item.url)
    : [];

  // State
  const [attachedLinks, setAttachedLinks] = useState(normalizedTaskLinks);
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [revisionLinks, setRevisionLinks] = useState([]);

  // Get current user
  const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
  const schoolUserId = currentUser?.user_id;
  const token = currentUser?.token;

  // Auto-refresh logic
  useEffect(() => {
    const loadTask = async () => {
      if (!taskId || !schoolUserId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const enrichedTask = await fetchTaskDetails(taskId, schoolUserId, token);
        setTask(enrichedTask);
        setIsCompleted(
          enrichedTask.assigned_response?.remarks === 'TURNED IN ON TIME' || 
          enrichedTask.assigned_response?.remarks === 'TURNED IN LATE'
        );
        // Initialize attachedLinks from task's submitted_links if they exist
        if (enrichedTask.submitted_links && enrichedTask.submitted_links.length > 0) {
          setAttachedLinks(enrichedTask.submitted_links.map(url => ({ url })));
        }
      } catch (err) {
        console.error("Error fetching task:", err);
        setError(err.message || "Failed to load task details.");
      } finally {
        setLoading(false);
      }
    };

    loadTask();
  }, [taskId, schoolUserId, token]);

  // Handlers
  const handleBack = () => navigate(-1);

  const handleLinksChange = (links) => {
    setAttachedLinks(links);
  };

  const handleRemoveLink = (index) => {
    setAttachedLinks(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddRevision = (newLink) => {
    setRevisionLinks(prev => [...prev, { ...newLink, id: Date.now() }]);
    toast.info("Revision link added!");
  };

  // Submit task logic — NO CONFIRMATIONS
  const handleComplete = async () => {
    const invalidLinks = attachedLinks.filter(link =>
      link && link.url && !/^(https?:\/\/)/i.test(link.url.trim())
    );

    if (invalidLinks.length > 0) {
      toast.error("Please enter valid URLs starting with http:// or https://");
      return;
    }

    // Proceed directly
    proceedWithSubmission(
      task?.assigned_response?.remarks === 'TURNED IN ON TIME' || 
      task?.assigned_response?.remarks === 'TURNED IN LATE'
    );
  };

  const proceedWithSubmission = async (wasPreviouslyCompleted) => {
    const now = new Date();
    const deadline = new Date(task.deadline);
    const isOnTime = now <= deadline;
    const submissionRemarks = isOnTime ? 'TURNED IN ON TIME' : 'TURNED IN LATE';

    // ✅ SEND ALL LINKS to backend
    const updatePayload = {
      task_id: task.task_id,
      school_id: schoolUserId,
      status: 'COMPLETE',
      remarks: submissionRemarks,
      link: attachedLinks.length > 0 ? attachedLinks[0].url : '', // Keep main link for compatibility
      revision_links: revisionLinks.map(link => link.url),
      attached_links: attachedLinks.map(link => link.url) // ✅ NEW: Send ALL user-attached links
    };

    // 🐞 DEBUG: LOG THE PAYLOAD BEFORE SENDING
    console.log("🚀 Sending to backend - updatePayload:", updatePayload);
    console.log("🔗 Attached Links being sent:", attachedLinks);
    console.log("📎 Attached Links (URLs only):", updatePayload.attached_links);

    try {
      setIsSubmitting(true);
      
      await updateTaskStatus(updatePayload, token);

      // ✅ UPDATE TASK STATE to include submitted_links so they persist in UI
      setTask(prevTask => ({
        ...prevTask,
        assigned_response: {
          ...prevTask.assigned_response,
          remarks: submissionRemarks,
          status_updated_at: new Date().toISOString()
        },
        submitted_links: attachedLinks.map(link => link.url) // ✅ Persist links in task state
      }));

      setRevisionLinks([]);
      setIsCompleted(true);
      setIsSubmitting(false);

      const successMessage = wasPreviouslyCompleted ? "Task resubmitted successfully!" : "Task submitted successfully!";
      toast.success(successMessage);

    } catch (err) {
      console.error("Submission error:", err);
      toast.error(err.message || "Failed to submit task. Please try again.");
      setIsSubmitting(false);
    }
  };

  // Cancel submission — NO CONFIRMATION
  const handleIncomplete = async () => {
    const remarks = task?.assigned_response?.remarks;
    if (remarks === 'TURNED IN ON TIME' || remarks === 'TURNED IN LATE') {
      proceedWithCancellation();
    } else {
      toast.info("Task is already in a non-submitted state.");
    }
  };

  const proceedWithCancellation = async () => {
    try {
      await revertTaskStatus(task.task_id, schoolUserId, token);

      setTask(prevTask => ({
        ...prevTask,
        assigned_response: {
          ...prevTask.assigned_response,
          remarks: 'PENDING'
        },
        submitted_links: [] // Clear submitted links on cancellation
      }));

      setAttachedLinks([]); // Reset local state
      setRevisionLinks([]);
      setIsCompleted(false);
      
      toast.info("Submission cancelled. Task is now pending.");

    } catch (err) {
      console.error("Revert error:", err);
      toast.error("Failed to cancel submission. Please try again.");
    }
  };

  // Calculate status info
  const now = new Date();
  const remarks = task?.assigned_response?.remarks || 'PENDING';
  const statusInfo = getRemarksStatusInfo(remarks, task?.deadline, now);
  const isDeadlinePassed = task?.deadline && new Date(task.deadline) < now;

  // Loading/Error states
  if (loading) {
    return (
      <div className="todo-detail-app">
        <main className="todo-detail-main">
          <button className="todo-back-btn" onClick={handleBack}>
            <IoChevronBackOutline className="icon-md" /> Back
          </button>
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading task details...</p>
          </div>
        </main>
        <ToastContainer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="todo-detail-app">
        <main className="todo-detail-main">
          <button className="todo-back-btn" onClick={handleBack}>
            <IoChevronBackOutline className="icon-md" /> Back
          </button>
          <div className="error-container">
            <p>⚠️ {error}</p>
          </div>
        </main>
        <ToastContainer />
      </div>
    );
  }

  if (!task) {
    return (
      <div className="todo-detail-app">
        <main className="todo-detail-main">
          <button className="todo-back-btn" onClick={handleBack}>
            <IoChevronBackOutline className="icon-md" /> Back
          </button>
          <div className="error-container">
            <p>⚠️ Task not found.</p>
          </div>
        </main>
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className="todo-detail-app">
      <main className="todo-detail-main">
        <button 
        className={`todo-back-btn`} 
        onClick={handleBack}>
          <IoChevronBackOutline className="icon-md" /> Back
        </button>

        <div className="todo-header">
          <div className="todo-icon" style={{ background: statusInfo.color }}>
            <PiClipboardTextBold className="icon-lg" style={{ color: "white" }} />
          </div>
          <h1 className="todo-title">{task.title || taskTitle}</h1>
          <div className="todo-status">
            {statusInfo.isCompleted ? (
              <span style={{ color: statusInfo.color, display: "flex", alignItems: "center", gap: "4px" }}>
                {statusInfo.text}
              </span>
            ) : statusInfo.isPastDue ? (
              <span style={{ color: statusInfo.color, display: "flex", alignItems: "center", gap: "4px", fontWeight: "bold" }}>
                {statusInfo.text}
              </span>
            ) : (
              <span style={{ color: statusInfo.color, display: "flex", alignItems: "center", gap: "4px", fontWeight: "bold" }}>
                {isDeadlinePassed && remarks === 'PENDING' && "⚠️ "}
                {statusInfo.text}
              </span>
            )}
          </div>
        </div>

        <div className="todo-meta">
          <div className="todo-category">{task.section}</div>
          <div className="todo-due">
            Due {formatDate(task.deadline || taskDeadline)} at {formatTime(task.deadline || taskDeadline)}
            {isDeadlinePassed && remarks === 'PENDING' && (
              <span style={{ color: '#D32F2F', marginLeft: '8px', fontWeight: 'bold', animation: 'pulse 1.5s infinite' }}>
                (Overdue)
              </span>
            )}
          </div>
        </div>

        <div className="divider" />

        <div className="todo-author">
          {task.creator_name || "Unknown Creator"} • Posted on {formatDate(task.creation_date || taskCreationDate)}
        </div>

        <div className="todo-description">
          {task.description || taskDescription || <em>No description</em>}
        </div>

        {/* Display Original Links from state */}
        {normalizedTaskLinks.length > 0 && (
          <div className="todo-links-section">
            <h3 className="todo-links-title">Links</h3>
            <ul className="todo-links-list">
              {normalizedTaskLinks.map((link, index) => (
                <li key={index} className="todo-link-item">
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="todo-link"
                  >
                    {link.url}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        <TaskActions
          onComplete={handleComplete}
          onIncomplete={handleIncomplete}
          isCompleted={isCompleted}
          onLinksChange={handleLinksChange}
          links={attachedLinks}
          isSubmitDisabled={isCompleted || isSubmitting}
          isSubmitting={isSubmitting}
          onAddRevision={handleAddRevision}
        />

        {/* ✅ Display User-Attached Links: Use submitted_links if task is completed */}
        {(attachedLinks.length > 0 || task?.submitted_links?.length > 0) && (
          <AttachedFiles
            links={isCompleted ? (task?.submitted_links?.map(url => ({ url })) || []) : attachedLinks}
            onRemoveLink={handleRemoveLink}
            isCompleted={isCompleted}
          />
        )}

        {/* Revision Links */}
        {revisionLinks.length > 0 && (
          <div className="revision-section">
            <h3 className="revision-title">Revision Links</h3>
            <AttachedFiles
              links={revisionLinks}
              onRemoveLink={(index) => {
                setRevisionLinks(prev => prev.filter((_, i) => i !== index));
              }}
              isCompleted={isCompleted}
            />
          </div>
        )}

      </main>

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

export default ToDoDetailPage;