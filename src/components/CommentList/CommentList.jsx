import React, { useState } from 'react';
import './CommentList.css';
import RichTextEditor from '../RichTextEditor/RichTextEditor';
import { FaEdit, FaTrash, FaSave, FaEllipsisV } from "react-icons/fa";
import useClickOutside from '../../hooks/useClickOutside';
import DOMPurify from 'dompurify';

const CommentList = ({
  comments,
  editingId,
  editText,
  setEditText,
  onEdit,
  onSaveEdit,
  onCancelEdit,
  onDelete
}) => {
  const menuRef = React.useRef(null);
  const [moreMenuId, setMoreMenuId] = React.useState(null);

  useClickOutside(menuRef, () => {
    setMoreMenuId(null);
  });

  return (
    <div className="comments-container">
      {comments.map((c) => (
        <div key={c.id} className="comment-item">
          {/* Avatar */}
          <div className="comment-avatar">
            {c.author.charAt(0).toUpperCase()}
          </div>

          <div className="comment-content" ref={menuRef}>
            {/* Header */}
            <div className="comment-header">
              <span className="comment-author">{c.author}</span>
              <span className="comment-time">{c.time}</span>
              <button
                className="comment-more-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setMoreMenuId(moreMenuId === c.id ? null : c.id);
                }}
                title="More options"
              >
                <FaEllipsisV size={14} />
              </button>
            </div>

            {/* Edit Mode */}
            {editingId === c.id ? (
              <div className="taskdetail-edit-container">
                <RichTextEditor
                  value={editText}
                  onChange={setEditText}
                  placeholder="Edit your comment..."
                />
                <div className="taskdetail-edit-actions">
                  <button
                    className="taskdetail-edit-cancel"
                    onClick={onCancelEdit}
                  >
                    Cancel
                  </button>
                  <button
                    className="taskdetail-edit-save"
                    onClick={onSaveEdit}
                  >
                    <FaSave size={14} style={{ marginRight: '6px' }} />
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div
                  className="comment-text"
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(c.text) }}
                />
                {c.isEdited && (
                  <span className="comment-edited-label"> (edited)</span>
                )}
              </>
            )}

            {/* Dropdown Menu */}
            {moreMenuId === c.id && (
              <div className="comment-menu-dropdown">
                <button
                  className="comment-menu-item"
                  onClick={() => {
                    setMoreMenuId(null);
                    onEdit(c);
                  }}
                >
                  <FaEdit size={12} style={{ marginRight: '8px' }} /> Edit
                </button>
                <button
                  className="comment-menu-item"
                  onClick={() => {
                    setMoreMenuId(null);
                    onDelete(c.id);
                  }}
                >
                  <FaTrash size={12} style={{ marginRight: '8px' }} /> Delete
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentList;