import React, { useState } from 'react';
import axios from 'axios';
import { FaPlus, FaTrash, FaSave } from 'react-icons/fa';
import './ResumeForm.css';

const ResumeForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    linkedin: '',
    skills: [],
    education: [],
    projects: [],
    certificates: [],
    hobbies: []
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Input handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Skills management
  const [skillInput, setSkillInput] = useState('');
  const addSkill = () => {
    if (skillInput.trim()) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()]
      }));
      setSkillInput('');
    }
  };

  const removeSkill = (index) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  // Education management
  const [educationInput, setEducationInput] = useState({
    institution: '',
    degree: '',
    field: '',
    startDate: '',
    endDate: '',
    gpa: ''
  });

  const addEducation = () => {
    if (educationInput.institution && educationInput.degree) {
      setFormData(prev => ({
        ...prev,
        education: [...prev.education, { ...educationInput }]
      }));
      setEducationInput({
        institution: '',
        degree: '',
        field: '',
        startDate: '',
        endDate: '',
        gpa: ''
      });
    }
  };

  const removeEducation = (index) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  // Projects management
  const [projectInput, setProjectInput] = useState({
    title: '',
    description: '',
    technologies: '',
    link: ''
  });

  const addProject = () => {
    if (projectInput.title && projectInput.description) {
      setFormData(prev => ({
        ...prev,
        projects: [...prev.projects, { ...projectInput }]
      }));
      setProjectInput({
        title: '',
        description: '',
        technologies: '',
        link: ''
      });
    }
  };

  const removeProject = (index) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index)
    }));
  };

  // Certificates management
  const [certificateInput, setCertificateInput] = useState({
    name: '',
    issuer: '',
    date: '',
    link: ''
  });

  const addCertificate = () => {
    if (certificateInput.name && certificateInput.issuer) {
      setFormData(prev => ({
        ...prev,
        certificates: [...prev.certificates, { ...certificateInput }]
      }));
      setCertificateInput({
        name: '',
        issuer: '',
        date: '',
        link: ''
      });
    }
  };

  const removeCertificate = (index) => {
    setFormData(prev => ({
      ...prev,
      certificates: prev.certificates.filter((_, i) => i !== index)
    }));
  };

  // Hobbies management
  const [hobbyInput, setHobbyInput] = useState('');
  const addHobby = () => {
    if (hobbyInput.trim()) {
      setFormData(prev => ({
        ...prev,
        hobbies: [...prev.hobbies, hobbyInput.trim()]
      }));
      setHobbyInput('');
    }
  };

  const removeHobby = (index) => {
    setFormData(prev => ({
      ...prev,
      hobbies: prev.hobbies.filter((_, i) => i !== index)
    }));
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setMessage({ type: 'error', text: 'Name is required!' });
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post('/api/resumes', formData);
      setMessage({ type: 'success', text: 'Resume created successfully!' });
      setFormData({
        name: '',
        phone: '',
        email: '',
        linkedin: '',
        skills: [],
        education: [],
        projects: [],
        certificates: [],
        hobbies: []
      });
    } catch (error) {
      setMessage({ type: 'error', text: 'Error creating resume. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="resume-form">
      {message && (
        <div className={message.type}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="card">
          <h2>Personal Information</h2>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="form-control"
                placeholder="Enter your full name"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="form-control"
                placeholder="Enter your phone number"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="form-control"
                placeholder="Enter your email address"
              />
            </div>
            <div className="form-group">
              <label className="form-label">LinkedIn Profile</label>
              <input
                type="url"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleInputChange}
                className="form-control"
                placeholder="Enter your LinkedIn profile URL"
              />
            </div>
          </div>
        </div>

        {/* Skills Section */}
        <div className="card">
          <div className="section-header">
            <h2>Skills</h2>
            <button type="button" className="add-item-btn" onClick={addSkill}>
              <FaPlus />
            </button>
          </div>
          <div className="form-group">
            <div className="input-group">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                className="form-control"
                placeholder="Enter a skill"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
              />
              <button type="button" className="btn btn-primary" onClick={addSkill}>
                Add
              </button>
            </div>
          </div>
          <div className="skills-list">
            {formData.skills.map((skill, index) => (
              <div key={index} className="skill-item">
                <span>{skill}</span>
                <button
                  type="button"
                  className="remove-item-btn"
                  onClick={() => removeSkill(index)}
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Education Section */}
        <div className="card">
          <div className="section-header">
            <h2>Education</h2>
            <button type="button" className="add-item-btn" onClick={addEducation}>
              <FaPlus />
            </button>
          </div>
          <div className="education-input">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Institution *</label>
                <input
                  type="text"
                  value={educationInput.institution}
                  onChange={(e) => setEducationInput(prev => ({ ...prev, institution: e.target.value }))}
                  className="form-control"
                  placeholder="University/College name"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Degree *</label>
                <input
                  type="text"
                  value={educationInput.degree}
                  onChange={(e) => setEducationInput(prev => ({ ...prev, degree: e.target.value }))}
                  className="form-control"
                  placeholder="e.g., Bachelor's, Master's"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Field of Study</label>
                <input
                  type="text"
                  value={educationInput.field}
                  onChange={(e) => setEducationInput(prev => ({ ...prev, field: e.target.value }))}
                  className="form-control"
                  placeholder="e.g., Computer Science"
                />
              </div>
              <div className="form-group">
                <label className="form-label">GPA</label>
                <input
                  type="text"
                  value={educationInput.gpa}
                  onChange={(e) => setEducationInput(prev => ({ ...prev, gpa: e.target.value }))}
                  className="form-control"
                  placeholder="e.g., 3.8/4.0"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Start Date</label>
                <input
                  type="date"
                  value={educationInput.startDate}
                  onChange={(e) => setEducationInput(prev => ({ ...prev, startDate: e.target.value }))}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label className="form-label">End Date</label>
                <input
                  type="date"
                  value={educationInput.endDate}
                  onChange={(e) => setEducationInput(prev => ({ ...prev, endDate: e.target.value }))}
                  className="form-control"
                />
              </div>
            </div>
            <button type="button" className="btn btn-primary" onClick={addEducation}>
              Add Education
            </button>
          </div>
          <div className="education-list">
            {formData.education.map((edu, index) => (
              <div key={index} className="list-item">
                <h3>{edu.institution}</h3>
                <p><strong>{edu.degree}</strong> {edu.field && `in ${edu.field}`}</p>
                <p>{edu.startDate} - {edu.endDate}</p>
                {edu.gpa && <p>GPA: {edu.gpa}</p>}
                <button
                  type="button"
                  className="remove-item-btn"
                  onClick={() => removeEducation(index)}
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Projects Section */}
        <div className="card">
          <div className="section-header">
            <h2>Projects</h2>
            <button type="button" className="add-item-btn" onClick={addProject}>
              <FaPlus />
            </button>
          </div>
          <div className="project-input">
            <div className="form-group">
              <label className="form-label">Project Title *</label>
              <input
                type="text"
                value={projectInput.title}
                onChange={(e) => setProjectInput(prev => ({ ...prev, title: e.target.value }))}
                className="form-control"
                placeholder="Enter project title"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Description *</label>
              <textarea
                value={projectInput.description}
                onChange={(e) => setProjectInput(prev => ({ ...prev, description: e.target.value }))}
                className="form-control"
                placeholder="Describe your project"
                rows="3"
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Technologies Used</label>
                <input
                  type="text"
                  value={projectInput.technologies}
                  onChange={(e) => setProjectInput(prev => ({ ...prev, technologies: e.target.value }))}
                  className="form-control"
                  placeholder="e.g., React, Node.js, MongoDB"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Project Link</label>
                <input
                  type="url"
                  value={projectInput.link}
                  onChange={(e) => setProjectInput(prev => ({ ...prev, link: e.target.value }))}
                  className="form-control"
                  placeholder="GitHub or live demo link"
                />
              </div>
            </div>
            <button type="button" className="btn btn-primary" onClick={addProject}>
              Add Project
            </button>
          </div>
          <div className="project-list">
            {formData.projects.map((project, index) => (
              <div key={index} className="list-item">
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                {project.technologies && <p><strong>Technologies:</strong> {project.technologies}</p>}
                {project.link && <p><strong>Link:</strong> <a href={project.link} target="_blank" rel="noopener noreferrer">{project.link}</a></p>}
                <button
                  type="button"
                  className="remove-item-btn"
                  onClick={() => removeProject(index)}
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Certificates Section */}
        <div className="card">
          <div className="section-header">
            <h2>Certificates</h2>
            <button type="button" className="add-item-btn" onClick={addCertificate}>
              <FaPlus />
            </button>
          </div>
          <div className="certificate-input">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Certificate Name *</label>
                <input
                  type="text"
                  value={certificateInput.name}
                  onChange={(e) => setCertificateInput(prev => ({ ...prev, name: e.target.value }))}
                  className="form-control"
                  placeholder="Certificate name"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Issuing Organization *</label>
                <input
                  type="text"
                  value={certificateInput.issuer}
                  onChange={(e) => setCertificateInput(prev => ({ ...prev, issuer: e.target.value }))}
                  className="form-control"
                  placeholder="e.g., Coursera, Udemy"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Date Earned</label>
                <input
                  type="date"
                  value={certificateInput.date}
                  onChange={(e) => setCertificateInput(prev => ({ ...prev, date: e.target.value }))}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Certificate Link</label>
                <input
                  type="url"
                  value={certificateInput.link}
                  onChange={(e) => setCertificateInput(prev => ({ ...prev, link: e.target.value }))}
                  className="form-control"
                  placeholder="Verification link"
                />
              </div>
            </div>
            <button type="button" className="btn btn-primary" onClick={addCertificate}>
              Add Certificate
            </button>
          </div>
          <div className="certificate-list">
            {formData.certificates.map((cert, index) => (
              <div key={index} className="list-item">
                <h3>{cert.name}</h3>
                <p><strong>Issuer:</strong> {cert.issuer}</p>
                {cert.date && <p><strong>Date:</strong> {cert.date}</p>}
                {cert.link && <p><strong>Link:</strong> <a href={cert.link} target="_blank" rel="noopener noreferrer">{cert.link}</a></p>}
                <button
                  type="button"
                  className="remove-item-btn"
                  onClick={() => removeCertificate(index)}
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Hobbies Section */}
        <div className="card">
          <div className="section-header">
            <h2>Hobbies & Interests</h2>
            <button type="button" className="add-item-btn" onClick={addHobby}>
              <FaPlus />
            </button>
          </div>
          <div className="form-group">
            <div className="input-group">
              <input
                type="text"
                value={hobbyInput}
                onChange={(e) => setHobbyInput(e.target.value)}
                className="form-control"
                placeholder="Enter a hobby or interest"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addHobby())}
              />
              <button type="button" className="btn btn-primary" onClick={addHobby}>
                Add
              </button>
            </div>
          </div>
          <div className="hobbies-list">
            {formData.hobbies.map((hobby, index) => (
              <div key={index} className="hobby-item">
                <span>{hobby}</span>
                <button
                  type="button"
                  className="remove-item-btn"
                  onClick={() => removeHobby(index)}
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creating...' : (
              <>
                <FaSave /> Save Resume
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ResumeForm; 