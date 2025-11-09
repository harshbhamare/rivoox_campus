import { useState } from 'react';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import './Registration.css';

const API_BASE = 'http://localhost:3000';

const Registration = ({ onBack, onRegisterSuccess }) => {
  const [formData, setFormData] = useState({
    role: '',
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const roles = [
    { value: 'class_teacher', label: 'Class Teacher' },
    { value: 'student', label: 'Student' },
    { value: 'hod', label: 'HOD' },
    { value: 'director', label: 'Director' },
    { value: 'faculty', label: 'Faculty' }
  ];

  const validateForm = () => {
    if (!formData.role) {
      setError('Please select a role');
      return false;
    }
    if (!formData.name.trim()) {
      setError('Name is required');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email');
      return false;
    }
    if (!formData.password) {
      setError('Password is required');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          department_id: null
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Registration successful, redirect to login
        onRegisterSuccess();
      } else {
        setError(data.error || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setError('Server error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-left">
        <button className="back-button" onClick={onBack}>
          <ArrowLeft size={20} />
          Back to Login
        </button>

        <div className="auth-form-wrapper">
          <div className="auth-header">
            <h1>Create Your Account</h1>
            <p>Join Rivoox Campus</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-field">
              <label>I am registering as a</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                className="form-select"
                required
              >
                <option value="">Select Role</option>
                {roles.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-field">
              <label>Name</label>
              <input
                type="text"
                placeholder="Enter Your Name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="form-input"
                required
              />
            </div>

            <div className="form-field">
              <label>Email</label>
              <input
                type="email"
                placeholder="Enter Your Email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="form-input"
                required
              />
            </div>

            <div className="form-field">
              <label>Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter Your Password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="form-input"
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="form-field">
              <label>Confirm Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm Your Password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="form-input"
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>

            <div className="auth-footer">
              Already have an account? <button type="button" onClick={onBack} className="link-button">Log in here</button>
            </div>
          </form>
        </div>
      </div>

      <div className="auth-right">
        <div className="brand-text">
          <div className="brand-line">RIVOOX</div>
          <div className="brand-line">RIVOOX</div>
          <div className="brand-line">RIVOOX</div>
          <div className="brand-line">RIVOOX</div>
          <div className="brand-line">RIVOOX</div>
        </div>
        <div className="brand-footer">Rivoox Solutions</div>
      </div>
    </div>
  );
};

export default Registration;
