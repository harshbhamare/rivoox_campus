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

const Sidebar = ({ currentView, setCurrentView }) => {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard
    },
    {
      id: 'submissions',
      label: 'Subject Wise Analysis ',
      icon: FileText
    },
    {
      id: 'manage-class',
      label: 'Manage Class',
      icon: Users
    },
    {
      id: 'subject-analysis',
      label: 'Your Submissions',
      icon: BarChart3
    },
    {
      id: 'defaulter-plug',
      label: 'Defaulter Plug',
      icon: AlertTriangle
    }
  ];

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