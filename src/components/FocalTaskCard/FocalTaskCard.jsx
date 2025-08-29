// components/FocalTaskCard/FocalTaskCard.jsx
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { taskData } from '../../data/taskData'; // ✅ Import sectionData
import './FocalTaskCard.css';

const FocalTaskCard = ({ section_designation, full_name, path = 'task-list' }) => {
  const navigate = useNavigate();
  const { sectionId } = useParams(); // Get sectionId from URL

  // 🔍 Find the correct entry in sectionData
  const section = taskData[sectionId];
  let avatar = null;

  if (section && Array.isArray(section)) {
    const entry = section.find(
      (item) => item.section_designation === section_designation && item.full_name === full_name
    );
    avatar = entry?.avatar || null;
  }

  // Fallback if avatar not found
  if (!avatar) {
    console.warn(`Avatar not found for ${section_designation} - ${full_name}`);
  }

  const handleClick = () => {
    if (!sectionId) {
      console.error("No sectionId found in route");
      return;
    }

    navigate(`${path}`, {
      state: { section_designation, full_name, sectionId },
    });
  };

  return (
    <div
      className="focal-task-card clickable"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label={`View tasks for ${section_designation}, managed by ${full_name}`}
      onKeyPress={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      <div className="card-content">
        <div className="avatar-container">
          {avatar ? (
            <img src={avatar} alt={`${full_name}'s avatar`} className="profile-avatar" />
          ) : (
            <div className="profile-fallback">?</div>
          )}
        </div>
        <div className="text-content">
          <h3 className="focal-title">{section_designation}</h3>
          <p className="focal-person">{full_name}</p> 
        </div>
      </div>
    </div>
  );
};

export default FocalTaskCard;