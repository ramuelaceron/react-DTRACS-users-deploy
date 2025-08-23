// components/FocalTaskCard/FocalTaskCard.jsx
import React from 'react';
import { FaUser } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom'; // ✅ use useParams
import './FocalTaskCard.css';

const FocalTaskCard = ({ title, focalPerson, path = 'task-list' }) => {
  const navigate = useNavigate();
  const { sectionId } = useParams(); // ✅ Get from URL

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
          <FaUser className="profile-icon" />
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