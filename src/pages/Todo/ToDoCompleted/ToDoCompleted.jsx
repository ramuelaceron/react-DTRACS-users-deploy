import { useState, useEffect } from "react";
import { Link, useOutletContext, useNavigate } from "react-router-dom"; // 👈 Added useNavigate
import { PiClipboardTextBold } from "react-icons/pi";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { createSlug } from "../../../utils/idGenerator"; // 👈 Import createSlug
import {
  formatDate,
  formatTime,
  getWeekday,
} from "../../../utils/taskHelpers";
import "./ToDoCompleted.css";

const ToDoCompleted = () => {
  // ✅ Get pre-filtered completed tasks and selected sort from ToDoPage layout
  const { completedTasks, selectedSort } = useOutletContext();
  const navigate = useNavigate(); // 👈 Initialize navigate

  // Group tasks by formatted completion date
  const groupedByDate = completedTasks.reduce((groups, task) => {
    const completionDate = task.completion_date || task.creation_date;
    const formattedDate = formatDate(completionDate);
    
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

  // Track open/closed state for each group
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
        return "No completed tasks due today.";
      case "week":
        return "No completed tasks due this week.";
      case "month":
        return "No completed tasks due this month.";
      default:
        return "No completed tasks.";
    }
  };

  // ✅ Handle click on a task item — navigate to ToDoDetailPage
  const handleTaskClick = (task) => {
    const sectionSlug = createSlug(task.section || "Unknown Section");
    const taskSlug = createSlug(task.title || "Untitled Task");

    navigate(`/todo/${sectionSlug}/${taskSlug}`, {
      state: {
        taskId: task.task_id,
        taskTitle: task.title,
        deadline: task.deadline,
        creation_date: task.creation_date,
        taskDescription: task.description,
        section_designation: task.section, // 👈 Used in ToDoDetailPage header
        creator_name: task.creator_name,
        office: task.office,
        completion_date: task.completion_date, // 👈 Optional but useful for context
        task_status: task.task_status, // 👈 For status display
      },
    });
  };

  return (
    <div className="completed-app">
      <main className="completed-main">
        {/* Task List Grouped by completion date */}
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
                >
                  <span className="completed-date-bold">{date}</span>
                  <span className="completed-weekday"> ({weekday})</span>

                  <div className="completed-header-actions">
                    <span className="completed-task-count">{tasks.length}</span>
                    <span className="completed-dropdown-arrow">
                      {isOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
                    </span>
                  </div>
                </div>

                {isOpen && (
                  <div className="completed-task-list">
                    {tasks.map((task) => {
                      const completionDate = task.completion_date || task.creation_date;
                      
                      return (
                        <div
                          key={task.task_id}
                          className="completed-task-item"
                          onClick={() => handleTaskClick(task)} // 👈 Click handler here
                          style={{ cursor: "pointer", userSelect: "none" }} // 👈 Visual feedback
                        >
                          <div className="completed-task-header">
                            <div className="completed-task-icon">
                              <PiClipboardTextBold className="icon-lg" />
                            </div>
                            <div className="completed-task-info">
                              <div className="completed-task-title">
                                {task.title}
                              </div>
                              <div className="completed-task-office">
                                {task.office}
                              </div>
                            </div>
                            <div className="completed-task-completion">
                              Completed on {formatDate(completionDate)} at{" "}
                              <span className="completed-time">{formatTime(completionDate)}</span>
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
          <div className="completed-no-tasks">
            {getEmptyMessage()}
          </div>
        )}
      </main>
    </div>
  );
};

export default ToDoCompleted;