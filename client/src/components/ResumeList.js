import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaDownload, FaEye, FaTrash, FaCalendarAlt, FaUser } from 'react-icons/fa';
import './ResumeList.css';

const ResumeList = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedResume, setSelectedResume] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/resumes');
      setResumes(response.data);
    } catch (err) {
      setError('Failed to fetch resumes');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this resume?')) {
      try {
        await axios.delete(`/api/resumes/${id}`);
        setResumes(resumes.filter(resume => resume.id !== id));
        if (selectedResume && selectedResume.id === id) {
          setSelectedResume(null);
          setShowModal(false);
        }
      } catch (err) {
        setError('Failed to delete resume');
      }
    }
  };

  const handleView = async (id) => {
    try {
      const response = await axios.get(`/api/resumes/${id}`);
      setSelectedResume(response.data);
      setShowModal(true);
    } catch (err) {
      setError('Failed to fetch resume details');
    }
  };

  const handleDownload = async (id, name) => {
    try {
      const response = await axios.get(`/api/resumes/${id}/pdf`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${name.replace(/\s+/g, '_')}_Resume.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('Failed to download PDF');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return <div className="loading">Loading resumes...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="resume-list">
      <div className="list-header">
        <h2>Your Resumes</h2>
        <p>{resumes.length} resume{resumes.length !== 1 ? 's' : ''} found</p>
      </div>

      {resumes.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📄</div>
          <h3>No resumes yet</h3>
          <p>Create your first resume to get started!</p>
        </div>
      ) : (
        <div className="resumes-grid">
          {resumes.map((resume) => (
            <div key={resume.id} className="resume-card">
              <div className="resume-header">
                <div className="resume-avatar">
                  <FaUser />
                </div>
                <div className="resume-info">
                  <h3>{resume.name}</h3>
                  <p className="resume-date">
                    <FaCalendarAlt /> Created {formatDate(resume.created_at)}
                  </p>
                </div>
              </div>
              
              <div className="resume-details">
                {resume.email && <p><strong>Email:</strong> {resume.email}</p>}
                {resume.phone && <p><strong>Phone:</strong> {resume.phone}</p>}
                {resume.linkedin && (
                  <p>
                    <strong>LinkedIn:</strong>{' '}
                    <a href={resume.linkedin} target="_blank" rel="noopener noreferrer">
                      View Profile
                    </a>
                  </p>
                )}
              </div>

              <div className="resume-actions">
                <button
                  className="btn btn-secondary"
                  onClick={() => handleView(resume.id)}
                  title="View Details"
                >
                  <FaEye /> View
                </button>
                <button
                  className="btn btn-success"
                  onClick={() => handleDownload(resume.id, resume.name)}
                  title="Download PDF"
                >
                  <FaDownload /> Download
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(resume.id)}
                  title="Delete Resume"
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for viewing resume details */}
      {showModal && selectedResume && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="resume-main-header">
                <h1>RESUME</h1>
              </div>
              <button
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="resume-name">
                <h2>{selectedResume.name}</h2>
              </div>
              
              <div className="resume-section">
                <h3 className="section-header">❖ Contact Information</h3>
                <div className="contact-info">
                  {selectedResume.email && <p><strong>Email:</strong> {selectedResume.email}</p>}
                  {selectedResume.phone && <p><strong>Phone:</strong> {selectedResume.phone}</p>}
                  {selectedResume.linkedin && (
                    <p>
                      <strong>LinkedIn:</strong>{' '}
                      <a href={selectedResume.linkedin} target="_blank" rel="noopener noreferrer">
                        {selectedResume.linkedin}
                      </a>
                    </p>
                  )}
                </div>
              </div>

              {selectedResume.skills && selectedResume.skills.length > 0 && (
                <div className="resume-section">
                  <h3 className="section-header">❖ Skills</h3>
                  <div className="skills-display">
                    {selectedResume.skills.map((skill, index) => (
                      <span key={index} className="skill-tag">{skill}</span>
                    ))}
                  </div>
                </div>
              )}

              {selectedResume.education && selectedResume.education.length > 0 && (
                <div className="resume-section">
                  <h3 className="section-header">❖ Academic Details</h3>
                  {selectedResume.education.map((edu, index) => (
                    <div key={index} className="education-item">
                      <h4>{edu.institution}</h4>
                      <p><strong>{edu.degree}</strong> {edu.field && `in ${edu.field}`}</p>
                      <p><strong>Duration:</strong> {edu.start_date} - {edu.end_date}</p>
                      {edu.gpa && <p><strong>GPA:</strong> {edu.gpa}</p>}
                    </div>
                  ))}
                </div>
              )}

              {selectedResume.projects && selectedResume.projects.length > 0 && (
                <div className="resume-section">
                  <h3 className="section-header">❖ Academic Project Undertaken</h3>
                  {selectedResume.projects.map((project, index) => (
                    <div key={index} className="project-item">
                      <h4>{project.title}</h4>
                      <p><strong>Company:</strong> {project.title}</p>
                      <p><strong>Project Title:</strong> {project.title}</p>
                      <p><strong>Profile:</strong> {project.description}</p>
                      {project.technologies && <p><strong>Technologies:</strong> {project.technologies}</p>}
                      {project.link && (
                        <p>
                          <strong>Link:</strong>{' '}
                          <a href={project.link} target="_blank" rel="noopener noreferrer">
                            {project.link}
                          </a>
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div className="resume-section">
                <h3 className="section-header">❖ Work Experience</h3>
                <div className="work-experience-item">
                  <p><strong>Organization:</strong> [To be added]</p>
                  <p><strong>Designation:</strong> [To be added]</p>
                  <p><strong>Duration:</strong> [To be added]</p>
                  <p><strong>Profile:</strong> [To be added]</p>
                </div>
              </div>

              {selectedResume.certificates && selectedResume.certificates.length > 0 && (
                <div className="resume-section">
                  <h3 className="section-header">❖ Certificates</h3>
                  {selectedResume.certificates.map((cert, index) => (
                    <div key={index} className="certificate-item">
                      <h4>{cert.name}</h4>
                      <p><strong>Issuer:</strong> {cert.issuer}</p>
                      {cert.date && <p><strong>Date:</strong> {cert.date}</p>}
                      {cert.link && (
                        <p>
                          <strong>Link:</strong>{' '}
                          <a href={cert.link} target="_blank" rel="noopener noreferrer">
                            {cert.link}
                          </a>
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {selectedResume.hobbies && selectedResume.hobbies.length > 0 && (
                <div className="resume-section">
                  <h3 className="section-header">❖ Hobbies & Interests</h3>
                  <div className="hobbies-display">
                    {selectedResume.hobbies.map((hobby, index) => (
                      <span key={index} className="hobby-tag">{hobby}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button
                className="btn btn-success"
                onClick={() => handleDownload(selectedResume.id, selectedResume.name)}
              >
                <FaDownload /> Download PDF
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeList; 