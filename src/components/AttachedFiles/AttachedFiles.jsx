// src/components/AttachedFiles/AttachedFiles.jsx
import React from 'react';
import { FaFilePdf, FaFileWord, FaFileImage, FaFile, FaTrash } from "react-icons/fa";
import './AttachedFiles.css';

const AttachedFiles = ({ files, onRemove, isCompleted }) => {
  const getFileIcon = (file) => {
    const ext = file?.name.split('.').pop().toLowerCase();
    if (ext === 'pdf') return <FaFilePdf />;
    if (ext === 'doc' || ext === 'docx') return <FaFileWord />;
    if (ext === 'jpg' || ext === 'jpeg' || ext === 'png') return <FaFileImage />;
    return <FaFile />;
  };

  const getFileType = (file) => {
    const ext = file?.name.split('.').pop().toLowerCase();
    if (ext === 'pdf') return 'PDF';
    if (ext === 'doc' || ext === 'docx') return 'DOC';
    if (ext === 'jpg' || ext === 'jpeg' || ext === 'png') return 'Image';
    return ext?.toUpperCase() || 'FILE';
  };

  return (
    <div className={`attached-files-list ${isCompleted ? 'is-completed' : ''}`}>
      {files.map(({ id, name, type, icon }) => (
        <div className="attached-file-card" key={id}>
          <div className="file-icon-wrapper">
            {icon || getFileIcon({ name })}
          </div>
          <div className="file-info">
            <div className="file-name">{name}</div>
            <div className="file-type">{getFileType({ name })}</div>
          </div>
          {!isCompleted && (
            <button
              type="button"
              className="file-close-button"
              onClick={() => onRemove(id)}
              title="Remove file"
            >
              <FaTrash />
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default AttachedFiles;