import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { FaArrowDown } from "react-icons/fa";
import "./Home.css";
import background from "../../assets/images/Start-Up.png";
import ParticleBackground from '../../components/ParticleBackground/Particle1.jsx';
import '../../components/ParticleBackground/Particle1.css';
import { motion } from "framer-motion";

const Home = () => {
  const navigate = useNavigate(); // Initialize navigate

  return (
    <div className="landing-page">
      {/* Fixed Background Image */}
      <div className="background-image">
        <img src={background} alt="DepEd Biñan City Building" />
      </div>

      <motion.div
        initial={{ x: 0 }}        // Start at normal position
        animate={{ x: 0 }}        // Stay in place
        exit={{ x: "100%" }}      // Slide out to the right on exit
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="landing-page"
      >
        <div className="blue-overlay">
          <ParticleBackground />

          <div className="content-container">
            <div className="greeting-section">
              <h1 className="greeting-text">Magandang Buhay!</h1>
              <p className="welcome-text">
                Welcome to DepEd Biñan Record Monitoring System
              </p>
            </div>

            <div className="instruction-section">
              <FaArrowDown className="arrow-icon" aria-hidden="true" />
              <p className="instruction-text">
                Please click or tap your destination.
              </p>
            </div>

            <div className="button-group">
              <button 
                className="btn-school"
                onClick={() => navigate("/login/school")} // Now works!
                aria-label="School login"
              >
                School
              </button>
              <button 
                className="btn-office"
                onClick={() => navigate("/login/office")} // Now works!
                aria-label="Office login"
              >
                Office
              </button>
            </div>

            <div className="terms-disclaimer">
              <p>
                By using this service, you understand and agree to the DepEd
                Online Services{" "}
                <a href="#terms" className="link">Terms of Use</a> and{" "}
                <a href="#privacy" className="link">Privacy Statement</a>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Home;