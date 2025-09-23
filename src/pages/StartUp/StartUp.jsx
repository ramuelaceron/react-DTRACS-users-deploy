import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { FaArrowDown } from "react-icons/fa";
import "./StartUp.css";
import background from "../../assets/images/Start-Up.png";
import ParticleBackground from "../../components/ParticleBackground/Particle1.jsx";
import "../../components/ParticleBackground/Particle1.css";
import Logo from "../../assets/images/logo-w-notext.png";

const StartUp = () => {
  const navigate = useNavigate();

  return (
    <div className="home-landing-page">
      <div className="home-background-image">
        <img src={background} alt="DepEd Biñan City Building" />
      </div>
      <div className="home-blue-overlay">
        <ParticleBackground />

        <div className="home-content-container">
          <div className="home-greeting-section">
            <img src={Logo} alt="DepEd Biñan Logo" className="home-logo" />
            <h1 className="home-greeting-text">Hello, Welcome!</h1>
            <p className="home-welcome-text">
              to DepEd Biñan Document Tracking and Compliance System
            </p>
          </div>

          <div className="home-instruction-section">
            <FaArrowDown className="home-arrow-icon" aria-hidden="true" />
            <p className="home-instruction-text">
              Please click or tap your destination.
            </p>
          </div>

          <div className="home-button-group">
            <button
              className="home-btn-school"
              onClick={() => navigate("/login/school")}
              aria-label="School login"
            >
              School
            </button>
            <button
              className="home-btn-office"
              onClick={() => navigate("/login/office")}
              aria-label="Office login"
            >
              Office
            </button>
          </div>

          <div className="home-terms-disclaimer">
            <p>
              By using this service, you understand and agree to the DepEd
              Online Services{" "}
              <a href="#terms" className="home-link">
                Terms of Use
              </a>{" "}
              and{" "}
              <a href="#privacy" className="home-link">
                Privacy Statement
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartUp;
