import React from 'react';
import { Calendar, FileText } from 'lucide-react';
import { useStudentContext } from './StudentApp';
import './DefaulterWork.css';

const DefaulterWork = () => {
  const { defaulterWorks } = useStudentContext();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="defaulter-work">
      <div className="defaulter-work-header">
        <h2>Defaulter Work Assignments</h2>
        <p>Complete your pending assignments before the due date</p>
      </div>

      <div className="defaulter-work-grid">
        {defaulterWorks.map((work) => {
          return (
            <div key={work.id} className={`defaulter-work-item ${work.status}`}>
              <div className="work-item-header">
                <div className="subject-info">
                  <div className="subject-code">{work.subjectCode}</div>
                  <div className="subject-name">{work.subjectName}</div>
                </div>
                <div className={`status-indicator ${work.status}`}>
                  {work.status === 'completed' && '✓'}
                  {work.status === 'pending' && '○'}
                </div>
              </div>

              <div className="work-item-content">
                <div className="work-description">
                  <FileText size={16} />
                  <p>{work.description}</p>
                </div>

                <div className="work-item-footer">
                  <div className="due-date">
                    <Calendar size={14} />
                    <span>Due: {formatDate(work.dueDate)}</span>
                  </div>
                </div>

                {/* {work.status === 'pending' && (
                  <button className="submit-work-btn">
                    Submit Work
                  </button>
                )} */}
                
                {work.status === 'completed' && (
                  <div className="completed-badge">
                    ✓ Submitted
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {defaulterWorks.length === 0 && (
        <div className="no-defaulter-work">
          <div className="no-work-icon">📚</div>
          <h3>No Defaulter Work</h3>
          <p>You don't have any defaulter work assignments at the moment.</p>
        </div>
      )}
    </div>
  );
};

export default DefaulterWork;