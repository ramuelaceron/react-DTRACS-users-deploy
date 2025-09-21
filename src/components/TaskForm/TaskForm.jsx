import React, { useState, useRef, useEffect } from 'react';
import RichTextEditor from './RichTextEditor';
import MultiSelectDropdown from './MultiSelectDropdown';
import AttachSection from './AttachSection';
import axios from 'axios';
import config from "../../config";
import './TaskForm.css';

const TaskForm = ({ onClose, onTaskCreated = () => {}, initialData = {}, creatorId }) => {

  // ✅ Fallback if onClose is not provided
  const handleClose = typeof onClose === 'function' ? onClose : () => {
    console.warn('⚠️ onClose is not a function. TaskForm cannot close itself.');
  };

  console.log('📥 TaskForm received initialData:', {
    for: initialData.for,
    assignedTo: initialData.assignedTo,
    title: initialData.title,
    description: initialData.description,
    deadline: initialData.deadline,
    links: initialData.links
  });

  // ✅ Updated useState initializer - Use assignedTo.school_id directly
  const [formData, setFormData] = useState(() => {
    let dueDate = '';
    let dueTime = '';

    const parseDeadline = (str) => {
        if (!str) return null;
        if (str.includes('T')) return new Date(str);
        
        const parts = str.split(' ');
        if (parts.length === 2) {
            const [datePart, timePart] = parts;
            const [year, month, day] = datePart.split('-').map(Number);
            const paddedMonth = String(month).padStart(2, '0');
            const paddedDay = String(day).padStart(2, '0');
            const normalized = `${year}-${paddedMonth}-${paddedDay}T${timePart}`;
            return new Date(normalized);
        }
        return null;
    };

    // Parse deadline
    if (initialData.deadline) {
        const dateObj = parseDeadline(initialData.deadline);
        if (dateObj && !isNaN(dateObj.getTime())) {
            dueDate = dateObj.toISOString().split('T')[0];
            dueTime = dateObj.toTimeString().substring(0, 5);
        }
    }

    // Use initialData.dueDate/dueTime as fallback
    if (initialData.dueDate) {
        const dateObj = parseDeadline(initialData.dueDate);
        if (dateObj && !isNaN(dateObj.getTime())) {
            dueDate = dateObj.toISOString().split('T')[0];
        } else {
            dueDate = initialData.dueDate.split('T')[0] || initialData.dueDate.split(' ')[0] || '';
        }
    }
    if (initialData.dueTime) {
        dueTime = initialData.dueTime;
    }

    // ✅ Extract school names from initialData.for (if it's an array of objects)
    const schoolNames = initialData.for
      ? Array.isArray(initialData.for)
        ? initialData.for.map(item => {
            // Handle both object and string cases
            if (typeof item === 'string') return item;
            if (item && typeof item === 'object' && item.school_name) return item.school_name;
            return '';
          }).filter(name => name.trim() !== '')
        : []
      : [];

    // Remove duplicates
    const finalFor = [...new Set(schoolNames)];

    // ✅ Extract user IDs (convert to string)
    // ✅ Correct: assume assignedTo is an array of strings (school IDs)
    const validUserIds = initialData.assignedTo
      ? initialData.assignedTo.map(id => String(id))
      .filter(id => id != null && id !== 'null' && id !== 'undefined')
      : [];

    // ✅ Link URL
    const linkUrl = Array.isArray(initialData.links) && initialData.links.length > 0
      ? '' // 👈 Empty string if links exist — they're already attached
      : initialData.link || '';

    return {
      for: finalFor,
      assignedTo: validUserIds,
      dueDate,
      dueTime,
      title: initialData.title || '',
      description: initialData.description || '',
      linkUrl: linkUrl || ''
    };
  });

  // ✅ Initialize attached links
  const [uploadedFiles, setUploadedFiles] = useState([]);
 // ✅ Initialize attachedLinks from initialData.links
  const [attachedLinks, setAttachedLinks] = useState(
    Array.isArray(initialData.links) && initialData.links.length > 0
      ? initialData.links.map(url => ({
          id: Date.now() + Math.random(),
          url,
          title: url,
          displayText: url.replace(/^(https?:\/\/)?(www\.)?/i, '') // Clean display text
        }))
      : []
  );

  // ✅ LOG: Received initialData
  console.log('📥 TaskForm received initialData:', initialData);

  const [availableUsers, setAvailableUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true); // 👈 ADD THIS
  const [schools, setSchools] = useState([]);
  const [error, setError] = useState(null);
  const [loadingSchools, setLoadingSchools] = useState(true); // 👈 ADD THIS
  const formContainerRef = useRef(null);

  // ✅ Fetch schools
  useEffect(() => {
    const fetchSchoolsAndAccounts = async () => {
      try {
        const response = await axios.get(`${config.API_BASE_URL}/focal/school/verified/accounts`);
        const accountsData = response.data;

        const schoolMap = new Map();
        accountsData.forEach(account => {
          const { school_name, ...accountDetails } = account;
          if (!schoolMap.has(school_name)) {
            schoolMap.set(school_name, { school_name, accounts: [] });
          }
          schoolMap.get(school_name).accounts.push(accountDetails);
        });

        const transformedSchools = Array.from(schoolMap.values());
        setSchools(transformedSchools);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch verified school accounts:', err);
        setError('Failed to load schools. Please try again.');
        setSchools([]);
      }
    };

    fetchSchoolsAndAccounts();
  }, []);

  // ✅ Fetch available users (accounts) based on selected schools
  // ✅ Fetch available users (accounts) based on selected schools
useEffect(() => {
  const fetchUsers = async () => {
    if (formData.for.length === 0) {
      setLoadingUsers(false);
      return;
    }

    try {
      const response = await axios.get(`${config.API_BASE_URL}/focal/school/verified/accounts`);
      const accountsData = response.data;

      // ✅ Get ALL verified accounts (no filtering by school)
      const filteredAccounts = accountsData;

      const userOptions = filteredAccounts.map(account => ({
        value: account.user_id,
        label: `${account.first_name} ${account.last_name}`,
        position: account.position || '',
      }));

      setAvailableUsers(userOptions);

      // 🟡 DEBUG: Log user options and assignedTo BEFORE filtering
      console.log('✅ [DEBUG] Fetched userOptions:', userOptions);
      console.log('✅ [DEBUG] Current formData.assignedTo:', formData.assignedTo);

      // ✅ After setting userOptions
      const validUserIds = userOptions.map(u => String(u.value)); // Ensure string
      const filteredAssignedTo = formData.assignedTo.filter(id => validUserIds.includes(String(id)));

      // 🟡 DEBUG: Log filtering results
      console.log('✅ [DEBUG] validUserIds (from options):', validUserIds);
      console.log('✅ [DEBUG] filteredAssignedTo (after filtering):', filteredAssignedTo);

      // ✅ Only update if there are valid users and they differ
      if (filteredAssignedTo.length > 0 &&  
          (!Array.isArray(formData.assignedTo) || 
           filteredAssignedTo.length !== formData.assignedTo.length || 
           !filteredAssignedTo.every((id, i) => id === formData.assignedTo[i]))) {
        setFormData(prev => ({ ...prev, assignedTo: filteredAssignedTo }));
        console.log('✅ [DEBUG] Updated formData.assignedTo to:', filteredAssignedTo);
      } else {
        console.log('ℹ️ [DEBUG] No update needed — assignedTo unchanged or no valid matches.');
      }

      setLoadingUsers(false);
    } catch (err) {
      console.error('❌ Failed to fetch users:', err);
      setAvailableUsers([]);
      setLoadingUsers(false);
    }
  };

  fetchUsers();
}, [formData.for]); // 👈 Re-run when schools change

  // ✅ School options
  const schoolOptions = schools.map(school => ({
    value: school.school_name,
    label: school.school_name
  }));

  // ✅ Add this useEffect after the one fetching schools
  // ✅ Fetch schools ONCE
  useEffect(() => {
    const fetchSchoolsAndAccounts = async () => {
      setLoadingSchools(true); // 👈 Start loading
      try {
        const response = await axios.get(`${config.API_BASE_URL}/focal/school/verified/accounts`);
        const accountsData = response.data;

        const schoolMap = new Map();
        accountsData.forEach(account => {
          const { school_name, ...accountDetails } = account;
          if (!schoolMap.has(school_name)) {
            schoolMap.set(school_name, { school_name, accounts: [] });
          }
          schoolMap.get(school_name).accounts.push(accountDetails);
        });

        const transformedSchools = Array.from(schoolMap.values());
        setSchools(transformedSchools);

        // ✅ Filter formData.for to only include schools that are actually in the list
        const validSchoolNames = new Set(transformedSchools.map(school => school.school_name));
        const filteredFor = formData.for.filter(name => validSchoolNames.has(name));

        // Only update if different
        if (filteredFor.length !== formData.for.length || !filteredFor.every((name, i) => name === formData.for[i])) {
          setFormData(prev => ({ ...prev, for: filteredFor }));
        }

        setError(null);
      } catch (err) {
        console.error('Failed to fetch verified school accounts:', err);
        setError('Failed to load schools. Please try again.');
        setSchools([]);
      } finally {
        setLoadingSchools(false); // 👈 Always stop loading, even on error
      }
    };

    fetchSchoolsAndAccounts();
  }, []); // 👈 Run only once on mount

  const handleSchoolSelection = (selectedSchools) => {
    setFormData(prev => ({ ...prev, for: selectedSchools }));
  };

  const handleUserSelection = (selectedUserIds) => {
    setFormData(prev => ({ ...prev, assignedTo: selectedUserIds }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert("Task title is required.");
      return;
    }

    if (!formData.dueDate) {
      alert("Please select a due date.");
      return;
    }

    const dueDateTime = new Date(`${formData.dueDate}T${formData.dueTime}`);
    const year = dueDateTime.getFullYear();
    const month = String(dueDateTime.getMonth() + 1).padStart(2, '0');
    const day = String(dueDateTime.getDate()).padStart(2, '0');
    const hour = String(dueDateTime.getHours()).padStart(2, '0');
    const minute = String(dueDateTime.getMinutes()).padStart(2, '0');

    const deadline = `${year}-${month}-${day} ${hour}:${minute}`;

    if (formData.for.length === 0 && formData.assignedTo.length === 0) {
      alert("Please select at least one school or account.");
      return;
    }

    const linkUrl = formData.linkUrl.trim();
    if (linkUrl && !/^https?:\/\/.+/i.test(linkUrl)) {
      alert("Please enter a valid URL (e.g., https://example.com)");
      return;
    }
    

    const createTaskPayload = {
      creator_id: creatorId,
      title: formData.title,
      description: formData.description,
      deadline,
      schools_required: formData.for,
      accounts_required: formData.assignedTo,
      links: attachedLinks.map(linkObj => linkObj.url),
      task_status: "ONGOING",
    };

    const updateTaskPayload = {
      task_id: initialData.task_id,
      title: formData.title,
      description: formData.description,
      deadline,
      accounts_required: formData.assignedTo,
      links: attachedLinks.map(linkObj => linkObj.url),
    };

    console.log('📤 Sending task to backend:', updateTaskPayload);

    try {
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      
      let response;

      const isEditing = !!initialData.task_id;
      const taskId = initialData.task_id;

      if (isEditing && taskId) {
        // ✅ Use update payload
        const url = `${config.API_BASE_URL}/focal/task/update/id/?task_id=${encodeURIComponent(taskId)}`;
        response = await axios.put(
          url,
          updateTaskPayload,
          {
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          }
        );
      } else {
        // ✅ Use create payload
        response = await axios.post(
          `${config.API_BASE_URL}/focal/task/new-task`,
          createTaskPayload, // 👈 Full payload with creator_id, schools, etc.
          {
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          }
        );
      }

      // ✅ Rest of your success logic (unchanged)
      const formattedDate = dueDateTime.toLocaleDateString('en-US', {
        month: 'long', day: 'numeric', year: 'numeric'
      });
      
      const formattedTime = dueDateTime.toLocaleTimeString('en-US', {
        hour: '2-digit', minute: '2-digit', hour12: true
      });

      onTaskCreated({
        id: response.data.id || taskId || Date.now(), // 👈 Use existing ID if editing
        ...response.data,
        ...createTaskPayload,
        formattedDate,
        formattedTime,
        office: formData.for.length > 0 ? formData.for.join(', ') : 'All schools',
        assignedTo: formData.assignedTo.length > 0 
          ? formData.assignedTo.map(id => availableUsers.find(u => u.value === id)?.label).filter(Boolean).join(', ')
          : 'All accounts',
        attachments: uploadedFiles.map(f => f.name),
        creation_date: response.data.created_at || new Date().toISOString()
      });

      setUploadedFiles([]);
      setAttachedLinks([]);
      handleClose();

    } catch (err) {
      console.error('❌ Failed to save task:', err.response?.data || err.message);
      alert('Failed to save task. Please check your connection and try again.');
    }
  };

  const userOptions = availableUsers.map(user => ({
    value: user.value,
    label: user.label,
    position: user.position
  }));

  if (error) {
    return (
      <div className="task-form-overlay" onClick={onClose}>
        <div className="task-form-container" ref={formContainerRef} onClick={e => e.stopPropagation()}>
          <button className="task-form-close" onClick={onClose}>×</button>
          <div style={{ padding: '2rem', textAlign: 'center', color: 'red' }}>
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (loadingSchools) {
  return (
    <div className="task-form-overlay" onClick={onClose}>
      <div className="task-form-container" ref={formContainerRef} onClick={e => e.stopPropagation()}>
        <button className="task-form-close" onClick={onClose}>×</button>
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <div className="loading-spinner">Loading...</div>
        </div>
      </div>
    </div>
  );
}

if (loadingUsers && formData.for.length > 0) {
  return (
    <div className="task-form-overlay" onClick={onClose}>
      <div className="task-form-container" ref={formContainerRef} onClick={e => e.stopPropagation()}>
        <button className="task-form-close" onClick={onClose}>×</button>
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          Loading accounts...
        </div>
      </div>
    </div>
  );
}

  return (
    <div className="task-form-overlay" onClick={onClose}>
      <div className="task-form-container" ref={formContainerRef} onClick={e => e.stopPropagation()}>
        <button 
          className="task-form-close" 
          onClick={(e) => {
            e.stopPropagation();
            handleClose(); // ✅ Safe to call
          }}
        >
          ×
        </button>

        <form onSubmit={handleSubmit} className="task-form">
          <div className="task-form-row">
            <div className="task-form-group">
              {/* DEBUG: Log Schools Data */}
                {console.log('🏫 TaskForm -> School Dropdown - selectedValues:', formData.for)}
                {console.log('🏫 TaskForm -> School Dropdown - options:', schoolOptions)}
              <MultiSelectDropdown
                label="For"
                options={schoolOptions}
                selectedValues={formData.for}
                onSelectionChange={handleSchoolSelection}
                placeholder="Select schools"  
              />
            </div>
            <div className="task-form-group">
              {/* DEBUG: Log Accounts Data */}
              {console.log('👥 TaskForm -> Accounts Dropdown - selectedValues:', formData.assignedTo)}
              {console.log('👥 TaskForm -> Accounts Dropdown - options:', userOptions)}
              <MultiSelectDropdown
                label="Assigned to"
                options={userOptions}
                selectedValues={formData.assignedTo}
                onSelectionChange={handleUserSelection}
                placeholder={formData.for.length === 0 
                  ? "No schools selected" 
                  : availableUsers.length === 0 
                    ? "No accounts found" 
                    : "Select accounts"}
                disabled={formData.for.length === 0 || availableUsers.length === 0}
                isAccountDropdown={true}
              />
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
            <div className="task-form-group">
              <label htmlFor="dueTime">Due Time</label>
              <input
                type="time"
                id="dueTime"
                name="dueTime"
                value={formData.dueTime}
                onChange={handleChange}
                className="time-picker-input"
              />
            </div>
          </div>

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

          <div className="task-form-group">
            <label>Description (optional)</label>
            <RichTextEditor
              value={formData.description}
              onChange={(value) => {
                const plainText = value.replace(/<[^>]+>/g, '');
                setFormData(prev => ({ ...prev, description: plainText }));
              }}
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
            <button 
              type="button" 
              className="cancel-btn" 
              onClick={(e) => {
                e.stopPropagation();
                handleClose(); // ✅ Safe to call
              }}
            >
              Cancel
            </button>
            <button type="submit" className="assign-btn">
              {initialData.title ? 'Update Task' : 'Assign Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );  
};

export default TaskForm;