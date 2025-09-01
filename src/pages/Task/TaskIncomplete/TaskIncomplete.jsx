// src/pages/Todo/PastDue/PastDue.jsx
import React, { useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { PiClipboardTextBold } from "react-icons/pi";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import "./TaskIncomplete.css";

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

const TaskIncomplete = () => {
  // ✅ Get pre-filtered past-due tasks from ToDoPage layout
  const { pastDueTasks } = useOutletContext();

  // Group tasks by formatted creation date
  const groupedByDate = pastDueTasks.reduce((groups, task) => {
    const formattedDate = formatDate(task.creation_date);
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
    <div className="incomplete-app">
      <main className="incomplete-main">
        {/* Task List Grouped by creation date */}
        {sortedDates.length > 0 ? (
          sortedDates.map((date) => {
            const tasks = groupedByDate[date];
            const weekday = getWeekday(date);
            const isOpen = openGroups[date];

            return (
              <div key={date} className="incomplete-date-group">
                <div
                  className="incomplete-date-header"
                  onClick={() => toggleGroup(date)}
                  style={{ cursor: "pointer", userSelect: "none" }}
                >
                  <span className="incomplete-date-bold">{date}</span>
                  <span className="incomplete-weekday"> ({weekday})</span>

                  <div className="incomplete-header-actions">
                    <span className="incomplete-task-count">{tasks.length}</span>
                    <span
                      className="incomplete-dropdown-arrow"
                      aria-label={isOpen ? "Collapse" : "Expand"}
                    >
                      {isOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
                    </span>
                  </div>
                </div>

                {isOpen && (
                  <div className="incomplete-task-list">
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
                          full_name: task.creator_name
                        }}
                        className="incomplete-task-link"
                        key={task.id}
                      >
                        <div className="incomplete-card">
                          <div className="incomplete-card-content">
                            <div className="incomplete-card-text">
                              <div className="incomplete-task-icon">
                                <PiClipboardTextBold className="icon-lg" />
                              </div>
                              <div>
                                <div className="incomplete-card-title">
                                  {task.title}
                                </div>
                                <div className="incomplete-card-meta">
                                  <span className="incomplete-office">
                                    {task.office}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="incomplete-card-deadline">
                              <span className="deadline-text">
                                Was due on {formatDate(task.deadline)} at{" "}
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
          <div className="incomplete-no-tasks">No past-due tasks.</div>
        )}
      </main>
    </div>
  );
};

export default TaskIncomplete;