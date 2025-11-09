import React, { useState } from 'react';
import { User, Phone, Upload, Eye, EyeOff, ArrowLeft, Check, Building } from 'lucide-react';
import './Registration.css';

const StaffRegistration = ({ onBack, onRegister }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    mobileNumber: '',
    department: '',
    role: 'teacher', // teacher, hod
    username: '',
    password: '',
    confirmPassword: '',
    idCardImage: null
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const departments = [
    'Computer Science',
    'Information Technology', 
    'Emerging Science & Technology',
    'Civil Engineering',
    'Mechanical Engineering',
    'Electronics Engineering',
    'Mathematics',
    'Physics',
    'Chemistry'
  ];

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';

    // Mobile number validation
    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = 'Mobile number is required';
    } else if (!/^[6-9]\d{9}$/.test(formData.mobileNumber)) {
      newErrors.mobileNumber = 'Please enter a valid 10-digit mobile number';
    }

    // Department validation
    if (!formData.department) {
      newErrors.department = 'Department is required';
    }

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 4) {
      newErrors.username = 'Username must be at least 4 characters';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // ID Card validation
    if (!formData.idCardImage) {
      newErrors.idCardImage = 'ID card image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    
    // Simulate registration process
    setTimeout(() => {
      onRegister({
        ...formData,
        type: formData.role,
        registrationDate: new Date().toISOString()
      });
      setLoading(false);
    }, 2000);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, idCardImage: 'Please upload a valid image (JPG, PNG)' }));
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, idCardImage: 'File size must be less than 5MB' }));
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({ ...prev, idCardImage: event.target.result }));
        setErrors(prev => ({ ...prev, idCardImage: null }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="registration-container">
      <div className="registration-background">
        <div className="registration-overlay"></div>
      </div>
      
      <div className="registration-content">
        <div className="registration-card">
          <div className="registration-header">
            <button className="back-btn" onClick={onBack}>
              <ArrowLeft size={20} />
            </button>
            <div className="registration-logo">
              <span className="logo-mil">Mil</span>
              <span className="logo-csn">CSN</span>
            </div>
            <h1>Staff Registration</h1>
            <p>Create your staff account</p>
          </div>

          <form onSubmit={handleSubmit} className="registration-form">
            {/* Role Selection */}
            <div className="form-group">
              <label>Role *</label>
              <div className="role-selection">
                <label className="role-option">
                  <input
                    type="radio"
                    name="role"
                    value="teacher"
                    checked={formData.role === 'teacher'}
                    onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                  />
                  <span>Teacher</span>
                </label>
                <label className="role-option">
                  <input
                    type="radio"
                    name="role"
                    value="hod"
                    checked={formData.role === 'hod'}
                    onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                  />
                  <span>Head of Department (HOD)</span>
                </label>
              </div>
            </div>

            {/* Name Fields */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First Name *</label>
                <div className="input-wrapper">
                  <User className="input-icon" size={20} />
                  <input
                    type="text"
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                    placeholder="Enter first name"
                    className={errors.firstName ? 'error' : ''}
                  />
                </div>
                {errors.firstName && <span className="error-text">{errors.firstName}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="middleName">Middle Name</label>
                <div className="input-wrapper">
                  <User className="input-icon" size={20} />
                  <input
                    type="text"
                    id="middleName"
                    value={formData.middleName}
                    onChange={(e) => setFormData(prev => ({ ...prev, middleName: e.target.value }))}
                    placeholder="Enter middle name"
                  />
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="lastName">Last Name *</label>
                <div className="input-wrapper">
                  <User className="input-icon" size={20} />
                  <input
                    type="text"
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                    placeholder="Enter last name"
                    className={errors.lastName ? 'error' : ''}
                  />
                </div>
                {errors.lastName && <span className="error-text">{errors.lastName}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="mobileNumber">Mobile Number *</label>
                <div className="input-wrapper">
                  <Phone className="input-icon" size={20} />
                  <input
                    type="tel"
                    id="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, mobileNumber: e.target.value }))}
                    placeholder="Enter 10-digit mobile number"
                    className={errors.mobileNumber ? 'error' : ''}
                  />
                </div>
                {errors.mobileNumber && <span className="error-text">{errors.mobileNumber}</span>}
              </div>
            </div>

            {/* Department Selection */}
            <div className="form-group">
              <label htmlFor="department">Department *</label>
              <div className="input-wrapper">
                <Building className="input-icon" size={20} />
                <select
                  id="department"
                  value={formData.department}
                  onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                  className={errors.department ? 'error' : ''}
                >
                  <option value="">Select Department</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              {errors.department && <span className="error-text">{errors.department}</span>}
            </div>

            {/* ID Card Upload */}
            <div className="form-group">
              <label>Identity Card Image *</label>
              <div className="upload-area">
                {formData.idCardImage ? (
                  <div className="uploaded-image">
                    <img src={formData.idCardImage} alt="ID Card" />
                    <button 
                      type="button" 
                      className="remove-image"
                      onClick={() => setFormData(prev => ({ ...prev, idCardImage: null }))}
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div className="upload-placeholder">
                    <Upload size={40} />
                    <p>Click to upload ID card image</p>
                    <span>JPG, PNG (Max 5MB)</span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="file-input"
                />
              </div>
              {errors.idCardImage && <span className="error-text">{errors.idCardImage}</span>}
            </div>

            {/* Username and Password */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="username">Username *</label>
                <div className="input-wrapper">
                  <User className="input-icon" size={20} />
                  <input
                    type="text"
                    id="username"
                    value={formData.username}
                    onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                    placeholder="Choose username"
                    className={errors.username ? 'error' : ''}
                  />
                </div>
                {errors.username && <span className="error-text">{errors.username}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="password">Password *</label>
                <div className="input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Create password"
                    className={errors.password ? 'error' : ''}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && <span className="error-text">{errors.password}</span>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password *</label>
              <div className="input-wrapper">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  placeholder="Confirm password"
                  className={errors.confirmPassword ? 'error' : ''}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
            </div>

            <button type="submit" className="register-btn" disabled={loading}>
              {loading ? (
                <div className="loading-spinner"></div>
              ) : (
                <>
                  <Check size={20} />
                  Register {formData.role === 'hod' ? 'HOD' : 'Teacher'}
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StaffRegistration;