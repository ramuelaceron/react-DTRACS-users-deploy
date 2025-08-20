// FocalTaskCard.js
import React from 'react';
import { FaUser } from 'react-icons/fa';
import './FocalTaskCard.css';

const FocalTaskCard = ({ title, focalPerson }) => {
  return (
    <div className="focal-task-card">
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