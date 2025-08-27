import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../../components/Header/Header";
import OfficeSidebar from "../../components/Sidebar/OfficeSidebar";
import "./OfficeHome.css";
import { useSidebar } from "../../context/SidebarContext";

const OfficeHome = () => {
  const { isExpanded, toggleSidebar } = useSidebar();

  return (
    <div className="app">
      <Header toggleSidebar={toggleSidebar} />

      <div className="app-body">
        <OfficeSidebar isExpanded={isExpanded} />
        <main className="app-content">  
          <Outlet context={{ isExpanded }} /> 
        </main>
      </div>

      {/* <Footer /> */}
    </div>
  );
};

export default OfficeHome;
