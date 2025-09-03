import React, { useMemo, useState } from "react";
import { Outlet } from "react-router-dom";
import TaskTabs from "../../../components/TaskTabs/TaskTabs";
import { taskData } from "../../../data/taskData";
import { createSlug } from "../../../utils/idGenerator";
import "./TaskPage.css";

const TaskPage = () => {
  const [selectedSort, setSelectedSort] = useState("newest");

  // Extract all offices
  const allOffices = useMemo(() => (
    [...new Set(
      Object.values(taskData)
        .flat()
        .flatMap(section => section.tasklist.map(task => task.office))
    )].sort()
  ), []);

  // Flatten and categorize tasks based on deadline
  const { upcomingTasks, pastDueTasks, completedTasks } = useMemo(() => {
    const upcoming = [];
    const pastDue = [];
    const completed = [];

    const now = new Date();

    Object.entries(taskData).forEach(([sectionId, sections]) => {
      sections.forEach(section => {
        section.tasklist.forEach(task => {
          const taskDeadline = new Date(task.deadline);
          const taskStatus = task.task_status || "Ongoing";

          const taskDataObj = {
            id: task.task_id,
            title: task.title,
            deadline: task.deadline,
            office: task.office,
            creation_date: task.creation_date,
            completion_date: task.completion_date, // Include completion_date
            sectionId,
            sectionName: section.section_name || section.section_designation || "General",
            taskSlug: createSlug(task.title),
            creator_name: task.creator_name,
            description: task.description,
            task_status: taskStatus,
            section_designation: section.section_designation,
            // Add these properties for the getTaskCompletionStats function
            schools_required: task.schools_required,
            accounts_required: task.accounts_required,
            // Include the complete task object for reference
            originalTask: task
          };

          // Categorize tasks
          if (taskStatus === "Completed") {
            completed.push({
              ...taskDataObj,
              completedTime: task.completion_date || task.modified_date || task.creation_date
            });
          } 
          else if (taskStatus === "Incomplete") {
            // All "Incomplete" status tasks go to past due
            pastDue.push(taskDataObj);
          }
          else if (taskDeadline < now) {
            // Ongoing tasks that are past their deadline
            pastDue.push(taskDataObj);
          } else {
            // Ongoing tasks that are not yet due
            upcoming.push(taskDataObj);
          }
        });
      });
    });

    return { 
      upcomingTasks: upcoming, 
      pastDueTasks: pastDue, 
      completedTasks: completed 
    };
  }, []);

  // Sort tasks based on selected option
  const sortTasks = (tasks) => {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    switch(selectedSort) {
      case "newest":
        return [...tasks].sort((a, b) => new Date(b.creation_date) - new Date(a.creation_date));
      case "oldest":
        return [...tasks].sort((a, b) => new Date(a.creation_date) - new Date(b.creation_date));
      case "today":
        return tasks.filter(task => {
          const taskDate = new Date(task.deadline);
          return taskDate >= startOfDay && taskDate < new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);
        });
      case "week":
        return tasks.filter(task => {
          const taskDate = new Date(task.deadline);
          const nextWeek = new Date(startOfWeek.getTime() + 7 * 24 * 60 * 60 * 1000);
          return taskDate >= startOfWeek && taskDate < nextWeek;
        });
      case "month":
        return tasks.filter(task => {
          const taskDate = new Date(task.deadline);
          const nextMonth = new Date(startOfMonth.getFullYear(), startOfMonth.getMonth() + 1, 1);
          return taskDate >= startOfMonth && taskDate < nextMonth;
        });
      default:
        return tasks;
    }
  };

  return (
    <div className="task-layout">
      <TaskTabs
        selectedSort={selectedSort}
        onSortChange={setSelectedSort}
        showUpcomingIndicator={upcomingTasks.length > 0}
        showPastDueIndicator={pastDueTasks.length > 0}
        showCompletedIndicator={completedTasks.length > 0}
      />

      {/* Pass sorted tasks down via Outlet context */}
      <Outlet context={{
        upcomingTasks: sortTasks(upcomingTasks),
        pastDueTasks: sortTasks(pastDueTasks),
        completedTasks: sortTasks(completedTasks)
      }} />
    </div>
  );
};

export default TaskPage;