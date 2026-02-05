import React, { useState, useEffect } from 'react';
import { scopingQuestionsData } from '../data/scopingQuestions';
import { ChevronDown, ChevronRight, Save } from 'lucide-react';

const ScopingQuestions = ({ onComplete, initialData }) => {
  const [responses, setResponses] = useState(initialData || {});
  const [expandedSections, setExpandedSections] = useState({});

  useEffect(() => {
    // Expand first section by default
    const firstSection = Object.keys(scopingQuestionsData)[0];
    setExpandedSections({ [firstSection]: true });
  }, []);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleResponseChange = (questionId, value) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSave = () => {
    const answeredCount = Object.keys(responses).filter(k => responses[k]?.trim()).length;
    const totalQuestions = Object.values(scopingQuestionsData).reduce((sum, qs) => sum + qs.length, 0);
    
    if (answeredCount < totalQuestions * 0.5) {
      if (!window.confirm(`You have answered ${answeredCount} out of ${totalQuestions} questions. Continue anyway?`)) {
        return;
      }
    }
    
    onComplete(responses);
  };

  const getProgress = () => {
    const totalQuestions = Object.values(scopingQuestionsData).reduce((sum, qs) => sum + qs.length, 0);
    const answered = Object.keys(responses).filter(k => responses[k]?.trim()).length;
    return Math.round((answered / totalQuestions) * 100);
  };

  return (
    <div className="scoping-questions">
      <div className="section-header">
        <h2>Step 1: Scoping Questions</h2>
        <p>Please answer the following questions to define the scope of your ISMS implementation.</p>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${getProgress()}%` }}></div>
          <span className="progress-text">{getProgress()}% Complete</span>
        </div>
      </div>

      <div className="questions-container">
        {Object.entries(scopingQuestionsData).map(([sectionName, questions]) => (
          <div key={sectionName} className="question-section">
            <button
              className="section-toggle"
              onClick={() => toggleSection(sectionName)}
            >
              {expandedSections[sectionName] ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
              <h3>{sectionName}</h3>
              <span className="question-count">
                {questions.filter(q => responses[q.id]?.trim()).length} / {questions.length}
              </span>
            </button>

            {expandedSections[sectionName] && (
              <div className="questions-list">
                {questions.map((question) => (
                  <div key={question.id} className="question-item">
                    <label className="question-label">
                      <span className="question-number">Q{question.id}</span>
                      {question.question}
                    </label>
                    <textarea
                      value={responses[question.id] || ''}
                      onChange={(e) => handleResponseChange(question.id, e.target.value)}
                      placeholder="Enter your response here..."
                      rows={3}
                      className="question-input"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="action-buttons">
        <button className="btn btn-primary" onClick={handleSave}>
          <Save size={18} />
          Save & Continue to Gap Assessment
        </button>
      </div>
    </div>
  );
};

export default ScopingQuestions;
