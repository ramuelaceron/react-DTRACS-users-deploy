import React from 'react';
import { FaUser } from 'react-icons/fa';
import './FocalTaskCard.css';

const FocalTaskCard = ({ title, focalPerson, onClick }) => {
  return (
    <div 
      className={`focal-task-card ${onClick ? 'clickable' : ''}`} 
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : -1}
      aria-label={onClick ? `Go to ${title}` : undefined}
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