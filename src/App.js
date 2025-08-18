import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import StartUp from "./pages/StartUp/StartUp";
import Login from "./pages/Login/Login";
import RegisterSchool from "./pages/Regsiter/RegisterSchool";
import RegisterOffice from "./pages/Regsiter/RegisterOffice";
import Home from "./pages/Home/Home";
import Todo from "./pages/Todo/Todo";
import ManageAccount from "./pages/ManageAccount/ManageAccount";
import SGOD from "./pages/SGOD/SGOD";
import Dashboard from "./pages/Dashboard/Dashboard";

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
      <Route element={<Home />}>
        <Route path="/home" element={<Dashboard />} />     {/* landing inside Home */}
        <Route path="/todo" element={<Todo />} />
        <Route path="/SGOD" element={<SGOD />} />
        <Route path="/manage-account" element={<ManageAccount />} />
      </Route>
    </Routes>
  );
}

export default App;
