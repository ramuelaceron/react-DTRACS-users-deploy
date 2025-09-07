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

// 🔽 Import Axios instance
import api from '../../api/axios';

// ✅ School addresses list (copied from Login.jsx)
import { schoolAddresses } from "../../data/schoolAddresses";

const ManageAccount = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showNameForm, setShowNameForm] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);

  // ✅ State: user data from backend
  const [userData, setUserData] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(true);

  const fileInputRef = useRef(null);

  // ✅ Temp states
  const [tempName, setTempName] = useState(null);
  const [tempEmail, setTempEmail] = useState(null);
  const [tempContact, setTempContact] = useState(null);

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

        // 🔹 Fetch user data from backend based on role
        // Note: Both school and focal routes use the same endpoint pattern
        const endpoint = `/specific/verified/account/${userId}`;
        const response = await api.get(endpoint);

        if (!response.data || !response.data.data) {
          throw new Error("Invalid response from server");
        }

        const backendData = response.data.data;

        // ✅ Create user data object directly from backend with minimal defaults
        let mergedData = {
          // Basic user info
          user_id: backendData.user_id || userId,
          first_name: backendData.first_name || "",
          last_name: backendData.last_name || "",
          middle_name: backendData.middle_name || "",
          email: backendData.email || "",
          contact_number: backendData.contact_number || "",
          avatar: backendData.avatar || null,
          role: role,
          // School-specific fields
          school_name: backendData.school_name || "Not specified",
          school_address: backendData.school_address || "Not specified",
          position: backendData.position || "Not specified",
          // Office-specific fields
          office: backendData.office || "Not specified",
          section_designation: backendData.section_designation || "Not specified",
        };

        // ✅ OVERRIDE: If school_address is "N/A" or "Not specified", auto-fill from school name
        if (role === "school" && (mergedData.school_address === "N/A" || mergedData.school_address === "Not specified")) {
          const correctAddress = schoolAddresses[mergedData.school_name];
          if (correctAddress) {
            mergedData.school_address = correctAddress;
          }
        }

        // Update session storage with latest data
        sessionStorage.setItem("currentUser", JSON.stringify(mergedData));

        setUserData(mergedData);
        setAvatar(mergedData.avatar);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user ", error);
        setLoading(false);
        
        // Fallback to session storage if API fails
        const savedUser = sessionStorage.getItem("currentUser");
        if (savedUser) {
          const fallbackData = JSON.parse(savedUser);
          setUserData(fallbackData);
          setAvatar(fallbackData.avatar || null);
          toast.warn("Using cached data. Please refresh to get latest information.");
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

  if (loading) {
    return <div className="manage-account-app">Loading...</div>;
  }

  if (!userData) {
    return <div className="manage-account-app">No user data available</div>;
  }

  // Open forms
  const openNameForm = () => {
    setTempName({ ...userData });
    setShowNameForm(true);
  };

  const openEmailForm = () => {
    setTempEmail(userData.email);
    setShowEmailForm(true);
  };

  const openContactForm = () => {
    setTempContact(userData.contact_number);
    setShowContactForm(true);
  };

  // Check changes
  const hasNameChanges = () => {
    if (!tempName) return false;
    return (
      tempName.first_name.trim() !== userData.first_name.trim() ||
      tempName.middle_name.trim() !== userData.middle_name.trim() ||
      tempName.last_name.trim() !== userData.last_name.trim()
    );
  };

  const hasEmailChanges = () => {
    if (!tempEmail) return false;
    return tempEmail.trim() !== userData.email.trim();
  };

  const hasContactChanges = () => {
    if (!tempContact) return false;
    return tempContact.trim() !== userData.contact_number.trim();
  };

  // Confirm discard
  const confirmDiscard = (hasChanges, onClose) => {
    if (!hasChanges) {
      onClose();
    } else {
      const confirmed = window.confirm("You have unsaved changes. Are you sure you want to discard them?");
      if (confirmed) {
        toast.info("Changes discarded.", { autoClose: 1500 });
        onClose();
      } else {
        toast.info("Edit cancelled. Your changes are safe.", { autoClose: 1500 });
      }
    }
  };

  // Save handlers
  const handleSaveName = async () => {
    if (tempName.first_name.trim() && tempName.last_name.trim()) {
      try {
        const userId = userData.user_id;
        const role = userData.role;
        
        // Prepare update data
        const updateData = {
          first_name: tempName.first_name.trim(),
          middle_name: tempName.middle_name?.trim() || '',
          last_name: tempName.last_name.trim(),
        };

        // TODO: Add API call to update name on backend
        // For now, we'll just update locally and in session storage
        const updated = {
          ...userData,
          ...updateData
        };
        setUserData(updated);
        
        // Update session
        sessionStorage.setItem("currentUser", JSON.stringify(updated));
        toast.success("Name updated successfully!");
        setShowNameForm(false);
        setTempName(null);
      } catch (error) {
        console.error("Error updating name:", error);
        toast.error("Failed to update name. Please try again.");
      }
    } else {
      toast.warn("Please fill in required fields.");
    }
  };

  const handleSaveEmail = async () => {
    if (tempEmail.includes("@")) {
      try {
        const userId = userData.user_id;
        const role = userData.role;
        
        // TODO: Add API call to update email on backend
        // For now, we'll just update locally and in session storage
        const updated = { ...userData, email: tempEmail.trim() };
        setUserData(updated);
        
        // Update session
        const savedUser = JSON.parse(sessionStorage.getItem("currentUser"));
        sessionStorage.setItem(
          "currentUser",
          JSON.stringify({ ...savedUser, email: tempEmail.trim() })
        );
        toast.success("Email updated successfully!");
        setShowEmailForm(false);
        setTempEmail(null);
      } catch (error) {
        console.error("Error updating email:", error);
        toast.error("Failed to update email. Please try again.");
      }
    } else {
      toast.warn("Please enter a valid email.");
    }
  };

  const handleSaveContact = async () => {
    if (tempContact.trim()) {
      try {
        const userId = userData.user_id;
        const role = userData.role;
        
        // TODO: Add API call to update contact on backend
        // For now, we'll just update locally and in session storage
        const updated = { ...userData, contact_number: tempContact.trim() };
        setUserData(updated);
        
        // Update session
        const savedUser = JSON.parse(sessionStorage.getItem("currentUser"));
        sessionStorage.setItem(
          "currentUser",
          JSON.stringify({ ...savedUser, contact_number: tempContact.trim() })
        );
        toast.success("Contact number updated successfully!");
        setShowContactForm(false);
        setTempContact(null);
      } catch (error) {
        console.error("Error updating contact:", error);
        toast.error("Failed to update contact number. Please try again.");
      }
    } else {
      toast.warn("Please enter a contact number.");
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
          
          // TODO: Add API call to update avatar on backend
          // For now, we'll just update in session storage
          const savedUser = JSON.parse(sessionStorage.getItem("currentUser"));
          const updatedUser = { ...savedUser, avatar: base64Image };
          sessionStorage.setItem("currentUser", JSON.stringify(updatedUser));
          
          // Update local state
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

        {/* Edit Links */}
        {isEditing && (
          <EditLinks
            showNameForm={showNameForm}
            showEmailForm={showEmailForm}
            showContactForm={showContactForm}
            tempName={tempName}
            tempEmail={tempEmail}
            tempContact={tempContact}
            userData={userData}
            setTempName={setTempName}
            setTempEmail={setTempEmail}
            setTempContact={setTempContact}
            openNameForm={openNameForm}
            openEmailForm={openEmailForm}
            openContactForm={openContactForm}
            confirmDiscard={confirmDiscard}
            handleSaveName={handleSaveName}
            handleSaveEmail={handleSaveEmail}
            handleSaveContact={handleSaveContact}
            hasNameChanges={hasNameChanges}
            hasEmailChanges={hasEmailChanges}
            hasContactChanges={hasContactChanges}
            setShowNameForm={setShowNameForm}
            setShowEmailForm={setShowEmailForm}
            setShowContactForm={setShowContactForm}
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