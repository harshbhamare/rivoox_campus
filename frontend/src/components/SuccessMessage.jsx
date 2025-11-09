import { Check } from 'lucide-react';
import './Registration.css';

const SuccessMessage = ({ message, onBack }) => {
  return (
    <div className="auth-container">
      <div className="auth-left">
        <div className="auth-form-wrapper">
          <div className="success-content">
            <div className="success-icon">
              <Check size={60} />
            </div>
            
            <h1 className="success-title">Registration Successful!</h1>
            <p className="success-message">{message}</p>
            
            <button className="submit-button" onClick={onBack}>
              Back to Login
            </button>
          </div>
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

export default SuccessMessage;