import React from 'react';
import { FaCirclePlus } from "react-icons/fa6";
import { MdAccountCircle } from "react-icons/md";
import './ProfileAvatar.css';

const ProfileAvatar = ({ avatar, isEditing, onButtonClick, fileInputRef, onFileChange }) => {
  return (
    <div className="profile-avatar-container">
      <div className="profile-avatar">
        {avatar ? (
          <img src={avatar} alt="Profile" className="avatar-image" />
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