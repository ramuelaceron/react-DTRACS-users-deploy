// src/pages/Todo/Completed/Completed.jsx
import React, { useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { PiClipboardTextBold } from "react-icons/pi";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import "./TaskHistory.css";

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

const TaskHistory = () => {
  // ✅ Get pre-filtered completed tasks from ToDoPage layout
  const { completedTasks } = useOutletContext();

  // Group tasks by formatted completion date (using completedTime)
  const groupedByDate = completedTasks.reduce((groups, task) => {
    const formattedDate = formatDate(task.completedTime || task.creation_date);
    if (!groups[formattedDate]) groups[formattedDate] = [];
    groups[formattedDate].push(task);
    return groups;
  }, {});

  // Sort dates: newest first
  const sortedDates = Object.keys(groupedByDate).sort((a, b) => {
    try {
      return new Date(b) - new Date(a);
    } catch (error) {
      return 0;
    }
  });

  // Track open/closed state for each group
  const [openGroups, setOpenGroups] = useState(() =>
    sortedDates.reduce((acc, date) => ({ ...acc, [date]: true }), {})
  );

  const toggleGroup = (date) => {
    setOpenGroups((prev) => ({
      ...prev,
      [date]: !prev[date],
    }));
  };

  return (
    <div className="history-app">
      <main className="history-main">
        {/* Task List Grouped by completion date */}
        {sortedDates.length > 0 ? (
          sortedDates.map((date) => {
            const tasks = groupedByDate[date];
            const weekday = getWeekday(date);
            const isOpen = openGroups[date];

            return (
              <div key={date} className="history-date-group">
                <div
                  className="history-date-header"
                  onClick={() => toggleGroup(date)}
                  style={{ cursor: "pointer", userSelect: "none" }}
                >
                  <span className="history-date-bold">{date}</span>
                  <span className="history-weekday"> ({weekday})</span>

                  <div className="header-actions">
                    <span className="history-task-count">{tasks.length}</span>
                    <span
                      className="history-dropdown-arrow"
                      aria-label={isOpen ? "Collapse" : "Expand"}
                    >
                      {isOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
                    </span>
                  </div>
                </div>

                {isOpen && (
                  <div className="history-task-list">
                    {tasks.map((task) => (
                      <Link
                        to={`/task/${task.sectionId}/${task.taskSlug}`}
                        state={{
                          taskTitle: task.title,
                          deadline: task.deadline,
                          creation_date: task.creation_date,
                          taskDescription: task.description,
                          taskId: task.id,
                          creator_name: task.creator_name,
                          section_designation: task.section_designation,
                          full_name: task.creator_name,
                          task_status: "Completed"
                        }}
                        className="history-task-link"
                        key={task.id}
                      >
                        <div className="history-card">
                          <div className="history-card-content">
                            <div className="history-card-text">
                              <div className="history-task-icon">
                                <PiClipboardTextBold className="icon-lg" />
                              </div>
                              <div>
                                <div className="history-card-title">
                                  {task.title}
                                </div>
                                <div className="history-card-meta">
                                  <span className="history-office">
                                    {task.office}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="history-card-completion">
                              <span className="history-text">
                                ✔ Completed on {formatDate(task.completedTime || task.creation_date)} at{" "}
                                <span className="time">{formatTime(task.completedTime || task.creation_date)}</span>
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
          <div className="history-no-tasks">No completed tasks.</div>
        )}
      </main>
    </div>
  );
};

export default TaskHistory;