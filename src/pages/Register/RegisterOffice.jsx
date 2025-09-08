// src/pages/RegisterOffice.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RegisterOffice.css";
import api from "../../api/axios";
import background from "../../assets/images/Start-Up.png";
import ParticleBackground from "../../components/ParticleBackground/Particle2.jsx";
import logo from "../../assets/images/logo-w-text.png";

const RegisterOffice = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // ✅ Form data matches backend enum keys
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    middle_name: "",
    office: "", 
    email: "",
    contact_number: "",
    password: "",
    confirm_password: "",
  });

  // ✅ Correct full names for each enum value
  const officeOptions = [
    { value: "School Governance and Operations Division", label: "School Governance and Operations Division" },
    { value: "Curriculum Implementation Division", label: "Curriculum Implementation Division" },
    { value: "Office of the Schools Division Superintendent", label: "Office of the Schools Division Superintendent" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "contact_number") {
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
    setError("");
    setSuccess("");

    // 🔐 Validate passwords
    if (formData.password !== formData.confirm_password) {
      setError("Passwords do not match.");
      return;
    }

    try {
      console.log("Sending to backend:", formData);

      // ✅ POST to focal registration endpoint
      const response = await api.post("/focal/account/registration", formData);

      console.log("✅ Success:", response.data);
      setSuccess("Registration successful! Awaiting verification.");

      // Reset form
      setFormData({
        first_name: "",
        last_name: "",
        middle_name: "",
        office: "",
        email: "",
        contact_number: "",
        password: "",
        confirm_password: "",
      });

      // Redirect to login
      setTimeout(() => navigate("/login/office"), 2000);

    } catch (err) {
      console.error("🚫 Registration failed:", err);

      let errorMsg = "Registration failed. Please try again.";

      if (err.response?.data?.detail) {
        const d = err.response.data.detail;
        if (typeof d === 'string') {
          errorMsg = d;
        } else if (Array.isArray(d)) {
          errorMsg = d.map(e => e.msg || "Invalid input").join(" • ");
        }
      } else if (!err.response) {
        errorMsg = "Network error. Check your connection.";
      }

      setError(errorMsg);
    }
  };

  const handleLoginClick = () => {
    navigate("/login/office");
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  return (
    <div className="register-office-page">
      <div className="office-background-image">
        <img src={background} alt="DepEd Biñan City Building" />
      </div>

      <div className="office-blue-overlay">
        <ParticleBackground />
        <div className="office-form-container">
          <div className="office-header">
            <div className="office-logo-container" onClick={handleLogoClick}>
              <img src={logo} className="logo-w-text" alt="Logo" />
            </div>
            <p className="office-subtitle">
              Please fill up information below to register.
            </p>
          </div>

          {/* ✅ Error Message */}
          {error && (
            <div className="office-error">
              <p>{error}</p>
            </div>
          )}

          {/* ✅ Success Message */}
          {success && (
            <div className="office-success">
              <p>{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="office-form">
            {/* Name Fields */}
            <div className="office-form-group">
              <label className="office-form-label">Name</label>
              <div className="office-name-inputs">
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder="First name"
                  className="office-name-input"
                  required
                />
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder="Last name"
                  className="office-name-input"
                  required
                />
                <input
                  type="text"
                  name="middle_name"
                  value={formData.middle_name}
                  onChange={handleChange}
                  placeholder="Middle name"
                  className="office-name-input"
                />
              </div>
            </div>

            {/* Office */}
            <div className="office-form-group">
              <label className="office-form-label">Office</label>
              <select
                name="office"
                value={formData.office}
                onChange={handleChange}
                className="office-form-input"
                required
              >
                <option value="">Select your office</option>
                {officeOptions.map((office) => (
                  <option key={office.value} value={office.value}>
                    {office.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Email */}
            <div className="office-form-group">
              <label className="office-form-label">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="office-name-input"
                required
              />
            </div>

            {/* Contact Number */}
            <div className="office-form-group">
              <label className="office-form-label">Contact Number</label>
              <div className="office-phone-input-container">
                <input
                  type="tel"
                  name="contact_number"
                  value={formData.contact_number}
                  onChange={handleChange}
                  placeholder="Enter your contact number"
                  className="office-phone-input"
                  required
                  pattern="[0-9]{11}"
                  inputMode="numeric"
                  minLength="11"
                  maxLength="11"
                />
              </div>
            </div>

            {/* Password */}
            <div className="office-form-group">
              <label className="office-form-label">Password</label>
              <div className="office-password-input-container">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  className="office-form-input"
                  required
                />
                <button
                  type="button"
                  className="office-toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="office-form-group">
              <label className="office-form-label">Confirm Password</label>
              <div className="office-password-input-container">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirm_password"
                  value={formData.confirm_password}
                  onChange={handleChange}
                  placeholder="Confirm password"
                  className="office-form-input"
                  required
                />
                <button
                  type="button"
                  className="office-toggle-password"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button type="submit" className="office-register-button">
              Register
            </button>
          </form>

          <div className="office-login-prompt">
            Already have an account?{" "}
            <span className="office-login-link" onClick={handleLoginClick}>
              Log in
            </span>
          </div>

          <div className="office-privacy-notice">
            <p>
              By using this service, you understand and agree to the DepEd
              Online Services{" "}
              <a href="#terms" className="office-privacy-link">
                Terms of Use
              </a>{" "}
              and{" "}
              <a href="#privacy" className="office-privacy-link">
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