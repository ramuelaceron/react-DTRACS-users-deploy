// src/pages/Todo/Upcoming/Upcoming.jsx
import React, { useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { PiClipboardTextBold } from "react-icons/pi";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import "./TaskOngoing.css";

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

const TaskOngoing = () => {
  // ✅ Get pre-filtered upcoming tasks from ToDoPage layout
  const { upcomingTasks } = useOutletContext();

  // ✅ No local state for filtering — it's already done in ToDoPage
  const hasUpcomingTasks = upcomingTasks.length > 0;

  // Group tasks by postDate
  const groupedByDate = upcomingTasks.reduce((groups, task) => {
    const date = task.postDate;
    if (!groups[date]) groups[date] = [];
    groups[date].push(task);
    return groups;
  }, {});

  // Sort dates: newest first
  const sortedDates = Object.keys(groupedByDate).sort((a, b) => parseDate(b) - parseDate(a));

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

  return (
    <div className="ongoing-app">
      <main className="ongoing-main">
        {/* Task List Grouped by postDate */}
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
                        to={`/task/ongoing/${task.taskSlug}`}
                        className="ongoing-task-link"
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
                                </div>
                              </div>
                            </div>

                            <div className="ongoing-card-deadline">
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
          <div className="ongoing-no-tasks">
            No upcoming tasks
          </div>
        )}
      </main>
    </div>
  );
};

export default TaskOngoing;