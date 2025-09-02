import React, { useMemo, useState } from "react";
import { Outlet } from "react-router-dom";
import TaskTabs from "../../../components/TaskTabs/TaskTabs";
import { taskData } from "../../../data/taskData";
import { createSlug } from "../../../utils/idGenerator";
import "./TaskPage.css";

const TaskPage = () => {
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

          const taskDataObj = {
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
            section_designation: section.section_designation,
            // Add these properties for the getTaskCompletionStats function
            schools_required: task.schools_required,
            accounts_required: task.accounts_required
          };

          // DEBUG: Log task details to see what's happening
          console.log('Task:', {
            title: task.title,
            status: taskStatus,
            deadline: task.deadline,
            isPastDue: taskDeadline < now
          });

          // Categorize tasks
          if (taskStatus === "Completed") {
            completed.push({
              ...taskDataObj,
              completedTime: task.modified_date || task.creation_date
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

    // DEBUG: Log counts
    console.log('Task counts:', {
      upcoming: upcoming.length,
      pastDue: pastDue.length,
      completed: completed.length
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
    <div className="task-layout">
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

export default TaskPage;