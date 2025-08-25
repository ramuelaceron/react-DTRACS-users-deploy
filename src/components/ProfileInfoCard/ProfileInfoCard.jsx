import React from 'react';
import EditButton from '../EditButton/EditButton';
import './ProfileInfoCard.css';

const ProfileInfoCard = ({ userData, isEditing, toggleEditMode }) => {
  return (
    <div className="profile-info-card">
      {/* Edit Button */}
      <EditButton isEditing={isEditing} onToggle={toggleEditMode} />

      <h2 className="profile-title">PROFILE INFORMATION</h2>
      <div className="profile-details">
        <div className="profile-row">
          <span className="label">Name:</span>
          <span className="value">{userData.firstName} {userData.middleName} {userData.lastName}</span>
        </div>
        <div className="profile-row">
          <span className="label">Email:</span>
          <span className="value">{userData.email}</span>
        </div>
        <div className="profile-row">
          <span className="label">Contact Number:</span>
          <span className="value">{userData.contactNumber}</span>
        </div>
        <div className="profile-row">
          <span className="label">Position:</span>
          <span className="value">{userData.position}</span>
        </div>
        <div className="profile-row">
          <span className="label">School:</span>
          <span className="value">{userData.school}</span>
        </div>
        <div className="profile-row">
          <span className="label">School Address:</span>
          <span className="value">{userData.schoolAddress}</span>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfoCard;