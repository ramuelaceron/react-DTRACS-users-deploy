// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Login.css";
import { FiLogIn } from "react-icons/fi";
import background from "../../assets/images/Start-Up.png";
import ParticleBackground from "../../components/ParticleBackground/Particle2.jsx";
import logo from "../../assets/images/logo-w-text.png";
import { schoolAddresses } from "../../data/schoolAddresses";
import config from "../../config";

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

    try {
      // Step 1: Login to get access_token and refresh_token
      const loginResponse = await fetch(`${config.API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      let loginData;
      let errorMsg = "";

      if (!loginResponse.ok) {
        try {
          loginData = await loginResponse.json();
        } catch (jsonErr) {
          throw new Error(`Server returned ${loginResponse.status} with non-JSON body`);
        }

        if (typeof loginData.detail === "string") {
          errorMsg = loginData.detail;
        } else if (Array.isArray(loginData.detail)) {
          errorMsg = loginData.detail
            .map((e) => e.msg || e.message || "Invalid input")
            .filter(Boolean)
            .join(" • ");
        } else if (loginData.message) {
          errorMsg = loginData.message;
        } else {
          errorMsg = `Login failed with status ${loginResponse.status}`;
        }

        throw new Error(errorMsg);
      }

      // Extract both tokens from response
      const { access_token, refresh_token, user_id } = await loginResponse.json();

      if (!access_token) {
        throw new Error("Access token not returned from login");
      }

      // Ayusin

      // Step 2: Fetch current user profile using the access token
      // const profileResponse = await fetch(`${config.API_BASE_URL}/auth/proxy/get/current/user`, {
      //   method: "GET",
      //   headers: {
      //     "Authorization": `Bearer ${access_token}`,
      //   },
      // });
      const profileResponse = await fetch(
        `${config.API_BASE_URL}/auth/proxy/get/current/user?user_id=${encodeURIComponent(user_id)}`,
        {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${access_token}`,
          },
        }
      );

      if (!profileResponse.ok) {
        const profileError = await profileResponse.json().catch(() => ({}));
        console.error("Profile fetch error:", profileError);
        throw new Error("Failed to load user profile. Please try again.");
      }

      const profileData = await profileResponse.json();

      // Step 3: Determine role from user_id (as per backend logic)
      let role = "school"; // default
      if (profileData.user_id?.includes("FOCAL")) {
        role = "office";
      } else if (profileData.user_id?.includes("ADMIN")) {
        role = "admin";
      }
      // Note: Backend uses "SCHOOL" in user_id → so default "school" is safe

      // Step 4: Build user object
      const userData = {
        user_id: profileData.user_id || "",
        first_name: profileData.first_name || "",
        middle_name: profileData.middle_name || "",
        last_name: profileData.last_name || "",
        school_name: profileData.school_name || "Not specified",
        school_address: profileData.school_address || "Not specified",
        position: profileData.position || "Not specified",
        office: profileData.office || "Not specified",
        section_designation: profileData.section_designation || "Not specified",
        email: profileData.email || email,
        contact_number: profileData.contact_number || "",
        registration_date: profileData.registration_date || new Date().toISOString(),
        active: profileData.active !== undefined ? profileData.active : true,
        avatar: profileData.avatar || null,
        role: role,
      };

      // Fix school address if needed (only for school users)
      if (role === "school" && (userData.school_address === "N/A" || userData.school_address === "Not specified")) {
        const correctAddress = schoolAddresses[userData.school_name];
        if (correctAddress) {
          userData.school_address = correctAddress;
        }
      }

      // Save user data and tokens to sessionStorage
      sessionStorage.setItem("currentUser", JSON.stringify(userData));
      sessionStorage.setItem("authToken", access_token);
      if (refresh_token) {
        sessionStorage.setItem("refreshToken", refresh_token); // ✅ Save refresh token
      }

      // Navigate based on role
      if (role === "school") {
        navigate("/home");
      } else if (role === "office" || role === "admin") {
        navigate("/task/ongoing");
      } else {
        navigate("/home");
      }
    } catch (err) {
      setError(err.message || "Unable to connect to server. Please try again later.");
      console.error("Login error:", err);
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
          {error && typeof error === "string" && error.length > 0 && (
            <div className="login-error">
              <p>{error}</p>
            </div>
          )}

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="login-form-group">
              <label htmlFor="email" className="login-form-label">
                Email
              </label>
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
              <label htmlFor="password" className="login-form-label">
                Password
              </label>
              <div className="login-password-input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  className="login-form-input"
                  placeholder="Enter password"
                  required
                />
                <button type="button" className="login-toggle-password" onClick={togglePasswordVisibility}>
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
              style={{
                backgroundColor: isHovering ? "#1e4a76" : "#2563eb",
                transition: "background-color 0.2s ease",
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

          <div className="login-terms-notice">
            <p>
              By using this service, you understand and agree to the DepEd Online Services{" "}
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