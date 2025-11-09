import React, { useState } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { useAppContext } from './AuthWrapper';
import './SubjectWiseAnalysis.css';

const SubjectWiseAnalysis = () => {
  const { students, setStudents, subjects } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [hoveredStudent, setHoveredStudent] = useState(null);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const showMessage = (message) => {
    setSnackbarMessage(message);
    setShowSnackbar(true);
    setTimeout(() => setShowSnackbar(false), 3000);
  };

  // Filter students based on search and subject
  const filteredStudents = students.filter(student => {
    const matchesSearch = (student.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (student.rollNumber || '').toString().toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = !selectedSubject || true; // Add subject filtering logic here
    return matchesSearch && matchesSubject;
  });

  const toggleSubmissionStatus = (studentId, submissionType) => {
    setStudents(prevStudents => 
      prevStudents.map(student => {
        if (student.id === studentId) {
          const currentStatus = student.submissions[submissionType];
          const newStatus = currentStatus === 'pending' ? 'complete' : 'pending';
          return {
            ...student,
            submissions: {
              ...student.submissions,
              [submissionType]: newStatus
            }
          };
        }
        return student;
      })
    );
    showMessage(`Submission status updated successfully!`);
  };

  const StudentCard = ({ student, isExpanded }) => (
    <div 
      className={`student-card ${isExpanded ? 'expanded' : ''}`}
      onMouseEnter={() => setHoveredStudent(student.id)}
      onMouseLeave={() => setHoveredStudent(null)}
    >
      <div className="student-basic-info">
        <span className="student-id">{student.rollNumber}</span>
        <span className="student-name">{student.name}</span>
        <span className="student-subject">{student.batch}</span>
        <ChevronDown 
          className={`expand-icon ${isExpanded ? 'rotated' : ''}`} 
          size={16} 
        />
      </div>
      
      {isExpanded && (
        <div className="student-marks">
          <div className="mark-section">
            <span className="mark-label">Mark for TA</span>
            <div className="mark-buttons">
              <button 
                className={`mark-btn ${student.submissions?.ta === 'pending' ? 'pending active' : 'pending'}`}
                onClick={() => toggleSubmissionStatus(student.id, 'ta')}
              >
                Pending
              </button>
              <button 
                className={`mark-btn ${student.submissions?.ta === 'complete' ? 'complete active' : 'complete'}`}
                onClick={() => toggleSubmissionStatus(student.id, 'ta')}
              >
                Complete
              </button>
            </div>
          </div>
          
          <div className="mark-section">
            <span className="mark-label">Mark for CIE</span>
            <div className="mark-buttons">
              <button 
                className={`mark-btn ${student.submissions?.cie === 'pending' ? 'pending active' : 'pending'}`}
                onClick={() => toggleSubmissionStatus(student.id, 'cie')}
              >
                Pending
              </button>
              <button 
                className={`mark-btn ${student.submissions?.cie === 'complete' ? 'complete active' : 'complete'}`}
                onClick={() => toggleSubmissionStatus(student.id, 'cie')}
              >
                Complete
              </button>
            </div>
          </div>
          
          <div className="mark-section">
            <span className="mark-label">Mark for Defaulter Work</span>
            <div className="mark-buttons">
              <button 
                className={`mark-btn ${student.submissions?.defaulter === 'pending' ? 'pending active' : 'pending'}`}
                onClick={() => toggleSubmissionStatus(student.id, 'defaulter')}
              >
                Pending
              </button>
              <button 
                className={`mark-btn ${student.submissions?.defaulter === 'complete' ? 'complete active' : 'complete'}`}
                onClick={() => toggleSubmissionStatus(student.id, 'defaulter')}
              >
                Complete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="subject-wise-analysis">
      <h2>Search Student</h2>
      
      <div className="search-section">
        <div className="search-controls">
          <div className="search-input-group">
            <input
              type="text"
              placeholder="Enter Student Name (Atleast 3 Characters)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <select className="subject-filter">
            <option>Select Subject</option>
            <option>Design and Analysis of Algorithm</option>
            <option>Data Science</option>
            <option>Machine Learning</option>
          </select>
        </div>
        

      </div>
      
      <div className="students-list">
        {filteredStudents.length > 0 ? (
          filteredStudents.map((student) => (
            <StudentCard 
              key={student.id} 
              student={student} 
              isExpanded={hoveredStudent === student.id}
            />
          ))
        ) : (
          <div className="no-students">
            <p>No students found matching your search criteria.</p>
          </div>
        )}
      </div>
      
      {showSnackbar && (
        <div className="snackbar success">
          {snackbarMessage}
        </div>
      )}
    </div>
  );
};

export default SubjectWiseAnalysis;