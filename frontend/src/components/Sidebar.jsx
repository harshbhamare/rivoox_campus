import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  BarChart3, 
  AlertTriangle,
  Radio
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ currentView, setCurrentView, userRole }) => {
  const allMenuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      roles: ['class_teacher', 'teacher', 'faculty']
    },
    {
      id: 'submissions',
      label: 'Subject Wise Analysis ',
      icon: FileText,
      roles: ['class_teacher', 'teacher', 'faculty']
    },
    {
      id: 'manage-class',
      label: 'Manage Class',
      icon: Users,
      roles: ['class_teacher', 'teacher'] // Only for class teachers, NOT faculty
    },
    {
      id: 'subject-analysis',
      label: 'Your Submissions',
      icon: BarChart3,
      roles: ['class_teacher', 'teacher', 'faculty']
    },
    {
      id: 'defaulter-plug',
      label: 'Defaulter Plug',
      icon: AlertTriangle,
      roles: ['class_teacher', 'teacher', 'faculty']
    }
  ];

  // Filter menu items based on user role
  const menuItems = allMenuItems.filter(item => 
    !item.roles || item.roles.includes(userRole)
  );

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo-section">
          <Radio className="logo-icon" />
          <div>
            <div className="logo-text">Term Work</div>
            <div className="logo-subtext">Submissions (Part 1)</div>
          </div>
        </div>
      </div>
      
      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              className={`nav-item ${currentView === item.id ? 'active' : ''}`}
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

export default Sidebar;