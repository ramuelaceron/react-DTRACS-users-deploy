// src/pages/Sections/SectionPage.jsx
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { taskData } from "../../data/taskData";
import FocalTaskCard from "../../components/FocalTaskCard/FocalTaskCard";
import { Outlet } from "react-router-dom";
import "./SectionPage.css";

// Import API base URL
import { API_BASE_URL } from "../../api/api"; // <-- You may need to create this file

const SectionPage = () => {
  const { sectionId } = useParams();
  const [focalMap, setFocalMap] = useState({}); // { section_designation: full_name }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get section data from taskData
  const section = taskData[sectionId];

  // Fetch focal persons for each section_designation in this section
  useEffect(() => {
    if (!section || !Array.isArray(section) || section.length === 0) {
      setLoading(false);
      return;
    }

    const fetchFocalPersons = async () => {
      try {
        const fetchedMap = {};

        for (const item of section) {
          const { section_designation } = item;

          const response = await fetch(
            `${API_BASE_URL}/school/office/section?section_designation=${encodeURIComponent(section_designation)}`
          );


          if (!response.ok) {
            console.warn(`Failed to fetch focal for: ${section_designation}`);
            fetchedMap[section_designation] = "No yet assigned";
            continue;
          }

          const data = await response.json();
          if (data && data.length > 0) {
            // Use first focal person's full name (or combine if needed)
            const firstFocal = data[0];
            const fullName = `${firstFocal.first_name} ${firstFocal.middle_name ? firstFocal.middle_name + " " : ""}${firstFocal.last_name}`.trim();
            fetchedMap[section_designation] = fullName;
          } else {
            fetchedMap[section_designation] = "No assigned yet";
          }
        }

        setFocalMap(fetchedMap);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching focal persons:", err);
        setError("Failed to load focal persons.");
        setLoading(false);
      }
    };

    fetchFocalPersons();
  }, [sectionId, section]);

  // If on task-list route, render Outlet only
  if (window.location.pathname.includes("task-list")) {
    return <Outlet />;
  }

  // Show loading state
  if (loading) {
    return <div className="loading">Loading focal persons...</div>;
  }

  // Show error state
  if (error) {
    return <div className="error">⚠️ {error}</div>;
  }

  // Show "No focal persons" if section is empty or invalid
  if (!section || !Array.isArray(section) || section.length === 0) {
    return <div>No focal persons found for this section.</div>;
  }

  return (
    <div className="focal-container">
      {section.map((focal, index) => (
        <FocalTaskCard
          key={index} // Use index since no `id` exists in your taskData
          section_designation={focal.section_designation}
          full_name={focalMap[focal.section_designation] || "No assigned yet"}
          path="task-list"
        />
      ))}
      <Outlet />
    </div>
  );
};

export default SectionPage;