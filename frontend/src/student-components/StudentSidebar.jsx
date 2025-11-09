import {
    LayoutDashboard,
    AlertTriangle,
    User,
    BookOpen,
    Radio
} from 'lucide-react';
import './StudentSidebar.css';

const StudentSidebar = ({ currentView, setCurrentView }) => {
    const menuItems = [
        {
            id: 'dashboard',
            label: 'Dashboard',
            icon: LayoutDashboard
        },
        {
            id: 'subjects',
            label: 'Subjects',
            icon: BookOpen
        },
        {
            id: 'defaulter-work',
            label: 'Defaulter Work',
            icon: AlertTriangle
        },
        {
            id: 'profile',
            label: 'Profile',
            icon: User
        }
    ];

    return (
        <div className="student-sidebar">
            <div className="student-sidebar-header">
                <div className="student-logo-section">
                    <Radio className="student-logo-icon" />
                    <div>
                        <div className="student-logo-text">Term Work</div>
                        <div className="student-logo-subtext">Submissions (Part 1)</div>
                    </div>
                </div>
            </div>

            <nav className="student-sidebar-nav">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <button
                            key={item.id}
                            className={`student-nav-item ${currentView === item.id ? 'active' : ''}`}
                            onClick={() => setCurrentView(item.id)}
                        >
                            <Icon size={20} />
                            <span>{item.label}</span>
                        </button>
                    );
                })}
            </nav>
        </div>
    );
};

export default StudentSidebar;