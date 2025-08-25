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

// 🔽 Import both account templates (for fallback structure)
import { schoolAccountData, officeAccountData } from '../../data/account';

const ManageAccount = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showNameForm, setShowNameForm] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);

  // ✅ State: user data from session or fallback
  const [userData, setUserData] = useState(null);
  const [avatar, setAvatar] = useState(null);

  const fileInputRef = useRef(null);

  // ✅ Temp states
  const [tempName, setTempName] = useState(null);
  const [tempEmail, setTempEmail] = useState(null);
  const [tempContact, setTempContact] = useState(null);

  // ✅ Load user on mount
  useEffect(() => {
    const savedUser = sessionStorage.getItem("currentUser");
    if (!savedUser) {
      toast.error("Not logged in. Redirecting...");
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
      return;
    }

    const user = JSON.parse(savedUser);

    // 🔍 Determine which template to use
    const accountData =
      user.role === "school" ? { ...schoolAccountData } : { ...officeAccountData };

    // Merge session data with template
    const mergedData = {
      ...accountData,
      firstName: user.firstName,
      lastName: user.lastName,
      middleName: user.middleName || "",
      email: user.email,
      contactNumber: user.contactNumber || accountData.contactNumber,
      avatar: user.avatar,
    };

    setUserData(mergedData);
    setAvatar(user.avatar || accountData.avatar);
  }, []);

  if (!userData) {
    return <div className="manage-account-app">Loading...</div>;
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
    setTempContact(userData.contactNumber);
    setShowContactForm(true);
  };

  // Check changes
  const hasNameChanges = () => {
    if (!tempName) return false;
    return (
      tempName.firstName.trim() !== userData.firstName.trim() ||
      tempName.middleName.trim() !== userData.middleName.trim() ||
      tempName.lastName.trim() !== userData.lastName.trim()
    );
  };

  const hasEmailChanges = () => {
    if (!tempEmail) return false;
    return tempEmail.trim() !== userData.email.trim();
  };

  const hasContactChanges = () => {
    if (!tempContact) return false;
    return tempContact.trim() !== userData.contactNumber.trim();
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
  const handleSaveName = () => {
    if (tempName.firstName.trim() && tempName.lastName.trim()) {
      const updated = {
        ...userData,
        firstName: tempName.firstName.trim(),
        middleName: tempName.middleName?.trim() || '',
        lastName: tempName.lastName.trim(),
      };
      setUserData(updated);
      // Update session
      const savedUser = JSON.parse(sessionStorage.getItem("currentUser"));
      sessionStorage.setItem(
        "currentUser",
        JSON.stringify({ ...savedUser, ...tempName })
      );
      toast.success("Name updated successfully!");
      setShowNameForm(false);
      setTempName(null);
    } else {
      toast.warn("Please fill in required fields.");
    }
  };

  const handleSaveEmail = () => {
    if (tempEmail.includes("@")) {
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
    } else {
      toast.warn("Please enter a valid email.");
    }
  };

  const handleSaveContact = () => {
    if (tempContact.trim()) {
      const updated = { ...userData, contactNumber: tempContact.trim() };
      setUserData(updated);
      // No need to update session for contact only (unless used elsewhere)
      toast.success("Contact number updated successfully!");
      setShowContactForm(false);
      setTempContact(null);
    } else {
      toast.warn("Please enter a contact number.");
    }
  };

  // Handle image upload
  const handleFileChange = (e) => {
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

      const reader = new FileReader();
      reader.onload = () => {
        setAvatar(reader.result);
        // Update session
        const savedUser = JSON.parse(sessionStorage.getItem("currentUser"));
        sessionStorage.setItem(
          "currentUser",
          JSON.stringify({ ...savedUser, avatar: reader.result })
        );
        toast.info("Profile picture updated!", { autoClose: 1500 });
      };
      reader.readAsDataURL(file);
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