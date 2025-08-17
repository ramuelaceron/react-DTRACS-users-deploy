import React, { useState } from "react";
import SchoolHeader from '../../components/Header/SchoolHeader'
import SchoolSidebar from '../../components/Sidebar/SchoolSidebar'
import Footer from '../../components/Footer/Footer'

const Home = () => {

  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarExpanded((prev) => !prev);
  };
  
  return (
    <div className="app">
      <SchoolHeader toggleSidebar={toggleSidebar} />
      <SchoolSidebar isExpanded={isSidebarExpanded} />
      <main className="app-content">{/* Your content here */}</main>
      <Footer />
    </div>

  )
}

export default Home
