import React, { useState, useEffect } from 'react';
import { User, ChevronDown, Radio, Edit, Trash2, Plus, LogOut } from 'lucide-react';
import HODSubjects from './HODSubjects';
import './HODDashboard.css';

const API_BASE = 'http://localhost:3000';

const HODDashboard = ({ user, onLogout }) => {
    const [currentView, setCurrentView] = useState('dashboard');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showFacultyModal, setShowFacultyModal] = useState(false);
    const [showEditFacultyModal, setShowEditFacultyModal] = useState(false);
    const [editingFaculty, setEditingFaculty] = useState(null);
    const [editingClass, setEditingClass] = useState(null);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [loading, setLoading] = useState(false);
    const [classes, setClasses] = useState([]);
    const [classTeachers, setClassTeachers] = useState([]);

    const [formData, setFormData] = useState({
        className: '',
        year: '',
        teacherId: ''
    });

    const [facultyFormData, setFacultyFormData] = useState({
        name: '',
        department: '',
        email: '',
        phone: '',
        specialization: ''
    });

    const [faculties, setFaculties] = useState([]);

    const [showSnackbar, setShowSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    // HOD Profile State
    const [hodProfile, setHodProfile] = useState({
        name: 'HOD',
        email: '',
        department: 'No Department Assigned'
    });

    // Fetch classes, class teachers, faculties, and HOD profile on mount
    useEffect(() => {
        fetchHodProfile();
        fetchClasses();
        fetchClassTeachers();
        fetchFaculties();
    }, []);

    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        return {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
    };

    const fetchHodProfile = async () => {
        try {
            const response = await fetch(`${API_BASE}/api/hod/profile`, {
                headers: getAuthHeaders()
            });
            const data = await response.json();
            
            if (data.success) {
                setHodProfile({
                    name: data.user.name,
                    email: data.user.email,
                    department: data.user.department_name || 'No Department Assigned'
                });
            } else {
                showMessage(data.error || 'Failed to fetch profile', 'error');
            }
        } catch (error) {
            console.error('Error fetching HOD profile:', error);
        }
    };

    const fetchClasses = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE}/api/hod/classes`, {
                headers: getAuthHeaders()
            });
            const data = await response.json();
            
            if (data.success) {
                setClasses(data.classes || []);
            }
        } catch (error) {
            console.error('Error fetching classes:', error);
            showMessage('Error fetching classes');
        } finally {
            setLoading(false);
        }
    };

    const fetchClassTeachers = async () => {
        try {
            const response = await fetch(`${API_BASE}/api/hod/class-teachers`, {
                headers: getAuthHeaders()
            });
            const data = await response.json();
            
            console.log('Class teachers response:', data);
            
            if (data.success) {
                setClassTeachers(data.teachers || []);
                console.log('Class teachers set:', data.teachers);
            } else {
                console.error('Failed to fetch class teachers:', data.error);
                showMessage(data.error || 'Failed to fetch class teachers');
            }
        } catch (error) {
            console.error('Error fetching class teachers:', error);
            showMessage('Error fetching class teachers');
        }
    };

    const fetchFaculties = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE}/api/hod/faculties`, {
                headers: getAuthHeaders()
            });
            const data = await response.json();
            
            if (data.success) {
                setFaculties(data.faculties || []);
            } else {
                showMessage(data.error || 'Failed to fetch faculties');
            }
        } catch (error) {
            console.error('Error fetching faculties:', error);
            showMessage('Error fetching faculties');
        } finally {
            setLoading(false);
        }
    };

    const showMessage = (message) => {
        setSnackbarMessage(message);
        setShowSnackbar(true);
        setTimeout(() => setShowSnackbar(false), 3000);
    };

    const handleCreateClass = async () => {
        if (!formData.className || !formData.year || !formData.teacherId) {
            showMessage('Please fill all fields');
            return;
        }

        try {
            setLoading(true);
            const response = await fetch(`${API_BASE}/api/hod/classes`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    name: formData.className,
                    year: parseInt(formData.year),
                    class_teacher_id: formData.teacherId
                })
            });

            const data = await response.json();

            if (data.success) {
                await fetchClasses();
                setFormData({ className: '', year: '', teacherId: '' });
                setShowCreateModal(false);
                showMessage('Class created successfully!');
            } else {
                showMessage(data.error || 'Failed to create class');
            }
        } catch (error) {
            showMessage('Error creating class: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClass = async (id) => {
        if (!window.confirm('Are you sure you want to delete this class? This action cannot be undone.')) {
            return;
        }

        try {
            setLoading(true);
            const response = await fetch(`${API_BASE}/api/hod/classes/${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });

            const data = await response.json();

            if (data.success) {
                await fetchClasses();
                showMessage('Class deleted successfully!');
            } else {
                showMessage(data.error || 'Failed to delete class');
            }
        } catch (error) {
            showMessage('Error deleting class: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEditClass = (cls) => {
        console.log('Edit class clicked:', cls);
        setEditingClass(cls);
        setFormData({
            className: cls.name,
            year: cls.year.toString(),
            teacherId: cls.teacher_id || ''
        });
        console.log('Form data set:', {
            className: cls.name,
            year: cls.year.toString(),
            teacherId: cls.teacher_id || ''
        });
        setShowEditModal(true);
        console.log('Edit modal should be visible now');
    };

    const handleUpdateClass = async () => {
        if (!formData.className || !formData.year || !formData.teacherId) {
            showMessage('Please fill all fields');
            return;
        }

        try {
            setLoading(true);
            const response = await fetch(`${API_BASE}/api/hod/classes/${editingClass.id}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    name: formData.className,
                    year: parseInt(formData.year),
                    class_teacher_id: formData.teacherId
                })
            });

            const data = await response.json();

            if (data.success) {
                await fetchClasses();
                setFormData({ className: '', year: '', teacherId: '' });
                setEditingClass(null);
                setShowEditModal(false);
                showMessage('Class updated successfully!');
            } else {
                showMessage(data.error || 'Failed to update class');
            }
        } catch (error) {
            showMessage('Error updating class: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateFaculty = () => {
        if (facultyFormData.name && facultyFormData.department && facultyFormData.email) {
            const newFaculty = {
                id: Date.now(),
                name: facultyFormData.name,
                department: facultyFormData.department,
                email: facultyFormData.email,
                phone: facultyFormData.phone,
                specialization: facultyFormData.specialization
            };
            setFaculties(prev => [...prev, newFaculty]);
            setFacultyFormData({ name: '', department: '', email: '', phone: '', specialization: '' });
            setShowFacultyModal(false);
            showMessage('Faculty added successfully!');
        } else {
            showMessage('Please fill required fields (Name, Department, Email)');
        }
    };

    const handleDeleteFaculty = (id) => {
        setFaculties(prev => prev.filter(faculty => faculty.id !== id));
        showMessage('Faculty removed successfully!');
    };

    const handleEditFaculty = (id) => {
        const faculty = faculties.find(f => f.id === id);
        if (faculty) {
            setEditingFaculty(faculty);
            setFacultyFormData({
                name: faculty.name,
                department: faculty.department,
                email: faculty.email,
                phone: faculty.phone,
                specialization: faculty.specialization
            });
            setShowEditFacultyModal(true);
        }
    };

    const handleUpdateFaculty = () => {
        if (facultyFormData.name && facultyFormData.department && facultyFormData.email) {
            setFaculties(prev => prev.map(faculty =>
                faculty.id === editingFaculty.id
                    ? {
                        ...faculty,
                        name: facultyFormData.name,
                        department: facultyFormData.department,
                        email: facultyFormData.email,
                        phone: facultyFormData.phone,
                        specialization: facultyFormData.specialization
                    }
                    : faculty
            ));
            setFacultyFormData({ name: '', department: '', email: '', phone: '', specialization: '' });
            setShowEditFacultyModal(false);
            setEditingFaculty(null);
            showMessage('Faculty updated successfully!');
        } else {
            showMessage('Please fill required fields (Name, Department, Email)');
        }
    };

    // Year-wise analytics data
    const yearAnalytics = [
        { year: 'First Year', percentage: 86, students: '10/20', division: 'Division - C' },
        { year: 'Second Year', percentage: 86, students: '10/20', division: 'Division - C' },
        { year: 'Third Year', percentage: 86, students: '10/20', division: 'Division - C' },
        { year: 'Final Year', percentage: 86, students: '10/20', division: 'Division - C' }
    ];

    const ProgressCircle = ({ percentage }) => {
        const radius = 45;
        const circumference = 2 * Math.PI * radius;
        const strokeDasharray = circumference;
        const strokeDashoffset = circumference - (percentage / 100) * circumference;

        return (
            <div className="hod-progress-circle">
                <svg width="100" height="100">
                    <circle
                        cx="50"
                        cy="50"
                        r={radius}
                        className="hod-progress-bg"
                    />
                    <circle
                        cx="50"
                        cy="50"
                        r={radius}
                        className="hod-progress-fill"
                        style={{
                            strokeDasharray,
                            strokeDashoffset
                        }}
                    />
                </svg>
                <div className="hod-progress-text">{percentage}%</div>
            </div>
        );
    };

    // Render modal inline to prevent re-creation
    const renderCreateClassModal = () => {
        if (!showCreateModal) return null;

        return (
            <div className="hod-modal-overlay" onClick={(e) => {
                if (e.target.className === 'hod-modal-overlay') {
                    setShowCreateModal(false);
                }
            }}>
                <div className="hod-modal-content">
                    <div className="hod-modal-header">
                        <h3>Create Class</h3>
                    </div>

                    <div className="hod-modal-body">
                        <div className="hod-form-row">
                            <div className="hod-form-group">
                                <label>Class Name</label>
                                <input
                                    type="text"
                                    placeholder="Enter Class Name"
                                    value={formData.className}
                                    onChange={(e) => setFormData(prev => ({ ...prev, className: e.target.value }))}
                                    className="hod-form-input"
                                    autoFocus
                                />
                            </div>

                            <div className="hod-form-group">
                                <label>Select Year</label>
                                <select
                                    value={formData.year}
                                    onChange={(e) => setFormData(prev => ({ ...prev, year: e.target.value }))}
                                    className="hod-form-select"
                                    disabled={loading}
                                >
                                    <option value="">Select year</option>
                                    <option value="1">First Year</option>
                                    <option value="2">Second Year</option>
                                    <option value="3">Third Year</option>
                                    <option value="4">Fourth Year</option>
                                </select>
                            </div>
                        </div>

                        <div className="hod-form-group">
                            <label>Assign Class Teacher</label>
                            <select
                                value={formData.teacherId}
                                onChange={(e) => setFormData(prev => ({ ...prev, teacherId: e.target.value }))}
                                className="hod-form-select"
                                disabled={loading}
                            >
                                <option value="">Select class Teacher</option>
                                {classTeachers.map((teacher) => (
                                    <option key={teacher.id} value={teacher.id}>
                                        {teacher.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="hod-modal-actions">
                            <button
                                className="hod-cancel-btn"
                                onClick={() => {
                                    setShowCreateModal(false);
                                    setFormData({ className: '', year: '', teacherId: '' });
                                }}
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                className="hod-add-btn"
                                onClick={handleCreateClass}
                                disabled={loading}
                            >
                                {loading ? 'Creating...' : 'Add Class'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="hod-dashboard">
            <div className="hod-dashboard-layout">
                {/* Sidebar */}
                <div className="hod-sidebar">
                    <div className="hod-sidebar-header">
                        <div className="hod-logo-section">
                            <Radio className="hod-logo-icon" />
                            <div>
                                <div className="hod-logo-text">Term Work</div>
                                <div className="hod-logo-subtext">Submissions (Part 1)</div>
                            </div>
                        </div>
                    </div>

                    <nav className="hod-sidebar-nav">
                        <button
                            className={`hod-nav-item ${currentView === 'dashboard' ? 'active' : ''}`}
                            onClick={() => setCurrentView('dashboard')}
                        >
                            <span>Dashboard</span>
                        </button>
                        <button
                            className={`hod-nav-item ${currentView === 'subjects' ? 'active' : ''}`}
                            onClick={() => setCurrentView('subjects')}
                        >
                            <span>Subjects</span>
                        </button>
                        <button
                            className={`hod-nav-item ${currentView === 'faculty' ? 'active' : ''}`}
                            onClick={() => setCurrentView('faculty')}
                        >
                            <span>Faculty List</span>
                        </button>
                    </nav>
                </div>

                {/* Main Content */}
                <div className="hod-main-content">
                    {/* Header */}
                    <header className="hod-header">
                        <div className="hod-header-left">
                            <div className="hod-logo">
                                <img
                                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4tIzAnxHyTy7vmn4G2MT00_NUMlZub68bjA&s"
                                    alt="Logo"
                                    style={{ height: "auto", width: "190px" }}
                                />
                            </div>
                        </div>

                        <div className="hod-header-center">
                            <div className="hod-welcome-section">
                                <h1 className="hod-welcome-title">Welcome, {hodProfile.name}</h1>
                                <div className="hod-department">{hodProfile.department}</div>
                            </div>
                        </div>

                        <div className="hod-header-right">
                            <div className="hod-user-menu-container">
                                <div
                                    className="hod-user-avatar"
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                >
                                    <User size={20} />
                                    <ChevronDown size={16} />
                                </div>
                                {showUserMenu && (
                                    <div className="hod-user-dropdown">
                                        <div className="hod-user-info">
                                            <p className="hod-user-name">{hodProfile.name}</p>
                                            <span className="hod-user-email">{hodProfile.email}</span>
                                            <span className="hod-user-role">HOD Account</span>
                                        </div>
                                        <button className="hod-logout-btn" onClick={onLogout}>
                                            <LogOut size={16} />
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </header>

                    <div className="hod-content-header">
                        {currentView === 'dashboard' && (
                            <button
                                className="hod-create-class-btn"
                                onClick={() => setShowCreateModal(true)}
                            >
                                <Plus size={16} />
                                Create Class
                            </button>
                        )}
                    </div>

                    {/* Dashboard View */}
                    {currentView === 'dashboard' && (
                        <>
                            {/* Analytics Section */}
                            <div className="hod-analytics-section">
                                {yearAnalytics.map((year, index) => (
                                    <div key={index} className="hod-year-card">
                                        <h3>{year.year}</h3>
                                        <div className="hod-year-content">
                                            <div className="hod-year-left">
                                                <ProgressCircle percentage={year.percentage} />
                                                <div className="hod-submission-text">Submission</div>
                                            </div>
                                            <div className="hod-year-right">
                                                {/* <ProgressCircle percentage={year.percentage} /> */}
                                                <div className="hod-stats">
                                                    {/* <div className="hod-stat-number">{year.students}</div> */}
                                                    {/* <div className="hod-stat-label">Student</div> */}
                                                    {/* <div className="hod-stat-status">Submission Confirmed</div> */}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="hod-division-tag">{year.division}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Classes Table */}
                            <div className="hod-classes-section">
                                <div className="hod-table-container">
                                    <table className="hod-classes-table">
                                        <thead>
                                            <tr>
                                                <th>Class Name</th>
                                                <th>Year</th>
                                                <th>Class Teacher</th>
                                                <th>Total Students</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {loading && classes.length === 0 ? (
                                                <tr>
                                                    <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                                                        Loading classes...
                                                    </td>
                                                </tr>
                                            ) : classes.length === 0 ? (
                                                <tr>
                                                    <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                                                        No classes found. Create one to get started.
                                                    </td>
                                                </tr>
                                            ) : (
                                                classes.map((cls) => (
                                                    <tr key={cls.id}>
                                                        <td>
                                                            <div className="hod-class-info">
                                                                <div className="hod-class-name">{cls.name}</div>
                                                            </div>
                                                        </td>
                                                        <td className="hod-year-name">
                                                            {cls.year === 1 ? 'First Year' :
                                                             cls.year === 2 ? 'Second Year' :
                                                             cls.year === 3 ? 'Third Year' :
                                                             cls.year === 4 ? 'Fourth Year' :
                                                             `Year ${cls.year}`}
                                                        </td>
                                                        <td className="hod-teacher-name">{cls.teacher}</td>
                                                        <td className="hod-students-count">{cls.total_students || 0}</td>
                                                        <td>
                                                            <div className="hod-action-buttons">
                                                                <button
                                                                    className="hod-edit-btn"
                                                                    onClick={() => handleEditClass(cls)}
                                                                    disabled={loading}
                                                                >
                                                                    <Edit size={16} />
                                                                </button>
                                                                <button
                                                                    className="hod-delete-btn"
                                                                    onClick={() => handleDeleteClass(cls.id)}
                                                                    disabled={loading}
                                                                >
                                                                    <Trash2 size={16} />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Subjects View */}
                    {currentView === 'subjects' && (
                        <HODSubjects />
                    )}

                    {/* Faculty List View */}
                    {currentView === 'faculty' && (
                        <div className="hod-faculty-section">
                            <div className="hod-table-container">
                                <table className="hod-classes-table">
                                    <thead>
                                        <tr>
                                            <th>Faculty Name</th>
                                            <th>Email</th>
                                            <th>Role</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading && faculties.length === 0 ? (
                                            <tr>
                                                <td colSpan="3" style={{ textAlign: 'center', padding: '20px' }}>
                                                    Loading faculties...
                                                </td>
                                            </tr>
                                        ) : faculties.length === 0 ? (
                                            <tr>
                                                <td colSpan="3" style={{ textAlign: 'center', padding: '20px' }}>
                                                    No faculties found in your department.
                                                </td>
                                            </tr>
                                        ) : (
                                            faculties.map((faculty) => (
                                                <tr key={faculty.id}>
                                                    <td className="hod-faculty-name">{faculty.name}</td>
                                                    <td className="hod-faculty-email">{faculty.email}</td>
                                                    <td className="hod-faculty-role">
                                                        {faculty.role === 'class_teacher' ? 'Class Teacher' :
                                                         faculty.role === 'hod' ? 'HOD' :
                                                         faculty.role === 'faculty' ? 'Faculty' :
                                                         faculty.role}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>

                {/* Create Class Modal */}
                {renderCreateClassModal()}

                {/* Edit Class Modal */}
                {showEditModal && (
                    <div className="hod-modal-overlay" onClick={(e) => {
                        if (e.target.className === 'hod-modal-overlay') {
                            setShowEditModal(false);
                            setEditingClass(null);
                            setFormData({ className: '', year: '', teacherId: '' });
                        }
                    }}>
                        <div className="hod-modal-content">
                            <div className="hod-modal-header">
                                <h3>Edit Class</h3>
                            </div>

                            <div className="hod-modal-body">
                                <div className="hod-form-row">
                                    <div className="hod-form-group">
                                        <label>Class Name</label>
                                        <input
                                            type="text"
                                            placeholder="Enter Class Name"
                                            value={formData.className}
                                            onChange={(e) => setFormData(prev => ({ ...prev, className: e.target.value }))}
                                            className="hod-form-input"
                                            disabled={loading}
                                            autoFocus
                                        />
                                    </div>

                                    <div className="hod-form-group">
                                        <label>Select Year</label>
                                        <select
                                            value={formData.year}
                                            onChange={(e) => setFormData(prev => ({ ...prev, year: e.target.value }))}
                                            className="hod-form-select"
                                            disabled={loading}
                                        >
                                            <option value="">Select year</option>
                                            <option value="1">First Year</option>
                                            <option value="2">Second Year</option>
                                            <option value="3">Third Year</option>
                                            <option value="4">Fourth Year</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="hod-form-group">
                                    <label>Assign Class Teacher</label>
                                    <select
                                        value={formData.teacherId}
                                        onChange={(e) => setFormData(prev => ({ ...prev, teacherId: e.target.value }))}
                                        className="hod-form-select"
                                        disabled={loading}
                                    >
                                        <option value="">Select class Teacher</option>
                                        {classTeachers.map((teacher) => (
                                            <option key={teacher.id} value={teacher.id}>
                                                {teacher.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="hod-modal-actions">
                                    <button
                                        className="hod-cancel-btn"
                                        onClick={() => {
                                            setShowEditModal(false);
                                            setEditingClass(null);
                                            setFormData({ className: '', year: '', teacherId: '' });
                                        }}
                                        disabled={loading}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="hod-add-btn"
                                        onClick={handleUpdateClass}
                                        disabled={loading}
                                    >
                                        {loading ? 'Updating...' : 'Update Class'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Add Faculty Modal */}
                {showFacultyModal && (
                    <div className="hod-modal-overlay" onClick={(e) => {
                        if (e.target.className === 'hod-modal-overlay') {
                            setShowFacultyModal(false);
                        }
                    }}>
                        <div className="hod-modal-content">
                            <div className="hod-modal-header">
                                <h3>Add Faculty</h3>
                            </div>

                            <div className="hod-modal-body">
                                <div className="hod-form-row">
                                    <div className="hod-form-group">
                                        <label>Faculty Name *</label>
                                        <input
                                            type="text"
                                            placeholder="Enter Faculty Name"
                                            value={facultyFormData.name}
                                            onChange={(e) => setFacultyFormData(prev => ({ ...prev, name: e.target.value }))}
                                            className="hod-form-input"
                                            autoFocus
                                        />
                                    </div>

                                    <div className="hod-form-group">
                                        <label>Department *</label>
                                        <select
                                            value={facultyFormData.department}
                                            onChange={(e) => setFacultyFormData(prev => ({ ...prev, department: e.target.value }))}
                                            className="hod-form-select"
                                        >
                                            <option value="">Select Department</option>
                                            <option value="Emerging Science & Technology">Emerging Science & Technology</option>
                                            <option value="Computer Science">Computer Science</option>
                                            <option value="Information Technology">Information Technology</option>
                                            <option value="Electronics">Electronics</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="hod-form-row">
                                    <div className="hod-form-group">
                                        <label>Email *</label>
                                        <input
                                            type="email"
                                            placeholder="Enter Email Address"
                                            value={facultyFormData.email}
                                            onChange={(e) => setFacultyFormData(prev => ({ ...prev, email: e.target.value }))}
                                            className="hod-form-input"
                                        />
                                    </div>

                                    <div className="hod-form-group">
                                        <label>Phone</label>
                                        <input
                                            type="tel"
                                            placeholder="Enter Phone Number"
                                            value={facultyFormData.phone}
                                            onChange={(e) => setFacultyFormData(prev => ({ ...prev, phone: e.target.value }))}
                                            className="hod-form-input"
                                        />
                                    </div>
                                </div>

                                <div className="hod-form-group">
                                    <label>Specialization</label>
                                    <input
                                        type="text"
                                        placeholder="Enter Specialization"
                                        value={facultyFormData.specialization}
                                        onChange={(e) => setFacultyFormData(prev => ({ ...prev, specialization: e.target.value }))}
                                        className="hod-form-input"
                                    />
                                </div>

                                <div className="hod-modal-actions">
                                    <button
                                        className="hod-cancel-btn"
                                        onClick={() => setShowFacultyModal(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="hod-add-btn"
                                        onClick={handleCreateFaculty}
                                    >
                                        Add Faculty
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Edit Faculty Modal */}
                {showEditFacultyModal && (
                    <div className="hod-modal-overlay" onClick={(e) => {
                        if (e.target.className === 'hod-modal-overlay') {
                            setShowEditFacultyModal(false);
                            setEditingFaculty(null);
                            setFacultyFormData({ name: '', department: '', email: '', phone: '', specialization: '' });
                        }
                    }}>
                        <div className="hod-modal-content">
                            <div className="hod-modal-header">
                                <h3>Edit Faculty</h3>
                            </div>

                            <div className="hod-modal-body">
                                <div className="hod-form-row">
                                    <div className="hod-form-group">
                                        <label>Faculty Name *</label>
                                        <input
                                            type="text"
                                            placeholder="Enter Faculty Name"
                                            value={facultyFormData.name}
                                            onChange={(e) => setFacultyFormData(prev => ({ ...prev, name: e.target.value }))}
                                            className="hod-form-input"
                                            autoFocus
                                        />
                                    </div>

                                    <div className="hod-form-group">
                                        <label>Department *</label>
                                        <select
                                            value={facultyFormData.department}
                                            onChange={(e) => setFacultyFormData(prev => ({ ...prev, department: e.target.value }))}
                                            className="hod-form-select"
                                        >
                                            <option value="">Select Department</option>
                                            <option value="Emerging Science & Technology">Emerging Science & Technology</option>
                                            <option value="Computer Science">Computer Science</option>
                                            <option value="Information Technology">Information Technology</option>
                                            <option value="Electronics">Electronics</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="hod-form-row">
                                    <div className="hod-form-group">
                                        <label>Email *</label>
                                        <input
                                            type="email"
                                            placeholder="Enter Email Address"
                                            value={facultyFormData.email}
                                            onChange={(e) => setFacultyFormData(prev => ({ ...prev, email: e.target.value }))}
                                            className="hod-form-input"
                                        />
                                    </div>

                                    <div className="hod-form-group">
                                        <label>Phone</label>
                                        <input
                                            type="tel"
                                            placeholder="Enter Phone Number"
                                            value={facultyFormData.phone}
                                            onChange={(e) => setFacultyFormData(prev => ({ ...prev, phone: e.target.value }))}
                                            className="hod-form-input"
                                        />
                                    </div>
                                </div>

                                <div className="hod-form-group">
                                    <label>Specialization</label>
                                    <input
                                        type="text"
                                        placeholder="Enter Specialization"
                                        value={facultyFormData.specialization}
                                        onChange={(e) => setFacultyFormData(prev => ({ ...prev, specialization: e.target.value }))}
                                        className="hod-form-input"
                                    />
                                </div>

                                <div className="hod-modal-actions">
                                    <button
                                        className="hod-cancel-btn"
                                        onClick={() => {
                                            setShowEditFacultyModal(false);
                                            setEditingFaculty(null);
                                            setFacultyFormData({ name: '', department: '', email: '', phone: '', specialization: '' });
                                        }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="hod-add-btn"
                                        onClick={handleUpdateFaculty}
                                    >
                                        Update Faculty
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Snackbar */}
            {showSnackbar && (
                <div className="hod-snackbar success">
                    {snackbarMessage}
                </div>
            )}
        </div>
    );
};

export default HODDashboard;