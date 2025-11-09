import { useMemo, useEffect, useState } from 'react';
import { useAppContext } from './AuthWrapper';
import './FacultyDashboard.css';

const FacultyDashboard = () => {
  const { students, setStudents, filters, setFilters } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('All');

  // --- Fetch faculty subjects and students on mount ---
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch subjects assigned to this faculty
        const subjectsRes = await fetch('http://localhost:3000/api/faculty/subjects', {
          headers: { Authorization: `Bearer ${token}` }
        });

        const subjectsJson = await subjectsRes.json();

        if (!subjectsRes.ok) {
          const errorMsg = subjectsJson.error || subjectsJson.message || 'Failed to load subjects';
          console.error('Subjects API Error:', errorMsg);
          
          if (errorMsg.includes('class_id') || errorMsg.includes('assigned')) {
            setError('Your account is not assigned to any subjects yet. Please contact your administrator to assign you to subjects.');
            setLoading(false);
            return;
          }
          throw new Error(errorMsg);
        }

        const facultySubjects = subjectsJson.subjects || [];
        setSubjects(facultySubjects);

        // Fetch all students for the assigned subjects
        const studentsRes = await fetch('http://localhost:3000/api/faculty/students', {
          headers: { Authorization: `Bearer ${token}` }
        });

        const studentsJson = await studentsRes.json();

        if (!studentsRes.ok) {
          const errorMsg = studentsJson.error || studentsJson.message || 'Failed to load students';
          console.error('Students API Error:', errorMsg);
          throw new Error(errorMsg);
        }

        setStudents(
          (studentsJson.students || []).map(s => ({
            id: s.id,
            name: s.name,
            rollNumber: s.roll_no,
            hallTicket: s.hall_ticket_number,
            email: s.email,
            contact: s.mobile,
            batch_id: s.batch_id,
            batch_name: s.batch_name,
            subject_id: s.subject_id,
            subject_name: s.subject_name,
            subject_code: s.subject_code,
            submissions: {
              ta: 'pending',
              cie: 'pending',
              defaulter: s.defaulter ? 'complete' : 'pending'
            },
            attendance_percent: s.attendance_percent,
            class_id: s.class_id,
            created_at: s.created_at
          }))
        );

      } catch (e) {
        console.error(e);
        setError(e.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [setStudents]);

  // --- Analysis cards ---
  const analysisData = useMemo(() => {
    const total = students.length;

    const submittedCount = students.filter(s =>
      s.submissions.ta === 'complete' || s.submissions.cie === 'complete'
    ).length;

    const markedCount = students.filter(s =>
      s.submissions.ta === 'complete' && s.submissions.cie === 'complete'
    ).length;

    const defaulterCount = students.filter(s =>
      s.submissions.defaulter === 'complete'
    ).length;

    return [
      {
        title: 'Overall Class Analysis',
        percentage: total > 0 ? Math.round((submittedCount / total) * 100) : 0,
        subtitle: 'Submission'
      },
      {
        title: 'Self Taught Subject Analysis',
        percentage: total > 0 ? Math.round((markedCount / total) * 100) : 0,
        subtitle: 'Submission Marked'
      },
      {
        title: 'Defaulters Analysis',
        percentage: total > 0 ? Math.round((defaulterCount / total) * 100) : 0,
        subtitle: 'Defaulter Work Submitted'
      }
    ];
  }, [students]);

  // --- Filters ---
  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      let categoryMatch = true;
      if (filters.category === 'Regular') {
        categoryMatch = !(student.submissions.ta === 'complete' && student.submissions.cie === 'complete');
      } else if (filters.category === 'Defaulter') {
        categoryMatch = student.submissions.defaulter === 'pending';
      } else if (filters.category === 'Completed') {
        categoryMatch = student.submissions.ta === 'complete' && student.submissions.cie === 'complete';
      }

      let subjectMatch = true;
      if (selectedSubject && selectedSubject !== 'All') {
        subjectMatch = student.subject_name === selectedSubject;
      }

      return categoryMatch && subjectMatch;
    });
  }, [students, filters.category, selectedSubject]);

  const calculateSubmissionPercentage = (student) => {
    const submissions = Object.values(student.submissions);
    const completed = submissions.filter(s => s === 'complete').length;
    return Math.round((completed / submissions.length) * 100);
  };

  const ProgressCircle = ({ percentage, title, subtitle }) => {
    const radius = 35;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="analysis-card">
        <div className="progress-circle">
          <svg width="80" height="80">
            <circle cx="40" cy="40" r={radius} className="progress-circle-bg" />
            <circle
              cx="40"
              cy="40"
              r={radius}
              className="progress-circle-fill"
              style={{ strokeDasharray, strokeDashoffset }}
            />
          </svg>
          <div className="progress-text">{percentage}%</div>
        </div>
        <div className="analysis-info">
          <div className="analysis-subtitle">{subtitle}</div>
          <div className="analysis-title">{title}</div>
        </div>
      </div>
    );
  };

  if (error) {
    return (
      <div className="faculty-dashboard">
        <div className="error-container" style={{
          padding: '40px',
          textAlign: 'center',
          backgroundColor: '#fff',
          borderRadius: '12px',
          margin: '20px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ color: '#dc3545', marginBottom: '20px' }}>⚠️ Access Error</h2>
          <p style={{ fontSize: '16px', color: '#666', marginBottom: '20px' }}>{error}</p>
          <p style={{ fontSize: '14px', color: '#999' }}>
            Please contact your administrator to resolve this issue.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="faculty-dashboard">
      <div className="analysis-section">
        <div className="analysis-grid">
          {analysisData.map((item, index) => (
            <ProgressCircle
              key={index}
              percentage={item.percentage}
              title={item.title}
              subtitle={item.subtitle}
            />
          ))}
        </div>
      </div>

      <div className="filters-section">
        <div className="filter-group">
          <h3>Category Wise Filter</h3>
          <div className="filter-buttons">
            {['Regular', 'Defaulter', 'Completed'].map(category => (
              <button
                key={category}
                className={`filter-btn ${filters.category === category ? 'active' : ''}`}
                onClick={() => setFilters(prev => ({ ...prev, category }))}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <h3>Subject Wise Filter</h3>
          <div className="filter-buttons">
            <button
              className={`filter-btn ${selectedSubject === 'All' ? 'active' : ''}`}
              onClick={() => setSelectedSubject('All')}
            >
              All Subjects
            </button>
            {subjects.map(subject => (
              <button
                key={subject.id}
                className={`filter-btn ${selectedSubject === subject.name ? 'active' : ''}`}
                onClick={() => setSelectedSubject(subject.name)}
              >
                {subject.code} - {subject.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="student-table-section">
        <table className="student-table">
          <thead>
            <tr>
              <th>Roll Number</th>
              <th>Name of Student</th>
              <th>Batch</th>
              <th>Subject</th>
              <th>Percentage Submission Completed</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: 20 }}>Loading…</td></tr>
            ) : filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <tr key={`${student.id}-${student.subject_id}`}>
                  <td>{student.rollNumber}</td>
                  <td>{student.name}</td>
                  <td>{student.batch_name || '-'}</td>
                  <td>{student.subject_code ? `${student.subject_code} - ${student.subject_name}` : '-'}</td>
                  <td>{calculateSubmissionPercentage(student)}%</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: '#5f6368' }}>
                  No students found for the selected filters
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FacultyDashboard;
