// Updated ToDoUpcoming component
import { useState, useEffect } from "react";
import { Link, useOutletContext, useNavigate } from "react-router-dom";
import { PiClipboardTextBold } from "react-icons/pi";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { createSlug } from "../../../utils/idGenerator";
import {
  formatDate,
  formatTime,
  getWeekday,
} from "../../../utils/taskHelpers";
import "./ToDoUpcoming.css";

const ToDoUpcoming = () => {
  // Get sorted tasks from context
  const { 
    upcomingTasks, 
    selectedSort, 
    loading, 
    hasLoaded,
    selectedOffice,
    getOfficeEmptyMessage
  } = useOutletContext();
  const navigate = useNavigate();

  // Group tasks by formatted creation date
  const groupedByDate = upcomingTasks.reduce((groups, task) => {
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
          `No tasks due today for ${selectedOffice}.`;
      case "week":
        return selectedOffice === "All Offices" 
          `No tasks due this week for ${selectedOffice}.`;
      case "month":
        return selectedOffice === "All Offices" 
          `No tasks due this month for ${selectedOffice}.`;
      default:
        return getOfficeEmptyMessage("Upcoming");
    }
  };

  // Handle click on task item
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
        section_designation: task.section,
        creator_name: task.creator_name,
        office: task.office,
      },
    });
  };

  return (
    <div className="upcoming-app">
      <main className="upcoming-main">
        {loading ? (
          <div className="upcoming-loading">
            <div className="upcoming-spinner"></div>
            <p>Loading tasks...</p>
          </div>
        ) : hasLoaded && sortedDates.length === 0 ? (
          <div className="upcoming-no-tasks">
            {getEmptyMessage()}
          </div>
        ) : (
          sortedDates.map((date) => {
            const tasks = groupedByDate[date];
            const weekday = getWeekday(date);
            const isOpen = openGroups[date];

            return (
              <div key={date} className="upcoming-date-group">
                <div
                  className="upcoming-date-header"
                  onClick={() => toggleGroup(date)}
                >
                  <span className="upcoming-date-bold">{date}</span>
                  <span className="upcoming-weekday"> ({weekday})</span>

                  <div className="upcoming-header-actions">
                    <span className="upcoming-task-count">{tasks.length}</span>
                    <span className="upcoming-dropdown-arrow">
                      {isOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
                    </span>
                  </div>
                </div>

                {isOpen && (
                  <div className="upcoming-task-list">
                    {tasks.map((task) => (
                      <div
                        key={task.task_id}
                        className="upcoming-task-item"
                        onClick={() => handleTaskClick(task)}
                        style={{ cursor: "pointer", userSelect: "none" }}
                      >
                        <div className="upcoming-task-header">
                          <div className="upcoming-task-icon">
                            <PiClipboardTextBold className="icon-lg" />
                          </div>
                          <div className="upcoming-task-info">
                            <div className="upcoming-task-title">
                              {task.title.trim() || "Untitled Task"}
                            </div>
                            <div className="upcoming-task-office">{task.office}</div>
                          </div>
                          <div className="upcoming-task-deadline">
                            Due on {formatDate(task.deadline)} at{" "}
                            <span className="upcoming-time">{formatTime(task.deadline)}</span>
                          </div>
                        </div>
                      </div>
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

export default ToDoUpcoming;