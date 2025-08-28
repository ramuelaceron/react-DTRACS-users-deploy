// src/pages/Todo/PastDue/PastDue.jsx
import React, { useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { PiClipboardTextBold } from "react-icons/pi";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import "./TaskIncomplete.css";

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

const TaskIncomplete = () => {
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
    <div className="incomplete-app">
      <main className="incomplete-main">
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

                  <div className="header-actions">
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
                        to={`/task/incomplete/${task.taskSlug}`}
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
          <div className="incomplete-no-tasks">No past-due tasks.</div>
        )}
      </main>
    </div>
  );
};

export default TaskIncomplete;