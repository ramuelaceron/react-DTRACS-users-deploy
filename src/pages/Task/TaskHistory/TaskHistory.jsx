// src/pages/Todo/Completed/Completed.jsx
import React, { useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { PiClipboardTextBold } from "react-icons/pi";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import "./TaskHistory.css";

// Helper: Convert date string to Date object for sorting
const parseDate = (dateStr) => {
  const [month, day, year] = dateStr.split(" ");
  const monthNames = {
    January: 0, February: 1, March: 2, April: 3, May: 4, June: 5,
    July: 6, August: 7, September: 8, October: 9, November: 10, December: 11,
  };
  return new Date(
    parseInt(year),
    monthNames[month],
    parseInt(day.replace(",", ""))
  );
};

// Helper: Get weekday from date string
const getWeekday = (dateStr) => {
  const date = parseDate(dateStr);
  if (isNaN(date)) return "";
  return date.toLocaleDateString("en-US", { weekday: "long" });
};

const TaskHistory = () => {
  // ✅ Get pre-filtered completed tasks from ToDoPage layout
  const { completedTasks } = useOutletContext();

  // Group tasks by postDate
  const groupedByDate = completedTasks.reduce((groups, task) => {
    const date = task.postDate;
    if (!groups[date]) groups[date] = [];
    groups[date].push(task);
    return groups;
  }, {});

  // Sort dates: newest first
  const sortedDates = Object.keys(groupedByDate).sort((a, b) => parseDate(b) - parseDate(a));

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
                        to={`/task/history/${task.taskSlug}`}
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
                                ✔ Completed at{" "}
                                <span className="time">{task.completedTime}</span>
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