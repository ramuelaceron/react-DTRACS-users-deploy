// ✅ Already perfect — no changes needed
import React, { useState, useEffect } from 'react';
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import './TaskForm.css';

const MultiSelectDropdown = ({ 
  label, 
  options, 
  selectedValues, 
  onSelectionChange, 
  placeholder = "Select options",
  disabled = false,
  isAccountDropdown = false
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const validSelectedValues = selectedValues.filter(value =>
    options.some(opt => opt.value === value)
  );

  useEffect(() => {
    if (selectedValues.length !== validSelectedValues.length) {
      onSelectionChange(validSelectedValues);
    }
  }, [options, selectedValues, onSelectionChange, validSelectedValues]);

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleCheckboxChange = (value) => {
    const newSelection = validSelectedValues.includes(value)
      ? validSelectedValues.filter(v => v !== value)
      : [...validSelectedValues, value];
    
    onSelectionChange(newSelection);
  };

  const selectAll = () => {
    onSelectionChange(options.map(opt => opt.value));
  };

  const clearAll = () => {
    onSelectionChange([]);
  };

  const getDisplayText = () => {
    if (validSelectedValues.length === 0) return placeholder;
    if (validSelectedValues.length === options.length) return "All selected";
    if (validSelectedValues.length === 1) {
      const selectedOption = options.find(opt => opt.value === validSelectedValues[0]);
      return selectedOption ? selectedOption.label : validSelectedValues[0];
    }
    return `${validSelectedValues.length} selected`;
  };

  return (
    <div className="multi-select-dropdown">
      <label>{label}</label>
      <div 
        className={`dropdown-toggle ${disabled ? 'disabled' : ''} ${isOpen ? 'open' : ''}`}
        onClick={toggleDropdown}
      >
        <span className="dropdown-selected-text">{getDisplayText()}</span>
        {!disabled && (
          <span className="dropdown-arrow">
            {isOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
          </span>
        )}
      </div>
      
      {isOpen && !disabled && (
        <div className="dropdown-menu">
          <div className="dropdown-actions">
            <button type="button" onClick={selectAll} className="dropdown-action-btn">
              Select All
            </button>
            <button type="button" onClick={clearAll} className="dropdown-action-btn">
              Clear All
            </button>
          </div>
          
          <div className="dropdown-options">
            {options.map((option) => (
              <label key={option.value} className="dropdown-option">
                <input
                  type="checkbox"
                  checked={validSelectedValues.includes(option.value)}
                  onChange={() => handleCheckboxChange(option.value)}
                />
                <span className="checkbox-label">
                  {isAccountDropdown ? (
                    <>
                      {option.label} {option.position && `(${option.position})`}
                    </>
                  ) : (
                    option.label
                  )}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiSelectDropdown;