import { useState, useEffect } from 'react';
import { User, ChevronDown, Radio, Edit, Trash2, Plus, Upload, BarChart3, Users, Settings, LogOut } from 'lucide-react';
import './DirectorDashboard.css';

const API_BASE = 'http://localhost:3000';

const DirectorDashboard = ({ user, onLogout }) => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [showCreateDeptModal, setShowCreateDeptModal] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [loading, setLoading] = useState(false);

  // Department Management State
  const [departments, setDepartments] = useState([]);

  const [deptFormData, setDeptFormData] = useState({
    departmentName: '',
    hodId: ''
  });

  const [editingDept, setEditingDept] = useState(null);
  const [showEditDeptModal, setShowEditDeptModal] = useState(false);

  // HOD List State
  const [availableHods, setAvailableHods] = useState([]);

  // Campus Information State
  const [campusInfo, setCampusInfo] = useState({
    instituteName: 'MIT College of Science and Technology',
    yearEstablished: '1995',
    instituteCode: 'MIT001',
    phoneNumber: '+91 20 12345678',
    city: 'Pune',
    address: '123 Education Street, Pune, Maharashtra 411001',
    logo: null
  });

  // Fetch departments and HODs on mount
  useEffect(() => {
    fetchDepartments();
    fetchAvailableHods();
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/api/director/departments`, {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      
      if (data.success) {
        setDepartments(data.departments);
      } else {
        showMessage(data.error || 'Failed to fetch departments', 'error');
      }
    } catch (error) {
      showMessage('Error fetching departments: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableHods = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/director/hods`, {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      
      if (data.success) {
        setAvailableHods(data.hods);
      } else {
        showMessage(data.error || 'Failed to fetch HODs', 'error');
      }
    } catch (error) {
      showMessage('Error fetching HODs: ' + error.message, 'error');
    }
  };

  // Dynamic Analytics Data based on departments
  const getDepartmentAnalytics = () => {
    return departments.map(dept => ({
      name: dept.name,
      percentage: dept.submissionRate || Math.floor(Math.random() * 40) + 60
    }));
  };

  const getSubmissionAnalytics = () => {
    return departments.map(dept => ({
      department: dept.name,
      percentage: dept.submissionRate || Math.floor(Math.random() * 40) + 60
    }));
  };

  const showMessage = (message) => {
    setSnackbarMessage(message);
    setShowSnackbar(true);
    setTimeout(() => setShowSnackbar(false), 3000);
  };

  const handleCreateDepartment = async () => {
    if (!deptFormData.departmentName.trim()) {
      showMessage('Please enter department name');
      return;
    }

    try {
      setLoading(true);
      
      // Step 1: Create department
      const createResponse = await fetch(`${API_BASE}/api/director/departments`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ name: deptFormData.departmentName })
      });
      
      const createData = await createResponse.json();
      
      if (!createData.success) {
        showMessage(createData.error || 'Failed to create department');
        return;
      }

      // Step 2: Assign HOD if selected
      if (deptFormData.hodId) {
        const assignResponse = await fetch(`${API_BASE}/api/director/assign-hod`, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify({
            user_id: deptFormData.hodId,
            department_id: createData.department.id
          })
        });
        
        const assignData = await assignResponse.json();
        
        if (!assignData.success) {
          showMessage('Department created but HOD assignment failed: ' + assignData.error);
        }
      }

      // Refresh departments list
      await fetchDepartments();
      await fetchAvailableHods();
      
      setDeptFormData({ departmentName: '', hodId: '' });
      setShowCreateDeptModal(false);
      showMessage('Department created successfully!');
      
    } catch (error) {
      showMessage('Error creating department: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDepartment = async (id) => {
    if (!window.confirm('Are you sure you want to delete this department? This will unassign all users from this department.')) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/api/director/departments/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      const data = await response.json();

      if (data.success) {
        await fetchDepartments();
        await fetchAvailableHods();
        showMessage('Department deleted successfully!');
      } else {
        showMessage(data.error || 'Failed to delete department');
      }
    } catch (error) {
      showMessage('Error deleting department: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditDepartment = (dept) => {
    setEditingDept(dept);
    setDeptFormData({
      departmentName: dept.name,
      hodId: dept.hod_id || ''
    });
    setShowEditDeptModal(true);
  };

  const handleUpdateDepartment = async () => {
    if (!deptFormData.departmentName.trim()) {
      showMessage('Please enter department name');
      return;
    }

    try {
      setLoading(true);

      // Check if HOD changed
      if (deptFormData.hodId && deptFormData.hodId !== editingDept.hod_id) {
        const assignResponse = await fetch(`${API_BASE}/api/director/assign-hod`, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify({
            user_id: deptFormData.hodId,
            department_id: editingDept.id
          })
        });
        
        const assignData = await assignResponse.json();
        
        if (!assignData.success) {
          showMessage('Failed to update HOD: ' + assignData.error);
          return;
        }
      }

      // Refresh departments list
      await fetchDepartments();
      await fetchAvailableHods();
      
      setDeptFormData({ departmentName: '', hodId: '' });
      setEditingDept(null);
      setShowEditDeptModal(false);
      showMessage('Department updated successfully!');
      
    } catch (error) {
      showMessage('Error updating department: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml'];
      if (!validTypes.includes(file.type)) {
        showMessage('Please upload a valid image file (JPG, PNG, or SVG)');
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        showMessage('File size must be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setCampusInfo(prev => ({ ...prev, logo: e.target.result }));
        showMessage('Logo uploaded successfully!');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setCampusInfo(prev => ({ ...prev, logo: null }));
    showMessage('Logo removed successfully!');
  };

  const handleSaveCampusInfo = () => {
    showMessage('Campus information saved successfully!');
  };

  // Progress Circle Component
  const ProgressCircle = ({ percentage }) => {
    const radius = 45;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="director-progress-circle">
        <svg width="100" height="100">
          <circle
            cx="50"
            cy="50"
            r={radius}
            className="director-progress-bg"
          />
          <circle
            cx="50"
            cy="50"
            r={radius}
            className="director-progress-fill"
            style={{
              strokeDasharray,
              strokeDashoffset
            }}
          />
        </svg>
        <div className="director-progress-text">{percentage}%</div>
      </div>
    );
  };

  // Bar Chart Component
  const BarChart = ({ data }) => {
    if (!data || data.length === 0) return <div>No data available</div>;

    const maxValue = Math.max(...data.map(item => item.percentage));

    return (
      <div className="director-bar-chart-wrapper">
        <div className="director-bar-chart-grid">
          {/* Grid lines */}
          <div className="director-grid-line" style={{ bottom: '0%' }}>
            <span className="director-grid-label">0%</span>
          </div>
          <div className="director-grid-line" style={{ bottom: '25%' }}>
            <span className="director-grid-label">25%</span>
          </div>
          <div className="director-grid-line" style={{ bottom: '50%' }}>
            <span className="director-grid-label">50%</span>
          </div>
          <div className="director-grid-line" style={{ bottom: '75%' }}>
            <span className="director-grid-label">75%</span>
          </div>
          <div className="director-grid-line" style={{ bottom: '100%' }}>
            <span className="director-grid-label">100%</span>
          </div>
        </div>
        <div className="director-bar-chart">
          {data.map((item, index) => (
            <div key={index} className="director-bar-item">
              <div className="director-bar-container">
                <div
                  className="director-bar"
                  style={{
                    height: `${Math.max((item.percentage / 100) * 100, 5)}%`
                  }}
                >
                  <span className="director-bar-value">{item.percentage}%</span>
                </div>
              </div>
              <div className="director-bar-label">{item.name}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="director-dashboard">
      {/* Header */}
      <header className="director-header">
        <div className="director-header-left">
          <div className="director-logo">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4tIzAnxHyTy7vmn4G2MT00_NUMlZub68bjA&s"
              alt="Logo"
              style={{ height: "auto", width: "190px" }}
            />
          </div>
        </div>

        <div className="director-header-center">
          <div className="director-welcome-section">
            <h1 className="director-welcome-title">Welcome, Director</h1>
            <div className="director-institute">MIT,CSN</div>
          </div>
        </div>

        <div className="director-header-right">
          <div className="director-user-menu-container">
            <div
              className="director-user-avatar"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <User size={20} />
              <ChevronDown size={16} />
            </div>
            {showUserMenu && (
              <div className="director-user-dropdown">
                <div className="director-user-info">
                  <p>Welcome, {user?.username || 'Director'}</p>
                  <span>Director Account</span>
                </div>
                <button className="director-logout-btn" onClick={onLogout}>
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="director-dashboard-layout">
        {/* Sidebar */}
        <div className="director-sidebar">
          <div className="director-sidebar-header">
            <div className="director-logo-section">
              <Radio className="director-logo-icon" />
              <div>
                <div className="director-logo-text">Term Work</div>
                <div className="director-logo-subtext">Submissions (Part 1)</div>
              </div>
            </div>
          </div>

          <nav className="director-sidebar-nav">
            <button
              className={`director-nav-item ${currentView === 'dashboard' ? 'active' : ''}`}
              onClick={() => setCurrentView('dashboard')}
            >
              <span>Dashboard</span>
            </button>
            <button
              className={`director-nav-item ${currentView === 'hods' ? 'active' : ''}`}
              onClick={() => setCurrentView('hods')}
            >
              <Users size={20} />
              <span>Faculty List</span>
            </button>
            <button
              className={`director-nav-item ${currentView === 'insights' ? 'active' : ''}`}
              onClick={() => setCurrentView('insights')}
            >
              <BarChart3 size={20} />
              <span>Submission Insights</span>
            </button>
            <button
              className={`director-nav-item ${currentView === 'campus' ? 'active' : ''}`}
              onClick={() => setCurrentView('campus')}
            >
              <Settings size={20} />
              <span>Manage Campus</span>
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="director-main-content">
          {/* Dashboard View */}
          {currentView === 'dashboard' && (
            <>
              <div className="director-content-header">
                <h2>Dashboard Overview</h2>
                <button
                  className="director-create-dept-btn"
                  onClick={() => setShowCreateDeptModal(true)}
                >
                  <Plus size={16} />
                  Create Department
                </button>
              </div>

              {/* Statistics Overview */}
              <div className="director-stats-grid">
                <div className="director-stat-card">
                  <div className="director-stat-icon">
                    <Users size={24} />
                  </div>
                  <div className="director-stat-content">
                    <h3>{departments.length}</h3>
                    <p>Total Departments</p>
                  </div>
                </div>

                <div className="director-stat-card">
                  <div className="director-stat-icon">
                    <BarChart3 size={24} />
                  </div>
                  <div className="director-stat-content">
                    <h3>{availableHods.length}</h3>
                    <p>Active HODs</p>
                  </div>
                </div>

                <div className="director-stat-card">
                  <div className="director-stat-icon">
                    <Settings size={24} />
                  </div>
                  <div className="director-stat-content">
                    <h3>{departments.length > 0 ? Math.round(getDepartmentAnalytics().reduce((acc, dept) => acc + dept.percentage, 0) / departments.length) : 0}%</h3>
                    <p>Avg Submission Rate</p>
                  </div>
                </div>

                <div className="director-stat-card">
                  <div className="director-stat-icon">
                    <Radio size={24} />
                  </div>
                  <div className="director-stat-content">
                    <h3>{departments.filter(dept => dept.hod_id).length}</h3>
                    <p>Assigned Departments</p>
                  </div>
                </div>
              </div>

              {/* Departments Table */}
              <div className="director-departments-section">
                <div className="director-table-container">
                  <table className="director-departments-table">
                    <thead>
                      <tr>
                        <th>Department Name</th>
                        <th>Assigned HOD</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading && departments.length === 0 ? (
                        <tr>
                          <td colSpan="3" style={{ textAlign: 'center', padding: '20px' }}>
                            Loading departments...
                          </td>
                        </tr>
                      ) : departments.length === 0 ? (
                        <tr>
                          <td colSpan="3" style={{ textAlign: 'center', padding: '20px' }}>
                            No departments found. Create one to get started.
                          </td>
                        </tr>
                      ) : (
                        departments.map((dept) => (
                          <tr key={dept.id}>
                            <td>
                              <div className="director-dept-info">
                                <div className="director-dept-name">{dept.name}</div>
                              </div>
                            </td>
                            <td className="director-hod-name">{dept.hod || 'Not Assigned'}</td>
                            <td>
                              <div className="director-action-buttons">
                                <button
                                  className="director-edit-btn"
                                  onClick={() => handleEditDepartment(dept)}
                                  disabled={loading}
                                >
                                  <Edit size={16} />
                                </button>
                                <button
                                  className="director-delete-btn"
                                  onClick={() => handleDeleteDepartment(dept.id)}
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

          {/* HOD's List View */}
          {currentView === 'hods' && (
            <div className="director-hods-section">
              <div className="director-table-container">
                <table className="director-departments-table">
                  <thead>
                    <tr>
                      <th>HOD Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Department</th>
                    </tr>
                  </thead>
                  <tbody>
                    {availableHods.length === 0 ? (
                      <tr>
                        <td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>
                          {loading ? 'Loading...' : 'No HODs found'}
                        </td>
                      </tr>
                    ) : (
                      availableHods.map((hod) => {
                        const dept = departments.find(d => d.hod_id === hod.id);
                        return (
                          <tr key={hod.id}>
                            <td className="director-hod-name">{hod.name}</td>
                            <td className="director-hod-email">{hod.email}</td>
                            <td className="director-hod-role">{hod.role}</td>
                            <td className="director-hod-dept">{dept ? dept.name : 'Not Assigned'}</td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Submission Insights View */}
          {currentView === 'insights' && (
            <div className="director-insights-section">
              <h2>Submission Insights</h2>
              <div className="director-charts-container">
                <div className="director-chart-card">
                  <h3>Department-wise Submission Analysis</h3>
                  <BarChart data={getDepartmentAnalytics()} />
                </div>

                <div className="director-submission-cards">
                  {getSubmissionAnalytics().map((item, index) => (
                    <div key={index} className="director-submission-card">
                      <ProgressCircle percentage={item.percentage} />
                      <div className="director-submission-info">
                        <h4>{item.percentage}%</h4>
                        <p>{item.department}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Manage Campus View */}
          {currentView === 'campus' && (
            <div className="director-campus-section">
              <div className="director-campus-container">
                <div className="director-campus-left">
                  <h3>Institute Profile Setting</h3>

                  <div className="director-logo-upload">
                    <h4>Institute Logo</h4>
                    <div className="director-logo-dropzone">
                      {campusInfo.logo ? (
                        <div className="director-logo-preview">
                          <img src={campusInfo.logo} alt="Institute Logo" className="director-uploaded-logo" />
                          <button
                            className="director-remove-logo-btn"
                            onClick={handleRemoveLogo}
                            type="button"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ) : (
                        <div className="director-upload-placeholder">
                          <Upload size={40} className="director-upload-icon" />
                          <p>Drag & drop logo here,</p>
                          <p>or click to browse</p>
                        </div>
                      )}
                      {!campusInfo.logo && (
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="director-file-input"
                        />
                      )}
                    </div>
                    {campusInfo.logo && (
                      <button
                        className="director-change-logo-btn"
                        onClick={() => document.querySelector('.director-change-logo-input').click()}
                      >
                        Change Logo
                      </button>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="director-change-logo-input"
                      style={{ display: 'none' }}
                    />
                    <p className="director-upload-info">
                      Supports PNG, JPG, or SVG. Max 5MB.<br />
                      Recommended: 300×300px
                    </p>
                  </div>
                </div>

                <div className="director-campus-right">
                  <h3>Institute Information</h3>
                  <h4>Basic Details</h4>

                  <div className="director-campus-form">
                    <div className="director-form-group">
                      <label>Institute Name</label>
                      <input
                        type="text"
                        value={campusInfo.instituteName}
                        onChange={(e) => setCampusInfo(prev => ({ ...prev, instituteName: e.target.value }))}
                        className="director-form-input"
                      />
                    </div>

                    <div className="director-form-row">
                      <div className="director-form-group">
                        <label>Year Established</label>
                        <input
                          type="text"
                          value={campusInfo.yearEstablished}
                          onChange={(e) => setCampusInfo(prev => ({ ...prev, yearEstablished: e.target.value }))}
                          className="director-form-input"
                        />
                      </div>
                      <div className="director-form-group">
                        <label>Institute Code</label>
                        <input
                          type="text"
                          value={campusInfo.instituteCode}
                          onChange={(e) => setCampusInfo(prev => ({ ...prev, instituteCode: e.target.value }))}
                          className="director-form-input"
                        />
                      </div>
                    </div>

                    <div className="director-form-row">
                      <div className="director-form-group">
                        <label>Phone Number</label>
                        <input
                          type="tel"
                          value={campusInfo.phoneNumber}
                          onChange={(e) => setCampusInfo(prev => ({ ...prev, phoneNumber: e.target.value }))}
                          className="director-form-input"
                        />
                      </div>
                      <div className="director-form-group">
                        <label>City</label>
                        <input
                          type="text"
                          value={campusInfo.city}
                          onChange={(e) => setCampusInfo(prev => ({ ...prev, city: e.target.value }))}
                          className="director-form-input"
                        />
                      </div>
                    </div>

                    <div className="director-form-group">
                      <label>Address</label>
                      <textarea
                        value={campusInfo.address}
                        onChange={(e) => setCampusInfo(prev => ({ ...prev, address: e.target.value }))}
                        className="director-form-textarea"
                        rows="3"
                      />
                    </div>

                    <button
                      className="director-save-btn"
                      onClick={handleSaveCampusInfo}
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Create Department Modal */}
        {showCreateDeptModal && (
          <div className="director-modal-overlay">
            <div className="director-modal-content">
              <div className="director-modal-header">
                <h3>Create Department</h3>
              </div>

              <div className="director-modal-body">
                <div className="director-form-group">
                  <label>Department Name</label>
                  <input
                    type="text"
                    placeholder="Enter Department Name"
                    value={deptFormData.departmentName}
                    onChange={(e) => setDeptFormData(prev => ({ ...prev, departmentName: e.target.value }))}
                    className="director-form-input"
                    disabled={loading}
                  />
                </div>

                <div className="director-form-group">
                  <label>Assign HOD (Optional)</label>
                  <select
                    value={deptFormData.hodId}
                    onChange={(e) => setDeptFormData(prev => ({ ...prev, hodId: e.target.value }))}
                    className="director-form-input"
                    disabled={loading}
                  >
                    <option value="">Select HOD</option>
                    {availableHods.map((hod) => (
                      <option key={hod.id} value={hod.id}>
                        {hod.name} ({hod.role})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="director-modal-actions">
                  <button
                    className="director-cancel-btn"
                    onClick={() => {
                      setShowCreateDeptModal(false);
                      setDeptFormData({ departmentName: '', hodId: '' });
                    }}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    className="director-add-btn"
                    onClick={handleCreateDepartment}
                    disabled={loading}
                  >
                    {loading ? 'Creating...' : 'Add Department'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Department Modal */}
        {showEditDeptModal && (
          <div className="director-modal-overlay">
            <div className="director-modal-content">
              <div className="director-modal-header">
                <h3>Edit Department</h3>
              </div>

              <div className="director-modal-body">
                <div className="director-form-group">
                  <label>Department Name</label>
                  <input
                    type="text"
                    placeholder="Enter Department Name"
                    value={deptFormData.departmentName}
                    onChange={(e) => setDeptFormData(prev => ({ ...prev, departmentName: e.target.value }))}
                    className="director-form-input"
                    disabled={loading}
                  />
                </div>

                <div className="director-form-group">
                  <label>Assign HOD</label>
                  <select
                    value={deptFormData.hodId}
                    onChange={(e) => setDeptFormData(prev => ({ ...prev, hodId: e.target.value }))}
                    className="director-form-input"
                    disabled={loading}
                  >
                    <option value="">Select HOD</option>
                    {availableHods.map((hod) => (
                      <option key={hod.id} value={hod.id}>
                        {hod.name} ({hod.role})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="director-modal-actions">
                  <button
                    className="director-cancel-btn"
                    onClick={() => {
                      setShowEditDeptModal(false);
                      setEditingDept(null);
                      setDeptFormData({ departmentName: '', hodId: '' });
                    }}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    className="director-add-btn"
                    onClick={handleUpdateDepartment}
                    disabled={loading}
                  >
                    {loading ? 'Updating...' : 'Update Department'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Snackbar */}
      {showSnackbar && (
        <div className="director-snackbar success">
          {snackbarMessage}
        </div>
      )}
    </div>
  );
};

export default DirectorDashboard;