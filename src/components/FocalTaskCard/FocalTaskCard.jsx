// components/FocalTaskCard/FocalTaskCard.jsx
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { sectionData } from '../../data/focals'; // ✅ Import sectionData
import './FocalTaskCard.css';

const FocalTaskCard = ({ title, focalPerson, path = 'task-list' }) => {
  const navigate = useNavigate();
  const { sectionId } = useParams(); // Get sectionId from URL

  // 🔍 Find the correct entry in sectionData
  const section = sectionData[sectionId];
  let avatar = null;

  if (section && Array.isArray(section)) {
    const entry = section.find(
      (item) => item.title === title && item.focalPerson === focalPerson
    );
    avatar = entry?.avatar || null;
  }

  // Fallback if avatar not found
  if (!avatar) {
    console.warn(`Avatar not found for ${title} - ${focalPerson}`);
  }

  const handleClick = () => {
    if (!sectionId) {
      console.error("No sectionId found in route");
      return;
    }

    navigate(`${path}`, {
      state: { title, focalPerson, sectionId },
    });
  };

  return (
    <div
      className="focal-task-card clickable"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label={`View tasks for ${title}, managed by ${focalPerson}`}
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
            <img src={avatar} alt={`${focalPerson}'s avatar`} className="profile-avatar" />
          ) : (
            <div className="profile-fallback">?</div>
          )}
        </div>
        <div className="text-content">
          <h3 className="focal-title">{title}</h3>
          <p className="focal-person">{focalPerson}</p>
        </div>
      </div>
    </div>
  );
};

export default FocalTaskCard;