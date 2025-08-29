// src/pages/Sections/SectionPage.jsx
import React from "react";
import { useParams } from "react-router-dom";
import { taskData } from "../../data/taskData";
import FocalTaskCard from "../../components/FocalTaskCard/FocalTaskCard";
import { Outlet } from 'react-router-dom'; // <-- Add this
import "./SectionPage.css";

const SectionPage = () => {
  const { sectionId } = useParams();
  const section = taskData[sectionId];

  // If we are on /SGOD/SMME/task-list, don't show cards
  if (window.location.pathname.includes('task-list')) {
    return <Outlet />; // Render TaskListPage
  }

  if (!section || !Array.isArray(section) || section.length === 0) {
    return <div>No focal persons found for this section.</div>;
  }

  return (
    <div className="focal-container">
      {section.map((focal) => (
        <FocalTaskCard
          key={focal.id}
          section_designation={focal.section_designation}
          full_name={focal.full_name}
          path="task-list" // relative path 
        />
      ))}
      <Outlet /> {/* In case you want to render nested routes below */}
    </div>
  );
};

export default SectionPage;