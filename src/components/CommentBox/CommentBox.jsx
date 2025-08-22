// src/components/CommentBox/CommentBox.jsx
import React from 'react';
import { MdAccountCircle } from "react-icons/md";
import { IoSendSharp } from "react-icons/io5";
import { HiMiniBold } from "react-icons/hi2";
import { FaItalic } from "react-icons/fa";
import { FaUnderline } from "react-icons/fa";
import { MdFormatListBulleted } from "react-icons/md";
import './CommentBox.css';

const CommentBox = ({ comment, setComment, onSubmit, disabled }) => {
  return (
    <div className="comment-box">
      <div className="comment-input-container">
        {/* Profile Icon */}
        <div className="comment-avatar">
          <MdAccountCircle size={32} />
        </div>

        {/* Input Wrapper */}
        <div className="comment-input-wrapper">
          <div className="comment-input-field">
            <textarea
              className="comment-input"
              placeholder="Add comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows="3"
              disabled={disabled}
            ></textarea>
            <button
              type="button"
              className="comment-send"
              onClick={onSubmit}
              disabled={!comment.trim() || disabled}
            >
              <IoSendSharp size={20} color="#2196F3" />
            </button>
          </div>
          <div className="comment-formats">
            <button type="button" className="format-btn"><HiMiniBold /></button>
            <button type="button" className="format-btn"><FaItalic /></button>
            <button type="button" className="format-btn"><FaUnderline /></button>
            <button type="button" className="format-btn"><MdFormatListBulleted /></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentBox;