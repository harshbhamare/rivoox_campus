import React, { useState } from 'react';
import { User, ChevronDown, QrCode, LogOut } from 'lucide-react';
import { useStudentContext } from './StudentApp';
import './StudentHeader.css';

const StudentHeader = () => {
  const { studentData, onLogout } = useStudentContext();
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header className="student-header">
      <div className="student-header-left">
        <div className="student-mil-csn-logo">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4tIzAnxHyTy7vmn4G2MT00_NUMlZub68bjA&s"
            alt="Logo"
            style={{ height: "65px", width: "190px" }}
          />
        </div>
      </div>

      <div className="student-header-center">
        <div className="student-welcome-section">
          <h1 className="student-welcome-title">Welcome, {studentData.name}</h1>
          <div className="student-roll-info">
            <span>ROLL NO : {studentData.rollNumber}</span>
          </div>
        </div>
      </div>

      <div className="student-header-right">
        <div className="student-qr-code">
          <QrCode size={24} />
        </div>

        <div className="student-user-info">
          <div
            className="student-user-avatar"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <User size={20} />
            <ChevronDown size={16} />
          </div>

          {showDropdown && (
            <div className="student-dropdown-menu">
              <button
                className="student-dropdown-item logout-btn"
                onClick={() => {
                  setShowDropdown(false);
                  onLogout();
                }}
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default StudentHeader;