import React, { useState } from 'react';
import { User, Mail, Phone, Hash, BookOpen, Award, GraduationCap } from 'lucide-react';
import { useStudentContext } from './StudentApp';
import './StudentProfile.css';

const StudentProfile = () => {
  const { studentData } = useStudentContext();
  
  // State for elective subjects
  const [nptelSubject, setNptelSubject] = useState('');
  const [professionalElective, setProfessionalElective] = useState('');
  const [mdmSubject, setMdmSubject] = useState('');
  const [honorMinor, setHonorMinor] = useState('');

  // Available options for dropdowns
  const nptelOptions = [
    'Introduction to Machine Learning',
    'Data Structures and Algorithms',
    'Cloud Computing',
    'Artificial Intelligence',
    'Cyber Security Fundamentals'
  ];

  const professionalElectiveOptions = [
    'Advanced Web Development',
    'Mobile App Development',
    'DevOps Engineering',
    'Blockchain Technology',
    'Internet of Things'
  ];

  const mdmOptions = [
    'Data Science',
    'Digital Marketing',
    'Financial Technology',
    'Entrepreneurship',
    'Design Thinking'
  ];

  const honorMinorOptions = [
    'Mathematics',
    'Physics',
    'Chemistry',
    'Economics',
    'Management Studies'
  ];

  const profileSections = [
    {
      title: 'Personal Information',
      icon: User,
      fields: [
        { label: 'Full Name', value: studentData.name, icon: User },
        { label: 'Roll Number', value: studentData.rollNumber, icon: Hash },
        { label: 'Hall Ticket Number', value: studentData.hallTicket, icon: Hash },
        { label: 'Email Address', value: studentData.email, icon: Mail },
        { label: 'Contact Number', value: studentData.contact, icon: Phone },
        { label: 'Batch', value: studentData.batch, icon: GraduationCap }
      ]
    },
    {
      title: 'Academic Information',
      icon: BookOpen,
      fields: [
        { label: 'Open Elective', value: studentData.openElective, icon: BookOpen }
      ]
    }
  ];

  return (
    <div className="student-profile">
      <div className="profile-header">
        <div className="profile-left">
          <div className="profile-avatar">
            <User size={48} />
          </div>
          <div className="profile-info">
            <h1>{studentData.name}</h1>
            <p>{studentData.rollNumber}</p>
          </div>
        </div>
        
        <div className="profile-right">
          <div className="completion-circle">
            <svg className="progress-ring" width="120" height="120">
              <circle
                className="progress-ring-circle-bg"
                stroke="#e8eaed"
                strokeWidth="8"
                fill="transparent"
                r="52"
                cx="60"
                cy="60"
              />
              <circle
                className="progress-ring-circle"
                stroke="#4285f4"
                strokeWidth="8"
                fill="transparent"
                r="52"
                cx="60"
                cy="60"
                strokeDasharray={`${2 * Math.PI * 52}`}
                strokeDashoffset={`${2 * Math.PI * 52 * (1 - studentData.submissionPercentage / 100)}`}
                strokeLinecap="round"
              />
            </svg>
            <div className="completion-text">
              <span className="completion-percentage">{studentData.submissionPercentage}%</span>
              <span className="completion-label">Complete</span>
            </div>
          </div>
        </div>
      </div>

      <div className="profile-sections">
        {profileSections.map((section, index) => {
          const SectionIcon = section.icon;
          return (
            <div key={index} className="profile-section">
              <div className="section-header">
                <SectionIcon size={20} />
                <h2>{section.title}</h2>
              </div>
              
              <div className="section-content">
                <div className="fields-grid">
                  {section.fields.map((field, fieldIndex) => {
                    const FieldIcon = field.icon;
                    return (
                      <div key={fieldIndex} className="field-item">
                        <div className="field-icon">
                          <FieldIcon size={16} />
                        </div>
                        <div className="field-content">
                          <label className="field-label">{field.label}</label>
                          <div className="field-value">{field.value}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}

        {/* Elective Subjects Section with Dropdowns */}
        <div className="profile-section">
          <div className="section-header">
            <Award size={20} />
            <h2>Elective Subjects Selection</h2>
          </div>
          
          <div className="section-content">
            <div className="elective-fields-grid">
              <div className="elective-field">
                <label className="elective-label">
                  <BookOpen size={16} />
                  NPTEL Course
                </label>
                <select 
                  value={nptelSubject} 
                  onChange={(e) => setNptelSubject(e.target.value)}
                  className="elective-dropdown"
                >
                  <option value="">Select NPTEL Course</option>
                  {nptelOptions.map((option, idx) => (
                    <option key={idx} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div className="elective-field">
                <label className="elective-label">
                  <Award size={16} />
                  Professional Elective
                </label>
                <select 
                  value={professionalElective} 
                  onChange={(e) => setProfessionalElective(e.target.value)}
                  className="elective-dropdown"
                >
                  <option value="">Select Professional Elective</option>
                  {professionalElectiveOptions.map((option, idx) => (
                    <option key={idx} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div className="elective-field">
                <label className="elective-label">
                  <GraduationCap size={16} />
                  Multidisciplinary Minor
                </label>
                <select 
                  value={mdmSubject} 
                  onChange={(e) => setMdmSubject(e.target.value)}
                  className="elective-dropdown"
                >
                  <option value="">Select MDM Subject</option>
                  {mdmOptions.map((option, idx) => (
                    <option key={idx} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div className="elective-field">
                <label className="elective-label">
                  <Award size={16} />
                  Honor/Minor
                </label>
                <select 
                  value={honorMinor} 
                  onChange={(e) => setHonorMinor(e.target.value)}
                  className="elective-dropdown"
                >
                  <option value="">Select Honor/Minor</option>
                  {honorMinorOptions.map((option, idx) => (
                    <option key={idx} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="profile-footer">
        <div className="footer-note">
          <p>This profile is in view-only mode. Contact your administrator for any changes.</p>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;