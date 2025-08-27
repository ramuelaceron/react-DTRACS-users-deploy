// src/pages/School/School.jsx
import React from "react";
import "./Schools.css";
import { schoolAccounts } from "../../data/schoolAccounts"; // ✅ Import data
import { FaRegUser } from "react-icons/fa";

const School = () => {
  return (
    <div className="admin-section">
      <div className="school-header">
        <h2 className="school-title">Schools</h2>
      </div>

      <div className="school-list">
        {schoolAccounts.map((school, index) => (
          <div key={index} className="school-item">
            {/* School name with logo */}
            <div className="school-info">
              <img
                src={school.logo}
                alt={`${school.name} logo`}
                className="school-logo"
              />
              <span className="schoolname">{school.name}</span>
            </div>

            {/* Account count with icon */}
            <div className="account-count">
              <FaRegUser className="account-image" />
              <span>{school.accounts} Accounts</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default School;