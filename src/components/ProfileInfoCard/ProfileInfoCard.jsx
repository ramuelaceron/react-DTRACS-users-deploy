// src/components/ProfileInfoCard/ProfileInfoCard.jsx
import React from 'react';
import EditButton from '../EditButton/EditButton';
import './ProfileInfoCard.css';

const ProfileInfoCard = ({ userData, isEditing, toggleEditMode }) => {
  // Define which fields to show and their labels based on role
  let fields = [];
  
  if (userData.role === "school") {
    fields = [
      { key: 'position', label: 'Position', value: userData.position },
      { key: 'email', label: 'Email', value: userData.email },
      { key: 'contactNumber', label: 'Contact Number', value: userData.contact_number },
      { key: 'school', label: 'School', value: userData.school_name },
      { key: 'schoolAddress', label: 'School Address', value: userData.school_address },
    ];
  } else if (userData.role === "office") {
    // Handle section value - if null/empty/"Not specified", show "Section not assigned yet" in italics
    const sectionValue = userData.section_designation;
    const displaySection = !sectionValue || 
                          sectionValue === "Not specified" || 
                          sectionValue === "" || 
                          sectionValue === null || 
                          sectionValue === "NULL"
                        ? "<em>Section not assigned yet</em>" 
                        : sectionValue;
    
    fields = [
      { key: 'office', label: 'Office', value: userData.office },
      { key: 'email', label: 'Email', value: userData.email },
      { key: 'contactNumber', label: 'Contact Number', value: userData.contact_number },
      { key: 'section', label: 'Section', value: displaySection, isHtml: true },
      { key: 'Office Address', label: 'Office Address', value: 'DepEd Division of Biñan City (102 P. Burgos Street, Biñan, 4024 Laguna)' },
    ];
  }

  // Filter out fields without values (except for section which we handled above)
  fields = fields.filter(field => {
    if (field.key === 'section') return true; // Always show section field
    return field.value && field.value !== "Not specified" && field.value !== "N/A";
  });

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
            {userData.first_name} {userData.middle_name} {userData.last_name}
          </span>
        </div>

        {/* Dynamically render other fields */}
        {fields.map((field) => (
          <div className="profile-row" key={field.key}>
            <span className="label">{field.label}:</span>
            {field.isHtml ? (
              <span className="value" dangerouslySetInnerHTML={{ __html: field.value }} />
            ) : (
              <span className="value">{field.value}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileInfoCard;