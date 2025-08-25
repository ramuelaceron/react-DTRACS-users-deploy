// App.jsx
import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

// Pages
import StartUp from "./pages/StartUp/StartUp";
import Login from "./pages/Login/Login";
import RegisterSchool from "./pages/Register/RegisterSchool";
import RegisterOffice from "./pages/Register/RegisterOffice";
import SchoolHome from "./pages/Home/SchoolHome";
import Schools from "./pages/School/School";
import OfficeHome from "./pages/Home/OfficeHome";
import SchoolDashboard from "./pages/Dashboard/SchoolDashboard";
import OfficeDashboard from "./pages/Dashboard/OfficeDashboard";
import SGOD from "./pages/SGOD/SGOD";
import SectionPage from "./pages/Sections/SectionPage";
import Todo from "./pages/Todo/Todo";
import TaskListPage from "./pages/TaskListPage/TaskListPage";
import TaskDetailPage from "./pages/TaskDetailPage/TaskDetailPage";
import ManageAccount from "./pages/ManageAccount/ManageAccount";

// 🔽 Import moved component
import RoleBasedRedirect from "./components/RoleBasedRedirect/RoleBasedRedirect";

function App() {
  const location = useLocation();

  return (
    <Routes location={location} key={location.pathname}>
      {/* Public routes */}
      <Route path="/" element={<StartUp />} />
      <Route path="/login/school" element={<Login />} />
      <Route path="/login/office" element={<Login />} />
      <Route path="/register/school" element={<RegisterSchool />} />
      <Route path="/register/office" element={<RegisterOffice />} />

      {/* School Protected Routes */}
      <Route element={<SchoolHome />}>
        <Route path="/home" element={<SchoolDashboard />} />
        <Route path="/todo" element={<Todo />} />
        <Route path="/SGOD" element={<SGOD />} />
        <Route path="/SGOD/:sectionId" element={<SectionPage />}>
          <Route path="task-list" element={<TaskListPage />} />
          <Route path="task-list/:taskSlug" element={<TaskDetailPage />} />
        </Route>
        <Route path="/s-manage-account" element={<ManageAccount />} />
      </Route>

      {/* Office Protected Routes */}
      <Route element={<OfficeHome />}>
        <Route path="/task" element={<OfficeDashboard />} />
        <Route path="/schools" element={<Schools />} />
        <Route path="/o-manage-account" element={<ManageAccount />} />
      </Route>

      {/* ✅ Unified redirect */}
      <Route
        path="/manage-account"
        element={
          <RoleBasedRedirect
            schoolPath="/s-manage-account"
            officePath="/o-manage-account"
          />
        }
      />
    </Routes>
  );
}

export default App;