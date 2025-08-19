import React from "react";
import "./SGOD.css";
import SectionCard from "../../components/SectionCard/SectionCard";
import NoImage from "../../assets/images/no-image.png";
import { useOutletContext, useNavigate } from "react-router-dom"; // 👈 get context from Home

const SGOD = () => {
  const { isExpanded } = useOutletContext();
  const navigate = useNavigate();

  const sections = [
    { title: "School Management Monitoring and Evaluation Section", path: "SMME",image: NoImage },
    { title: "Planning and Research", path: "planning-research", image: NoImage },
    { title: "Human Resource Development Section", path: "HRD", image: NoImage },
    { title: "School Health Section", path: "school-health", image: NoImage },
    { title: "Education Facilities Section", path: "education-facilities", image: NoImage },
    { title: "Social Mobilization and Networking Section", image: NoImage },
    { title: "Disaster Risk Reduction and Management Unit", image: NoImage },
    { title: "Youth Formation Section", image: NoImage },
  ];

  return (
    <div className={`section-container ${isExpanded ? "expanded" : "collapsed"}`}>
      {sections.map((section, index) => (
        <SectionCard
          key={index}
          title={section.title}
          image={section.image}
          onClick={() => section.path && navigate(section.path, { relative: "path" })}
        />
      ))}
    </div>
  );
};


export default SGOD;
