import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../../components/Header/Header";
import SchoolSidebar from "../../components/Sidebar/SchoolSidebar";
import Footer from "../../components/Footer/Footer";
import { useSidebar } from "../../context/SidebarContext";

const Home = () => {
  const { isExpanded, toggleSidebar } = useSidebar();

  return (
    <div className="app">
      {/* Header with sidebar toggle */}
      <Header toggleSidebar={toggleSidebar} />

      <div className="app-body">

        <SchoolSidebar isExpanded={isExpanded} />

        {/* Content area where child routes will be injected */}
        <main className="app-content">  
          <Outlet />   {/* 👈 This is where Dashboard, Todo, Offices, etc. will show */}
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
