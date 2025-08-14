const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'client/build')));

// Database setup
const db = new sqlite3.Database('./resumes.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
    createTables();
  }
});

// Create tables
function createTables() {
  const createResumeTable = `
    CREATE TABLE IF NOT EXISTS resumes (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      phone TEXT,
      email TEXT,
      linkedin TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;

  const createSkillsTable = `
    CREATE TABLE IF NOT EXISTS skills (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      resume_id TEXT,
      skill TEXT,
      FOREIGN KEY (resume_id) REFERENCES resumes (id)
    )
  `;

  const createEducationTable = `
    CREATE TABLE IF NOT EXISTS education (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      resume_id TEXT,
      institution TEXT,
      degree TEXT,
      field TEXT,
      start_date TEXT,
      end_date TEXT,
      gpa TEXT,
      FOREIGN KEY (resume_id) REFERENCES resumes (id)
    )
  `;

  const createProjectsTable = `
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      resume_id TEXT,
      title TEXT,
      description TEXT,
      technologies TEXT,
      link TEXT,
      FOREIGN KEY (resume_id) REFERENCES resumes (id)
    )
  `;

  const createCertificatesTable = `
    CREATE TABLE IF NOT EXISTS certificates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      resume_id TEXT,
      name TEXT,
      issuer TEXT,
      date TEXT,
      link TEXT,
      FOREIGN KEY (resume_id) REFERENCES resumes (id)
    )
  `;

  const createHobbiesTable = `
    CREATE TABLE IF NOT EXISTS hobbies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      resume_id TEXT,
      hobby TEXT,
      FOREIGN KEY (resume_id) REFERENCES resumes (id)
    )
  `;

  db.serialize(() => {
    db.run(createResumeTable);
    db.run(createSkillsTable);
    db.run(createEducationTable);
    db.run(createProjectsTable);
    db.run(createCertificatesTable);
    db.run(createHobbiesTable);
  });
}

// API Routes

// Create new resume
app.post('/api/resumes', (req, res) => {
  const resumeId = uuidv4();
  const { name, phone, email, linkedin, skills, education, projects, certificates, hobbies } = req.body;

  db.serialize(() => {
    // Insert main resume data
    const insertResume = db.prepare('INSERT INTO resumes (id, name, phone, email, linkedin) VALUES (?, ?, ?, ?, ?)');
    insertResume.run(resumeId, name, phone, email, linkedin);
    insertResume.finalize();

    // Insert skills
    if (skills && skills.length > 0) {
      const insertSkill = db.prepare('INSERT INTO skills (resume_id, skill) VALUES (?, ?)');
      skills.forEach(skill => {
        insertSkill.run(resumeId, skill);
      });
      insertSkill.finalize();
    }

    // Insert education
    if (education && education.length > 0) {
      const insertEducation = db.prepare('INSERT INTO education (resume_id, institution, degree, field, start_date, end_date, gpa) VALUES (?, ?, ?, ?, ?, ?, ?)');
      education.forEach(edu => {
        insertEducation.run(resumeId, edu.institution, edu.degree, edu.field, edu.startDate, edu.endDate, edu.gpa);
      });
      insertEducation.finalize();
    }

    // Insert projects
    if (projects && projects.length > 0) {
      const insertProject = db.prepare('INSERT INTO projects (resume_id, title, description, technologies, link) VALUES (?, ?, ?, ?, ?)');
      projects.forEach(project => {
        insertProject.run(resumeId, project.title, project.description, project.technologies, project.link);
      });
      insertProject.finalize();
    }

    // Insert certificates
    if (certificates && certificates.length > 0) {
      const insertCertificate = db.prepare('INSERT INTO certificates (resume_id, name, issuer, date, link) VALUES (?, ?, ?, ?, ?)');
      certificates.forEach(cert => {
        insertCertificate.run(resumeId, cert.name, cert.issuer, cert.date, cert.link);
      });
      insertCertificate.finalize();
    }

    // Insert hobbies
    if (hobbies && hobbies.length > 0) {
      const insertHobby = db.prepare('INSERT INTO hobbies (resume_id, hobby) VALUES (?, ?)');
      hobbies.forEach(hobby => {
        insertHobby.run(resumeId, hobby);
      });
      insertHobby.finalize();
    }
  });

  res.json({ success: true, id: resumeId });
});

// Get all resumes
app.get('/api/resumes', (req, res) => {
  db.all('SELECT * FROM resumes ORDER BY created_at DESC', (err, resumes) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(resumes);
  });
});

// Get single resume with all details
app.get('/api/resumes/:id', (req, res) => {
  const { id } = req.params;
  
  db.get('SELECT * FROM resumes WHERE id = ?', [id], (err, resume) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!resume) {
      res.status(404).json({ error: 'Resume not found' });
      return;
    }

    // Get all related data
    db.serialize(() => {
      db.all('SELECT skill FROM skills WHERE resume_id = ?', [id], (err, skills) => {
        db.all('SELECT * FROM education WHERE resume_id = ?', [id], (err, education) => {
          db.all('SELECT * FROM projects WHERE resume_id = ?', [id], (err, projects) => {
            db.all('SELECT * FROM certificates WHERE resume_id = ?', [id], (err, certificates) => {
              db.all('SELECT hobby FROM hobbies WHERE resume_id = ?', [id], (err, hobbies) => {
                const fullResume = {
                  ...resume,
                  skills: skills.map(s => s.skill),
                  education,
                  projects,
                  certificates,
                  hobbies: hobbies.map(h => h.hobby)
                };
                res.json(fullResume);
              });
            });
          });
        });
      });
    });
  });
});

// Delete resume
app.delete('/api/resumes/:id', (req, res) => {
  const { id } = req.params;
  
  db.serialize(() => {
    db.run('DELETE FROM skills WHERE resume_id = ?', [id]);
    db.run('DELETE FROM education WHERE resume_id = ?', [id]);
    db.run('DELETE FROM projects WHERE resume_id = ?', [id]);
    db.run('DELETE FROM certificates WHERE resume_id = ?', [id]);
    db.run('DELETE FROM hobbies WHERE resume_id = ?', [id]);
    db.run('DELETE FROM resumes WHERE id = ?', [id], (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ success: true });
    });
  });
});

// Generate PDF resume
app.get('/api/resumes/:id/pdf', (req, res) => {
  const { id } = req.params;
  
  db.get('SELECT * FROM resumes WHERE id = ?', [id], (err, resume) => {
    if (err || !resume) {
      res.status(404).json({ error: 'Resume not found' });
      return;
    }

    // Get all related data
    db.serialize(() => {
      db.all('SELECT skill FROM skills WHERE resume_id = ?', [id], (err, skills) => {
        db.all('SELECT * FROM education WHERE resume_id = ?', [id], (err, education) => {
          db.all('SELECT * FROM projects WHERE resume_id = ?', [id], (err, projects) => {
            db.all('SELECT * FROM certificates WHERE resume_id = ?', [id], (err, certificates) => {
              db.all('SELECT hobby FROM hobbies WHERE resume_id = ?', [id], (err, hobbies) => {
                const fullResume = {
                  ...resume,
                  skills: skills.map(s => s.skill),
                  education,
                  projects,
                  certificates,
                  hobbies: hobbies.map(h => h.hobby)
                };
                
                generatePDF(fullResume, res);
              });
            });
          });
        });
      });
    });
  });
});

function generatePDF(resume, res) {
  const doc = new PDFDocument();
  const filename = `${resume.name.replace(/\s+/g, '_')}_Resume.pdf`;
  
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  
  doc.pipe(res);
  
  // Header
  doc.fontSize(24).font('Helvetica-Bold').text(resume.name, { align: 'center' });
  doc.moveDown(0.5);
  
  // Contact Information
  doc.fontSize(12).font('Helvetica');
  if (resume.phone) doc.text(`Phone: ${resume.phone}`);
  if (resume.email) doc.text(`Email: ${resume.email}`);
  if (resume.linkedin) doc.text(`LinkedIn: ${resume.linkedin}`);
  doc.moveDown();
  
  // Skills
  if (resume.skills && resume.skills.length > 0) {
    doc.fontSize(16).font('Helvetica-Bold').text('Skills');
    doc.fontSize(12).font('Helvetica').text(resume.skills.join(', '));
    doc.moveDown();
  }
  
  // Education
  if (resume.education && resume.education.length > 0) {
    doc.fontSize(16).font('Helvetica-Bold').text('Education');
    resume.education.forEach(edu => {
      doc.fontSize(14).font('Helvetica-Bold').text(edu.institution);
      doc.fontSize(12).font('Helvetica').text(`${edu.degree} in ${edu.field}`);
      doc.fontSize(10).text(`${edu.startDate} - ${edu.endDate}`);
      if (edu.gpa) doc.text(`GPA: ${edu.gpa}`);
      doc.moveDown(0.5);
    });
  }
  
  // Projects
  if (resume.projects && resume.projects.length > 0) {
    doc.fontSize(16).font('Helvetica-Bold').text('Projects');
    resume.projects.forEach(project => {
      doc.fontSize(14).font('Helvetica-Bold').text(project.title);
      doc.fontSize(12).font('Helvetica').text(project.description);
      if (project.technologies) doc.fontSize(10).text(`Technologies: ${project.technologies}`);
      if (project.link) doc.fontSize(10).text(`Link: ${project.link}`);
      doc.moveDown(0.5);
    });
  }
  
  // Certificates
  if (resume.certificates && resume.certificates.length > 0) {
    doc.fontSize(16).font('Helvetica-Bold').text('Certificates');
    resume.certificates.forEach(cert => {
      doc.fontSize(14).font('Helvetica-Bold').text(cert.name);
      doc.fontSize(12).font('Helvetica').text(`Issuer: ${cert.issuer}`);
      doc.fontSize(10).text(`Date: ${cert.date}`);
      if (cert.link) doc.text(`Link: ${cert.link}`);
      doc.moveDown(0.5);
    });
  }
  
  // Hobbies
  if (resume.hobbies && resume.hobbies.length > 0) {
    doc.fontSize(16).font('Helvetica-Bold').text('Hobbies');
    doc.fontSize(12).font('Helvetica').text(resume.hobbies.join(', '));
  }
  
  doc.end();
}

// Serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 