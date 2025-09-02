// TaskViewComment.jsx
import React, { useState } from "react";
import "./TaskViewComment.css"
import { mockComments, schoolAccounts } from "../../data/SchoolAccounts";

const TaskViewComment = () => {
  const [ comments ] = useState(mockComments);

  return (
    <div className="comments-section">
      <h3>Comments</h3>
      {/* Comments list */}
      <div className="comment-list">
        {comments.map((c) => (
          <div key={c.id} className="comment-card">
            <div className="comment-header">
              <span className="author">{c.author}</span>{" "}
              <span className="role">({c.role})</span>
              <span className="date">{c.date}</span>
            </div>
            <p className="comment-text">{c.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskViewComment;