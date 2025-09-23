// src/pages/Todo/pastdue/ToDopastdue.jsx
import React, { useState, useEffect } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { PiClipboardTextBold } from "react-icons/pi";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { createSlug } from "../../../utils/idGenerator";
import "./ToDoPastDue.css";
import {
  formatDate,
  formatTime,
  getWeekday,
} from "../../../utils/taskHelpers";

const ToDoPastDue = () => {
  const { 
    pastDueTasks, 
    selectedSort, 
    loading, 
    hasLoaded,
    selectedOffice,
    getOfficeEmptyMessage
  } = useOutletContext();

  // Group tasks by formatted creation date
  const groupedByDate = pastDueTasks.reduce((groups, task) => {
    const formattedDate = formatDate(task.creation_date);
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

  const getEmptyMessage = () => {
    switch (selectedSort) {
      case "today":
        return selectedOffice === "All Offices"
          ? "No tasks due today."
          : `No tasks due today for ${selectedOffice}.`;
      case "week":
        return selectedOffice === "All Offices"
          ? "No tasks due this week."
          : `No tasks due this week for ${selectedOffice}.`;
      case "month":
        return selectedOffice === "All Offices"
          ? "No tasks due this month."
          : `No tasks due this month for ${selectedOffice}.`;
      default:
        return getOfficeEmptyMessage("Upcoming");
    }
  };

  return (
    <div className="pastdue-app">
      <main className="pastdue-main">
        {loading ? (
          <div className="pastdue-loading">
            <div className="pastdue-spinner"></div>
            <p>Loading tasks...</p>
          </div>
        ) : hasLoaded && sortedDates.length === 0 ? (
          <div className="pastdue-no-tasks">
            {getEmptyMessage()}
          </div>
        ) : (
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

                  <div className="pastdue-header-actions">
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
                        className="pastdue-task-link"
                        key={`${task.task_id}-${task.title}`}
                      >
                        {/* ✅ Use CSS-aligned structure here */}
                        <div className="pastdue-task-item">
                          <div className="pastdue-task-header">
                            <div className="pastdue-task-icon">
                              <PiClipboardTextBold />
                            </div>
                            <div className="pastdue-task-info">
                              <h3 className="pastdue-task-title">{task.title}</h3>
                              <div className="pastdue-task-office">{task.office}</div>
                            </div>
                            <div className="pastdue-task-deadline">
                              Due on {formatDate(task.deadline)} at{" "}
                              <span className="pastdue-time">{formatTime(task.deadline)}</span>
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

export default ToDoPastDue;