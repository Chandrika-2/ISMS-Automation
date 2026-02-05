import React, { useState } from 'react';
import { Upload, Save, Calendar, CheckCircle, AlertCircle } from 'lucide-react';

const InternalAudit = ({ onComplete, initialData }) => {
  const [audit, setAudit] = useState(initialData.startDate ? initialData : {
    startDate: '',
    endDate: '',
    auditTeam: '',
    scope: '',
    findings: [],
    reportFile: null,
    reportFileName: '',
    status: 'Planned',
    nonConformities: {
      major: '',
      minor: '',
      observations: ''
    }
  });

  const [newFinding, setNewFinding] = useState({
    control: '',
    finding: '',
    severity: 'Minor',
    recommendation: ''
  });

  const updateAudit = (field, value) => {
    setAudit({ ...audit, [field]: value });
  };

  const updateNonConformity = (type, value) => {
    setAudit({
      ...audit,
      nonConformities: {
        ...audit.nonConformities,
        [type]: value
      }
    });
  };

  const addFinding = () => {
    if (newFinding.control && newFinding.finding) {
      setAudit({
        ...audit,
        findings: [...audit.findings, { ...newFinding, id: Date.now() }]
      });
      setNewFinding({
        control: '',
        finding: '',
        severity: 'Minor',
        recommendation: ''
      });
    }
  };

  const removeFinding = (id) => {
    setAudit({
      ...audit,
      findings: audit.findings.filter(f => f.id !== id)
    });
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setAudit({
        ...audit,
        reportFile: file,
        reportFileName: file.name,
        status: 'Completed'
      });
    }
  };

  const handleSave = () => {
    if (!audit.startDate || !audit.endDate) {
      alert('Please provide audit start and end dates.');
      return;
    }
    
    onComplete(audit);
  };

  return (
    <div className="internal-audit">
      <div className="section-header">
        <h2>Step 6: Internal Audit</h2>
        <p>Document and track internal audit activities and findings</p>
      </div>

      <div className="audit-details">
        <div className="audit-grid">
          <div className="field-group">
            <label>Audit Start Date *</label>
            <input
              type="date"
              value={audit.startDate}
              onChange={(e) => updateAudit('startDate', e.target.value)}
              className="text-input"
            />
          </div>

          <div className="field-group">
            <label>Audit End Date *</label>
            <input
              type="date"
              value={audit.endDate}
              onChange={(e) => updateAudit('endDate', e.target.value)}
              className="text-input"
            />
          </div>

          <div className="field-group">
            <label>Audit Team</label>
            <input
              type="text"
              value={audit.auditTeam}
              onChange={(e) => updateAudit('auditTeam', e.target.value)}
              placeholder="e.g., Lead Auditor: John Doe, Auditor: Jane Smith"
              className="text-input"
            />
          </div>

          <div className="field-group">
            <label>Status</label>
            <select
              value={audit.status}
              onChange={(e) => updateAudit('status', e.target.value)}
              className="select-input"
            >
              <option value="Planned">Planned</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Report Issued">Report Issued</option>
            </select>
          </div>

          <div className="field-group full-width">
            <label>Audit Scope</label>
            <textarea
              value={audit.scope}
              onChange={(e) => updateAudit('scope', e.target.value)}
              placeholder="Describe the scope of the internal audit (e.g., All ISO 27001:2022 controls, specific departments, systems)"
              rows={3}
              className="textarea-input"
            />
          </div>
        </div>

        <div className="non-conformities">
          <h3>Non-Conformities Summary</h3>
          <div className="nc-grid">
            <div className="field-group">
              <label>Major Non-Conformities</label>
              <input
                type="number"
                min="0"
                value={audit.nonConformities.major}
                onChange={(e) => updateNonConformity('major', e.target.value)}
                className="text-input"
                placeholder="0"
              />
            </div>
            <div className="field-group">
              <label>Minor Non-Conformities</label>
              <input
                type="number"
                min="0"
                value={audit.nonConformities.minor}
                onChange={(e) => updateNonConformity('minor', e.target.value)}
                className="text-input"
                placeholder="0"
              />
            </div>
            <div className="field-group">
              <label>Observations</label>
              <input
                type="number"
                min="0"
                value={audit.nonConformities.observations}
                onChange={(e) => updateNonConformity('observations', e.target.value)}
                className="text-input"
                placeholder="0"
              />
            </div>
          </div>
        </div>

        <div className="findings-section">
          <h3>Audit Findings</h3>
          
          <div className="add-finding">
            <div className="finding-grid">
              <div className="field-group">
                <label>Control Reference</label>
                <input
                  type="text"
                  value={newFinding.control}
                  onChange={(e) => setNewFinding({ ...newFinding, control: e.target.value })}
                  placeholder="e.g., A.5.1, A.8.9"
                  className="text-input"
                />
              </div>

              <div className="field-group">
                <label>Severity</label>
                <select
                  value={newFinding.severity}
                  onChange={(e) => setNewFinding({ ...newFinding, severity: e.target.value })}
                  className="select-input"
                >
                  <option value="Major">Major Non-Conformity</option>
                  <option value="Minor">Minor Non-Conformity</option>
                  <option value="Observation">Observation</option>
                  <option value="Opportunity">Opportunity for Improvement</option>
                </select>
              </div>

              <div className="field-group full-width">
                <label>Finding Description</label>
                <textarea
                  value={newFinding.finding}
                  onChange={(e) => setNewFinding({ ...newFinding, finding: e.target.value })}
                  placeholder="Describe the audit finding..."
                  rows={2}
                  className="textarea-input"
                />
              </div>

              <div className="field-group full-width">
                <label>Recommendation</label>
                <textarea
                  value={newFinding.recommendation}
                  onChange={(e) => setNewFinding({ ...newFinding, recommendation: e.target.value })}
                  placeholder="Provide recommendations for addressing this finding..."
                  rows={2}
                  className="textarea-input"
                />
              </div>
            </div>

            <button className="btn btn-secondary" onClick={addFinding}>
              <CheckCircle size={18} />
              Add Finding
            </button>
          </div>

          {audit.findings.length > 0 && (
            <div className="findings-list">
              <h4>Recorded Findings ({audit.findings.length})</h4>
              {audit.findings.map((finding) => (
                <div key={finding.id} className="finding-item">
                  <div className="finding-header">
                    <div>
                      <span className="control-ref">{finding.control}</span>
                      <span className={`severity-badge ${finding.severity.toLowerCase().replace(' ', '-')}`}>
                        {finding.severity}
                      </span>
                    </div>
                    <button
                      className="btn-icon"
                      onClick={() => removeFinding(finding.id)}
                    >
                      <AlertCircle size={16} />
                    </button>
                  </div>
                  <p className="finding-text">{finding.finding}</p>
                  {finding.recommendation && (
                    <p className="recommendation-text">
                      <strong>Recommendation:</strong> {finding.recommendation}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="upload-section">
          <h3>Final Audit Report</h3>
          <label className="upload-label large">
            <Upload size={24} />
            <span>{audit.reportFileName || 'Upload Final Audit Report'}</span>
            <p className="upload-hint">PDF, Word, or Excel format</p>
            <input
              type="file"
              onChange={handleFileUpload}
              accept=".pdf,.doc,.docx,.xlsx"
              style={{ display: 'none' }}
            />
          </label>
          {audit.reportFile && (
            <div className="upload-success large">
              <CheckCircle size={20} />
              <span>Report uploaded successfully</span>
            </div>
          )}
        </div>
      </div>

      <div className="action-buttons">
        <button className="btn btn-primary" onClick={handleSave}>
          <Save size={18} />
          Save & View Dashboard
        </button>
      </div>
    </div>
  );
};

export default InternalAudit;
