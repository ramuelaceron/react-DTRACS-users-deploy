// src/pages/TaskDetailPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import "./TaskDetailPage.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoChevronBackOutline } from "react-icons/io5";

// Components
import TaskDescription from "../../components/TaskDetailComponents/TaskDescription/TaskDescription";
import SchoolStats from "../../components/TaskDetailComponents/SchoolStats/SchoolStats";

// Mock Data
import { taskData } from "../../data/taskData";

const TaskDetailPage = () => {
  const navigate = useNavigate();
  const { sectionId } = useParams();
  const { state } = useLocation();

  const [isCompleted, setIsCompleted] = useState(false);
  const [isLate, setIsLate] = useState(false);

  const taskTitle = state?.taskTitle;
  const taskDeadline = state?.deadline;
  const taskCreationDate = state?.creation_date;
  const taskDescription = state?.taskDescription;
  const taskId = state?.taskId;
  const creator_name = state?.creator_name || "Unknown Creator";

  const section = taskData[sectionId];
  let task = null;

  if (section && Array.isArray(section) && taskId) {
    for (const item of section) {
      const match = item.tasklist?.find((t) => t.task_id === taskId);
      if (match) {
        task = match;
        break;
      }
    }
  }

  if (!task && taskTitle && section && Array.isArray(section)) {
    for (const item of section) {
      const match = item.tasklist?.find((t) => t.title === taskTitle);
      if (match) {
        task = match;
        break;
      }
    }
  }

  useEffect(() => {
    const status = task?.task_status;
    if (status === "Completed") {
      setIsCompleted(true);
      setIsLate(false);
    } else if (status === "Incomplete") {
      setIsCompleted(false);
      setIsLate(true);
    } else {
      setIsCompleted(false);
      setIsLate(false);
    }
  }, [task?.task_status]);

  const handleBack = () => navigate(-1);

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

  return (
    <div className="task-detail-page">
      <div className="task-detail-left">
        <button className="task-back-btn" onClick={handleBack}>
          <IoChevronBackOutline className="icon-md" /> Back
        </button>
          <TaskDescription
            task={task}
            creator_name={creator_name}
            creation_date={taskCreationDate}
            deadline={taskDeadline}
            description={taskDescription}
            isCompleted={isCompleted}
            isLate={isLate}
          />
      </div>

      <div className="task-detail-right">
        <SchoolStats task={task} taskId={taskId} sectionId={sectionId} />
      </div>

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