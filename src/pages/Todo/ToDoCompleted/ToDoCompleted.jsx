// src/pages/Todo/completed/ToDocompleted.jsx
import React, { useState, useEffect } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { PiClipboardTextBold } from "react-icons/pi";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { createSlug } from "../../../utils/idGenerator";
import "./ToDoCompleted.css";
import {
  formatDate,
  formatTime,
  getWeekday,
} from "../../../utils/taskHelpers";

const ToDoCompleted = () => {
  const { 
    completedTasks, 
    selectedSort, 
    loading, 
    hasLoaded,
    selectedOffice,
    getOfficeEmptyMessage
  } = useOutletContext();

  // Group tasks by formatted completion date (fallback to creation_date)
  const groupedByDate = completedTasks.reduce((groups, task) => {
    const formattedDate = formatDate(task.completedTime || task.creation_date);
    if (!groups[formattedDate]) groups[formattedDate] = [];
    groups[formattedDate].push(task);
    return groups;
  }, {});

  // Sort dates based on selected sort option
  const sortedDates = Object.keys(groupedByDate).sort((a, b) => {
    try {
      if (selectedSort === "oldest") {
        return new Date(a) - new Date(b);
      } else {
        return new Date(b) - new Date(a); // Default: newest first
      }
    } catch (error) {
      return 0;
    }
  });

  // Track open/closed state for each date group
  const [openGroups, setOpenGroups] = useState(() =>
    sortedDates.reduce((acc, date) => ({ ...acc, [date]: true }), {})
  );

  useEffect(() => {
    if (sortedDates.length > 0 && Object.keys(openGroups).length === 0) {
      setOpenGroups(sortedDates.reduce((acc, date) => ({ ...acc, [date]: true }), {}));
    }
  }, [sortedDates, openGroups]);

  const toggleGroup = (date) => {
    setOpenGroups((prev) => ({
      ...prev,
      [date]: !prev[date],
    }));
  };

  // Get appropriate empty message based on filter
  const getEmptyMessage = () => {
    switch (selectedSort) {
      case "today":
        return selectedOffice === "All Offices"
          ? `No tasks due today for ${selectedOffice}.`
          : `No tasks due today for ${selectedOffice}.`;
      case "week":
        return selectedOffice === "All Offices"
          ? `No tasks due this week for ${selectedOffice}.`
          : `No tasks due this week for ${selectedOffice}.`;
      case "month":
        return selectedOffice === "All Offices"
          ? `No tasks due this month for ${selectedOffice}.`
          : `No tasks due this month for ${selectedOffice}.`;
      default:
        return getOfficeEmptyMessage("completed");
    }
  };

  return (
    <div className="completed-app">
      <main className="completed-main">
        {loading ? (
          <div className="completed-loading">
            <div className="completed-spinner"></div>
            <p>Loading tasks...</p>
          </div>
        ) : hasLoaded && sortedDates.length === 0 ? (
          <div className="completed-no-tasks">
            {getEmptyMessage()}
          </div>
        ) : (
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

                  <div className="completed-header-actions">
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
                        to={`/todo/${task.sectionId}/${createSlug(task.title)}`}
                        state={{
                          taskTitle: task.title,
                          links: task.links,
                          deadline: task.deadline,
                          creation_date: task.creation_date,
                          taskDescription: task.description,
                          taskId: task.task_id,
                          creator_name: task.creator_name,
                          section_designation: task.section_designation,
                          full_name: task.creator_name
                        }}
                        className="completed-task-link"
                        key={`${task.task_id}-${task.title}`}
                      >
                        {/* ✅ Use CSS-aligned structure here */}
                        <div className="completed-task-item">
                          <div className="completed-task-header">
                            <div className="completed-task-icon">
                              <PiClipboardTextBold />
                            </div>
                            <div className="completed-task-info">
                              <h3 className="completed-task-title">{task.title}</h3>
                              <div className="completed-task-office">{task.office}</div>
                            </div>
                            <div className="completed-task-deadline">
                              Completed on {formatDate(task.completedTime)} at{" "}
                              <span className="completed-time">{formatTime(task.completedTime)}</span>
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
        )}
      </main>
    </div>
  );
};

export default ToDoCompleted;