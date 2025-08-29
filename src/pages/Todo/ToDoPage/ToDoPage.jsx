import React, { useMemo, useState } from "react";
import { Outlet } from "react-router-dom";
import ToDoTabs from "../../../components/ToDoTabs/ToDoTabs";
import { taskData } from "../../../data/taskData";
import { createSlug } from "../../../utils/idGenerator";
import "./ToDoPage.css";

const ToDoPage = () => {
  const [selectedOffice, setSelectedOffice] = useState("All Offices");

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

          const taskData = {
            id: task.task_id,
            title: task.title,
            deadline: task.deadline,
            office: task.office,
            creation_date: task.creation_date,
            sectionId,
            taskSlug: createSlug(task.title),
            creator_name: task.creator_name,
            description: task.description,
            task_status: taskStatus,
            section_designation: section.section_designation
          };

          // Categorize based on task_status
          if (taskStatus === "Completed") {
            completed.push({
              ...taskData,
              completedTime: task.modified_date || task.creation_date // Use modified_date if available, otherwise creation_date
            });
          } else if (taskStatus === "Incomplete" || (taskDeadline < now && taskStatus !== "Completed")) {
            pastDue.push(taskData);
          } else {
            upcoming.push(taskData);
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

  // Apply office filter
  const filterByOffice = (tasks) =>
    selectedOffice === "All Offices" ? tasks : tasks.filter(t => t.office === selectedOffice);

  return (
    <div className="todo-layout">
      <ToDoTabs
        selectedOffice={selectedOffice}
        onOfficeChange={setSelectedOffice}
        allOffices={allOffices}
        showUpcomingIndicator={upcomingTasks.length > 0}
        showPastDueIndicator={pastDueTasks.length > 0}
        showCompletedIndicator={completedTasks.length > 0}
      />

      {/* Pass tasks down via Outlet context */}
      <Outlet context={{
        upcomingTasks: filterByOffice(upcomingTasks),
        pastDueTasks: filterByOffice(pastDueTasks),
        completedTasks: filterByOffice(completedTasks)
      }} />
    </div>
  );
};

export default ToDoPage;