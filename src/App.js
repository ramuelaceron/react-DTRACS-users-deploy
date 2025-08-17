import React from 'react'
import { AnimatePresence } from "framer-motion";
import { Routes, Route, useLocation } from "react-router-dom";
import StartUp from './pages/StartUp/StartUp'
import Login from './pages/Login/Login'
import RegisterSchool from './pages/Regsiter/RegisterSchool';
import RegisterOffice from './pages/Regsiter/RegisterOffice';
import Home from './pages/Home/Home';

function App() {
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<StartUp />} />
        <Route path="/login/school" element={<Login />} />
        <Route path="/login/office" element={<Login />} />
        <Route path="/register/school" element={<RegisterSchool />} />
        <Route path="/register/office" element={<RegisterOffice />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </AnimatePresence>
  );
}

export default App;
