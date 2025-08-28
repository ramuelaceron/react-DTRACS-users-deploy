// src/components/EditLinks/EditLinks.jsx
import React from 'react';
import './EditLinks.css';

const EditLinks = ({
	showNameForm,
	showEmailForm,
	showContactForm,
	setShowNameForm,
	setShowEmailForm,
	setShowContactForm,
	tempName,
	tempEmail,
	tempContact,
	userData,
	setTempName,
	setTempEmail,
	setTempContact,
	openNameForm,
	openEmailForm,
	openContactForm,
	confirmDiscard,
	handleSaveName,
	handleSaveEmail,
	handleSaveContact,
	hasNameChanges,
	hasEmailChanges,
	hasContactChanges,
}) => {
	return (
		<div className="edit-links">
			{/* Change Name */}
			<div className={`edit-link ${showNameForm ? 'show-form' : ''}`}>
				<button
					className="edit-link-button"
					onClick={() => confirmDiscard(hasNameChanges(), () => {
						setShowNameForm(!showNameForm); // ✅ Now available
						if (!showNameForm) openNameForm();
						else setTempName(null);
					})}
				>
					<span>Change your name</span>
					<span className="arrow">{showNameForm ? '▼' : '▶'}</span>
				</button>
				{showNameForm && (
					<div className="edit-form">
						<div className="form-row">
							<div className="form-group">
								<label>First Name:</label>
								<input
									type="text"
									value={tempName?.first_name || ''}
									onChange={(e) => setTempName(prev => ({ ...prev, first_name: e.target.value }))}
									placeholder="First Name"
								/>
							</div>
							<div className="form-group">
								<label>Middle Name:</label>
								<input
									type="text"
									value={tempName?.middle_name || ''}
									onChange={(e) => setTempName(prev => ({ ...prev, middle_name: e.target.value }))}
									placeholder="Middle Name "
								/>
							</div>
							<div className="form-group">
								<label>Last Name:</label>
								<input
									type="text"
									value={tempName?.last_name || ''}
									onChange={(e) => setTempName(prev => ({ ...prev, last_name: e.target.value }))}
									placeholder="Last Name"
								/>
							</div>
						</div>
						<button className="save-btn" onClick={handleSaveName}>
							Save
						</button>
					</div>
				)}
			</div>

			{/* Change Email */}
			<div className={`edit-link ${showEmailForm ? 'show-form' : ''}`}>
				<button
					className="edit-link-button"
					onClick={() => confirmDiscard(hasEmailChanges(), () => {
						setShowEmailForm(!showEmailForm); // ✅ Now available
						if (!showEmailForm) openEmailForm();
						else setTempEmail(null);
					})}
				>
					<span>Change your email</span>
					<span className="arrow">{showEmailForm ? '▼' : '▶'}</span>
				</button>
				{showEmailForm && (
					<div className="edit-form">
						<div className="form-group">
							<label>Email Address:</label>
							<input
								type="email"
								value={tempEmail || ''}
								onChange={(e) => setTempEmail(e.target.value)}
								placeholder="example@deped.edu.ph"
							/>
						</div>
						<button className="save-btn" onClick={handleSaveEmail}>
							Save
						</button>
					</div>
				)}
			</div>

			{/* Change Contact */}
			<div className={`edit-link ${showContactForm ? 'show-form' : ''}`}>
				<button
					className="edit-link-button"
					onClick={() => confirmDiscard(hasContactChanges(), () => {
						setShowContactForm(!showContactForm);
						if (!showContactForm) openContactForm();
						else setTempContact(null);
					})}
				>
					<span>Change contact no.</span>
					<span className="arrow">{showContactForm ? '▼' : '▶'}</span>
				</button>
				{showContactForm && (
					<div className="edit-form">
						<div className="form-group">
							<label>Contact Number:</label>
							<input
								type="tel"
								value={tempContact || ''}
								onChange={(e) => {
									const value = e.target.value;

									// Allow empty
									if (!value) {
										setTempContact('');
										return;
									}

									// Remove all non-digit and non-'+' characters
									const cleaned = value.replace(/[^+\d]/g, '');

									// Ensure '+' only appears at the beginning
									const formatted = cleaned.startsWith('+')
										? '+' + cleaned.slice(1).replace(/\+/g, '') // Keep first '+', remove others
										: cleaned;

									setTempContact(formatted);
								}}
								placeholder="+63 912 345 6789"
								maxLength="15"
							/>
						</div>
						<button className="save-btn" onClick={handleSaveContact}>
							Save
						</button>
					</div>
				)}
			</div>
		</div>
	);
};

export default EditLinks;