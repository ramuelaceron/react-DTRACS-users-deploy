import React from "react";
import "./RegisterOffice.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import background from "../../assets/images/Start-Up.png";
import ParticleBackground from "../../components/ParticleBackground/Particle2.jsx";
import "../../components/ParticleBackground/Particle2.css";
import phflag from "../../assets/images/ph-flag.png";
import logo from "../../assets/images/logo-w-text.png";

const RegisterOffice = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    middleName: "",
    email: "",
    contactNumber: "",
    school: "",
    position: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add form validation and submission logic here
    console.log("Form submitted:", formData);
  };

  const handleLoginClick = () => {
    navigate("/login/office");
  };

  return (
    <div className="register-school-page">
      <div className="regsiter-background-image">
        <img src={background} alt="DepEd Biñan City Building" />
      </div>

      <div className="register-school-blue-overlay">
        <ParticleBackground />
        <div className="register-school-form-container">
          <div className="register-school-header">
            <div className="register-school-logo-container">
              {/* <h1 className="register-school-logo-text">DepEd Biñan DTRACS</h1>
              <div className="register-school-beta-tag">βeta</div> */}
              <img src={logo} className="logo-w-text" />
            </div>
            <p className="register-school-subtitle">
              Please fill up information below to register.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="register-school-form">
            {/* Name Fields */}
            <div className="register-school-form-group">
              <label className="register-school-form-label">Name</label>
              <div className="register-school-name-inputs">
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="First name"
                  className="register-school-name-input"
                  required
                />
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Last name"
                  className="register-school-name-input"
                  required
                />
                <input
                  type="text"
                  name="middleName"
                  value={formData.middleName}
                  onChange={handleChange}
                  placeholder="Middle name"
                  className="register-school-name-input"
                />
              </div>
            </div>

            {/* Email */}
            <div className="register-school-form-group">
              <label className="register-school-form-label">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="register-school-name-input"
                required
              />
            </div>

            {/* Contact Number */}
            <div className="register-school-form-group">
              <label className="register-school-form-label">
                Contact Number
              </label>
              <div className="school-phone-input-container">
                <img src={phflag} className="school-flag-icon" />
                <span className="school-country-code">+63</span>
                <input
                  type="tel"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  placeholder="Enter your contact number"
                  className="school-phone-input"
                  required
                />
              </div>
            </div>

            <div className="register-school-form-group">
              <label className="register-school-form-label">School</label>
              <select
                name="school"
                value={formData.school}
                onChange={handleChange}
                className="register-school-form-input"
                required
              >
                <option value="">Select your school</option>
                <option value="school1">
                  Biñan City Science & Technology High School
                </option>
                <option value="school2">
                  Biñan City Senior High School-San Antonio Campus
                </option>
                <option value="school3">
                  Biñan City Senior High School-Sto.Tomas Campus
                </option>
                <option value="school4">
                  Biñan City Senior High School-Timbao Campus
                </option>
                <option value="school5">
                  Biñan City Senior High School-West Campus
                </option>
                <option value="school6">Biñan Elementary School</option>
                <option value="school7">
                  Biñan Integrated National High School
                </option>
                <option value="school8">
                  Biñan Secondary School of Applied Academics
                </option>
                <option value="school9">Canlalay Elementary School</option>
                <option value="school10">
                  Dela Paz Main Elementary School
                </option>
                <option value="school11">Dela Paz National High School</option>
                <option value="school12">
                  Dela Paz West Elementary School
                </option>
                <option value="school13">
                  Dr. Jose G. Tamayo Mem. Elem. School
                </option>
                <option value="school14">
                  Dr. M.Z.Batista Mem. Elem. School
                </option>
                <option value="school15">Ganado Elementary School</option>
                <option value="school16">
                  Jacobo Z Gonzales Memorial National High School
                </option>
                <option value="school17">Langkiwa Elementary School</option>
                <option value="school18">Loma Elementary School</option>
                <option value="school19">Malaban East Elementary School</option>
                <option value="school20">Malaban Elementary School</option>
                <option value="school21">Mamplasan Elementary School</option>
                <option value="school22">Mamplasan National High School</option>
                <option value="school23">
                  Nereo R. Joaquin National High School
                </option>
                <option value="school24">
                  Our Lady of Lourdes Elementary School
                </option>
                <option value="school25">Pagkakaisa Elementary School</option>
                <option value="school26">
                  Pedro H. Escueta Mem. Elem. School
                </option>
                <option value="school27">Platero Elementary School</option>
                <option value="school28">
                  Saint Anthony Integrated School
                </option>
                <option value="school29">
                  Saint Francis Integrated National High School
                </option>
                <option value="school30">
                  San Francisco Elementary School
                </option>
                <option value="school31">San Vicente Elementary School</option>
                <option value="school32">Soro-Soro Elementary School</option>
                <option value="school33">
                  Southville 5 Elementary School (Timbao Annex)
                </option>
                <option value="school34">Southville 5A ES-Langkiwa</option>
                <option value="school35">
                  Southville 5A National High School
                </option>
                <option value="school36">Sto.Tomas Elementary School</option>
                <option value="school37">Timbao Elementary School</option>
                <option value="school38">Tomas A. Turalba Mes</option>
                <option value="school39">Tubigan Elementary School</option>
                <option value="school40">Zapote Elementary School</option>
              </select>
            </div>

            <div className="register-school-form-group">
              <label className="register-school-form-label">Position</label>
              <select
                name="position"
                value={formData.position}
                onChange={handleChange}
                className="register-school-form-input"
                required
              >
                <option value="">Select your position</option>
                <option value="teacher">Teacher</option>
                <option value="principal">Principal</option>
              </select>
            </div>

            {/* Password */}
            <div className="register-school-form-group">
              <label className="register-school-form-label">Password</label>
              <div className="school-password-input-container">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  className="register-school-form-input"
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
            <div className="register-school-form-group">
              <label className="register-school-form-label">
                Confirm Password
              </label>
              <div className="school-password-input-container">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm password"
                  className="register-school-form-input"
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

export default RegisterOffice;
