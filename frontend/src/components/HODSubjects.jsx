import { useState, useEffect } from 'react';
import { BookOpen, Plus, X } from 'lucide-react';
import './HODSubjects.css';

const API_BASE = 'http://localhost:3000';

const HODSubjects = () => {
  const [loading, setLoading] = useState(false);
  const [faculties, setFaculties] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Form states for each subject type
  const [mdmForm, setMdmForm] = useState({
    subjectCode: '',
    subjectName: '',
    type: 'MDM',
    facultyIds: [],
    semester: '',
    year: ''
  });

  const [oeForm, setOeForm] = useState({
    subjectCode: '',
    subjectName: '',
    type: 'OE',
    facultyIds: [],
    semester: '',
    year: ''
  });

  const [peForm, setPeForm] = useState({
    subjectCode: '',
    subjectName: '',
    type: 'PE',
    facultyIds: [],
    semester: '',
    year: ''
  });

  useEffect(() => {
    fetchFaculties();
    fetchSubjects();
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  const fetchFaculties = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/hod/class-teachers`, {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      
      if (data.success) {
        setFaculties(data.teachers || []);
      }
    } catch (error) {
      console.error('Error fetching faculties:', error);
    }
  };

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/api/hod/offered-subjects`, {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      
      if (data.success) {
        setSubjects(data.subjects || []);
      }
    } catch (error) {
      console.error('Error fetching subjects:', error);
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (message) => {
    setSnackbarMessage(message);
    setShowSnackbar(true);
    setTimeout(() => setShowSnackbar(false), 3000);
  };

  const deleteSubject = async (id) => {
    if (!window.confirm('Are you sure you want to delete this subject?')) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/api/hod/offered-subjects/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      const data = await response.json();

      if (data.success) {
        showMessage('Subject deleted successfully!');
        fetchSubjects();
      } else {
        showMessage(data.error || 'Failed to delete subject');
      }
    } catch (error) {
      showMessage('Error deleting subject: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFacultyToggle = (facultyId, formType) => {
    const setForm = formType === 'MDM' ? setMdmForm : formType === 'OE' ? setOeForm : setPeForm;
    
    setForm(prev => {
      const currentIds = prev.facultyIds || [];
      const newIds = currentIds.includes(facultyId)
        ? currentIds.filter(id => id !== facultyId)
        : [...currentIds, facultyId];
      
      return { ...prev, facultyIds: newIds };
    });
  };

  const addSubject = async (formData, formType) => {
    const { subjectCode, subjectName, type, facultyIds, semester, year } = formData;

    if (!subjectCode || !subjectName || !facultyIds.length || !semester || !year) {
      showMessage('Please fill all fields and select at least one faculty');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/api/hod/add-offered-subject`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          name: subjectName,
          subject_code: subjectCode,
          type: type,
          faculty_ids: facultyIds,
          semester: parseInt(semester),
          year: parseInt(year)
        })
      });

      const data = await response.json();

      if (data.success) {
        showMessage(`${type} subject added successfully!`);
        // Reset form
        if (formType === 'MDM') {
          setMdmForm({ subjectCode: '', subjectName: '', type: 'MDM', facultyIds: [], semester: '', year: '' });
        } else if (formType === 'OE') {
          setOeForm({ subjectCode: '', subjectName: '', type: 'OE', facultyIds: [], semester: '', year: '' });
        } else {
          setPeForm({ subjectCode: '', subjectName: '', type: 'PE', facultyIds: [], semester: '', year: '' });
        }
        // Refresh subjects list
        fetchSubjects();
      } else {
        showMessage(data.error || 'Failed to add subject');
      }
    } catch (error) {
      showMessage('Error adding subject: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderSubjectCard = (title, formData, setFormData, formType) => (
    <div className="subject-form-card">
      <div className="form-header">
        <BookOpen size={20} />
        <span>{title}</span>
      </div>

      <div className="form-fields">
        <div className="form-group">
          <label>Subject Code</label>
          <input
            type="text"
            placeholder="e.g., PE22"
            value={formData.subjectCode}
            onChange={(e) => setFormData(prev => ({ ...prev, subjectCode: e.target.value }))}
            className="form-input"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>Subject Name</label>
          <input
            type="text"
            placeholder="e.g., Human Computer Interaction"
            value={formData.subjectName}
            onChange={(e) => setFormData(prev => ({ ...prev, subjectName: e.target.value }))}
            className="form-input"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>Type</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
            className="form-select"
            disabled={loading}
          >
            <option value="PE">PE (Professional Elective)</option>
            <option value="MDM">MDM (Multidisciplinary Minor)</option>
            <option value="OE">OE (Open Elective)</option>
          </select>
        </div>

        <div className="form-group">
          <label>Select Faculties (Multiple)</label>
          <div className="faculty-checkboxes">
            {faculties.length === 0 ? (
              <p className="no-faculties">No faculties available</p>
            ) : (
              faculties.map((faculty) => (
                <label key={faculty.id} className="faculty-checkbox">
                  <input
                    type="checkbox"
                    checked={formData.facultyIds.includes(faculty.id)}
                    onChange={() => handleFacultyToggle(faculty.id, formType)}
                    disabled={loading}
                  />
                  <span>{faculty.name}</span>
                </label>
              ))
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Semester</label>
            <select
              value={formData.semester}
              onChange={(e) => setFormData(prev => ({ ...prev, semester: e.target.value }))}
              className="form-select"
              disabled={loading}
            >
              <option value="">Select Semester</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                <option key={sem} value={sem}>Semester {sem}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Year</label>
            <select
              value={formData.year}
              onChange={(e) => setFormData(prev => ({ ...prev, year: e.target.value }))}
              className="form-select"
              disabled={loading}
            >
              <option value="">Select Year</option>
              <option value="1">First Year</option>
              <option value="2">Second Year</option>
              <option value="3">Third Year</option>
              <option value="4">Fourth Year</option>
            </select>
          </div>
        </div>

        <button 
          className="add-subject-btn" 
          onClick={() => addSubject(formData, formType)}
          disabled={loading}
        >
          <Plus size={16} />
          {loading ? 'Adding...' : `Add ${formType} Subject`}
        </button>
      </div>
    </div>
  );

  return (
    <div className="hod-subjects">
      <div className="hod-subjects-header">
        <h2>Elective Subjects Management</h2>
        <p>Add MDM, OE, and PE subjects for your department</p>
      </div>

      <div className="subjects-grid">
        {renderSubjectCard('MDM (Multidisciplinary Minor)', mdmForm, setMdmForm, 'MDM')}
        {renderSubjectCard('OE (Open Elective)', oeForm, setOeForm, 'OE')}
        {renderSubjectCard('PE (Professional Elective)', peForm, setPeForm, 'PE')}
      </div>

      {/* Subjects Table */}
      <div className="subjects-table-section">
        <div className="table-header">
          <h3>Added Subjects</h3>
          <span className="subject-count">{subjects.length} Subject{subjects.length !== 1 ? 's' : ''}</span>
        </div>

        <div className="table-container">
          <table className="subjects-table">
            <thead>
              <tr>
                <th>Subject Code</th>
                <th>Subject Name</th>
                <th>Type</th>
                <th>Faculties</th>
                <th>Semester</th>
                <th>Year</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading && subjects.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>
                    Loading subjects...
                  </td>
                </tr>
              ) : subjects.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '20px' }}>
                    No subjects added yet. Add subjects using the forms above.
                  </td>
                </tr>
              ) : (
                subjects.map((subject) => (
                  <tr key={subject.id}>
                    <td>
                      <span className="subject-code-badge">{subject.subject_code}</span>
                    </td>
                    <td className="subject-name-cell">{subject.subject_name}</td>
                    <td>
                      <span className={`type-badge type-${subject.type.toLowerCase()}`}>
                        {subject.type}
                      </span>
                    </td>
                    <td className="faculties-cell">
                      {subject.faculties.length > 0 ? (
                        <div className="faculty-list">
                          {subject.faculties.map((faculty, idx) => (
                            <span key={idx} className="faculty-tag">
                              {faculty}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="no-faculty">No faculty assigned</span>
                      )}
                    </td>
                    <td>Semester {subject.semester}</td>
                    <td>
                      {subject.year === 1 ? 'First Year' :
                       subject.year === 2 ? 'Second Year' :
                       subject.year === 3 ? 'Third Year' :
                       subject.year === 4 ? 'Fourth Year' :
                       `Year ${subject.year}`}
                    </td>
                    <td>
                      <button
                        className="delete-subject-btn"
                        onClick={() => deleteSubject(subject.id)}
                        disabled={loading}
                      >
                        <X size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showSnackbar && (
        <div className="snackbar success">
          {snackbarMessage}
        </div>
      )}
    </div>
  );
};

export default HODSubjects;
