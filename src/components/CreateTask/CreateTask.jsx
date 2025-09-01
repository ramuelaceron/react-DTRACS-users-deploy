// src/components/CreateTask/CreateTask.jsx
import React from 'react';
import { FaPlus } from "react-icons/fa6";
import './CreateTask.css';
import TaskForm from '../TaskForm/TaskForm'; // Import modal

const CreateTask = ({ onTaskCreated }) => {
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
        />
      )}
    </>
  );
};

export default CreateTask;