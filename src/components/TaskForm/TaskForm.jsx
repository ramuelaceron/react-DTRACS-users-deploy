import React, { useState, useRef, useEffect } from 'react';
import RichTextEditor from './RichTextEditor';
import MultiSelectDropdown from './MultiSelectDropdown';
import AttachSection from './AttachSection';
import axios from 'axios';
import config from "../../config";
import './TaskForm.css';

const TaskForm = ({ onClose, onTaskCreated = () => {}, initialData = {}, creatorId }) => {
  const handleClose = typeof onClose === 'function' ? onClose : () => console.warn('⚠️ onClose not provided');

  const [formData, setFormData] = useState(() => {
    const parseDeadline = (str) => {
      if (!str) return null;
      if (str.includes('T')) return new Date(str);
      const parts = str.split(' ');
      if (parts.length === 2) {
        const [datePart, timePart] = parts;
        const [year, month, day] = datePart.split('-').map(Number);
        const normalized = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T${timePart}`;
        return new Date(normalized);
      }
      return null;
    };

    let dueDate = '', dueTime = '';
    if (initialData.deadline) {
      const d = parseDeadline(initialData.deadline);
      if (d && !isNaN(d.getTime())) {
        dueDate = d.toISOString().split('T')[0];
        dueTime = d.toTimeString().substring(0, 5);
      }
    }

    const forSchools = Array.isArray(initialData.for)
      ? [...new Set(initialData.for.map(item => typeof item === 'string' ? item : item?.school_name || '').filter(n => n.trim()))]
      : [];

    const assignedTo = Array.isArray(initialData.assignedTo)
      ? initialData.assignedTo.map(id => String(id)).filter(id => id && !['null', 'undefined'].includes(id))
      : [];

    const linkUrl = Array.isArray(initialData.links) && initialData.links.length > 0 ? '' : initialData.link || '';

    return { for: forSchools, assignedTo, dueDate, dueTime, title: initialData.title || '', description: initialData.description || '', linkUrl };
  });

  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [attachedLinks, setAttachedLinks] = useState(
    Array.isArray(initialData.links) && initialData.links.length > 0
      ? initialData.links.map(url => ({
          id: Date.now() + Math.random(),
          url,
          title: url,
          displayText: url.replace(/^(https?:\/\/)?(www\.)?/i, '')
        }))
      : []
  );

  const [availableUsers, setAvailableUsers] = useState([]);
  const [schools, setSchools] = useState([]);
  const [loadingSchools, setLoadingSchools] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [error, setError] = useState(null);
  const formContainerRef = useRef(null);

  // Fetch schools on mount
  useEffect(() => {
    const fetchSchools = async () => {
      setLoadingSchools(true);
      try {
        const res = await axios.get(`${config.API_BASE_URL}/focal/school/verified/accounts`);
        const schoolMap = new Map();
        res.data.forEach(acc => {
          if (!schoolMap.has(acc.school_name)) schoolMap.set(acc.school_name, { school_name: acc.school_name, accounts: [] });
          schoolMap.get(acc.school_name).accounts.push(acc);
        });
        const transformed = Array.from(schoolMap.values());
        setSchools(transformed);

        const validSchools = new Set(transformed.map(s => s.school_name));
        const filteredFor = formData.for.filter(name => validSchools.has(name));
        if (JSON.stringify(filteredFor) !== JSON.stringify(formData.for)) {
          setFormData(prev => ({ ...prev, for: filteredFor }));
        }
      } catch (err) {
        setError('Failed to load schools.');
        setSchools([]);
      } finally {
        setLoadingSchools(false);
      }
    };
    fetchSchools();
  }, []);

  // Fetch users when schools change
  useEffect(() => {
    if (formData.for.length === 0) return;
    setLoadingUsers(true);
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${config.API_BASE_URL}/focal/school/verified/accounts`);
        const userOptions = res.data.map(acc => ({
          value: acc.user_id,
          label: `${acc.first_name} ${acc.last_name}`,
          position: acc.position || ''
        }));
        setAvailableUsers(userOptions);

        const validIds = userOptions.map(u => String(u.value));
        const filtered = formData.assignedTo.filter(id => validIds.includes(String(id)));
        if (filtered.length && (JSON.stringify(filtered) !== JSON.stringify(formData.assignedTo))) {
          setFormData(prev => ({ ...prev, assignedTo: filtered }));
        }
      } catch (err) {
        setAvailableUsers([]);
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchUsers();
  }, [formData.for]);

  const handleSchoolSelection = (selected) => setFormData(prev => ({ ...prev, for: selected }));
  const handleUserSelection = (selected) => setFormData(prev => ({ ...prev, assignedTo: selected }));
  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return alert("Task title is required.");
    if (!formData.dueDate) return alert("Please select a due date.");

    const dueDateTime = new Date(`${formData.dueDate}T${formData.dueTime}`);
    if (isNaN(dueDateTime.getTime())) return alert("Invalid date/time.");

    const deadline = `${dueDateTime.getFullYear()}-${String(dueDateTime.getMonth()+1).padStart(2,'0')}-${String(dueDateTime.getDate()).padStart(2,'0')} ${String(dueDateTime.getHours()).padStart(2,'0')}:${String(dueDateTime.getMinutes()).padStart(2,'0')}`;

    if (formData.for.length === 0 && formData.assignedTo.length === 0) return alert("Select at least one school or account.");

    const linkUrl = formData.linkUrl.trim();
    if (linkUrl && !/^https?:\/\/.+/i.test(linkUrl)) return alert("Enter a valid URL.");

    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    const isEditing = !!initialData.task_id;
    const url = isEditing
      ? `${config.API_BASE_URL}/focal/task/update/id/?task_id=${encodeURIComponent(initialData.task_id)}`
      : `${config.API_BASE_URL}/focal/task/new-task`;

    const payload = isEditing
      ? {
          task_id: initialData.task_id,
          title: formData.title,
          description: formData.description,
          deadline,
          accounts_required: formData.assignedTo,
          links: attachedLinks.map(l => l.url)
        }
      : {
          creator_id: creatorId,
          title: formData.title,
          description: formData.description,
          deadline,
          schools_required: formData.for,
          accounts_required: formData.assignedTo,
          links: attachedLinks.map(l => l.url),
          task_status: "ONGOING"
        };

    try {
      const res = await axios[isEditing ? 'put' : 'post'](url, payload, {
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
      });

      const formattedDate = dueDateTime.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
      const formattedTime = dueDateTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

      onTaskCreated({
        id: res.data.id || initialData.task_id || Date.now(),
        ...res.data,
        ...payload,
        formattedDate,
        formattedTime,
        office: formData.for.length > 0 ? formData.for.join(', ') : 'All schools',
        assignedTo: formData.assignedTo.length > 0
          ? formData.assignedTo.map(id => availableUsers.find(u => u.value === id)?.label).filter(Boolean).join(', ')
          : 'All accounts',
        attachments: uploadedFiles.map(f => f.name),
        creation_date: res.data.created_at || new Date().toISOString()
      });

      setUploadedFiles([]);
      setAttachedLinks([]);
      handleClose();
    } catch (err) {
      console.error('Save failed:', err.response?.data || err.message);
      alert('Failed to save task.');
    }
  };

  const schoolOptions = schools.map(s => ({ value: s.school_name, label: s.school_name }));
  const userOptions = availableUsers.map(u => ({ value: u.value, label: u.label, position: u.position }));

  if (error) return (
    <div className="task-form-overlay" onClick={onClose}>
      <div className="task-form-container" ref={formContainerRef} onClick={e => e.stopPropagation()}>
        <button className="task-form-close" onClick={onClose}>×</button>
        <div style={{ padding: '2rem', textAlign: 'center', color: 'red' }}>{error}</div>
      </div>
    </div>
  );

  if (loadingSchools) return (
    <div className="task-form-overlay" onClick={onClose}>
      <div className="task-form-container" ref={formContainerRef} onClick={e => e.stopPropagation()}>
        <button className="task-form-close" onClick={onClose}>×</button>
        <div style={{ padding: '2rem', textAlign: 'center' }}>Loading schools...</div>
      </div>
    </div>
  );

  if (loadingUsers && formData.for.length > 0) return (
    <div className="task-form-overlay" onClick={onClose}>
      <div className="task-form-container" ref={formContainerRef} onClick={e => e.stopPropagation()}>
        <button className="task-form-close" onClick={onClose}>×</button>
        <div style={{ padding: '2rem', textAlign: 'center' }}>Loading accounts...</div>
      </div>
    </div>
  );

  return (
    <div className="task-form-overlay" onClick={onClose}>
      <div className="task-form-container" ref={formContainerRef} onClick={e => e.stopPropagation()}>
        <button className="task-form-close" onClick={handleClose}>×</button>
        <form onSubmit={handleSubmit} className="task-form">
          <div className="task-form-row">
            <div className="task-form-group">
              <MultiSelectDropdown
                label="For"
                options={schoolOptions}
                selectedValues={formData.for}
                onSelectionChange={handleSchoolSelection}
                placeholder="Select schools"
              />
            </div>
            <div className="task-form-group">
              <MultiSelectDropdown
                label="Assigned to"
                options={userOptions}
                selectedValues={formData.assignedTo}
                onSelectionChange={handleUserSelection}
                placeholder={formData.for.length === 0 ? "No schools selected" : availableUsers.length === 0 ? "No accounts found" : "Select accounts"}
                disabled={formData.for.length === 0 || availableUsers.length === 0}
                isAccountDropdown={true}
              />
            </div>
            <div className="task-form-group">
              <label>Due Date</label>
              <input type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} required className="date-picker-input" />
            </div>
            <div className="task-form-group">
              <label>Due Time</label>
              <input type="time" name="dueTime" value={formData.dueTime} onChange={handleChange} className="time-picker-input" />
            </div>
          </div>

          <div className="task-form-group">
            <label>Title*</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Enter task title" required />
          </div>

          <div className="task-form-group">
            <label>Description (optional)</label>
            <RichTextEditor
              value={formData.description}
              onChange={(val) => setFormData(prev => ({ 
                ...prev, 
                description: val // 👈 Just save the raw HTML — DO NOT strip tags
              }))}
            />
          </div>

          <AttachSection
            uploadedFiles={uploadedFiles}
            setUploadedFiles={setUploadedFiles}
            attachedLinks={attachedLinks}
            setAttachedLinks={setAttachedLinks}
            formData={formData}
            setFormData={setFormData}
          />

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={handleClose}>Cancel</button>
            <button type="submit" className="assign-btn">{initialData.title ? 'Update Task' : 'Assign Task'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;