// src/components/ProfileAvatar/ProfileAvatar.jsx
import React from 'react';
import { FaCirclePlus } from "react-icons/fa6";
import { MdAccountCircle } from "react-icons/md";
import { generateAvatar } from '../../utils/iconGenerator'; // Import the icon generator
import './ProfileAvatar.css';

const ProfileAvatar = ({ 
  avatar, 
  isEditing, 
  onButtonClick, 
  fileInputRef, 
  onFileChange,
  userName // Add userName prop to generate avatar from name
}) => {
  // Generate avatar props if no avatar is provided
  const avatarProps = !avatar && userName ? generateAvatar(userName) : null;

  return (
    <div className="profile-avatar-container">
      <div className="profile-avatar">
        {avatar ? (
          <img src={avatar} alt="Profile" className="avatar-image" />
        ) : avatarProps ? (
          <div 
            className="generated-avatar-large"
            style={{ backgroundColor: avatarProps.color }}
          >
            {avatarProps.initials}
          </div>
        ) : (
          <MdAccountCircle size={120} />
        )}
      </div>

      {isEditing && (
        <>
          <button className="change-avatar-btn" onClick={onButtonClick}>
            <FaCirclePlus size={16} color="#2196F3" /> Change
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={onFileChange}
            accept="image/*"
            style={{ display: 'none' }}
          />
        </>
      )}
    </div>
  );
};

export default ProfileAvatar;