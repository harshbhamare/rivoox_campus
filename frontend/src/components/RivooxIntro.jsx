import { useState } from 'react';
import './RivooxIntro.css';

const RivooxIntro = ({ onComplete }) => {
  const [stage, setStage] = useState('button');

  const handleEnter = () => {
    setStage('strike');
    
    // Show logo reveal after lightning strike completes
    setTimeout(() => {
      setStage('reveal');
    }, 2000);
    
    // Fade out
    setTimeout(() => {
      setStage('fadeout');
    }, 5000);
    
    // Complete transition
    setTimeout(() => {
      if (onComplete) onComplete();
    }, 6000);
  };

  return (
    <div className={`rivoox-intro stage-${stage}`}>
      <div className="intro-bg"></div>
      
      {/* Button Stage */}
      {stage === 'button' && (
        <div className="button-stage">
          <button className="lightning-btn" onClick={handleEnter}>
            <span className="bolt-icon">⚡</span>
            <div className="electric-ring"></div>
          </button>
          <div className="click-text">Click Here</div>
        </div>
      )}
      
      {/* Lightning Strike */}
      {stage === 'strike' && (
        <>
          <div className="lightning-strike main-strike"></div>
          <div className="impact-flash"></div>
          <div className="electric-waves"></div>
        </>
      )}
      
      {/* Logo Reveal */}
      {(stage === 'reveal' || stage === 'fadeout') && (
        <div className="reveal-stage">
          <div className="particles-container">
            {[...Array(25)].map((_, i) => (
              <div 
                key={i} 
                className="particle"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${3 + Math.random() * 4}s`
                }}
              />
            ))}
          </div>
          
          <h1 className="rivoox-logo">
            <span className="logo-letter">R</span>
            <span className="logo-letter">I</span>
            <span className="logo-letter">V</span>
            <span className="logo-letter">O</span>
            <span className="logo-letter">O</span>
            <span className="logo-letter">X</span>
          </h1>
          
          <div className="tagline">Campus Management System</div>
          
          <div className="energy-orbs">
            <div className="orb orb-1"></div>
            <div className="orb orb-2"></div>
            <div className="orb orb-3"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RivooxIntro;
