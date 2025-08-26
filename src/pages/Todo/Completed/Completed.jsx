// src/pages/Todo/Completed/Completed.jsx
import React, { useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { PiClipboardTextBold } from "react-icons/pi";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import "./Completed.css";

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

const Completed = () => {
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
    <div className="completed-app">
      <main className="completed-main">
        {/* ❌ Removed: <TaskTabs /> — already rendered in ToDoPage layout */}

        {/* Task List Grouped by postDate */}
        {sortedDates.length > 0 ? (
          sortedDates.map((date) => {
            const tasks = groupedByDate[date];
            const weekday = getWeekday(date);
            const isOpen = openGroups[date];

            return (
              <div key={date} className="completed-date-group">
                <div
                  className="completed-date-header"
                  onClick={() => toggleGroup(date)}
                  style={{ cursor: "pointer", userSelect: "none" }}
                >
                  <span className="completed-date-bold">{date}</span>
                  <span className="completed-weekday"> ({weekday})</span>

                  <div className="header-actions">
                    <span className="completed-task-count">{tasks.length}</span>
                    <span
                      className="completed-dropdown-arrow"
                      aria-label={isOpen ? "Collapse" : "Expand"}
                    >
                      {isOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
                    </span>
                  </div>
                </div>

                {isOpen && (
                  <div className="completed-task-list">
                    {tasks.map((task) => (
                      <Link
                        to={`/SGOD/${task.sectionId}/task-list/${task.taskSlug}`}
                        className="completed-task-link"
                        key={task.id}
                      >
                        <div className="completed-card">
                          <div className="completed-card-content">
                            <div className="completed-card-text">
                              <div className="completed-task-icon">
                                <PiClipboardTextBold className="icon-lg" />
                              </div>
                              <div>
                                <div className="completed-card-title">
                                  {task.title}
                                </div>
                                <div className="completed-card-meta">
                                  <span className="completed-office">
                                    {task.office}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="completed-card-completion">
                              <span className="completion-text">
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
          <div className="completed-no-tasks">No completed tasks.</div>
        )}
      </main>
    </div>
  );
};

export default Completed;