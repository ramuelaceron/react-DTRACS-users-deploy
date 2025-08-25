// src/components/EditToggle/EditToggle.jsx
import React from 'react';
import { FaUserEdit } from "react-icons/fa";
import './EditButton.css';

const EditButton = ({ isEditing, onToggle }) => {
  return (
    <div className="edit-icon-wrapper">
      {!isEditing ? (
        <button className="edit-icon-button" onClick={onToggle} aria-label="Edit Profile">
          <FaUserEdit size={20} color="#2196F3" />
        </button>
      ) : (
        <button className="edit-done-button" onClick={onToggle}>
          Done
        </button>
      )}
    </div>
  );
};

export default EditButton;