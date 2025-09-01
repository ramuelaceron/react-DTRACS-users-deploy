// src/components/TaskForm/TaskForm.jsx
import React, { useState, useRef, useEffect } from 'react';
import { FiUpload } from "react-icons/fi";
import { IoMdLink } from "react-icons/io";
import { useQuill } from 'react-quilljs';
import AttachedFiles from '../AttachedFiles/AttachedFiles';
import 'quill/dist/quill.snow.css';
import './TaskForm.css';
import { schoolAccounts } from '../../data/schoolAccounts'; // Import your school accounts data

// ✅ Rich Text Editor Component using useQuill
const RichTextEditor = ({ value, onChange }) => {
  const { quill, quillRef } = useQuill({
    theme: 'snow',
    modules: {
      toolbar: [
        ['bold', 'italic', 'underline'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['clean']
      ]
    },
    placeholder: 'Enter task description with formatting...'
  });

  const hasSetContent = useRef(false);

  // ✅ Set initial value
  useEffect(() => {
    if (quill && !hasSetContent.current) {
      quill.clipboard.dangerouslyPasteHTML(value || '');
      hasSetContent.current = true;
    }
  }, [quill, value]);

  // ✅ Listen for changes
  useEffect(() => {
    if (quill) {
      const handler = () => {
        const html = quill.root.innerHTML;
        onChange(html);
      };
      quill.on('text-change', handler);
      return () => {
        quill.off('text-change', handler);
      };
    }
  }, [quill, onChange]);

  return (
    <div style={{ height: '150px', marginBottom: '50px' }}>
      <div ref={quillRef} style={{ height: '100%' }} />
    </div>
  );
};

const TaskForm = ({ onClose, onTaskCreated = () => {} }) => {
  const [formData, setFormData] = useState({
    for: 'All schools',
    assignedTo: 'All accounts',
    dueDate: '', 
    title: '',
    description: '',
    linkUrl: ''
  });

  const [isLinkInputVisible, setIsLinkInputVisible] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isLinkValid, setIsLinkValid] = useState(true);
  const [availableUsers, setAvailableUsers] = useState([]);

  // Update available users when selected school changes
  useEffect(() => {
    if (formData.for === 'All schools') {
      setAvailableUsers([]);
      setFormData(prev => ({ ...prev, assignedTo: 'All accounts' }));
    } else {
      const selectedSchool = schoolAccounts.find(school => 
        school.school_name === formData.for
      );
      
      if (selectedSchool) {
        const users = selectedSchool.accounts.map(account => ({
          id: account.user_id,
          name: `${account.first_name} ${account.middle_name} ${account.last_name}`.trim(),
          position: account.position
        }));
        setAvailableUsers(users);
        
        // Reset assignedTo if the previous selection is not in the new list
        if (formData.assignedTo !== 'All accounts' && 
            !users.some(user => user.name === formData.assignedTo)) {
          setFormData(prev => ({ ...prev, assignedTo: 'All accounts' }));
        }
      } else {
        setAvailableUsers([]);
        setFormData(prev => ({ ...prev, assignedTo: 'All accounts' }));
      }
    }
  }, [formData.for]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'linkUrl') {
      // ✅ Validate: empty or starts with http:// or https://
      const isValid = value === '' || /^(https?:\/\/)/i.test(value.trim());
      setIsLinkValid(isValid);
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);

    if (files.length > 5) {
      console.warn("You can only upload up to 5 files.");
      return;
    }

    const validFiles = files.filter(file => {
      if (file.size > 10 * 1024 * 1024) {
        console.warn(`${file.name} is too large (max 10MB).`);
        return false;
      }
      return true;
    });

    const newFiles = validFiles.map(file => ({
      id: URL.createObjectURL(file),
      name: file.name,
      file
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (id) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // ✅ Final validation before submit
    if (formData.linkUrl && !/^(https?:\/\/)/i.test(formData.linkUrl.trim())) {
      setIsLinkValid(false);
      return;
    }

    if (!formData.title.trim()) {
      console.warn("Task title is required.");
      return;
    }

    if (!formData.dueDate) {
      console.warn("Please select a due date.");
      return;
    }

    const selectedDate = new Date(formData.dueDate);
    const formattedDate = selectedDate.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });

    onTaskCreated({
      id: Date.now(),
      title: formData.title,
      description: formData.description,
      dueDate: formData.dueDate,
      formattedDate,
      office: formData.for,
      assignedTo: formData.assignedTo,
      taskSlug: `task-${Date.now()}`,
      linkUrl: formData.linkUrl,
      attachments: uploadedFiles.map(f => f.name)
    });

    setUploadedFiles([]);
    setIsLinkInputVisible(false);
    onClose();
  };

  const toggleLinkInput = () => {
    setIsLinkInputVisible(prev => !prev);
    // ✅ Reset validation when toggling
    if (!isLinkInputVisible && formData.linkUrl) {
      setIsLinkValid(/^(https?:\/\/)/i.test(formData.linkUrl.trim()));
    }
  };

  return (
    <div className="task-form-overlay">
      <div className="task-form-container">
        <button className="task-form-close" onClick={onClose}>×</button>

        <form onSubmit={handleSubmit} className="task-form">
          {/* Row 1 */}
          <div className="task-form-row">
            <div className="task-form-group">
              <label htmlFor="for">For</label>
              <select id="for" name="for" value={formData.for} onChange={handleChange}>
                <option value="All schools">All schools</option>
                {schoolAccounts.map(school => (
                  <option key={school.slug} value={school.school_name}>
                    {school.school_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="task-form-group">
              <label htmlFor="assignedTo">Assigned to</label>
              <select 
                id="assignedTo" 
                name="assignedTo" 
                value={formData.assignedTo} 
                onChange={handleChange}
                disabled={formData.for === 'All schools' && availableUsers.length === 0}
              >
                <option value="All accounts">All accounts</option>
                {availableUsers.map(user => (
                  <option key={user.id} value={user.name}>
                    {user.name} ({user.position})
                  </option>
                ))}
              </select>
            </div>
            <div className="task-form-group">
              <label htmlFor="dueDate">Due Date</label>
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                required
                className="date-picker-input"
              />
            </div>
          </div>

          {/* Title */}
          <div className="task-form-group">
            <label htmlFor="title">Title*</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter task title"
              required
            />
          </div>

          {/* Description with Quill Editor */}
          <div className="task-form-group">
            <label>Description (optional)</label>
            <RichTextEditor
              value={formData.description}
              onChange={(value) => setFormData(prev => ({ ...prev, description: value }))}
            />
          </div>

          {/* Attach */}
          <div className="task-form-group">
            <label>Attach</label>
            <div className="task-form-attach">
              <div className="upload-link-container">
                <div className="upload-item">
                  <input
                    type="file"
                    id="upload"
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                    multiple
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  />
                  <button
                    type="button"
                    className="upload-circle"
                    onClick={() => document.getElementById('upload').click()}
                  >
                    <FiUpload size={20} />
                  </button>
                  <span className="upload-label">Upload</span>
                </div>

                <div className="link-item">
                  <button type="button" className="link-circle" onClick={toggleLinkInput}>
                    <IoMdLink size={20} />
                  </button>
                  <span className="link-label">Link</span>
                </div>
              </div>

              {/* ✅ Use AttachedFiles Component */}
              {uploadedFiles.length > 0 && (
                <AttachedFiles
                  files={uploadedFiles}
                  onRemove={removeFile}
                  isCompleted={false}
                />
              )}

              {/* Link Input */}
              {isLinkInputVisible && (
                <div className="link-input-outer-container">
                  <input
                    type="text"
                    placeholder="https://example.com"
                    value={formData.linkUrl}
                    name="linkUrl"
                    onChange={handleChange}
                    className={`link-input ${!isLinkValid ? 'invalid' : ''}`}
                    aria-invalid={!isLinkValid}
                  />
                </div>
              )}

              {/* 🔽 Error Message Below Input (after container) */}
              {isLinkInputVisible && !isLinkValid && formData.linkUrl && (
                <p className="error-text link-error-below">
                  Please enter a valid link starting with <strong>http://</strong> or <strong>https://</strong>
                </p>
              )}
            </div>
          </div>

          <button type="submit" className="assign-btn">Assign</button>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;