import React, { useState } from 'react';
import { User, ChevronDown, LogOut } from 'lucide-react';
import { useAppContext } from './AuthWrapper';
import './Header.css';

const Header = () => {
  const { 
    isSubmissionAvailable, 
    setIsSubmissionAvailable, 
    subjects,
    user,
    onLogout
  } = useAppContext();
  
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSubjectDropdown, setShowSubjectDropdown] = useState(false);
  const [selectedSubjects, setSelectedSubjects] = useState([]);

  // Debug: Log user data
  React.useEffect(() => {
    console.log('Header - User data:', user);
  }, [user]);

  // Helper function to format role display
  const formatRole = (role) => {
    const roleMap = {
      'class_teacher': 'Class Teacher',
      'hod': 'Head of Department',
      'director': 'Director',
      'faculty': 'Faculty',
      'student': 'Student'
    };
    return roleMap[role] || role || 'User';
  };

  const handleToggleSubmission = () => {
    setIsSubmissionAvailable(!isSubmissionAvailable);
  };

  const handleSubjectToggle = (subjectCode, e) => {
    e.stopPropagation();
    setSelectedSubjects(prev => {
      if (prev.includes(subjectCode)) {
        return prev.filter(code => code !== subjectCode);
      } else {
        return [...prev, subjectCode];
      }
    });
  };

  const handleClearAll = (e) => {
    e.stopPropagation();
    setSelectedSubjects([]);
  };

  const allSubjects = [
    ...subjects.theory.map(s => ({ ...s, type: 'Theory' })),
    ...subjects.practical.map(s => ({ ...s, type: 'Practical', code: `${s.code}-practical` }))
  ];

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (showSubjectDropdown && !event.target.closest('.subject-selector')) {
        setShowSubjectDropdown(false);
      }
      if (showUserMenu && !event.target.closest('.user-menu-container')) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showSubjectDropdown, showUserMenu]);

  return (
    <header className="header">
      <div className="header-left">
        <div className="mil-csn-logo">
          <img
  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4tIzAnxHyTy7vmn4G2MT00_NUMlZub68bjA&s"
  alt="Logo"
  style={{ height: "auto", width: "190px" }}
/>

        </div>
      </div>
      
      <div className="header-right">
        <div className="submission-toggle">
          <span>Available for Submissions?</span>
          <div 
            className={`toggle-switch ${isSubmissionAvailable ? 'active' : ''}`}
            onClick={handleToggleSubmission}
          >
            <input
              type="checkbox"
              checked={isSubmissionAvailable}
              onChange={handleToggleSubmission}
            />
            <span className="toggle-slider"></span>
          </div>
        </div>
        
        <div className="subject-selector">
          <div 
            className="subject-dropdown-trigger"
            onClick={() => setShowSubjectDropdown(!showSubjectDropdown)}
          >
            <span>
              {selectedSubjects.length === 0 
                ? 'Select Subjects' 
                : `${selectedSubjects.length} Subject${selectedSubjects.length > 1 ? 's' : ''} Selected`}
            </span>
            <ChevronDown size={16} />
          </div>
          
          {showSubjectDropdown && (
            <div className="subject-dropdown-menu" onClick={(e) => e.stopPropagation()}>
              <div className="dropdown-header">
                <span>Select Subjects for Submission</span>
                {selectedSubjects.length > 0 && (
                  <button 
                    className="clear-all-btn"
                    onClick={handleClearAll}
                  >
                    Clear All
                  </button>
                )}
              </div>
              <div className="dropdown-content">
                {allSubjects.length > 0 ? (
                  allSubjects.map((subject) => (
                    <label 
                      key={subject.code} 
                      className="subject-checkbox-item"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        checked={selectedSubjects.includes(subject.code)}
                        onChange={(e) => handleSubjectToggle(subject.code, e)}
                      />
                      <span className="checkbox-custom"></span>
                      <span className="subject-label">
                        <span className="subject-name">{subject.name}</span>
                        <span className="subject-type">{subject.type}</span>
                      </span>
                    </label>
                  ))
                ) : (
                  <div className="no-subjects">
                    <p>No subjects available</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        <div className="faculty-info">
          <div className="faculty-details">
            <div className="faculty-name">{user?.name || 'User'}</div>
            <div className="faculty-role">{formatRole(user?.role)}</div>
          </div>
          <div className="user-menu-container">
            <div 
              className="user-avatar"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <User size={20} />
              <ChevronDown size={16} />
            </div>
            {showUserMenu && (
              <div className="user-dropdown">
                <div className="user-info">
                  <p>{user?.name || 'User'}</p>
                  <span>{formatRole(user?.role)}</span>
                </div>
                <button className="logout-btn" onClick={onLogout}>
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;