import React from 'react';
import { Book, BookOpen, GraduationCap, Award, Eye, Star } from 'lucide-react';
import { useStudentContext } from './StudentApp';
import './Subjects.css';

const Subjects = () => {

    // Sample subject data with different types
    const allSubjects = {
        theory: [
            { code: 'EST123', name: 'Operating System', faculty: 'Dr. Kavita Bhosale' },
            { code: 'EST124', name: 'Database Management', faculty: 'Prof. Samruddhi Chillure' },
            { code: 'EST125', name: 'Software Engineering', faculty: 'Dr. Priyanka Sonawane' },
            { code: 'EST126', name: 'Computer Networks', faculty: 'Prof. John Smith' },
            { code: 'EST127', name: 'Web Development', faculty: 'Dr. Sarah Wilson' }
        ],
        practical: [
            { code: 'EST123P', name: 'Operating System Lab', faculty: 'Dr. Kavita Bhosale' },
            { code: 'EST124P', name: 'Database Management Lab', faculty: 'Prof. Samruddhi Chillure' },
            { code: 'EST125P', name: 'Software Engineering Lab', faculty: 'Dr. Priyanka Sonawane' },
            { code: 'EST126P', name: 'Computer Networks Lab', faculty: 'Prof. John Smith' }
        ],
        mdm: [
            { code: 'MDM101', name: 'Internet of Things (IoT)', faculty: 'Dr. Tech Expert', description: 'Multidisciplinary Minor in IoT and Smart Systems' }
        ],
        oe: [
            { code: 'OE201', name: 'NPTEL Course', faculty: 'Online Platform', description: 'Open Elective through NPTEL certification' }
        ],
        pe: [
            { code: 'PE301', name: 'Data Science', faculty: 'Dr. Analytics Expert', description: 'Professional Elective in Data Science and Machine Learning' }
        ]
    };

    const SubjectCard = ({ subject, type, icon: Icon }) => (
        <div className={`subject-card ${type}`}>
            <div className="subject-card-top">
                <div className="subject-icon">
                    <Icon size={22} />
                </div>
                <div className="subject-type-badge">
                    {type.toUpperCase()}
                </div>
            </div>

            <div className="subject-info">
                <div className="subject-code">{subject.code}</div>
                <div className="subject-name">{subject.name}</div>
                <div className="subject-faculty">
                    <span className="faculty-label">Faculty:</span> {subject.faculty}
                </div>
                {subject.description && (
                    <div className="subject-description">{subject.description}</div>
                )}
            </div>

            <div className="subject-footer">
                <div className="view-only-badge">
                    <Eye size={14} />
                    <span>View Only</span>
                </div>
            </div>
        </div>
    );

    const SubjectSection = ({ title, subjects, type, icon }) => (
        <div className="subject-section">
            <div className="section-header">
                <h3>{title}</h3>
                <span className="subject-count">{subjects.length} subjects</span>
            </div>
            <div className="subjects-grid">
                {subjects.map((subject, index) => (
                    <SubjectCard
                        key={index}
                        subject={subject}
                        type={type}
                        icon={icon}
                    />
                ))}
            </div>
        </div>
    );

    return (
        <div className="subjects-container">
            <div className="subjects-header">
                <h2>My Subjects</h2>
                <p>View all your allotted subjects for the current semester</p>
            </div>

            <div className="subjects-content">
                <SubjectSection
                    title="Theory Subjects"
                    subjects={allSubjects.theory}
                    type="theory"
                    icon={Book}
                />

                <SubjectSection
                    title="Practical Subjects"
                    subjects={allSubjects.practical}
                    type="practical"
                    icon={BookOpen}
                />

                <SubjectSection
                    title="Multidisciplinary Minor (MDM)"
                    subjects={allSubjects.mdm}
                    type="mdm"
                    icon={GraduationCap}
                />

                <SubjectSection
                    title="Open Elective (OE)"
                    subjects={allSubjects.oe}
                    type="oe"
                    icon={Award}
                />

                <SubjectSection
                    title="Professional Elective (PE)"
                    subjects={allSubjects.pe}
                    type="pe"
                    icon={Star}
                />
            </div>


        </div>
    );
};

export default Subjects;