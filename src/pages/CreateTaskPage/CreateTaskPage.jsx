// src/components/CreateTask/CreateTask.jsx
import React from 'react';
import { FaPlus } from "react-icons/fa6";
import './CreateTaskPage.css';
import TaskForm from '../../components/TaskForm/TaskForm'; // Import modal
import {API_BASE_URL} from '../../api/api'

const CreateTaskPage = ({ onTaskCreated, focalId }) => { // 👈 Add focalId to props
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleCreateClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      {/* ✅ Button remains 100% unchanged */}
      <button className="create-task-btn" onClick={handleCreateClick}>
        <FaPlus className="plus-icon" />
        <span className="create-text">Create</span>
      </button>

      {/* ✅ Pass onTaskCreated to TaskForm */}
      {isModalOpen && (
        <TaskForm 
          onClose={closeModal} 
          onTaskCreated={onTaskCreated}
          creatorId={focalId} // 👈 Pass it to TaskForm if needed
        />
      )}
    </>
  );
};

export default CreateTaskPage;