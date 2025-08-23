  import React from "react";
  import { Routes, Route, useLocation } from "react-router-dom";
  import StartUp from "./pages/StartUp/StartUp";
  import Login from "./pages/Login/Login";
  import RegisterSchool from "./pages/Register/RegisterSchool";
  import RegisterOffice from "./pages/Register/RegisterOffice";
  import SchoolHome from "./pages/Home/SchoolHome";
  import Schools from "./pages/School/School";
  import OfficeHome from "./pages/Home/OfficeHome";
  import SchoolDashboard from "./pages/Dashboard/SchoolDashboard";
  import OfficeManageAccount from "./pages/ManageAccount/OfficeManageAccount";
  import OfficeDashboard from "./pages/Dashboard/OfficeDashboard";
  import SGOD from "./pages/SGOD/SGOD";
  import SectionPage from "./pages/Sections/SectionPage";
  import Todo from "./pages/Todo/Todo";
  import SchoolManageAccount from "./pages/ManageAccount/SchoolManageAccount";
  import TaskListPage from "./pages/TaskListPage/TaskListPage";
  import TaskDetailPage from "./pages/TaskDetailPage/TaskDetailPage";


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

        <Route element={<SchoolHome />}>
          <Route path="/home" element={<SchoolDashboard />} />
          <Route path="/SGOD" element={<SGOD />} />
          {/* Section Page + Nested Routes */}
          <Route path="/SGOD/:sectionId" element={<SectionPage />}>
            {/* Nested: task-list inside section */}
            <Route path="task-list" element={<TaskListPage />} />
            {/* Optional: task details */}
            <Route path="task-list/:taskSlug" element={<TaskDetailPage />} />
          </Route>

          <Route path="/todo" element={<Todo />} />
          <Route path="/s-manage-account" element={<SchoolManageAccount />} />
        </Route>

        <Route element={<OfficeHome />}>
          <Route path="/task" element={<OfficeDashboard />} />
          <Route path="/schools" element={<Schools />} />
          <Route path="/o-manage-account" element={<OfficeManageAccount />} />
        </Route>
      </Routes>
    );
  }

  export default App;
