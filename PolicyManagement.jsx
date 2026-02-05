import React, { useState } from 'react';
import { Upload, FileText, Trash2, Save, Download, CheckCircle } from 'lucide-react';

const REQUIRED_POLICIES = [
  'Information Security Policy',
  'Access Control Policy',
  'Acceptable Use Policy',
  'Change Management Policy',
  'Incident Response Policy',
  'Business Continuity Policy',
  'Backup and Recovery Policy',
  'Data Classification Policy',
  'Password Policy',
  'Physical Security Policy'
];

const PolicyManagement = ({ onComplete, initialData }) => {
  const [policies, setPolicies] = useState(initialData.length > 0 ? initialData : 
    REQUIRED_POLICIES.map(name => ({
      id: Date.now() + Math.random(),
      name,
      version: '',
      owner: '',
      approvedDate: '',
      reviewDate: '',
      status: 'Draft',
      file: null,
      fileName: ''
    }))
  );

  const handleFileUpload = (policyId, event) => {
    const file = event.target.files[0];
    if (file) {
      setPolicies(policies.map(policy =>
        policy.id === policyId
          ? { ...policy, file, fileName: file.name, status: 'Uploaded' }
          : policy
      ));
    }
  };

  const updatePolicy = (policyId, field, value) => {
    setPolicies(policies.map(policy =>
      policy.id === policyId ? { ...policy, [field]: value } : policy
    ));
  };

  const removePolicy = (policyId) => {
    setPolicies(policies.filter(p => p.id !== policyId));
  };

  const addCustomPolicy = () => {
    setPolicies([...policies, {
      id: Date.now(),
      name: '',
      version: '',
      owner: '',
      approvedDate: '',
      reviewDate: '',
      status: 'Draft',
      file: null,
      fileName: ''
    }]);
  };

  const handleSave = () => {
    const uploadedCount = policies.filter(p => p.file).length;
    const requiredCount = REQUIRED_POLICIES.length;
    
    if (uploadedCount < requiredCount * 0.7) {
      if (!window.confirm(`You have uploaded ${uploadedCount} out of ${requiredCount} required policies. Continue anyway?`)) {
        return;
      }
    }
    
    onComplete(policies);
  };

  const exportPolicyList = () => {
    const policyData = policies.map(p => ({
      'Policy Name': p.name,
      'Version': p.version,
      'Owner': p.owner,
      'Approved Date': p.approvedDate,
      'Review Date': p.reviewDate,
      'Status': p.status,
      'File Name': p.fileName
    }));

    const csvContent = [
      Object.keys(policyData[0]).join(','),
      ...policyData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ISMS_Policy_Register.csv';
    a.click();
  };

  const getProgress = () => {
    const uploaded = policies.filter(p => p.file).length;
    return Math.round((uploaded / policies.length) * 100);
  };

  return (
    <div className="policy-management">
      <div className="section-header">
        <h2>Step 4: Policy Management</h2>
        <p>Upload and manage your information security policies and procedures</p>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${getProgress()}%` }}></div>
          <span className="progress-text">{policies.filter(p => p.file).length} / {policies.length} Uploaded</span>
        </div>
      </div>

      <div className="policies-grid">
        {policies.map((policy) => (
          <div key={policy.id} className="policy-card">
            <div className="policy-header">
              <div className="policy-title">
                <FileText size={20} />
                <input
                  type="text"
                  value={policy.name}
                  onChange={(e) => updatePolicy(policy.id, 'name', e.target.value)}
                  placeholder="Policy Name"
                  className="policy-name-input"
                  disabled={REQUIRED_POLICIES.includes(policy.name)}
                />
              </div>
              {!REQUIRED_POLICIES.includes(policy.name) && (
                <button className="btn-icon" onClick={() => removePolicy(policy.id)}>
                  <Trash2 size={16} />
                </button>
              )}
            </div>

            <div className="policy-fields">
              <div className="field-row">
                <div className="field-group">
                  <label>Version</label>
                  <input
                    type="text"
                    value={policy.version}
                    onChange={(e) => updatePolicy(policy.id, 'version', e.target.value)}
                    placeholder="e.g., 1.0"
                    className="text-input"
                  />
                </div>

                <div className="field-group">
                  <label>Owner</label>
                  <input
                    type="text"
                    value={policy.owner}
                    onChange={(e) => updatePolicy(policy.id, 'owner', e.target.value)}
                    placeholder="e.g., CISO"
                    className="text-input"
                  />
                </div>
              </div>

              <div className="field-row">
                <div className="field-group">
                  <label>Approved Date</label>
                  <input
                    type="date"
                    value={policy.approvedDate}
                    onChange={(e) => updatePolicy(policy.id, 'approvedDate', e.target.value)}
                    className="text-input"
                  />
                </div>

                <div className="field-group">
                  <label>Next Review Date</label>
                  <input
                    type="date"
                    value={policy.reviewDate}
                    onChange={(e) => updatePolicy(policy.id, 'reviewDate', e.target.value)}
                    className="text-input"
                  />
                </div>
              </div>

              <div className="upload-section">
                <label className="upload-label">
                  <Upload size={18} />
                  {policy.fileName ? policy.fileName : 'Upload Policy Document'}
                  <input
                    type="file"
                    onChange={(e) => handleFileUpload(policy.id, e)}
                    accept=".pdf,.doc,.docx"
                    style={{ display: 'none' }}
                  />
                </label>
                {policy.file && (
                  <div className="upload-success">
                    <CheckCircle size={16} />
                    <span>Uploaded</span>
                  </div>
                )}
              </div>

              <div className="field-group">
                <label>Status</label>
                <select
                  value={policy.status}
                  onChange={(e) => updatePolicy(policy.id, 'status', e.target.value)}
                  className="select-input"
                >
                  <option value="Draft">Draft</option>
                  <option value="Uploaded">Uploaded</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Approved">Approved</option>
                  <option value="Active">Active</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="btn btn-secondary" onClick={addCustomPolicy}>
        <FileText size={18} />
        Add Custom Policy
      </button>

      <div className="action-buttons">
        <button className="btn btn-secondary" onClick={exportPolicyList}>
          <Download size={18} />
          Export Policy Register
        </button>
        <button className="btn btn-primary" onClick={handleSave}>
          <Save size={18} />
          Save & Continue to VAPT
        </button>
      </div>
    </div>
  );
};

export default PolicyManagement;
