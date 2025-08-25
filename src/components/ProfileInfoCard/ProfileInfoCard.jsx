// src/components/ProfileInfoCard/ProfileInfoCard.jsx
import React from 'react';
import EditButton from '../EditButton/EditButton';
import './ProfileInfoCard.css';

const ProfileInfoCard = ({ userData, isEditing, toggleEditMode }) => {
  // Define which fields to show and their labels
  const fields = [
    { key: 'position', label: 'Position', value: userData.position },
    { key: 'office', label: 'Office', value: userData.office },
    { key: 'email', label: 'Email', value: userData.email },
    { key: 'contactNumber', label: 'Contact Number', value: userData.contactNumber },
    { key: 'school', label: 'School', value: userData.school },
    { key: 'Address', label: 'Address', value: userData.Address }, // Note: capital "A"
    { key: 'schoolAddress', label: 'School Address', value: userData.schoolAddress },
  ].filter(field => field.value); // ✅ Only show fields with a value
  return (
    <div className="profile-info-card">
      {/* Edit Button */}
      <EditButton isEditing={isEditing} onToggle={toggleEditMode} />

      <h2 className="profile-title">PROFILE INFORMATION</h2>

      <div className="profile-details">
        {/* Name is always shown */}
        <div className="profile-row">
          <span className="label">Name:</span>
          <span className="value">
            {userData.firstName} {userData.middleName} {userData.lastName}
          </span>
        </div>

        {/* Dynamically render other fields */}
        {fields.map((field) => (
          <div className="profile-row" key={field.key}>
            <span className="label">{field.label}:</span>
            <span className="value">{field.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileInfoCard;