import React from "react";
import "./SGOD.css";
import SectionCard from "../../components/SectionCard/SectionCard";
import Image1 from "../../assets/images/SMME.png";
import Image2 from "../../assets/images/Planning-and-Research.png";
import Image3 from "../../assets/images/Human-Resources-Development-Section.png";
import Image4 from "../../assets/images/School-Health-Section.png";
import Image5 from "../../assets/images/Education-Facilities-Section.png";
import Image6 from "../../assets/images/SMNS.png";
import Image7 from "../../assets/images/DRRMU.png";
import Image8 from "../../assets/images/YFS.png";


import { useOutletContext, useNavigate } from "react-router-dom"; // 👈 get context from Home

const SGOD = () => {
  const { isExpanded } = useOutletContext();
  const navigate = useNavigate();

  const sections = [
    { title: "School Management Monitoring and Evaluation Section", path: "SMME",image: Image1 },
    { title: "Planning and Research", path: "planning-research", image: Image2 },
    { title: "Human Resource Development Section", path: "HRD", image: Image3 },
    { title: "School Health Section", path: "school-health", image: Image4 },
    { title: "Education Facilities Section", path: "education-facilities", image: Image5 },
    { title: "Social Mobilization and Networking Section", path: "SMN", image: Image6 },
    { title: "Disaster Risk Reduction and Management Unit", path: "DRRM", image: Image7 },
    { title: "Youth Formation Section", path: "youth-formation", image: Image8 },
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