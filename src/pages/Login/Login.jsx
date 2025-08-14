import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FiLogIn } from "react-icons/fi"; 
import background from "../../assets/images/Start-Up.png";
import ParticleBackground from '../../components/ParticleBackground/Particle2.jsx';
import '../../components/ParticleBackground/Particle2.css';
import { motion } from "framer-motion";

const Login = () => {

  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [isHovering, setIsHovering] = useState(false);
  const navigate = useNavigate(); // Added navigation hook

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login submitted");
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

  return (
    <div className="login-container">
      <div className="login-page">
        {/* Fixed Background Image */}
        <div className="background-image">
          <img src={background} alt="DepEd Biñan City Building" />
        </div>

        <motion.div
          initial={{ x: "-50%" }}   // Start off-screen to the left
          animate={{ x: 0 }}         // Slide in to normal position
          exit={{ x: "-100%" }}      // Slide out to the left on exit (optional)
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="login-page"
        >
          <div className="blue-overlay">

            <ParticleBackground />
            
            <div className="login-header">
              <div className="logo-container">
                <h1 className="logo-text">DepEd Biñan DTRACS</h1>
                <div className="beta-tag">βeta</div>
              </div>
              <p className="login-subtitle">Please login or sign up to start your session.</p>
            </div>

            <form className="login-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email" className="form-label">Email</label>
                <div className="input-group">
                  <input
                    type="email"
                    id="email"
                    className="form-input"
                    placeholder="Enter your Email"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">Password</label>
                <div className="input-group password-input-group">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    className="form-input"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={togglePasswordVisibility}
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <FaEyeSlash className={isHovering ? "icon-hover" : ""} />
                    ) : (
                      <FaEye className={isHovering ? "icon-hover" : ""} />
                    )}
                  </button>
                </div>
                <div className="forgot-password">
                  <a href="#forgot" className="forgot-link">I forgot my password</a>
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

            <div className="terms-notice">
              <p>
                By using this service, you understand and agree to the DepEd Online Services{" "}
                <a href="#terms" className="terms-link">Terms of Use</a> and{" "}
                <a href="#privacy" className="terms-link">Privacy Statement</a>
              </p>
            </div>

          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Login
