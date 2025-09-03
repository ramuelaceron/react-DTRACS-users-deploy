// src/pages/AttachmentsPage/AttachmentsPage.jsx
import React from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { IoChevronBackOutline } from "react-icons/io5";
import "./AttachmentsPage.css";

const AttachmentsPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { sectionId, taskSlug } = useParams(); // Changed from taskId to taskSlug

  const { schoolName, accountName, attachments = [], taskTitle } = state || {};

  const handleBack = () => navigate(-1);

  return (
    <div className="attachments-page">
      <div className="attachments-container">
        <button className="attachments-back-btn" onClick={handleBack}>
          <IoChevronBackOutline className="icon-md" /> Back
        </button>

        <div className="attachments-header">
          <h1>Attachments from {accountName}</h1>
          <p className="subtitle">
            {schoolName} • {taskTitle}
          </p>
        </div>

        <div className="attachments-content">
          {attachments.length > 0 ? (
            <div className="attachments-list">
              <h3>Submitted Files</h3>
              {attachments.map((attachment, index) => (
                <div key={index} className="attachment-item">
                  <div className="attachment-info">
                    <span className="attachment-name">{attachment.name || `Attachment ${index + 1}`}</span>
                    <span className="attachment-type">{attachment.type}</span>
                  </div>
                  <button className="download-btn">Download</button>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-attachments">
              <p>No attachments submitted yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttachmentsPage;