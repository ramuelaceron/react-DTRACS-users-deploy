import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { FiLogIn } from "react-icons/fi";
import background from "../../assets/images/Start-Up.png";
import ParticleBackground from "../../components/ParticleBackground/Particle2.jsx";
import "../../components/ParticleBackground/Particle2.css";
import logo from "../../assets/images/logo-w-text.png";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/home"); // Redirect to home after login
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleRegisterClick = (e) => {
    e.preventDefault();

    if (location.pathname.includes("/login/school")) {
      navigate("/register/school");
    } else if (location.pathname.includes("/login/office")) {
      navigate("/register/office");
    } else {
      navigate("/register");
    }
  };

  const handleLogoClick = () => {
    navigate("/"); // Navigates to the home page
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

            <form className="login-form" onSubmit={handleSubmit}>
              <div className="login-form-group">
                <label htmlFor="email" className="login-form-label">
                  Email
                </label>
                <div className="login-input-group">
                  <input
                    type="email"
                    id="email"
                    className="login-form-input"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div className="login-form-group">
                <label htmlFor="password" className="login-form-label">
                  Password
                </label>
                <div className="login-password-input-group">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
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
                  href={
                    location.pathname.includes("/login/school")
                      ? "/register/school"
                      : "/register/office"
                  }
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
