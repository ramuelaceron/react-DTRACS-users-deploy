import React from "react";
import { Outlet } from "react-router-dom";
import SchoolHeader from "../../components/Header/SchoolHeader";
import SchoolSidebar from "../../components/Sidebar/SchoolSidebar";
import Footer from "../../components/Footer/Footer";
import { useSidebar } from "../../context/SidebarContext"; // ✅ import context

const Home = () => {
  const { isExpanded, toggleSidebar } = useSidebar(); // ✅ use context

  return (
    <div className="app">
      <SchoolHeader toggleSidebar={toggleSidebar} />
      <div className="app-body">
        <SchoolSidebar isExpanded={isExpanded} />
        <main className="app-content">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
