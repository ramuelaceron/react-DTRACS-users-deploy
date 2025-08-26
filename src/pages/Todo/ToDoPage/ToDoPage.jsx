// src/layouts/ToDoLayout.jsx
import React, { useMemo, useState } from "react";
import { Outlet } from "react-router-dom";
import TaskTabs from "../../../components/TaskTabs/TaskTabs";
import { sectionData } from "../../../data/focals";
import { createSlug } from "../../../utils/idGenerator";
import "./ToDoPage.css"; // <-- Add this

const ToDoPage = () => {
  const [selectedOffice, setSelectedOffice] = useState("All Offices");

  // Extract all offices
  const allOffices = useMemo(() => (
    [...new Set(
      Object.values(sectionData)
        .flat()
        .flatMap(section => section.tasklist.map(task => task.office))
    )].sort()
  ), []);

  // Flatten and categorize tasks
  const { upcomingTasks, pastDueTasks, completedTasks } = useMemo(() => {
    const upcoming = [];
    const pastDue = [];
    const completed = [];

    Object.entries(sectionData).forEach(([sectionId, sections]) => {
      sections.forEach(section => {
        section.tasklist.forEach(task => {
          const taskData = {
            id: task.id,
            title: task.title,
            dueDate: task.dueDate,
            dueTime: task.dueTime,
            office: task.office,
            postDate: task.postDate,
            sectionId,
            taskSlug: createSlug(task.title),
          };

          if (task.status === "Upcoming") upcoming.push(taskData);
          if (task.status === "Past Due") pastDue.push(taskData);
          if (task.status === "Completed") completed.push({
            ...taskData,
            completedTime: task.dueTime
          });
        });
      });
    });

    return { upcomingTasks: upcoming, pastDueTasks: pastDue, completedTasks: completed };
  }, []);

  // Apply office filter
  const filterByOffice = (tasks) =>
    selectedOffice === "All Offices" ? tasks : tasks.filter(t => t.office === selectedOffice);

  return (
    <div className="todo-layout">
      <TaskTabs
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
