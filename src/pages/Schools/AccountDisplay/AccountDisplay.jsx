// src/pages/Schools/AccountDisplay/AccountDisplay.jsx
import React from "react";
import "./AccountDisplay.css";
import { useNavigate, useParams } from "react-router-dom";
import { schoolAccounts } from "../../../data/schoolAccounts";
import { IoChevronBackOutline } from "react-icons/io5";

const AccountDisplay = () => {
  const navigate = useNavigate();
  const { schoolSlug } = useParams();
  const school = schoolAccounts.find(s => s.slug === schoolSlug);

  const handleBack = () => navigate(-1);

  const hasAccounts = school.accounts && school.accounts.length > 0;

  return (
    <div className="account-section">
      <button className="account-back-button" onClick={handleBack}>
        <IoChevronBackOutline className="icon-md" /> Back
      </button>
      <div className="account-header">
        <div className="account-header-info">
          <img src={school.logo} alt={`${school.school_name} logo`} className="account-header-logo" />
          <div>
            <h2 className="account-title">{school.school_name}</h2>
            <p className="account-subtitle">{school.school_address}</p>
          </div>
        </div>
      </div>

      {/* Account List */}
      <div className="account-list">
        {hasAccounts ? (
          school.accounts.map((account) => (
            <div className="account-item" key={account.id}>
              <div className="account-info">
                <img src={account.avatar} alt="" className="account-logo" />
                <div className="account-text">
                  <span className="accountname">
                    {account.first_name} {account.middle_name ? `${account.middle_name} ` : ""}{account.last_name}
                  </span>
                  <p className="account-address">{account.position}</p>
                </div>
              </div>
              <div className="account-email">
                <span>{account.email}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="no-accounts">
            <span>No accounts available for this school.</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountDisplay;