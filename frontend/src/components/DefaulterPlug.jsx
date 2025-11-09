import React, { useState } from 'react';
import { Edit, AlertTriangle, Plus, X } from 'lucide-react';
import { useAppContext } from './AuthWrapper';
import './DefaulterPlug.css';

const DefaulterPlug = () => {
  const { subjects } = useAppContext();
  const [workContent, setWorkContent] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [defaulterWorks, setDefaulterWorks] = useState([
    {
      id: 1,
      subject: 'Design and Analysis of Algorithm',
      title: '4 Previous Year Question Papers',
      content: 'Solve the previous year question papers and submit the solutions.',
      isEnabled: true
    }
  ]);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [editingWork, setEditingWork] = useState(null);

  const showMessage = (message) => {
    setSnackbarMessage(message);
    setShowSnackbar(true);
    setTimeout(() => setShowSnackbar(false), 3000);
  };

  const addDefaulterWork = () => {
    if (workContent.trim() && selectedSubject) {
      const newWork = {
        id: Date.now(),
        subject: selectedSubject,
        title: `Work ${defaulterWorks.length + 1}`,
        content: workContent,
        isEnabled: true
      };
      setDefaulterWorks(prev => [...prev, newWork]);
      setWorkContent('');
      setSelectedSubject('');
      showMessage('Defaulter work added successfully!');
    } else {
      showMessage('Please select a subject and enter work content.');
    }
  };

  const updateDefaulterWork = (id, updatedWork) => {
    setDefaulterWorks(prev => prev.map(work => 
      work.id === id ? { ...work, ...updatedWork } : work
    ));
    setEditingWork(null);
    showMessage('Defaulter work updated successfully!');
  };

  const deleteDefaulterWork = (id) => {
    setDefaulterWorks(prev => prev.filter(work => work.id !== id));
    showMessage('Defaulter work deleted successfully!');
  };

  const toggleWorkStatus = (id) => {
    setDefaulterWorks(prev => prev.map(work => 
      work.id === id ? { ...work, isEnabled: !work.isEnabled } : work
    ));
    showMessage('Work status updated successfully!');
  };

  const EditWorkModal = ({ work, onSave, onClose }) => {
    const [editContent, setEditContent] = useState(work.content);
    const [editTitle, setEditTitle] = useState(work.title);

    const handleSave = () => {
      onSave(work.id, { title: editTitle, content: editContent });
    };

    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="modal-header">
            <h3>Edit Defaulter Work</h3>
            <button className="close-btn" onClick={onClose}>
              <X size={20} />
            </button>
          </div>
          <div className="modal-body">
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Content</label>
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="work-textarea"
                rows="6"
              />
            </div>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={onClose}>Cancel</button>
              <button className="save-btn" onClick={handleSave}>Save Changes</button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="defaulter-plug">
      <h2>Manage Defaulter Work</h2>
      
      {/* Add New Work Section */}
      <div className="add-work-section">
        <div className="section-header">
          <Plus size={20} />
          <span>Add New Defaulter Work</span>
        </div>
        
        <div className="add-work-form">
          <div className="form-row">
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="subject-select"
            >
              <option value="">Select Subject</option>
              {subjects.theory.map(subject => (
                <option key={subject.id} value={subject.name}>
                  {subject.name}
                </option>
              ))}
              {subjects.practical.map(subject => (
                <option key={`practical-${subject.id}`} value={`${subject.name} (Practical)`}>
                  {subject.name} (Practical)
                </option>
              ))}
            </select>
          </div>
          
          <textarea
            placeholder="Write defaulter work description here..."
            value={workContent}
            onChange={(e) => setWorkContent(e.target.value)}
            className="work-textarea"
            rows="4"
          />
          
          <button className="add-work-btn" onClick={addDefaulterWork}>
            <Plus size={16} />
            Add Defaulter Work
          </button>
        </div>
      </div>

      {/* Existing Works */}
      <div className="existing-works">
        <h3>Existing Defaulter Works</h3>
        
        {defaulterWorks.map(work => (
          <div key={work.id} className="defaulter-work-section">
            <div className="work-header">
              <h4>{work.subject}</h4>
              <div className="work-status">
                <button 
                  className={`status-toggle ${work.isEnabled ? 'enabled' : 'disabled'}`}
                  onClick={() => toggleWorkStatus(work.id)}
                >
                  {work.isEnabled ? 'Enabled' : 'Disabled'}
                </button>
              </div>
            </div>
            
            <div className="work-form">
              <div className="form-header">
                <span>{work.title}</span>
                <div className="form-actions">
                  <button 
                    className="edit-btn"
                    onClick={() => setEditingWork(work)}
                  >
                    <Edit size={14} />
                    Edit
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={() => deleteDefaulterWork(work.id)}
                  >
                    <X size={14} />
                    Delete
                  </button>
                </div>
              </div>
              
              <div className="work-content-display">
                <p>{work.content}</p>
              </div>
            </div>
          </div>
        ))}
        
        {defaulterWorks.length === 0 && (
          <div className="no-works">
            <p>No defaulter works created yet. Add one above to get started.</p>
          </div>
        )}
      </div>

      {editingWork && (
        <EditWorkModal
          work={editingWork}
          onSave={updateDefaulterWork}
          onClose={() => setEditingWork(null)}
        />
      )}

      {showSnackbar && (
        <div className="snackbar success">
          {snackbarMessage}
        </div>
      )}
    </div>
  );
};

export default DefaulterPlug;