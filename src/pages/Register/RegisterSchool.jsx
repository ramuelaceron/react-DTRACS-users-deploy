// src/pages/Register/RegisterSchool.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RegisterSchool.css";
import background from "../../assets/images/Start-Up.png";
import ParticleBackground from "../../components/ParticleBackground/Particle2.jsx";
import "../../components/ParticleBackground/Particle2.css";
import logo from "../../assets/images/logo-w-text.png";
import api from "../../api/axios"; // Axios instance
import { schoolAddresses } from "../../data/schoolAddresses";

const RegisterSchool = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    middleName: "",
    email: "",
    contactNumber: "",
    school: "",
    school_address: "",
    position: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "school") {
      // ✅ Auto-fill school address from imported object
      const address = schoolAddresses[value] || "Address not available";
      setFormData(prev => ({
        ...prev,
        [name]: value,
        school_address: address
      }));
    } else if (name === "contactNumber") {
      const numbersOnly = value.replace(/[^0-9]/g, '');
      if (numbersOnly.length <= 11) {
        setFormData(prev => ({ ...prev, [name]: numbersOnly }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        middle_name: formData.middleName || "",
        school_name: formData.school,
        school_address: formData.school_address,
        position: formData.position,
        email: formData.email,
        contact_number: formData.contactNumber,
        password: formData.password,
        confirm_password: formData.confirmPassword,
        registration_date: new Date().toISOString(),
        active: false,
        avatar: "", // required string
      };

      const res = await api.post("/school/account/request", payload);
      setMessage(res.data.message || "Registration successful!");

      setTimeout(() => {
        navigate("/login/school");
      }, 2000);

    } catch (err) {
      console.error(err);
      setMessage(
        err.response?.data?.detail
          ? JSON.stringify(err.response.data.detail)
          : "Registration failed"
      );
    }
  };

  const handleLoginClick = () => navigate("/login/school");
  const handleLogoClick = () => navigate("/");

  return (
    <div className="register-school-page">
      <div className="school-background-image">
        <img src={background} alt="DepEd Biñan City Building" />
      </div>

      <div className="school-blue-overlay">
        <ParticleBackground />
        <div className="school-form-container">
          <div className="school-header">
            <div className="school-logo-container" onClick={handleLogoClick}>
              <img src={logo} className="logo-w-text" alt="Logo" />
            </div>
            <p className="school-subtitle">
              Please fill up information below to register.
            </p>
          </div>

          {/* Message */}
          {message && <p className="registration-message">{message}</p>}

          <form onSubmit={handleSubmit} className="school-form">
            {/* Name Fields */}
            <div className="school-form-group">
              <label className="school-form-label">Name</label>
              <div className="school-name-inputs">
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="First name"
                  className="school-name-input"
                  required
                />
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Last name"
                  className="school-name-input"
                  required
                />
                <input
                  type="text"
                  name="middleName"
                  value={formData.middleName}
                  onChange={handleChange}
                  placeholder="Middle name"
                  className="school-name-input"
                />
              </div>
            </div>

            {/* Email */}
            <div className="school-form-group">
              <label className="school-form-label">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="school-name-input"
                required
              />
            </div>

            {/* Contact Number */}
            <div className="school-form-group">
              <label className="school-form-label">Contact Number</label>
              <div className="school-phone-input-container">
                <input
                  type="tel"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  placeholder="Enter your contact number"
                  className="school-phone-input"
                  required
                  pattern="[0-9]{11}"
                  inputMode="numeric"
                  minLength="11"
                  maxLength="11"
                />
              </div>
            </div>

            {/* School */}
            <div className="school-form-group">
              <label className="school-form-label">School</label>
              <select
                name="school"
                value={formData.school}
                onChange={handleChange}
                className="school-form-input"
                required
              >
                <option value="">Select your school</option>
                <option value="Biñan City Science & Technology High School">Biñan City Science & Technology High School</option>
                <option value="Biñan City Senior High School-San Antonio Campus">Biñan City Senior High School-San Antonio Campus</option>
                <option value="Biñan City Senior High School-Sto.Tomas Campus">Biñan City Senior High School-Sto.Tomas Campus</option>
                <option value="Biñan City Senior High School-Timbao Campus">Biñan City Senior High School-Timbao Campus</option>
                <option value="Biñan City Senior High School-West Campus">Biñan City Senior High School-West Campus</option>
                <option value="Biñan Elementary School">Biñan Elementary School</option>
                <option value="Biñan Integrated National High School">Biñan Integrated National High School</option>
                <option value="Biñan Secondary School of Applied Academics">Biñan Secondary School of Applied Academics</option>
                <option value="Canlalay Elementary School">Canlalay Elementary School</option>
                <option value="Dela Paz Main Elementary School">Dela Paz Main Elementary School</option>
                <option value="Dela Paz National High School">Dela Paz National High School</option>
                <option value="Dela Paz West Elementary School">Dela Paz West Elementary School</option>
                <option value="Dr. Jose G. Tamayo Memorial Elementary School">Dr. Jose G. Tamayo Memorial Elementary School</option>
                <option value="Dr. Marcelino Z. Batista Memorial Elementary School">Dr. Marcelino Z. Batista Memorial Elementary School</option>
                <option value="Ganado Elementary School">Ganado Elementary School</option>
                <option value="Jacobo Z Gonzales Memorial National High School">Jacobo Z Gonzales Memorial National High School</option>
                <option value="Langkiwa Elementary School">Langkiwa Elementary School</option>
                <option value="Loma Elementary School">Loma Elementary School</option>
                <option value="Malaban Elementary School">Malaban Elementary School</option>
                <option value="Malaban East Elementary School">Malaban East Elementary School</option>
                <option value="Mamplasan Elementary School">Mamplasan Elementary School</option>
                <option value="Mamplasan National High School">Mamplasan National High School</option>
                <option value="Nereo R. Joaquin Memorial National High School">Nereo R. Joaquin Memorial National High School</option>
                <option value="Our Lady of Lourdes Elementary School">Our Lady of Lourdes Elementary School</option>
                <option value="Pagkakaisa Elementary School">Pagkakaisa Elementary School</option>
                <option value="Pedro H. Escueta Memorial Elementary School">Pedro H. Escueta Memorial Elementary School</option>
                <option value="Platero Elementary School">Platero Elementary School</option>
                <option value="Saint Anthony Integrated School">Saint Anthony Integrated School</option>
                <option value="Saint Francis Integrated National High School">Saint Francis Integrated National High School</option>
                <option value="San Francisco Elementary School">San Francisco Elementary School</option>
                <option value="San Vicente Elementary School">San Vicente Elementary School</option>
                <option value="Soro-Soro Elementary School">Soro-Soro Elementary School</option>
                <option value="Southville 5 Elementary School">Southville 5 Elementary School</option>
                <option value="Southville 5A Elementary School">Southville 5A Elementary School</option>
                <option value="Southville 5A National High School">Southville 5A National High School</option>
                <option value="Sto.Tomas Elementary School">Sto.Tomas Elementary School</option>
                <option value="Timbao Elementary School">Timbao Elementary School</option>
                <option value="Tomas A. Turalba Main Elementary School">Tomas A. Turalba Main Elementary School</option>
                <option value="Tubigan Elementary School">Tubigan Elementary School</option>
                <option value="Zapote Elementary School">Zapote Elementary School</option>
              </select>
            </div>

            {/* Position */}
            <div className="school-form-group">
              <label className="school-form-label">Position</label>
              <select
                name="position"
                value={formData.position}
                onChange={handleChange}
                className="school-form-input"
                required
              >
                <option value="">Select your position</option>
                <option value="Teacher">Teacher</option>
                <option value="Principal">Principal</option>
              </select>
            </div>

            {/* Password */}
            <div className="school-form-group">
              <label className="school-form-label">Password</label>
              <div className="school-password-input-container">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  className="school-form-input"
                  required
                />
                <button
                  type="button"
                  className="school-toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="school-form-group">
              <label className="school-form-label">Confirm Password</label>
              <div className="school-password-input-container">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm password"
                  className="school-form-input"
                  required
                />
                <button
                  type="button"
                  className="school-toggle-password"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button type="submit" className="school-register-button">
              Register
            </button>
          </form>

          <div className="school-login-prompt">
            Already have an account?{" "}
            <span className="school-login-link" onClick={handleLoginClick}>
              Log in
            </span>
          </div>

          <div className="school-privacy-notice">
            <p>
              By using this service, you understand and agree to the DepEd
              Online Services{" "}
              <a href="#terms" className="school-privacy-link">
                Terms of Use
              </a>{" "}
              and{" "}
              <a href="#privacy" className="school-privacy-link">
                Privacy Statement
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterSchool;