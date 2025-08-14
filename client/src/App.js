import React, { useState } from 'react';
import ResumeForm from './components/ResumeForm';
import ResumeList from './components/ResumeList';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('form');

  return (
    <div className="App">
      <div className="container">
        <div className="header">
          <h1>Resume Builder</h1>
          <p>Create, manage, and download your professional resumes</p>
        </div>

        <div className="nav-tabs">
          <button 
            className={`nav-tab ${activeTab === 'form' ? 'active' : ''}`}
            onClick={() => setActiveTab('form')}
          >
            Create Resume
          </button>
          <button 
            className={`nav-tab ${activeTab === 'list' ? 'active' : ''}`}
            onClick={() => setActiveTab('list')}
          >
            View Resumes
          </button>
        </div>

        {activeTab === 'form' ? <ResumeForm /> : <ResumeList />}
      </div>
    </div>
  );
}

export default App; 