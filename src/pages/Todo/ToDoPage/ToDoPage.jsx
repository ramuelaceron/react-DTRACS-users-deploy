// src/pages/ToDoPage.jsx
import { useMemo, useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import ToDoTabs from "../../../components/ToDoTabs/ToDoTabs";
import { createSlug } from "../../../utils/idGenerator";
import { API_BASE_URL } from "../../../api/api";
import "./ToDoPage.css";

const ToDoPage = () => {
  // ✅ Declare ALL hooks first
  const [selectedSort, setSelectedSort] = useState("newest");
  const [tasks, setTasks] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  
  const currentUser = useMemo(() => {
    const item = sessionStorage.getItem("currentUser");
    return item ? JSON.parse(item) : null;
  }, []); // 👈 Only parse once on mount

  const isOfficeWithoutSection = currentUser?.role === "office" && (
    !currentUser.section_designation ||
    currentUser.section_designation === "Not specified" ||
    currentUser.section_designation === "" ||
    currentUser.section_designation === "NULL"
  );

  // ✅ Get the school user's ID (this is what the backend expects)
  const schoolUserId = currentUser?.user_id;
  const isSchoolUser = currentUser?.role === "school";

  // ✅ Fetch tasks assigned to THIS school (via new endpoint)
  useEffect(() => {
    const fetchTasks = async () => {
      console.log("🔄 Fetching tasks assigned to school...");

      try {
        setLoading(true);

        if (!isSchoolUser || !schoolUserId) {
          console.warn("⚠️ Not a school user or schoolUserId missing. No tasks to load.");
          setTasks({});
          return;
        }

        const token = currentUser?.token;

        // ✅ NEW ENDPOINT: Only fetch tasks assigned to this school
        const response = await fetch(
          `${API_BASE_URL}/school/all/tasks?user_id=${encodeURIComponent(schoolUserId)}`,
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to fetch tasks: ${response.status} - ${errorText}`);
        }

        const rawData = await response.json();
        console.log("📡 Tasks received (filtered by school):", rawData);

        // ✅ Backend already returned grouped tasks — no need to group again!
        // Assuming backend returns same structure as before: array of tasks
        // We still need to group by section for consistency with existing UI logic.

        const groupedBySection = rawData.reduce((acc, task) => {
          const sectionName = task.section || "General";
          if (!acc[sectionName]) {
            acc[sectionName] = [
              {
                section_name: sectionName,
                section_designation: sectionName,
                tasklist: [],
              },
            ];
          }
          acc[sectionName][0].tasklist.push(task);
          return acc;
        }, {});

        setTasks(groupedBySection);
      } catch (err) {
        console.error("Error fetching tasks:", err);
        setError(err.message || "Failed to load tasks. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    // ✅ Fetch immediately on mount
    fetchTasks();

    // ✅ Set up polling every 30 seconds
    const intervalId = setInterval(fetchTasks, 30_000); // 30 seconds

    // ✅ Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, [isSchoolUser, schoolUserId]); // 👈 Depend on user ID — re-fetch if user changes

  // ✅ useMemo: called unconditionally
  const allOffices = useMemo(() => {
    return [
      ...new Set(
        Object.values(tasks)
          .flat()
          .flatMap((section) => section.tasklist.map((task) => task.office))
      ),
    ].sort();
  }, [tasks]);

  // ✅ useMemo: called unconditionally — simplified, no assignment fields used
  const { upcomingTasks, pastDueTasks, completedTasks } = useMemo(() => {
    console.log("🧮 Recalculating task categories...");
    const upcoming = [];
    const pastDue = [];
    const completed = [];
    const now = new Date();

    Object.entries(tasks).forEach(([sectionName, sections]) => {
      sections.forEach((section) => {
        section.tasklist.forEach((task) => {
          const taskDeadline = new Date(task.deadline);
          const taskStatus = task.task_status || "ONGOING";

          console.log(`Task: ${task.title} | Status: ${taskStatus}`);

          // ✅ No assignment data needed anymore — clean object
          const taskDataObj = {
            id: task.creator_id,
            task_id: task.task_id,
            title: task.title,
            deadline: task.deadline,
            office: task.office,
            creation_date: task.creation_date,
            completion_date: task.completion_date || null,
            sectionId: sectionName,
            sectionName: sectionName,
            taskSlug: createSlug(task.title),
            creator_name: task.creator_name,
            description: task.description,
            task_status: taskStatus,
            section_designation: sectionName,
            originalTask: task, // Keep for debugging if needed
          };

          if (taskStatus === "COMPLETE") {
            completed.push({
              ...taskDataObj,
              completedTime: task.completion_date || task.modified_date || task.creation_date,
            });
          } else if (taskStatus === "INCOMPLETE") {
            pastDue.push(taskDataObj);
          } else if (taskDeadline < now) {
            pastDue.push(taskDataObj);
          } else {
            upcoming.push(taskDataObj);
          }
        });
      });
    });

    return { upcomingTasks: upcoming, pastDueTasks: pastDue, completedTasks: completed };
  }, [tasks]);

  // ✅ NOW return conditionally (after hooks)
  if (isOfficeWithoutSection) {
    return (
      <div className="no-section-page">
        <div className="no-section-container">
          <h2>⏳ Section Not Assigned Yet</h2>
          <p>Your account has not been assigned to a section by the administrator.</p>
          <p>Please wait for admin approval or contact support for assistance.</p>
          <p className="note">
            <strong>Note:</strong> You will not be able to view or manage tasks until your section is assigned.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container" style={{ padding: "2rem", textAlign: "center", color: "red" }}>
        <p>❌ Failed to load tasks: {error}</p>
        <button onClick={() => window.location.reload()} style={{ marginTop: "1rem", padding: "0.5rem 1rem" }}>
          Retry
        </button>
      </div>
    );
  }

  const sortTasks = (tasks, sortOption) => {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - now.getDay()
    );
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    switch (sortOption) {
      case "newest":
        return [...tasks].sort(
          (a, b) => new Date(b.creation_date) - new Date(a.creation_date)
        );
      case "oldest":
        return [...tasks].sort(
          (a, b) => new Date(a.creation_date) - new Date(b.creation_date)
        );
      case "today":
        return tasks.filter((task) => {
          const taskDate = new Date(task.deadline);
          return (
            taskDate >= startOfDay &&
            taskDate < new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000)
          );
        });
      case "week":
        return tasks.filter((task) => {
          const taskDate = new Date(task.deadline);
          const nextWeek = new Date(startOfWeek.getTime() + 7 * 24 * 60 * 60 * 1000);
          return taskDate >= startOfWeek && taskDate < nextWeek;
        });
      case "month":
        return tasks.filter((task) => {
          const taskDate = new Date(task.deadline);
          const nextMonth = new Date(
            startOfMonth.getFullYear(),
            startOfMonth.getMonth() + 1,
            1
          );
          return taskDate >= startOfMonth && taskDate < nextMonth;
        });
      default:
        return tasks;
    }
  };

  return (
    <div className="task-layout">
      <ToDoTabs
        selectedSort={selectedSort}
        onSortChange={setSelectedSort}
        showUpcomingIndicator={upcomingTasks.length > 0}
        showPastDueIndicator={pastDueTasks.length > 0}
        showCompletedIndicator={completedTasks.length > 0}
      />
      <Outlet
        context={{
          upcomingTasks: sortTasks(upcomingTasks, selectedSort),
          pastDueTasks: sortTasks(pastDueTasks, selectedSort),
          completedTasks: sortTasks(completedTasks, selectedSort),
          selectedSort,
          allOffices,
        }}
      />
    </div>
  );
};

export default ToDoPage;