import React, { useState } from 'react';
import { Plus, Trash2, Save, Download } from 'lucide-react';
import * as XLSX from 'xlsx';

const RiskManagement = ({ gapData, onComplete, initialData }) => {
  const [risks, setRisks] = useState(initialData.length > 0 ? initialData : [
    {
      id: Date.now(),
      asset: '',
      threat: '',
      vulnerability: '',
      likelihood: '',
      impact: '',
      riskLevel: '',
      treatment: '',
      owner: '',
      status: 'Open',
      controls: ''
    }
  ]);

  const addRisk = () => {
    setRisks([...risks, {
      id: Date.now(),
      asset: '',
      threat: '',
      vulnerability: '',
      likelihood: '',
      impact: '',
      riskLevel: '',
      treatment: '',
      owner: '',
      status: 'Open',
      controls: ''
    }]);
  };

  const removeRisk = (id) => {
    setRisks(risks.filter(r => r.id !== id));
  };

  const updateRisk = (id, field, value) => {
    setRisks(risks.map(risk => {
      if (risk.id === id) {
        const updated = { ...risk, [field]: value };
        
        // Auto-calculate risk level
        if (field === 'likelihood' || field === 'impact') {
          const likelihood = field === 'likelihood' ? value : risk.likelihood;
          const impact = field === 'impact' ? value : risk.impact;
          updated.riskLevel = calculateRiskLevel(likelihood, impact);
        }
        
        return updated;
      }
      return risk;
    }));
  };

  const calculateRiskLevel = (likelihood, impact) => {
    if (!likelihood || !impact) return '';
    
    const likelihoodValue = { 'Low': 1, 'Medium': 2, 'High': 3 }[likelihood] || 0;
    const impactValue = { 'Low': 1, 'Medium': 2, 'High': 3 }[impact] || 0;
    const score = likelihoodValue * impactValue;
    
    if (score >= 6) return 'Critical';
    if (score >= 4) return 'High';
    if (score >= 2) return 'Medium';
    return 'Low';
  };

  const exportToExcel = () => {
    const riskData = risks.map((r, index) => ({
      'Risk ID': `RISK-${String(index + 1).padStart(3, '0')}`,
      'Asset': r.asset,
      'Threat': r.threat,
      'Vulnerability': r.vulnerability,
      'Likelihood': r.likelihood,
      'Impact': r.impact,
      'Risk Level': r.riskLevel,
      'Treatment Plan': r.treatment,
      'Risk Owner': r.owner,
      'Status': r.status,
      'Existing Controls': r.controls
    }));

    const ws = XLSX.utils.json_to_sheet(riskData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Risk Register');
    
    // Add risk summary
    const summary = [
      { Category: 'Total Risks', Count: risks.length },
      { Category: 'Critical Risks', Count: risks.filter(r => r.riskLevel === 'Critical').length },
      { Category: 'High Risks', Count: risks.filter(r => r.riskLevel === 'High').length },
      { Category: 'Medium Risks', Count: risks.filter(r => r.riskLevel === 'Medium').length },
      { Category: 'Low Risks', Count: risks.filter(r => r.riskLevel === 'Low').length },
      { Category: 'Open Risks', Count: risks.filter(r => r.status === 'Open').length },
      { Category: 'Mitigated Risks', Count: risks.filter(r => r.status === 'Mitigated').length }
    ];
    
    const wsSummary = XLSX.utils.json_to_sheet(summary);
    XLSX.utils.book_append_sheet(wb, wsSummary, 'Summary');
    
    XLSX.writeFile(wb, 'ISMS_Risk_Register.xlsx');
  };

  const handleSave = () => {
    const validRisks = risks.filter(r => r.asset && r.threat);
    
    if (validRisks.length === 0) {
      alert('Please add at least one risk before continuing.');
      return;
    }
    
    onComplete(risks);
  };

  return (
    <div className="risk-management">
      <div className="section-header">
        <h2>Step 3: Risk Management</h2>
        <p>Identify and assess information security risks based on identified gaps</p>
      </div>

      {gapData.filter(g => g.implemented !== 'Fully Implemented').length > 0 && (
        <div className="info-banner">
          <p>💡 Consider the following gaps when identifying risks:</p>
          <ul>
            {gapData
              .filter(g => g.implemented !== 'Fully Implemented' && g.priority === 'High')
              .slice(0, 5)
              .map(gap => (
                <li key={gap.controlId}>{gap.controlId}: {gap.controlName}</li>
              ))}
          </ul>
        </div>
      )}

      <div className="risks-container">
        {risks.map((risk, index) => (
          <div key={risk.id} className="risk-card">
            <div className="risk-header">
              <h3>Risk #{index + 1}</h3>
              <button className="btn-icon" onClick={() => removeRisk(risk.id)} title="Delete Risk">
                <Trash2 size={18} />
              </button>
            </div>

            <div className="risk-grid">
              <div className="field-group">
                <label>Asset / Information System *</label>
                <input
                  type="text"
                  value={risk.asset}
                  onChange={(e) => updateRisk(risk.id, 'asset', e.target.value)}
                  placeholder="e.g., Customer Database, AWS S3 Bucket"
                  className="text-input"
                />
              </div>

              <div className="field-group">
                <label>Threat *</label>
                <input
                  type="text"
                  value={risk.threat}
                  onChange={(e) => updateRisk(risk.id, 'threat', e.target.value)}
                  placeholder="e.g., Unauthorized Access, Data Breach"
                  className="text-input"
                />
              </div>

              <div className="field-group">
                <label>Vulnerability</label>
                <input
                  type="text"
                  value={risk.vulnerability}
                  onChange={(e) => updateRisk(risk.id, 'vulnerability', e.target.value)}
                  placeholder="e.g., Weak passwords, Missing encryption"
                  className="text-input"
                />
              </div>

              <div className="field-group">
                <label>Likelihood</label>
                <select
                  value={risk.likelihood}
                  onChange={(e) => updateRisk(risk.id, 'likelihood', e.target.value)}
                  className="select-input"
                >
                  <option value="">Select...</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              <div className="field-group">
                <label>Impact</label>
                <select
                  value={risk.impact}
                  onChange={(e) => updateRisk(risk.id, 'impact', e.target.value)}
                  className="select-input"
                >
                  <option value="">Select...</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              <div className="field-group">
                <label>Risk Level</label>
                <div className={`risk-level-badge ${risk.riskLevel.toLowerCase()}`}>
                  {risk.riskLevel || 'Not Calculated'}
                </div>
              </div>

              <div className="field-group full-width">
                <label>Risk Treatment Plan</label>
                <textarea
                  value={risk.treatment}
                  onChange={(e) => updateRisk(risk.id, 'treatment', e.target.value)}
                  placeholder="Describe how this risk will be treated (Accept, Mitigate, Transfer, Avoid)"
                  rows={2}
                  className="textarea-input"
                />
              </div>

              <div className="field-group">
                <label>Risk Owner</label>
                <input
                  type="text"
                  value={risk.owner}
                  onChange={(e) => updateRisk(risk.id, 'owner', e.target.value)}
                  placeholder="e.g., IT Manager, CISO"
                  className="text-input"
                />
              </div>

              <div className="field-group">
                <label>Status</label>
                <select
                  value={risk.status}
                  onChange={(e) => updateRisk(risk.id, 'status', e.target.value)}
                  className="select-input"
                >
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Mitigated">Mitigated</option>
                  <option value="Accepted">Accepted</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <div className="field-group full-width">
                <label>Existing Controls</label>
                <input
                  type="text"
                  value={risk.controls}
                  onChange={(e) => updateRisk(risk.id, 'controls', e.target.value)}
                  placeholder="List existing security controls"
                  className="text-input"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="btn btn-secondary" onClick={addRisk}>
        <Plus size={18} />
        Add Another Risk
      </button>

      <div className="action-buttons">
        <button className="btn btn-secondary" onClick={exportToExcel}>
          <Download size={18} />
          Export Risk Register
        </button>
        <button className="btn btn-primary" onClick={handleSave}>
          <Save size={18} />
          Save & Continue to Policy Management
        </button>
      </div>
    </div>
  );
};

export default RiskManagement;
