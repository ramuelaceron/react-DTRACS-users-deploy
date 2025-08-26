// src/pages/Todo/PastDue/PastDue.jsx
import React, { useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { PiClipboardTextBold } from "react-icons/pi";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import "./PastDue.css";

// Helper: Convert date string to Date object for sorting
const parseDate = (dateStr) => {
  const [month, day, year] = dateStr.split(" ");
  const monthNames = {
    January: 0,
    February: 1,
    March: 2,
    April: 3,
    May: 4,
    June: 5,
    July: 6,
    August: 7,
    September: 8,
    October: 9,
    November: 10,
    December: 11,
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

const PastDue = () => {
  // ✅ Get pre-filtered past-due tasks from ToDoPage layout
  const { pastDueTasks } = useOutletContext();

  // Group tasks by postDate
  const groupedByDate = pastDueTasks.reduce((groups, task) => {
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
    <div className="pastdue-app">
      <main className="pastdue-main">
        {/* ❌ Removed: <TaskTabs /> — already in ToDoPage layout */}

        {/* Task List Grouped by postDate */}
        {sortedDates.length > 0 ? (
          sortedDates.map((date) => {
            const tasks = groupedByDate[date];
            const weekday = getWeekday(date);
            const isOpen = openGroups[date];

            return (
              <div key={date} className="pastdue-date-group">
                <div
                  className="pastdue-date-header"
                  onClick={() => toggleGroup(date)}
                  style={{ cursor: "pointer", userSelect: "none" }}
                >
                  <span className="pastdue-date-bold">{date}</span>
                  <span className="pastdue-weekday"> ({weekday})</span>

                  <div className="header-actions">
                    <span className="pastdue-task-count">{tasks.length}</span>
                    <span
                      className="pastdue-dropdown-arrow"
                      aria-label={isOpen ? "Collapse" : "Expand"}
                    >
                      {isOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
                    </span>
                  </div>
                </div>

                {isOpen && (
                  <div className="pastdue-task-list">
                    {tasks.map((task) => (
                      <Link
                        to={`/SGOD/${task.sectionId}/task-list/${task.taskSlug}`}
                        className="pastdue-task-link"
                        key={task.id}
                      >
                        <div className="pastdue-card">
                          <div className="pastdue-card-content">
                            <div className="pastdue-card-text">
                              <div className="pastdue-task-icon">
                                <PiClipboardTextBold className="icon-lg" />
                              </div>
                              <div>
                                <div className="pastdue-card-title">
                                  {task.title}
                                </div>
                                <div className="pastdue-card-meta">
                                  <span className="pastdue-office">
                                    {task.office}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="pastdue-card-deadline">
                              <span className="deadline-text">
                                Due on {task.dueDate} at{" "}
                                <span className="time">{task.dueTime}</span>
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
          <div className="pastdue-no-tasks">No past-due tasks.</div>
        )}
      </main>
    </div>
  );
};

export default PastDue;