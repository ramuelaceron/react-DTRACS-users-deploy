import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import StartUp from "./pages/StartUp/StartUp";
import Login from "./pages/Login/Login";
import RegisterSchool from "./pages/Regsiter/RegisterSchool";
import RegisterOffice from "./pages/Regsiter/RegisterOffice";
import SchoolHome from "./pages/Home/SchoolHome";
import OfficeHome from "./pages/Home/OfficeHome";
import Todo from "./pages/Todo/Todo";
import TaskListPage from "./pages/TaskListPage/TaskListPage";
import OfficeManageAccount from "./pages/ManageAccount/OfficeManageAccount";
import SchoolManageAccount from "./pages/ManageAccount/SchoolManageAccount";
import SchoolDashboard from "./pages/Dashboard/SchoolDashboard";
import SGOD from "./pages/SGOD/SGOD";
import PlanningResearch from "./pages/SGOD/PlanningResearch/PlanningResearch";
import SMME from "./pages/SGOD/SMME/SMME";
import HRD from "./pages/SGOD/HRD/HRD";
import SchoolHealth from "./pages/SGOD/SchoolHealth/SchoolHealth";
import EducationFacilities from "./pages/SGOD/EducationFacilities/EducationFacilities";
import SMN from "./pages/SGOD/SMN/SMN";
import DRRM from "./pages/SGOD/DRRM/DRRM";
import YouthFormation from "./pages/SGOD/YouthFormation/YouthFormation";
import Schools from "./pages/School/School";
import OfficeDashboard from "./pages/Dashboard/OfficeDashboard";


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

      {/* Protected layout: Home + Sidebar nav */}
      <Route element={<SchoolHome />}>
        <Route path="/home" element={<SchoolDashboard />} />
        <Route path="/SGOD" element={<SGOD />} />
        <Route path="/SGOD/SMME" element={<SMME />} />
        <Route path="/SGOD/SMME/task-list" element={<TaskListPage />} />
        <Route path="/SGOD/planning-research" element={<PlanningResearch />} />
        <Route path="/SGOD/planning-research/task-list" element={<TaskListPage />} />
        <Route path="/SGOD/HRD" element={<HRD />} />
        <Route path="/SGOD/HRD/task-list" element={<TaskListPage />} />
        <Route path="/SGOD/school-health" element={<SchoolHealth />} />
        <Route path="/SGOD/school-health/task-list" element={<TaskListPage />} />
        <Route path="/SGOD/education-facilities" element={<EducationFacilities />} />
        <Route path="/SGOD/education-facilities/task-list" element={<TaskListPage />} />
        <Route path="/SGOD/SMN" element={<SMN />} />
        <Route path="/SGOD/SMN/task-list" element={<TaskListPage />} />
        <Route path="/SGOD/DRRM" element={<DRRM />} />
        <Route path="/SGOD/DRRM/task-list" element={<TaskListPage />} />
        <Route path="/SGOD/youth-formation" element={<YouthFormation />} />
        <Route path="/SGOD/youth-formation/task-list" element={<TaskListPage />} />
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
