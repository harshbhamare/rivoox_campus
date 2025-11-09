import React, { useState, createContext, useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Registration from './Registration';
import SuccessMessage from './SuccessMessage';

// Import existing dashboard components
import Sidebar from './Sidebar';
import Header from './Header';
import Dashboard from './Dashboard';
import ManageClass from './ManageClass';
import YourSubmissions from './YourSubmissions';
import SubjectWiseAnalysis from './SubjectWiseAnalysis';
import DefaulterPlug from './DefaulterPlug';
import HODDashboard from './HODDashboard';
import DirectorDashboard from './DirectorDashboard';
import FacultyDashboard from './FacultyDashboard';

// Import student components
import StudentApp from '../student-components/StudentApp';

// Global Context for App State
const AppContext = createContext();

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};

const AuthWrapper = () => {
  // 🔹 Load user from localStorage if available
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [currentView, setCurrentView] = useState(() => {
    return localStorage.getItem('user') ? 'dashboard' : 'login';
  });

  const [teacherView, setTeacherView] = useState('dashboard');
  const [isSubmissionAvailable, setIsSubmissionAvailable] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [loading, setLoading] = useState(false);

  // Global state for students, subjects, and batches
  const [students, setStudents] = useState([
    {
      id: 1,
      name: 'Harsh Sojwal Bhamare',
      rollNumber: 'TY-CSD-C-01',
      hallTicket: '230101080565',
      email: 'harshbhamare123@123.com',
      contact: '+91 7387883221',
      batch: 'C1',
      openElective: 'NPTEL',
      professionalElective: 'Data Science',
      multidisciplinaryMinor: 'Smart City and Management',
      honorMinor: 'Skipped',
      submissions: {
        ta: 'pending',
        cie: 'pending',
        defaulter: 'pending'
      }
    },
    {
      id: 2,
      name: 'Chaitanya Vinod Mohare',
      rollNumber: 'TY-CSD-C-02',
      hallTicket: '230101080566',
      email: 'chaitanya@123.com',
      contact: '+91 9876543210',
      batch: 'C1',
      openElective: 'NPTEL',
      professionalElective: 'Machine Learning',
      multidisciplinaryMinor: 'IoT',
      honorMinor: 'Skipped',
      submissions: {
        ta: 'complete',
        cie: 'pending',
        defaulter: 'complete'
      }
    },
    {
      id: 3,
      name: 'Priya Sharma',
      rollNumber: 'TY-CSD-C-03',
      hallTicket: '230101080567',
      email: 'priya@123.com',
      contact: '+91 9876543213',
      batch: 'C2',
      openElective: 'NPTEL',
      professionalElective: 'AI/ML',
      multidisciplinaryMinor: 'Cyber Security',
      honorMinor: 'Skipped',
      submissions: {
        ta: 'complete',
        cie: 'complete',
        defaulter: 'complete'
      }
    },
    {
      id: 4,
      name: 'Rahul Patel',
      rollNumber: 'TY-CSD-C-04',
      hallTicket: '230101080568',
      email: 'rahul@123.com',
      contact: '+91 9876543214',
      batch: 'C3',
      openElective: 'NPTEL',
      professionalElective: 'Data Science',
      multidisciplinaryMinor: 'IoT',
      honorMinor: 'Skipped',
      submissions: {
        ta: 'pending',
        cie: 'pending',
        defaulter: 'pending'
      }
    }
  ]);

  const [subjects, setSubjects] = useState({
    theory: [
      {
        id: 1,
        code: 'CSD101',
        name: 'Foundation of Intelligent Learning',
        faculty: 'Mrs. Priyanka Sonawane'
      }
    ],
    practical: [
      {
        id: 1,
        code: 'CSD101',
        name: 'Foundation of Intelligent Learning',
        faculties: {
          C1: 'Mrs. Priyanka Sonawane',
          C2: 'Dr. John Smith',
          C3: 'Prof. Sarah Wilson',
          C4: 'Dr. Mike Johnson'
        }
      }
    ]
  });

  const [batches, setBatches] = useState([
    { id: 1, name: 'C1', from: 1, to: 20 },
    { id: 2, name: 'C2', from: 21, to: 40 },
    { id: 3, name: 'C3', from: 41, to: 60 },
    { id: 4, name: 'C4', from: 61, to: 80 }
  ]);

  const [filters, setFilters] = useState({
    category: 'Regular',
    batch: 'All'
  });

  // 🔹 When login is successful
  const handleLogin = (userData) => {
    console.log('AuthWrapper - handleLogin userData:', userData);
    // Save in localStorage
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setCurrentView('dashboard');
  };

  // 🔹 Logout
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setCurrentView('login');
    setTeacherView('dashboard');
  };

  // 🔹 Registration success
  const handleRegisterSuccess = () => {
    setCurrentView('success');
  };

  // 🔹 Context data (shared globally)
  const contextValue = {
    currentView: teacherView,
    setCurrentView: setTeacherView,
    isSubmissionAvailable,
    setIsSubmissionAvailable,
    selectedSubject,
    setSelectedSubject,
    students,
    setStudents,
    subjects,
    setSubjects,
    batches,
    setBatches,
    filters,
    setFilters,
    user,
    onLogout: handleLogout
  };

  // 🔹 Teacher dashboard layout
  const renderTeacherDashboard = () => (
    <AppContext.Provider value={contextValue}>
      <div className="app">
        <Sidebar currentView={teacherView} setCurrentView={setTeacherView} userRole={user?.role} />
        <div className="main-content">
          <Header />
          <div className="welcome-banner">
            <h1 className="welcome-title">
              Welcome, {user?.name || 'Faculty'}
            </h1>
            <div className="class-info">
              <span>Class Teacher : TY-CSD-C</span>
            </div>
          </div>
          <div className="content">
            {teacherView === 'dashboard' && <Dashboard />}
            {teacherView === 'submissions' && <YourSubmissions />}
            {teacherView === 'manage-class' && <ManageClass />}
            {teacherView === 'subject-analysis' && <SubjectWiseAnalysis />}
            {teacherView === 'defaulter-plug' && <DefaulterPlug />}
          </div>
        </div>
      </div>
    </AppContext.Provider>
  );

  // 🔹 Faculty dashboard layout
  const renderFacultyDashboard = () => (
    <AppContext.Provider value={contextValue}>
      <div className="app">
        <Sidebar currentView={teacherView} setCurrentView={setTeacherView} userRole="faculty" />
        <div className="main-content">
          <Header />
          <div className="welcome-banner">
            <h1 className="welcome-title">
              Welcome, {user?.name || 'Faculty'}
            </h1>
            <div className="class-info">
              <span>Faculty Dashboard</span>
            </div>
          </div>
          <div className="content">
            {teacherView === 'dashboard' && <FacultyDashboard />}
            {teacherView === 'submissions' && <YourSubmissions />}
            {teacherView === 'subject-analysis' && <SubjectWiseAnalysis />}
            {teacherView === 'defaulter-plug' && <DefaulterPlug />}
          </div>
        </div>
      </div>
    </AppContext.Provider>
  );

  // 🔹 Role-based dashboard selection
  const renderDashboard = () => {
    if (!user) return null;

    const role = user.role || user.type; // handle both fields

    switch (role) {
      case 'student':
        return <StudentApp user={user} onLogout={handleLogout} />;
      case 'class_teacher':
      case 'teacher':
        return renderTeacherDashboard();
      case 'faculty':
        return renderFacultyDashboard();
      case 'hod':
        return <HODDashboard user={user} onLogout={handleLogout} />;
      case 'director':
        return <DirectorDashboard user={user} onLogout={handleLogout} />;
      default:
        return (
          <Login
            onLogin={handleLogin}
            onRegister={() => setCurrentView('register')}
          />
        );
    }
  };

  // 🔹 Auto-load dashboard if logged in
  if (currentView === 'dashboard' && user) {
    return renderDashboard();
  }

  // 🔹 View switching
  switch (currentView) {
    case 'login':
      return (
        <Login
          onLogin={handleLogin}
          onRegister={() => setCurrentView('register')}
        />
      );
    case 'register':
      return (
        <Registration
          onBack={() => setCurrentView('login')}
          onRegisterSuccess={handleRegisterSuccess}
        />
      );
    case 'success':
      return (
        <SuccessMessage
          message="Your account has been created successfully! You can now login with your credentials."
          onBack={() => setCurrentView('login')}
        />
      );
    default:
      return (
        <Login
          onLogin={handleLogin}
          onRegister={() => setCurrentView('register')}
        />
      );
  }
};

export default AuthWrapper;
