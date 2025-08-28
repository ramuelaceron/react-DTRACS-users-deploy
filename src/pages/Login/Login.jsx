import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Login.css";
import { FiLogIn } from "react-icons/fi";
import background from "../../assets/images/Start-Up.png";
import ParticleBackground from "../../components/ParticleBackground/Particle2.jsx";
import logo from "../../assets/images/logo-w-text.png";

// 🔽 Import account data
import { loginAccounts, schoolAccountData, focalAccountData } from "../../data/accountData";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [error, setError] = useState(""); // ✅ Add error state
  const navigate = useNavigate();
  const location = useLocation();

  const isSchoolPath = location.pathname.includes("/login/school");
  const isOfficePath = location.pathname.includes("/login/office");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(""); // Reset error

    const formData = new FormData(e.target);
    const email = formData.get("email").trim();
    const password = formData.get("password");

    // 🔍 Look up user by email
    const user = loginAccounts[email];

    if (!user) {
      setError("Invalid email or password.");
      return;
    }

    // 🔒 Validate password
    if (user.password !== password) {
      setError("Invalid email or password.");
      return;
    }

    // 🔑 Role-based access control
    if (isSchoolPath && user.email !== schoolAccountData.email) {
      setError("This account is not authorized for School access.");
      return;
    }

    if (isOfficePath && user.email !== focalAccountData.email) {
      setError("This account is not authorized for Office access.");
      return;
    }

    // ✅ Login successful
    console.log("Login successful:", user);

    // Store user in session (optional)
    sessionStorage.setItem("currentUser", JSON.stringify({
      email: user.email,
      first_name: user.first_name,
      middle_name: user.middle_name,
      last_name: user.last_name,
      contact_number: user.contact_number,
      avatar: user.avatar,
      role: isSchoolPath ? "school" : "office", // ✅ This is critical
    }));

    // Redirect
    if (isSchoolPath) {
      navigate("/home");
    } else if (isOfficePath) {
      navigate("/task/ongoing");
    } else {
      navigate("/home");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleRegisterClick = (e) => {
    e.preventDefault();
    if (isSchoolPath) {
      navigate("/register/school");
    } else if (isOfficePath) {
      navigate("/register/office");
    } else {
      navigate("/register");
    }
  };

  const handleLogoClick = () => {
    navigate("/"); // Home
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

          {/* ✅ Show error if any */}
          {error && (
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
                  name="email"  // ✅ Required for FormData.get("email")
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
                  name="password"  // ✅ Required
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
              <div className="login-forgot-password">
                <a href="#forgot" className="login-forgot-link">
                  I forgot my password
                </a>
              </div>
            </div>

            <button
              type="submit"
              className="login-button"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
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

          <div className="login-terms-notice">
            <p>
              By using this service, you understand and agree to the DepEd
              Online Services{" "}
              <a href="#terms" className="login-terms-link">
                Terms of Use
              </a>{" "}
              and{" "}
              <a href="#privacy" className="login-terms-link">
                Privacy Statement
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;