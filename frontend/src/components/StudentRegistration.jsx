import React, { useState } from 'react';
import { User, Mail, Upload, Eye, EyeOff, ArrowLeft, Check, AlertCircle } from 'lucide-react';
import './Registration.css';

const StudentRegistration = ({ onBack, onRegister }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    uniqueId: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    idCardImage: null
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';

    // Unique ID validation
    if (!formData.uniqueId.trim()) {
      newErrors.uniqueId = 'Unique ID is required';
    } else if (!/^[A-Z0-9]{6,12}$/.test(formData.uniqueId)) {
      newErrors.uniqueId = 'Unique ID must be 6-12 characters (letters and numbers)';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!formData.email.endsWith('@mit.asia')) {
      newErrors.email = 'Email must end with @mit.asia';
    } else if (!/^[^\s@]+@mit\.asia$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
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
        type: 'student',
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
               <img
  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4tIzAnxHyTy7vmn4G2MT00_NUMlZub68bjA&s"
  alt="Logo"
  style={{ height: "65px", width: "190px" }}
/>
            </div>
            <h1>Student Registration</h1>
            <p>Create your student account</p>
          </div>

          <form onSubmit={handleSubmit} className="registration-form">
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
                <label htmlFor="uniqueId">Unique ID *</label>
                <div className="input-wrapper">
                  <User className="input-icon" size={20} />
                  <input
                    type="text"
                    id="uniqueId"
                    value={formData.uniqueId}
                    onChange={(e) => setFormData(prev => ({ ...prev, uniqueId: e.target.value.toUpperCase() }))}
                    placeholder="e.g., STU123456"
                    className={errors.uniqueId ? 'error' : ''}
                  />
                </div>
                {errors.uniqueId && <span className="error-text">{errors.uniqueId}</span>}
              </div>
            </div>

            {/* Email Field */}
            <div className="form-group">
              <label htmlFor="email">College Email *</label>
              <div className="input-wrapper">
                <Mail className="input-icon" size={20} />
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="example@mit.asia"
                  className={errors.email ? 'error' : ''}
                />
              </div>
              {errors.email && <span className="error-text">{errors.email}</span>}
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
                  Register Student
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StudentRegistration;