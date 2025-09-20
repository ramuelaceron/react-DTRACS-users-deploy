// Updated ToDoPastDue component
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
import "./ToDoPastDue.css";

const ToDoPastDue = () => {
  // ✅ Get pre-filtered past-due tasks and selected sort from ToDoPage layout
  const { 
    pastDueTasks, 
    selectedSort, 
    loading, 
    hasLoaded,
    selectedOffice,
    getOfficeEmptyMessage
  } = useOutletContext();
  const navigate = useNavigate();

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
        return selectedOffice === "All Offices" 
          `No past-due tasks due today for ${selectedOffice}.`;
      case "week":
        return selectedOffice === "All Offices" 
          `No past-due tasks due this week for ${selectedOffice}.`;
      case "month":
        return selectedOffice === "All Offices" 
          `No past-due tasks due this month for ${selectedOffice}.`;
      default:
        return getOfficeEmptyMessage("Past Due");
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
        section_designation: task.section,
        creator_name: task.creator_name,
        office: task.office,
      },
    });
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
                >
                  <span className="pastdue-date-bold">{date}</span>
                  <span className="pastdue-weekday"> ({weekday})</span>

                  <div className="pastdue-header-actions">
                    <span className="pastdue-task-count">{tasks.length}</span>
                    <span className="pastdue-dropdown-arrow">
                      {isOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
                    </span>
                  </div>
                </div>

                {isOpen && (
                  <div className="pastdue-task-list">
                    {tasks.map((task) => (
                      <div
                        key={task.task_id}
                        className="pastdue-task-item"
                        onClick={() => handleTaskClick(task)}
                        style={{ cursor: "pointer", userSelect: "none" }}
                      >
                        <div className="pastdue-task-header">
                          <div className="pastdue-task-icon">
                            <PiClipboardTextBold className="icon-lg" />
                          </div>
                          <div className="pastdue-task-info">
                            <div className="pastdue-task-title">
                              {task.title}
                            </div>
                            <div className="pastdue-task-office">
                              {task.office}
                            </div>
                          </div>
                          <div className="pastdue-task-deadline">
                            Was due on {formatDate(task.deadline)} at{" "}
                            <span className="pastdue-time">{formatTime(task.deadline)}</span>
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

export default ToDoPastDue;