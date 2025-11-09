import React, { useState, createContext, useContext } from 'react';
import StudentSidebar from './StudentSidebar';
import StudentHeader from './StudentHeader';
import StudentDashboard from './StudentDashboard';
import SubmissionStatus from './SubmissionStatus';
import Subjects from './Subjects';
import DefaulterWork from './DefaulterWork';
import StudentProfile from './StudentProfile';
import './StudentApp.css';

// Student Context
const StudentContext = createContext();

export const useStudentContext = () => {
    const context = useContext(StudentContext);
    if (!context) {
        throw new Error('useStudentContext must be used within StudentProvider');
    }
    return context;
};

function StudentApp({ user, onLogout }) {
    const [currentView, setCurrentView] = useState('dashboard');

    // Student data
    const [studentData] = useState({
        name: 'Pratiksha Kate',
        rollNumber: 'TY-CSD-C-64',
        hallTicket: '230101080564',
        email: 'pratiksha@example.com',
        contact: '+91 9876543210',
        batch: 'C4',
        openElective: 'NPTEL',
        professionalElective: 'Data Science',
        multidisciplinaryMinor: 'IoT',
        honorMinor: 'Skipped',
        submissionPercentage: 86
    });

    // Subjects and submissions data
    const [subjects] = useState([
        {
            code: 'EST123',
            name: 'Operating System',
            submissions: {
                cie: 'completed',
                ta: 'completed',
                defaulter: 'completed'
            }
        },
        {
            code: 'EST124',
            name: 'Database Management',
            submissions: {
                cie: 'pending',
                ta: 'pending',
                defaulter: 'pending'
            }
        },
        {
            code: 'EST125',
            name: 'Software Engineering',
            submissions: {
                cie: 'completed',
                ta: 'pending',
                defaulter: 'pending'
            }
        }
    ]);

    // Defaulter work data
    const [defaulterWorks] = useState([
        {
            id: 1,
            subjectCode: 'EST123',
            subjectName: 'Operating System',
            description: 'work questions for defaulter student',
            dueDate: '2024-12-15',
            status: 'pending'
        },
        {
            id: 2,
            subjectCode: 'EST124',
            subjectName: 'Database Management',
            description: 'work questions for defaulter student',
            dueDate: '2024-12-20',
            status: 'pending'
        },
        {
            id: 3,
            subjectCode: 'EST125',
            subjectName: 'Software Engineering',
            description: 'work questions for defaulter student',
            dueDate: '2024-12-25',
            status: 'pending'
        },
        {
            id: 4,
            subjectCode: 'EST126',
            subjectName: 'Computer Networks',
            description: 'work questions for defaulter student',
            dueDate: '2024-12-30',
            status: 'pending'
        }
    ]);

    const contextValue = {
        currentView,
        setCurrentView,
        studentData,
        subjects,
        defaulterWorks,
        user,
        onLogout
    };

    return (
        <StudentContext.Provider value={contextValue}>
            <div className="student-app">
                <StudentSidebar currentView={currentView} setCurrentView={setCurrentView} />
                <div className="student-main-content">
                    <StudentHeader />
                    <div className="student-content">
                        {currentView === 'dashboard' && <StudentDashboard />}
                        {currentView === 'submission-status' && <SubmissionStatus />}
                        {currentView === 'subjects' && <Subjects />}
                        {currentView === 'defaulter-work' && <DefaulterWork />}
                        {currentView === 'profile' && <StudentProfile />}
                    </div>
                </div>
            </div>
        </StudentContext.Provider>
    );
}

export default StudentApp;