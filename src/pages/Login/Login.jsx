// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Login.css";
import { FiLogIn } from "react-icons/fi";
import background from "../../assets/images/Start-Up.png";
import ParticleBackground from "../../components/ParticleBackground/Particle2.jsx";
import logo from "../../assets/images/logo-w-text.png";
import { schoolAddresses } from "../../data/schoolAddresses";

// 🔽 Import Axios instance
import api from "../../api/axios";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [error, setError] = useState(""); // Must be string
  const navigate = useNavigate();
  const location = useLocation();

  const isSchoolPath = location.pathname.includes("/login/school");
  const isOfficePath = location.pathname.includes("/login/office");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous error

    const formData = new FormData(e.target);
    const email = formData.get("email").trim();
    const password = formData.get("password");

    // 🔹 DYNAMIC ENDPOINT BASED ON PATH
    const endpoint = isSchoolPath 
      ? "/school/account/login" 
      : isOfficePath 
        ? "/focal/account/login" 
        : "/school/account/login";

    try {
    const response = await api.post(endpoint, { email, password });

    console.log("Backend response:", response.data);

    // ✅ Validate response structure
    if (!response.data || typeof response.data !== 'object') {
      throw new Error("Invalid server response format");
    }

    // ✅ Extract role
    const role = isOfficePath ? "office" : "school";

    // ✅ Build userData from response.data (NOT response.data.data)
    const userData = {
      user_id: response.data.user_id || "",
      first_name: response.data.first_name || "",
      middle_name: response.data.middle_name || "",
      last_name: response.data.last_name || "",
      school_name: response.data.school_name || "Not specified",
      school_address: response.data.school_address || "Not specified",
      position: response.data.position || "Not specified",
      office: response.data.office || "Not specified",
      section_designation: response.data.section_designation || "Not specified",
      email: response.data.email || "",
      contact_number: response.data.contact_number || "",
      registration_date: response.data.registration_date || new Date().toISOString(),
      active: response.data.active !== undefined ? response.data.active : true,
      avatar: response.data.avatar || null,
      role: role,
    };

    // ✅ Auto-fill school address if needed
    if (role === "school" && (userData.school_address === "N/A" || userData.school_address === "Not specified")) {
      const correctAddress = schoolAddresses[userData.school_name];
      if (correctAddress) {
        userData.school_address = correctAddress;
      }
    }

    sessionStorage.setItem("currentUser", JSON.stringify(userData));

    if (role === "school") {
      navigate("/home");
    } else if (role === "office") {
      navigate("/task/ongoing");
    } else {
      navigate("/home");
    }

    } catch (err) {
      console.error("Full error:", err);

      let errorMsg = "Login failed. Please try again.";

      try {
        if (err && err.response && err.response.data) {
          const data = err.response.data;

          if (typeof data.detail === 'string') {
            errorMsg = data.detail;
          } else if (Array.isArray(data.detail)) {
            errorMsg = data.detail
              .map(e => e.msg || e.message || "Invalid input")
              .filter(Boolean)
              .join(" • ");
          } else if (data.message) {
            errorMsg = data.message;
          } else {
            try {
              errorMsg = JSON.stringify(data);
            } catch (e) {
              errorMsg = "An unknown error occurred.";
            }
          }
        } else if (!err.response) {
          errorMsg = "Network error. Please check your connection.";
        }
      } catch (innerErr) {
        console.error("Error processing error:", innerErr);
        errorMsg = "An unexpected error occurred.";
      }

      if (typeof errorMsg !== 'string' || !errorMsg) {
        errorMsg = "An error occurred during login.";
      }

      setError(errorMsg);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleRegisterClick = (e) => {
    e.preventDefault();
    if (isSchoolPath) navigate("/register/school");
    else if (isOfficePath) navigate("/register/office");
    else navigate("/register");
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  return (
    <div className="login-page">
      <div className="login-background-image">
        <img src={background} alt="DepEd Biñan City Building" />
      </div>
      <div className="login-blue-overlay">
        <ParticleBackground />
        <div className="login-form-container">
          <div className="login-header">
            <div className="login-logo-container" onClick={handleLogoClick}>
              <img src={logo} className="logo-w-text" alt="Logo" />
            </div>
            <p className="login-subtitle">
              Please login or sign up to start your session.
            </p>
          </div>

          {/* ✅ Only render if `error` is a non-empty string */}
          {error && typeof error === 'string' && error.length > 0 && (
            <div className="login-error">
              <p>{error}</p>
            </div>
          )}

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="login-form-group">
              <label htmlFor="email" className="login-form-label">Email</label>
              <div className="login-input-group">
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="login-form-input"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div className="login-form-group">
              <label htmlFor="password" className="login-form-label">Password</label>
              <div className="login-password-input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  className="login-form-input"
                  placeholder="Enter password"
                  required
                />
                <button
                  type="button"
                  className="login-toggle-password"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="login-button"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              style={{
                backgroundColor: isHovering ? '#1e4a76' : '#2563eb',
                transition: 'background-color 0.2s ease'
              }}
            >
              <FiLogIn className="login-icon" />
              Log in
            </button>
          </form>

          <div className="register-section">
            <p className="register-text">
              Need an account?{" "}
              <a
                href={isSchoolPath ? "/register/school" : "/register/office"}
                className="register-link"
                onClick={handleRegisterClick}
              >
                Register here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;