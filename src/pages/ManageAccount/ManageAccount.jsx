// src/pages/ManageAccount/ManageAccount.jsx
import React, { useState, useRef, useEffect } from 'react';
import './ManageAccount.css';

// Toastify
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components
import EditLinks from '../../components/EditLinks/EditLinks';
import ProfileInfoCard from '../../components/ProfileInfoCard/ProfileInfoCard';
import ProfileAvatar from '../../components/ProfileAvatar/ProfileAvatar';

import api from '../../api/axios';
import { schoolAddresses } from "../../data/schoolAddresses";

const ManageAccount = () => {
  const [isEditing, setIsEditing] = useState(false);

  // ✅ State: user data from backend
  const [userData, setUserData] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(true);

  const fileInputRef = useRef(null);

  // ✅ Unified temp state for all editable fields
  const [tempProfile, setTempProfile] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    email: "",
    contact_number: "",
  });

  // ✅ Load user data from backend on mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const savedUser = sessionStorage.getItem("currentUser");
        if (!savedUser) {
          toast.error("Not logged in. Redirecting...");
          setTimeout(() => {
            window.location.href = "/";
          }, 1500);
          return;
        }

        const currentUser = JSON.parse(savedUser);
        const userId = currentUser.user_id;
        const role = currentUser.role;

        if (!userId) {
          throw new Error("User ID not found");
        }

        const endpoint = `/specific/verified/account/${userId}`;
        const response = await api.get(endpoint);

        if (!response.data || !response.data.data) {
          throw new Error("Invalid response from server");
        }

        const backendData = response.data.data;

        let mergedData = {
          user_id: backendData.user_id || userId,
          first_name: backendData.first_name || "",
          last_name: backendData.last_name || "",
          middle_name: backendData.middle_name || "",
          email: backendData.email || "",
          contact_number: backendData.contact_number || "",
          avatar: backendData.avatar || null,
          role: role,
          school_name: backendData.school_name || "Not specified",
          school_address: backendData.school_address || "Not specified",
          position: backendData.position || "Not specified",
          office: backendData.office || "Not specified",
          section_designation: backendData.section_designation || "Not specified",
        };

        if (role === "school" && (mergedData.school_address === "N/A" || mergedData.school_address === "Not specified")) {
          const correctAddress = schoolAddresses[mergedData.school_name];
          if (correctAddress) {
            mergedData.school_address = correctAddress;
          }
        }

        sessionStorage.setItem("currentUser", JSON.stringify(mergedData));
        setUserData(mergedData);
        setAvatar(mergedData.avatar);

        // Initialize tempProfile with current data
        setTempProfile({
          first_name: mergedData.first_name,
          middle_name: mergedData.middle_name,
          last_name: mergedData.last_name,
          email: mergedData.email,
          contact_number: mergedData.contact_number,
        });

        setLoading(false);
      } catch (error) {
        console.error("Error fetching user ", error);
        setLoading(false);
        
        const savedUser = sessionStorage.getItem("currentUser");
        if (savedUser) {
          const fallbackData = JSON.parse(savedUser);
          setUserData(fallbackData);
          setAvatar(fallbackData.avatar || null);
          setTempProfile({
            first_name: fallbackData.first_name || "",
            middle_name: fallbackData.middle_name || "",
            last_name: fallbackData.last_name || "",
            email: fallbackData.email || "",
            contact_number: fallbackData.contact_number || "",
          });
        } else {
          toast.error("Failed to load user data. Please login again.");
          setTimeout(() => {
            window.location.href = "/";
          }, 2000);
        }
      }
    };

    fetchUserData();
  }, []);

  // ✅ Show success toast after reload if flag exists
  useEffect(() => {
    const shouldShowToast = sessionStorage.getItem("showProfileUpdateSuccess");
    if (shouldShowToast === "true") {
      toast.success("✅ Profile updated successfully!");
      sessionStorage.removeItem("showProfileUpdateSuccess"); // Clean up
    }
  }, []);

  if (loading) {
    return <div className="manage-account-app">Loading...</div>;
  }

  if (!userData) {
    return <div className="manage-account-app">No user data available</div>;
  }

  // Unified save handler — sends all fields, then reloads
  const handleSaveProfile = async () => {
    // Validate required fields
    if (!tempProfile.first_name.trim() || !tempProfile.last_name.trim()) {
      toast.warn("First and last name are required.");
      return;
    }

    if (!tempProfile.email || !tempProfile.email.includes("@")) {
      toast.warn("Please enter a valid email.");
      return;
    }

    if (!tempProfile.contact_number?.trim()) {
      toast.warn("Please enter a contact number.");
      return;
    }

    try {
      const userId = userData.user_id;
      const role = userData.role;

      if (!userId) {
        throw new Error("User ID not found");
      }

      // ✅ Prepare payload
      const payload = {
        first_name: tempProfile.first_name.trim(),
        middle_name: tempProfile.middle_name?.trim() || '',
        last_name: tempProfile.last_name.trim(),
        email: tempProfile.email.trim(),
        contact_number: tempProfile.contact_number.trim(),
      };

      // ✅ Choose endpoint
      const endpoint = role === "school"
        ? `/school/account/update/id/?user_id=${encodeURIComponent(userId)}`
        : `/focal/account/update/id/?user_id=${encodeURIComponent(userId)}`;

      // ✅ Send PUT request
      const response = await api.put(endpoint, payload);

      if (!response.data) {
        throw new Error("No data returned from server");
      }

      // ✅ Update session storage
      const updatedData = { ...userData, ...payload };
      sessionStorage.setItem("currentUser", JSON.stringify(updatedData));

      // ✅ SET FLAG TO SHOW TOAST AFTER RELOAD
      sessionStorage.setItem("showProfileUpdateSuccess", "true");

      // ✅ RELOAD PAGE
      window.location.reload();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(`❌ Failed to update profile: ${error.response?.data?.detail || error.message}`);
    }
  };

  // Handle image upload
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Please upload a valid image (JPG, PNG, GIF)");
        e.target.value = '';
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image too large. Max 5MB allowed.");
        e.target.value = '';
        return;
      }

      try {
        const reader = new FileReader();
        reader.onload = async () => {
          const base64Image = reader.result;
          setAvatar(base64Image);
          
          const savedUser = JSON.parse(sessionStorage.getItem("currentUser"));
          const updatedUser = { ...savedUser, avatar: base64Image };
          sessionStorage.setItem("currentUser", JSON.stringify(updatedUser));
          
          setUserData(prev => ({ ...prev, avatar: base64Image }));
          
          toast.info("Profile picture updated!", { autoClose: 1500 });
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error("Error processing image:", error);
        toast.error("Failed to process image. Please try again.");
      }
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  // Toggle edit mode
  const toggleEditMode = () => {
    if (isEditing) {
      setIsEditing(false);
      toast.info("Exited edit mode.", { autoClose: 1500 });
    } else {
      setIsEditing(true);
      toast.info("Edit mode enabled. Make your changes!", { autoClose: 2000 });
    }
  };

  return (
    <div className="manage-account-app">
      <main className="manage-account-main">
        {/* Profile Section */}
        <div className="profile-section">
          <ProfileAvatar
            avatar={avatar}
            isEditing={isEditing}
            onButtonClick={handleButtonClick}
            fileInputRef={fileInputRef}
            onFileChange={handleFileChange}
            userName={`${userData.first_name} ${userData.middle_name} ${userData.last_name}`}
          />

          <ProfileInfoCard
            userData={userData}
            isEditing={isEditing}
            toggleEditMode={toggleEditMode}
          />
        </div>

        {/* Edit Links — only show when editing */}
        {isEditing && (
          <EditLinks
            tempProfile={tempProfile}
            setTempProfile={setTempProfile}
            handleSaveProfile={handleSaveProfile}
          />
        )}
      </main>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};

export default ManageAccount;