import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './TaskTabs.css';

const TaskTabs = ({ 
  selectedOffice, 
  onOfficeChange, 
  allOffices = [], 
  showUpcomingIndicator = false,
  showPastDueIndicator = false,
  showCompletedIndicator = false
}) => {
  const location = useLocation();
  const [indicatorStyle, setIndicatorStyle] = useState({ width: 0, transform: 'translateX(0px)' });
  const tabsRef = useRef({});

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const activePath = location.pathname;
    const activeEl = tabsRef.current[activePath];
    if (activeEl) {
      setIndicatorStyle({
        width: activeEl.offsetWidth,
        transform: `translateX(${activeEl.offsetLeft}px)`
      });
    }
  }, [location.pathname]);

  return (
    <div className="task-tabs-container">
      <div className="task-tabs">
        <Link
          ref={(el) => (tabsRef.current['/to-do/upcoming'] = el)}
          to="/to-do/upcoming"
          className={`task-tab ${isActive('/to-do/upcoming') ? 'active' : ''}`}
        >
          Upcoming
          {showUpcomingIndicator && <span className="task-indicator task-blue"></span>}
        </Link>
        <Link
          ref={(el) => (tabsRef.current['/to-do/past-due'] = el)}
          to="/to-do/past-due"
          className={`task-tab ${isActive('/to-do/past-due') ? 'active' : ''}`}
        >
          Past due
          {showPastDueIndicator && <span className="task-indicator task-red"></span>}
        </Link>
        <Link
          ref={(el) => (tabsRef.current['/to-do/completed'] = el)}
          to="/to-do/completed"
          className={`task-tab ${isActive('/to-do/completed') ? 'active' : ''}`}
        >
          Completed
          {showCompletedIndicator && <span className="task-indicator task-green"></span>}
        </Link>

        {/* Sliding underline that persists */}
        <span className="tab-underline" style={indicatorStyle}></span>
      </div>

      <select
        className="task-dropdown"
        value={selectedOffice}
        onChange={(e) => onOfficeChange(e.target.value)}
      >
        <option>All Offices</option>
        {allOffices.map(office => (
          <option key={office} value={office}>
            {office}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TaskTabs;
