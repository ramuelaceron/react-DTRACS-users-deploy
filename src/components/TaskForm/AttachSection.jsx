import { useState } from 'react';
import { IoMdLink } from "react-icons/io";
import './TaskForm.css';

const AttachSection = ({
  attachedLinks,
  setAttachedLinks,
  formData,
  setFormData
}) => {
  const [isLinkInputVisible, setIsLinkInputVisible] = useState(false);
  const [isLinkValid, setIsLinkValid] = useState(true);

  const handleLinkChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'linkUrl') {
      const isValid = value === '' || /^(https?:\/\/)/i.test(value.trim());
      setIsLinkValid(isValid);
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addLink = () => {
    if (!formData.linkUrl.trim()) {
      setIsLinkValid(false);
      return;
    }

    if (!/^(https?:\/\/)/i.test(formData.linkUrl.trim())) {
      setIsLinkValid(false);
      return;
    }

    const newLink = {
      id: Date.now(),
      url: formData.linkUrl.trim(),
      title: formData.linkUrl.trim().replace(/^(https?:\/\/)?(www\.)?/i, ''),
      displayText: formData.linkUrl.trim().replace(/^(https?:\/\/)?(www\.)?/i, '')
    };

    setAttachedLinks(prev => [...prev, newLink]);
    setFormData(prev => ({ ...prev, linkUrl: '' }));
    setIsLinkValid(true);
  };

  const removeLink = (index) => {
    setAttachedLinks(prev => prev.filter((_, i) => i !== index));
  };

  const toggleLinkInput = () => {
    setIsLinkInputVisible(prev => !prev);
    if (!isLinkInputVisible && formData.linkUrl) {
      setIsLinkValid(/^(https?:\/\/)/i.test(formData.linkUrl.trim()));
    }
  };

  // Show warning if more than 1 link added
  const hasMultipleLinks = attachedLinks.length > 1;

  return (
    <div className="task-form-group">
      <label>Attach</label>
      <div className="task-form-attach">
        <div className="upload-link-container">
          <div className="link-item">
            <button type="button" className="link-circle" onClick={toggleLinkInput}>
              <IoMdLink size={20} />
            </button>
            <span className="link-label">Link</span>
          </div>
        </div>

        {/* Link Input */}
        {isLinkInputVisible && (
          <div className="link-input-container">
            <div className="link-input-group">
              <input
                type="text"
                placeholder="https://example.com"
                value={formData.linkUrl}
                name="linkUrl"
                onChange={handleLinkChange}
                className={`link-input ${!isLinkValid ? 'invalid' : ''}`}
                aria-invalid={!isLinkValid}
              />
              <button 
                type="button" 
                className="add-link-btn"
                onClick={addLink}
                disabled={!formData.linkUrl.trim() || !isLinkValid}
              >
                Add Link
              </button>
              <button 
                type="button" 
                className="cancel-link-btn"
                onClick={() => setIsLinkInputVisible(false)}
              >
                Cancel
              </button>
            </div>
            
            {!isLinkValid && formData.linkUrl && (
              <p className="error-text link-error-below">
                Please enter a valid link starting with <strong>http://</strong> or <strong>https://</strong>
              </p>
            )}
          </div>
        )}

        {/* Display Added Links */}
        {attachedLinks.length > 0 && (
          <div className="attached-links-display">
            <h4>Added Links:</h4>
            <ul className="links-list">
              {attachedLinks.map((link, index) => (
                <li key={link.id} className="link-item-display">
                  <a href={link.url} target="_blank" rel="noopener noreferrer">
                    {link.displayText}
                  </a>
                  <button 
                    type="button" 
                    className="remove-link-btn"
                    onClick={() => removeLink(index)}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttachSection;