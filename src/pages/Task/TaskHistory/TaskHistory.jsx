import React, { useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { PiClipboardTextBold } from "react-icons/pi";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import {
  formatDate,
  formatTime,
  getWeekday,
  getTaskCompletionStats,
} from "../../../utils/taskHelpers";
import "./TaskHistory.css";

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
                >
                  <span className="history-date-bold">{date}</span>
                  <span className="history-weekday"> ({weekday})</span>

                  <div className="header-actions">
                    <span className="history-task-count">{tasks.length}</span>
                    <span className="history-dropdown-arrow">
                      {isOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
                    </span>
                  </div>
                </div>

                {isOpen && (
                  <div className="history-task-list">
                    {tasks.map((task) => {
                      const { total, completed } = getTaskCompletionStats(task);
                      
                      return (
                        <div className="history-task-item" key={task.id}>
                          <div className="history-task-header">
                            <div className="history-task-icon">
                              <PiClipboardTextBold className="icon-lg" />
                            </div>
                            <div className="history-task-info">
                              <div className="history-task-title">
                                {task.title}
                              </div>
                              <div className="history-task-office">
                                {task.office}
                              </div>
                            </div>
                            <div className="history-task-completion">
                              Completed on {formatDate(task.completedTime || task.creation_date)} at{" "}
                              <span className="history-time">{formatTime(task.completedTime || task.creation_date)}</span>
                            </div>
                          </div>

                          <div className="history-task-footer">
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
                              className="history-description-link"
                            >
                              View Description
                            </Link>

                            {/* Added Submitted and Assigned counts */}
                            <div className="history-assigned-submitted-counts">
                              <div className="history-count-item">
                                <span className="history-count-number">
                                  {completed}
                                </span>
                                <span className="history-count-label">Submitted</span>
                              </div>
                              <div className="history-count-item">
                                <span className="history-count-number">{total}</span>
                                <span className="history-count-label">Assigned</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
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