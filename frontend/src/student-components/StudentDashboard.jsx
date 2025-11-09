import { Check, Clock } from 'lucide-react';
import { useStudentContext } from './StudentApp';
import './StudentDashboard.css';

const StudentDashboard = () => {
  const { studentData, subjects } = useStudentContext();

  const ProgressCircle = ({ percentage }) => {
    const radius = 45;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="submission-progress-circle">
        <svg width="100" height="100">
          <circle
            cx="50"
            cy="50"
            r={radius}
            className="progress-bg"
          />
          <circle
            cx="50"
            cy="50"
            r={radius}
            className="progress-fill"
            style={{
              strokeDasharray,
              strokeDashoffset
            }}
          />
        </svg>
        <div className="progress-percentage">{percentage}%</div>
      </div>
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return '#34a853';
      case 'pending':
        return '#ea4335';
      default:
        return '#5f6368';
    }
  };

  const getStatusIcon = (status) => {
    if (status === 'completed') {
      return <Check size={16} className="status-icon completed" />;
    }
    return <Clock size={16} className="status-icon pending" />;
  };

  const getAvailabilityDot = (status) => {
    const isAvailable = status === 'completed';
    return (
      <span
        className={`availability-dot ${isAvailable ? 'available' : 'unavailable'}`}
      >
        ●
      </span>
    );
  };

  const getStatusText = (status) => {
    return status === 'completed' ? 'Completed' : 'Pending';
  };

  return (
    <div className="submission-status">
      <div className="status-header">
        <div className="defaulter-status-badge">
          Defaulter
        </div>

        <div className="completion-summary-left">
          <ProgressCircle percentage={studentData.submissionPercentage} />
          <div className="completion-text">
            <div className="completion-label">Submission completed</div>
          </div>
        </div>

        <div className="status-info-right">
          <div className="online-status">
            {/* <span className="status-indicator online">● Online</span> */}
          </div>
        </div>
      </div>

      <div className="submissions-table-container">
        <table className="submissions-table">
          <thead>
            <tr>
              <th>Subject Code</th>
              <th>Subject Name</th>
              <th colSpan="3">Submission</th>
            </tr>
            <tr className="sub-header">
              <th></th>
              <th></th>
              <th>CIE</th>
              <th>TA</th>
              <th>Defaulter</th>
            </tr>
          </thead>
          <tbody>
            {subjects.map((subject, index) => (
              <tr key={index}>
                <td className="subject-code-cell">{subject.code}</td>
                <td className="subject-name-cell">
                  {getAvailabilityDot(subject.submissions.cie)}
                  {subject.name}
                </td>
                <td className="status-cell">
                  <span className={`status-badge ${subject.submissions.cie}`}>
                    {getStatusIcon(subject.submissions.cie)}
                    {getStatusText(subject.submissions.cie)}
                  </span>
                </td>
                <td className="status-cell">
                  <span className={`status-badge ${subject.submissions.ta}`}>
                    {getStatusIcon(subject.submissions.ta)}
                    {getStatusText(subject.submissions.ta)}
                  </span>
                </td>
                <td className="status-cell">
                  <span className={`status-badge ${subject.submissions.defaulter}`}>
                    {getStatusIcon(subject.submissions.defaulter)}
                    {getStatusText(subject.submissions.defaulter)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentDashboard;