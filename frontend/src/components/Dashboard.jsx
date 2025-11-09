import React, { useMemo, useEffect, useState } from 'react';
import { useAppContext } from './AuthWrapper';
import './Dashboard.css';

const Dashboard = () => {
  const { students, setStudents, filters, setFilters, batches, setBatches, user } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [batchNameById, setBatchNameById] = useState({});

  // --- Fetch students & batches on mount ---
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [studentsRes, batchesRes] = await Promise.all([
          fetch('http://localhost:3000/api/class-teacher/students', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch('http://localhost:3000/api/class-teacher/batches', {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        const studentsJson = await studentsRes.json();
        const batchesJson = await batchesRes.json();

        if (!studentsRes.ok) throw new Error(studentsJson.message || 'Failed to load students');
        if (!batchesRes.ok) throw new Error(batchesJson.message || 'Failed to load batches');

        setStudents(
          (studentsJson.students || []).map(s => ({
            id: s.id,
            name: s.name,
            rollNumber: s.roll_no,
            hallTicket: s.hall_ticket_number,
            email: s.email,
            contact: s.mobile,
            batch_id: s.batch_id,
            // TEMP structure to keep UI working until you confirm TA/CIE source:
            submissions: {
              ta: 'pending',     // TODO: replace when you share where TA lives
              cie: 'pending',    // TODO: replace when you share where CIE lives
              defaulter: s.defaulter ? 'complete' : 'pending' // crude mapping
            },
            attendance_percent: s.attendance_percent,
            class_id: s.class_id,
            created_at: s.created_at
          }))
        );

        setBatches(batchesJson.batches || []);

      } catch (e) {
        console.error(e);
        // You can add a toast here if you have one
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [setStudents, setBatches]);

  // Map batch_id -> name
  useEffect(() => {
    const map = {};
    (batches || []).forEach(b => { map[b.id] = b.name; });
    setBatchNameById(map);
  }, [batches]);

  // --- Analysis cards (TEMP: based on current UI contract) ---
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
      // Category filter (TEMP mapping until TA/CIE confirmed)
      let categoryMatch = true;
      if (filters.category === 'Regular') {
        categoryMatch = !(student.submissions.ta === 'complete' && student.submissions.cie === 'complete');
      } else if (filters.category === 'Defaulter') {
        categoryMatch = student.submissions.defaulter === 'pending';
      } else if (filters.category === 'Completed') {
        categoryMatch = student.submissions.ta === 'complete' && student.submissions.cie === 'complete';
      }

      // Batch filter
      let batchMatch = true;
      if (filters.batch && filters.batch !== 'All') {
        batchMatch = batchNameById[student.batch_id] === filters.batch;
      }

      return categoryMatch && batchMatch;
    });
  }, [students, filters, batchNameById]);

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

  return (
    <div className="dashboard">
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
          <h3>Batch Wise Filter</h3>
          <div className="filter-buttons">
            <button
              className={`filter-btn ${filters.batch === 'All' ? 'active' : ''}`}
              onClick={() => setFilters(prev => ({ ...prev, batch: 'All' }))}
            >
              All
            </button>
            {(batches || []).map(batch => (
              <button
                key={batch.id}
                className={`filter-btn ${filters.batch === batch.name ? 'active' : ''}`}
                onClick={() => setFilters(prev => ({ ...prev, batch: batch.name }))}
              >
                {batch.name}
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
              <th>Percentage Submission Completed</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" style={{ textAlign: 'center', padding: 20 }}>Loading…</td></tr>
            ) : filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <tr key={student.id}>
                  <td>{student.rollNumber}</td>
                  <td>{student.name}</td>
                  <td>{batchNameById[student.batch_id] || '-'}</td>
                  <td>{calculateSubmissionPercentage(student)}%</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: '20px', color: '#5f6368' }}>
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

export default Dashboard;
