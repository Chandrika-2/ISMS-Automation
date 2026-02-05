import React, { useState } from 'react';
import { Upload, Download, Save, AlertTriangle, CheckCircle } from 'lucide-react';

const VAPTManagement = ({ onComplete, initialData }) => {
  const [vapt, setVapt] = useState(initialData.length > 0 ? initialData : [
    {
      id: 1,
      type: 'External VAPT',
      scope: '',
      vendor: '',
      startDate: '',
      endDate: '',
      reportFile: null,
      reportFileName: '',
      criticalFindings: '',
      highFindings: '',
      mediumFindings: '',
      lowFindings: '',
      status: 'Planned'
    },
    {
      id: 2,
      type: 'Internal VAPT',
      scope: '',
      vendor: '',
      startDate: '',
      endDate: '',
      reportFile: null,
      reportFileName: '',
      criticalFindings: '',
      highFindings: '',
      mediumFindings: '',
      lowFindings: '',
      status: 'Planned'
    },
    {
      id: 3,
      type: 'Cloud Security Assessment',
      scope: '',
      vendor: '',
      startDate: '',
      endDate: '',
      reportFile: null,
      reportFileName: '',
      criticalFindings: '',
      highFindings: '',
      mediumFindings: '',
      lowFindings: '',
      status: 'Planned'
    }
  ]);

  const updateVAPT = (id, field, value) => {
    setVapt(vapt.map(v => v.id === id ? { ...v, [field]: value } : v));
  };

  const handleFileUpload = (id, event) => {
    const file = event.target.files[0];
    if (file) {
      setVapt(vapt.map(v =>
        v.id === id
          ? { ...v, reportFile: file, reportFileName: file.name, status: 'Completed' }
          : v
      ));
    }
  };

  const handleSave = () => {
    const completedCount = vapt.filter(v => v.reportFile).length;
    
    if (completedCount === 0) {
      if (!window.confirm('No VAPT reports uploaded. Continue anyway?')) {
        return;
      }
    }
    
    onComplete(vapt);
  };

  const getTotalFindings = () => {
    return vapt.reduce((acc, v) => ({
      critical: acc.critical + (parseInt(v.criticalFindings) || 0),
      high: acc.high + (parseInt(v.highFindings) || 0),
      medium: acc.medium + (parseInt(v.mediumFindings) || 0),
      low: acc.low + (parseInt(v.lowFindings) || 0)
    }), { critical: 0, high: 0, medium: 0, low: 0 });
  };

  const totals = getTotalFindings();

  return (
    <div className="vapt-management">
      <div className="section-header">
        <h2>Step 5: Vulnerability Assessment & Penetration Testing (VAPT)</h2>
        <p>Upload VAPT reports and track security findings</p>
      </div>

      <div className="findings-summary">
        <h3>Total Findings Summary</h3>
        <div className="findings-grid">
          <div className="finding-card critical">
            <div className="finding-number">{totals.critical}</div>
            <div className="finding-label">Critical</div>
          </div>
          <div className="finding-card high">
            <div className="finding-number">{totals.high}</div>
            <div className="finding-label">High</div>
          </div>
          <div className="finding-card medium">
            <div className="finding-number">{totals.medium}</div>
            <div className="finding-label">Medium</div>
          </div>
          <div className="finding-card low">
            <div className="finding-number">{totals.low}</div>
            <div className="finding-label">Low</div>
          </div>
        </div>
      </div>

      <div className="vapt-list">
        {vapt.map((item) => (
          <div key={item.id} className="vapt-card">
            <div className="vapt-header">
              <h3>{item.type}</h3>
              <span className={`status-badge ${item.status.toLowerCase().replace(' ', '-')}`}>
                {item.status}
              </span>
            </div>

            <div className="vapt-grid">
              <div className="field-group full-width">
                <label>Scope</label>
                <input
                  type="text"
                  value={item.scope}
                  onChange={(e) => updateVAPT(item.id, 'scope', e.target.value)}
                  placeholder="e.g., Web Application, Network Infrastructure, AWS Cloud"
                  className="text-input"
                />
              </div>

              <div className="field-group">
                <label>Vendor / Assessor</label>
                <input
                  type="text"
                  value={item.vendor}
                  onChange={(e) => updateVAPT(item.id, 'vendor', e.target.value)}
                  placeholder="e.g., SecurityCorp, Internal Team"
                  className="text-input"
                />
              </div>

              <div className="field-group">
                <label>Start Date</label>
                <input
                  type="date"
                  value={item.startDate}
                  onChange={(e) => updateVAPT(item.id, 'startDate', e.target.value)}
                  className="text-input"
                />
              </div>

              <div className="field-group">
                <label>End Date</label>
                <input
                  type="date"
                  value={item.endDate}
                  onChange={(e) => updateVAPT(item.id, 'endDate', e.target.value)}
                  className="text-input"
                />
              </div>

              <div className="field-group">
                <label>Status</label>
                <select
                  value={item.status}
                  onChange={(e) => updateVAPT(item.id, 'status', e.target.value)}
                  className="select-input"
                >
                  <option value="Planned">Planned</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Remediation">Remediation in Progress</option>
                </select>
              </div>

              <div className="upload-section full-width">
                <label className="upload-label">
                  <Upload size={18} />
                  {item.reportFileName ? item.reportFileName : 'Upload VAPT Report'}
                  <input
                    type="file"
                    onChange={(e) => handleFileUpload(item.id, e)}
                    accept=".pdf,.doc,.docx,.xlsx"
                    style={{ display: 'none' }}
                  />
                </label>
                {item.reportFile && (
                  <div className="upload-success">
                    <CheckCircle size={16} />
                    <span>Uploaded</span>
                  </div>
                )}
              </div>

              <div className="findings-inputs">
                <h4>
                  <AlertTriangle size={16} />
                  Findings Count
                </h4>
                <div className="findings-row">
                  <div className="field-group">
                    <label>Critical</label>
                    <input
                      type="number"
                      min="0"
                      value={item.criticalFindings}
                      onChange={(e) => updateVAPT(item.id, 'criticalFindings', e.target.value)}
                      className="text-input"
                      placeholder="0"
                    />
                  </div>
                  <div className="field-group">
                    <label>High</label>
                    <input
                      type="number"
                      min="0"
                      value={item.highFindings}
                      onChange={(e) => updateVAPT(item.id, 'highFindings', e.target.value)}
                      className="text-input"
                      placeholder="0"
                    />
                  </div>
                  <div className="field-group">
                    <label>Medium</label>
                    <input
                      type="number"
                      min="0"
                      value={item.mediumFindings}
                      onChange={(e) => updateVAPT(item.id, 'mediumFindings', e.target.value)}
                      className="text-input"
                      placeholder="0"
                    />
                  </div>
                  <div className="field-group">
                    <label>Low</label>
                    <input
                      type="number"
                      min="0"
                      value={item.lowFindings}
                      onChange={(e) => updateVAPT(item.id, 'lowFindings', e.target.value)}
                      className="text-input"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="action-buttons">
        <button className="btn btn-primary" onClick={handleSave}>
          <Save size={18} />
          Save & Continue to Internal Audit
        </button>
      </div>
    </div>
  );
};

export default VAPTManagement;
