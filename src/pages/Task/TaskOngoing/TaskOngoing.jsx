import React, { useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { PiClipboardTextBold } from "react-icons/pi";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { createSlug } from "../../../utils/idGenerator";
import CreateTask from '../../../components/CreateTask/CreateTask';
import "./TaskOngoing.css";


import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Helper: Format date from ISO string to readable format
const formatDate = (dateString) => {
  if (!dateString) return "No date";
  
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

// Helper: Format time from ISO string
const formatTime = (dateString) => {
  if (!dateString) return 'No time';
  
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

// Helper: Get weekday from date string
const getWeekday = (dateStr) => {
  try {
    const date = new Date(dateStr);
    if (isNaN(date)) return "";
    return date.toLocaleDateString("en-US", { weekday: "long" });
  } catch (error) {
    console.error('Error getting weekday:', error);
    return "";
  }
};

const TaskOngoing = () => {
  // ✅ Get pre-filtered upcoming tasks from ToDoPage layout
  const { upcomingTasks } = useOutletContext();

  // Group tasks by formatted deadline date
  const groupedByDate = upcomingTasks.reduce((groups, task) => {
    const formattedDate = formatDate(task.creation_date);
    if (!groups[formattedDate]) groups[formattedDate] = [];
    groups[formattedDate].push(task);
    return groups;
  }, {});

  // Sort dates: earliest first (upcoming tasks should show soonest first)
  const sortedDates = Object.keys(groupedByDate).sort((a, b) => {
    try {
      return new Date(a) - new Date(b);
    } catch (error) {
      return 0;
    }
  });

  // Track open/closed state for each date group
  const [openGroups, setOpenGroups] = useState(() =>
    sortedDates.reduce((acc, date) => ({ ...acc, [date]: true }), {})
  );

  const toggleGroup = (date) => {
    setOpenGroups((prev) => ({
      ...prev,
      [date]: !prev[date],
    }));
  };

  // ✅ Add new task with correct date from calendar
  const handleCreateTask = (newTaskData) => {
    const newTask = {
      id: Date.now(),
      title: newTaskData.title || "Untitled Task",
      description: newTaskData.description || "No description",
      time: "TBD", // You can enhance this later
      date: newTaskData.formattedDate // Comes from TaskForm
    };
  };

  return (
    <div className="ongoing-app">
      <main className="ongoing-main">
         <CreateTask onTaskCreated={(newTask) => {
          toast.success("Task created!");
        }} />
        {sortedDates.length > 0 ? (
          sortedDates.map((date) => {
            const tasks = groupedByDate[date];
            const weekday = getWeekday(date);
            const isOpen = openGroups[date];

            return (
              <div key={date} className="ongoing-date-group">
                <div
                  className="ongoing-date-header"
                  onClick={() => toggleGroup(date)}
                  style={{ cursor: "pointer", userSelect: "none" }}
                >
                  <span className="ongoing-date-bold">{date}</span>
                  <span className="ongoing-weekday"> ({weekday})</span>

                  <div className="header-actions">
                    <span className="ongoing-task-count">{tasks.length}</span>
                    <span
                      className="ongoing-dropdown-arrow"
                      aria-label={isOpen ? "Collapse" : "Expand"}
                    >
                      {isOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
                    </span>
                  </div>
                </div>

                {isOpen && (
                  <div className="ongoing-task-list">
                    {tasks.map((task) => (
                      <Link
                        to={`/task/${task.sectionId}/${createSlug(task.title)}`}
                        state={{
                          taskTitle: task.title,
                          deadline: task.deadline,
                          creation_date: task.creation_date,
                          taskDescription: task.description,
                          taskId: task.id,
                          creator_name: task.creator_name,
                          section_designation: task.section_designation,
                          full_name: task.creator_name
                        }}
                        className="upcoming-task-link"
                        key={task.id}
                      >
                        <div className="ongoing-card">
                          <div className="ongoing-card-content">
                            <div className="ongoing-card-text">
                              <div className="ongoing-task-icon">
                                <PiClipboardTextBold className="icon-lg" />
                              </div>
                              <div>
                                <div className="ongoing-card-title">
                                  {task.title}
                                </div>
                                <div className="ongoing-card-meta">
                                  <span className="ongoing-office">
                                    {task.office}
                                  </span>
                                  {/* <span className="upcoming-creator">
                                    • {task.creator_name}
                                  </span> */}
                                </div>
                              </div>
                            </div>

                            <div className="ongoing-card-deadline">
                              <span className="deadline-text">
                                Due on {formatDate(task.deadline)} at{" "}
                                <span className="time">{formatTime(task.deadline)}</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="ongoing-no-tasks">
            No upcoming tasks
          </div>
        )}
      </main>

       <ToastContainer
        position="top-right"
        autoClose={2000}
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

export default TaskOngoing;