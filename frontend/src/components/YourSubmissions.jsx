import './YourSubmissions.css';

const YourSubmissions = () => {
  const submissionData = Array(9).fill({
    percentage: 86,
    status: '10/20',
    subject: 'Design and Analysis of Algorithm',
    // statusText: 'Defaulter Work Status'
  });

  const ProgressCircle = ({ percentage }) => {
    const radius = 35;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="submission-progress-circle">
        <svg width="80" height="80">
          <circle
            cx="40"
            cy="40"
            r={radius}
            className="progress-circle-bg"
          />
          <circle
            cx="40"
            cy="40"
            r={radius}
            className="progress-circle-fill"
            style={{
              strokeDasharray,
              strokeDashoffset
            }}
          />
        </svg>
        <div className="progress-text">{percentage}%</div>
      </div>
    );
  };

  return (
    <div className="your-submissions">
      <h2>Track Submissions</h2>

      <div className="submissions-grid">
        {submissionData.map((item, index) => (
          <div key={index} className="submission-card">
            <div className="defaulter-badge">Defaulter</div>
            
            <div className="card-content">
              <div className="left-section">
                <ProgressCircle percentage={item.percentage} />
              </div>
              
              <div className="right-section">
                <div className="submission-info">
                  <div className="submission-status">{item.status}</div>
                  <div className="submission-label">{item.statusText}</div>
                  <div className="submission-confirmed">Submission Confirmed</div>
                </div>
              </div>
            </div>
            
            <div className="subject-tag">
              {item.subject}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default YourSubmissions;