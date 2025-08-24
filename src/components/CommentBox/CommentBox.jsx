import React, { useState, useRef } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MdAccountCircle } from "react-icons/md";
import { IoSendSharp } from "react-icons/io5";
import RichTextEditor from '../RichTextEditor/RichTextEditor';
import './CommentBox.css';

const CommentBox = ({ onSubmit, disabled }) => {
  const [htmlContent, setHtmlContent] = useState('');
  const quillRef = useRef(null);

  const handleSend = () => {
  if (disabled || !quillRef.current) return;

  if (quillRef.current.isEmpty()) {
    toast.error("Please enter a comment");
    return;
  }

  onSubmit(quillRef.current.getHTML());

  setHtmlContent('');
  quillRef.current.clear();
  };

  return (
    <div className="comment-box">
      <div className="comment-input-container">
        <div className="comment-avatar">
          <MdAccountCircle size={32} />
        </div>
        <div className="comment-input-wrapper">
          <div className="comment-editor-container">
            <RichTextEditor
              ref={quillRef}
              value={htmlContent}
              onChange={setHtmlContent}
              placeholder="Add comment..."
              readOnly={disabled}
            />
            <button
              type="button"
              className="comment-send"
              onClick={handleSend}
              disabled={disabled}
            >
              <IoSendSharp size={20} color="#2196F3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentBox;