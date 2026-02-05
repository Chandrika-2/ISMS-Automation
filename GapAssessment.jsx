import React, { useState, useEffect } from 'react';
import { iso27001Controls } from '../data/iso27001Controls';
import { Download, Save, AlertCircle, Upload, FileSpreadsheet, HelpCircle } from 'lucide-react';
import * as XLSX from 'xlsx';

const GapAssessment = ({ scopingData, onComplete, initialData }) => {
  const [assessments, setAssessments] = useState(initialData || []);
  const [currentControl, setCurrentControl] = useState('A.5');
  const [scopeContext, setScopeContext] = useState({});
  const [showQuestions, setShowQuestions] = useState({});
  const [evidenceTemplate, setEvidenceTemplate] = useState(null);

  useEffect(() => {
    // Analyze scoping data to understand client's infrastructure
    const context = analyzeScopeData(scopingData);
    setScopeContext(context);

    // Initialize assessments if empty
    if (assessments.length === 0) {
      const initialAssessments = [];
      Object.entries(iso27001Controls).forEach(([annexId, annex]) => {
        annex.controls.forEach(control => {
          initialAssessments.push({
            controlId: control.id,
            controlName: control.name,
            annex: annexId,
            description: control.description,
            implemented: '',
            currentImplementation: '',
            evidence: '',
            evidenceFiles: [],
            gaps: '',
            priority: '',
            questions: generateControlQuestions(control, context),
            answers: {}
          });
        });
      });
      setAssessments(initialAssessments);
    }
  }, [scopingData]);

  const analyzeScopeData = (data) => {
    const context = {
      hasCloud: false,
      cloudProviders: [],
      hasOnPrem: false,
      hasHybrid: false,
      hasRemoteWork: false,
      hasThirdParty: false,
      hasMobile: false,
      criticalSystems: [],
      dataTypes: [],
      locations: [],
      industry: '',
      employeeCount: 0
    };

    // Analyze infrastructure
    const infraAnswer = (data[22] || data[25] || '').toLowerCase();
    context.hasCloud = infraAnswer.includes('cloud');
    context.hasOnPrem = infraAnswer.includes('on-premise') || infraAnswer.includes('on premise');
    context.hasHybrid = infraAnswer.includes('hybrid');
    
    if (context.hasCloud) {
      if (infraAnswer.includes('aws')) context.cloudProviders.push('AWS');
      if (infraAnswer.includes('azure')) context.cloudProviders.push('Azure');
      if (infraAnswer.includes('gcp')) context.cloudProviders.push('GCP');
    }

    // Remote work
    const remoteAnswer = (data[46] || '').toLowerCase();
    context.hasRemoteWork = remoteAnswer.includes('yes') || remoteAnswer.includes('remote') || remoteAnswer.includes('hybrid');

    // Third party
    const thirdPartyAnswer = (data[12] || '').toLowerCase();
    context.hasThirdParty = thirdPartyAnswer.includes('yes') || thirdPartyAnswer.length > 10;

    // Mobile devices
    const mobileAnswer = (data[30] || '').toLowerCase();
    context.hasMobile = mobileAnswer.includes('mdm') || mobileAnswer.includes('mobile');

    // Critical systems
    const systemsAnswer = data[21] || data[24] || '';
    if (systemsAnswer) {
      context.criticalSystems = systemsAnswer.split(',').map(s => s.trim()).filter(Boolean);
    }

    // Data types
    const dataAnswer = data[23] || '';
    if (dataAnswer) {
      context.dataTypes = dataAnswer.split(',').map(d => d.trim()).filter(Boolean);
    }

    // Employee count
    const empAnswer = data[37] || '';
    const empMatch = empAnswer.match(/\d+/);
    if (empMatch) {
      context.employeeCount = parseInt(empMatch[0]);
    }

    return context;
  };

  const generateControlQuestions = (control, context) => {
    const questions = [];
    const controlId = control.id;

    // A.5.9 - Asset Inventory
    if (controlId === 'A.5.9') {
      questions.push({
        id: 'asset_inventory_tool',
        question: 'What tool or system do you use to maintain your asset inventory?',
        type: 'text',
        required: true
      });
      questions.push({
        id: 'asset_update_frequency',
        question: 'How frequently is the asset inventory updated?',
        type: 'select',
        options: ['Real-time', 'Daily', 'Weekly', 'Monthly', 'Quarterly'],
        required: true
      });
      if (context.hasCloud) {
        questions.push({
          id: 'cloud_asset_tracking',
          question: `How do you track assets in ${context.cloudProviders.join(', ')}?`,
          type: 'text',
          required: true
        });
      }
    }

    // A.5.15 - Access Control
    if (controlId === 'A.5.15') {
      questions.push({
        id: 'access_control_system',
        question: 'What system(s) do you use for access control management?',
        type: 'text',
        required: true
      });
      if (context.hasCloud) {
        questions.push({
          id: 'cloud_iam',
          question: `Do you use centralized IAM for ${context.cloudProviders.join(', ')}?`,
          type: 'select',
          options: ['Yes - Centralized', 'Yes - Per Provider', 'No', 'Partially'],
          required: true
        });
      }
    }

    // A.5.19 - Supplier Relationships
    if (controlId === 'A.5.19' && context.hasThirdParty) {
      questions.push({
        id: 'supplier_assessment',
        question: 'How do you assess security risks of third-party suppliers?',
        type: 'text',
        required: true
      });
      questions.push({
        id: 'supplier_contracts',
        question: 'Do all supplier contracts include security requirements?',
        type: 'select',
        options: ['Yes - All', 'Yes - Critical only', 'Partially', 'No'],
        required: true
      });
    }

    // A.5.23 - Cloud Services
    if (controlId === 'A.5.23' && context.hasCloud) {
      context.cloudProviders.forEach(provider => {
        questions.push({
          id: `cloud_security_${provider.toLowerCase()}`,
          question: `What security controls are implemented in ${provider}?`,
          type: 'textarea',
          required: true
        });
      });
    }

    // A.6.7 - Remote Working
    if (controlId === 'A.6.7' && context.hasRemoteWork) {
      questions.push({
        id: 'remote_vpn',
        question: 'What VPN solution do you use for remote access?',
        type: 'text',
        required: true
      });
      questions.push({
        id: 'remote_mfa',
        question: 'Is MFA enforced for all remote access?',
        type: 'select',
        options: ['Yes - All users', 'Yes - Privileged only', 'Partially', 'No'],
        required: true
      });
    }

    // A.8.1 - User Endpoint Devices
    if (controlId === 'A.8.1') {
      questions.push({
        id: 'endpoint_protection',
        question: 'What endpoint protection software is deployed?',
        type: 'text',
        required: true
      });
      if (context.hasMobile) {
        questions.push({
          id: 'mdm_solution',
          question: 'What MDM solution is used for mobile device management?',
          type: 'text',
          required: true
        });
      }
    }

    // A.8.8 - Vulnerability Management
    if (controlId === 'A.8.8') {
      questions.push({
        id: 'vuln_scanning_tool',
        question: 'What vulnerability scanning tool(s) do you use?',
        type: 'text',
        required: true
      });
      questions.push({
        id: 'vuln_scan_frequency',
        question: 'How often are vulnerability scans performed?',
        type: 'select',
        options: ['Continuous', 'Weekly', 'Monthly', 'Quarterly', 'Annually'],
        required: true
      });
    }

    // A.8.9 - Configuration Management
    if (controlId === 'A.8.9') {
      questions.push({
        id: 'config_management_tool',
        question: 'What configuration management tools are in use?',
        type: 'text',
        required: false
      });
      if (context.hasCloud) {
        questions.push({
          id: 'iac_usage',
          question: 'Do you use Infrastructure as Code (IaC)?',
          type: 'select',
          options: ['Yes - Terraform', 'Yes - CloudFormation', 'Yes - Other', 'No'],
          required: true
        });
      }
    }

    // A.8.13 - Backup
    if (controlId === 'A.8.13') {
      questions.push({
        id: 'backup_solution',
        question: 'What backup solution/tool is implemented?',
        type: 'text',
        required: true
      });
      questions.push({
        id: 'backup_frequency',
        question: 'What is the backup frequency for critical systems?',
        type: 'select',
        options: ['Real-time/Continuous', 'Hourly', 'Daily', 'Weekly'],
        required: true
      });
      questions.push({
        id: 'backup_testing',
        question: 'How often are backup restores tested?',
        type: 'select',
        options: ['Monthly', 'Quarterly', 'Semi-annually', 'Annually', 'Never'],
        required: true
      });
    }

    // A.8.15 - Logging
    if (controlId === 'A.8.15') {
      questions.push({
        id: 'logging_tool',
        question: 'What logging/SIEM solution is used?',
        type: 'text',
        required: true
      });
      questions.push({
        id: 'log_retention',
        question: 'What is the log retention period?',
        type: 'select',
        options: ['30 days', '90 days', '6 months', '1 year', '2+ years'],
        required: true
      });
    }

    // A.8.16 - Monitoring
    if (controlId === 'A.8.16') {
      questions.push({
        id: 'monitoring_tools',
        question: 'What monitoring tools are deployed?',
        type: 'text',
        required: true
      });
      questions.push({
        id: 'alert_response_time',
        question: 'What is the average response time to security alerts?',
        type: 'select',
        options: ['< 15 minutes', '< 1 hour', '< 4 hours', '< 24 hours', 'Varies'],
        required: true
      });
    }

    // A.8.20 - Network Security
    if (controlId === 'A.8.20') {
      questions.push({
        id: 'firewall_solution',
        question: 'What firewall solution(s) are in place?',
        type: 'text',
        required: true
      });
      questions.push({
        id: 'network_segmentation',
        question: 'Is network segmentation implemented?',
        type: 'select',
        options: ['Yes - VLANs', 'Yes - Physical', 'Yes - Both', 'No'],
        required: true
      });
    }

    // A.8.24 - Cryptography
    if (controlId === 'A.8.24') {
      questions.push({
        id: 'encryption_at_rest',
        question: 'What encryption is used for data at rest?',
        type: 'text',
        required: true
      });
      questions.push({
        id: 'encryption_in_transit',
        question: 'What protocols are used for data in transit?',
        type: 'text',
        required: true
      });
      if (context.hasCloud) {
        questions.push({
          id: 'key_management',
          question: 'What key management solution is used?',
          type: 'text',
          required: true
        });
      }
    }

    return questions;
  };

  const handleAssessmentChange = (controlId, field, value) => {
    setAssessments(prev => prev.map(assessment =>
      assessment.controlId === controlId
        ? { ...assessment, [field]: value }
        : assessment
    ));
  };

  const handleQuestionAnswer = (controlId, questionId, answer) => {
    setAssessments(prev => prev.map(assessment =>
      assessment.controlId === controlId
        ? { 
            ...assessment, 
            answers: { ...assessment.answers, [questionId]: answer }
          }
        : assessment
    ));
  };

  const handleEvidenceUpload = (controlId, event) => {
    const files = Array.from(event.target.files);
    setAssessments(prev => prev.map(assessment =>
      assessment.controlId === controlId
        ? { 
            ...assessment, 
            evidenceFiles: [...(assessment.evidenceFiles || []), ...files.map(f => ({ name: f.name, size: f.size }))]
          }
        : assessment
    ));
  };

  const toggleQuestions = (controlId) => {
    setShowQuestions(prev => ({
      ...prev,
      [controlId]: !prev[controlId]
    }));
  };

  const generateEvidenceTemplate = () => {
    const templateData = [];
    
    Object.entries(iso27001Controls).forEach(([annexId, annex]) => {
      annex.controls.forEach(control => {
        templateData.push({
          'Control ID': control.id,
          'Control Name': control.name,
          'Evidence Required': 'Describe the evidence here',
          'Evidence Location': 'File path or URL',
          'Evidence Owner': 'Name/Department',
          'Last Updated': 'YYYY-MM-DD',
          'Remarks': ''
        });
      });
    });

    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Evidence Template');
    
    // Add instructions sheet
    const instructions = [
      { Instruction: 'Fill in the evidence details for each control' },
      { Instruction: 'Evidence Required: Describe what evidence exists (e.g., Policy document, Screenshots, Logs)' },
      { Instruction: 'Evidence Location: Specify where the evidence is stored' },
      { Instruction: 'Evidence Owner: Who maintains this evidence' },
      { Instruction: 'Last Updated: When was this evidence last verified' },
      { Instruction: 'Upload this completed file back to the system' }
    ];
    const wsInst = XLSX.utils.json_to_sheet(instructions);
    XLSX.utils.book_append_sheet(wb, wsInst, 'Instructions');
    
    XLSX.writeFile(wb, 'ISMS_Evidence_Template.xlsx');
  };

  const handleEvidenceTemplateUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        // Map evidence data to assessments
        setAssessments(prev => prev.map(assessment => {
          const evidenceRow = jsonData.find(row => row['Control ID'] === assessment.controlId);
          if (evidenceRow) {
            return {
              ...assessment,
              evidence: evidenceRow['Evidence Required'] || assessment.evidence,
              evidenceLocation: evidenceRow['Evidence Location'] || '',
              evidenceOwner: evidenceRow['Evidence Owner'] || '',
              lastUpdated: evidenceRow['Last Updated'] || ''
            };
          }
          return assessment;
        }));
        
        setEvidenceTemplate(file.name);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const exportToExcel = () => {
    const gapData = assessments
      .filter(a => a.implemented !== 'Fully Implemented' && a.implemented !== 'Not Applicable')
      .map(a => ({
        'Control ID': a.controlId,
        'Control Name': a.controlName,
        'Annex': a.annex,
        'Implementation Status': a.implemented,
        'Current Implementation': a.currentImplementation || '',
        'Evidence': a.evidence,
        'Evidence Files': a.evidenceFiles?.map(f => f.name).join(', ') || '',
        'Identified Gaps': a.gaps,
        'Priority': a.priority,
        'Questions Asked': a.questions?.length || 0,
        'Questions Answered': Object.keys(a.answers || {}).length
      }));

    const ws = XLSX.utils.json_to_sheet(gapData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Gap Assessment');
    
    // Add detailed Q&A sheet
    const qaData = [];
    assessments.forEach(a => {
      if (a.questions && a.questions.length > 0) {
        a.questions.forEach(q => {
          qaData.push({
            'Control ID': a.controlId,
            'Control Name': a.controlName,
            'Question': q.question,
            'Answer': a.answers?.[q.id] || 'Not Answered',
            'Required': q.required ? 'Yes' : 'No'
          });
        });
      }
    });
    
    if (qaData.length > 0) {
      const wsQA = XLSX.utils.json_to_sheet(qaData);
      XLSX.utils.book_append_sheet(wb, wsQA, 'Detailed Q&A');
    }
    
    // Add summary sheet
    const summary = [
      { Metric: 'Total Controls', Value: assessments.length },
      { Metric: 'Fully Implemented', Value: assessments.filter(a => a.implemented === 'Fully Implemented').length },
      { Metric: 'Partially Implemented', Value: assessments.filter(a => a.implemented === 'Partially Implemented').length },
      { Metric: 'Not Implemented', Value: assessments.filter(a => a.implemented === 'Not Implemented').length },
      { Metric: 'Not Applicable', Value: assessments.filter(a => a.implemented === 'Not Applicable').length },
      { Metric: 'Total Gaps', Value: gapData.length },
      { Metric: 'High Priority Gaps', Value: gapData.filter(g => g.Priority === 'High').length },
      { Metric: 'Questions Asked', Value: assessments.reduce((sum, a) => sum + (a.questions?.length || 0), 0) },
      { Metric: 'Questions Answered', Value: assessments.reduce((sum, a) => sum + Object.keys(a.answers || {}).length, 0) },
      { Metric: 'Evidence Files Uploaded', Value: assessments.reduce((sum, a) => sum + (a.evidenceFiles?.length || 0), 0) }
    ];
    
    // Add infrastructure context
    if (scopeContext.hasCloud) {
      summary.push({ Metric: 'Cloud Providers', Value: scopeContext.cloudProviders.join(', ') });
    }
    if (scopeContext.criticalSystems.length > 0) {
      summary.push({ Metric: 'Critical Systems Count', Value: scopeContext.criticalSystems.length });
    }
    
    const wsSummary = XLSX.utils.json_to_sheet(summary);
    XLSX.utils.book_append_sheet(wb, wsSummary, 'Summary');
    
    XLSX.writeFile(wb, 'ISMS_Gap_Assessment.xlsx');
  };

  const handleSave = () => {
    const completedCount = assessments.filter(a => a.implemented).length;
    const totalCount = assessments.length;
    
    if (completedCount < totalCount * 0.8) {
      if (!window.confirm(`You have assessed ${completedCount} out of ${totalCount} controls. Continue anyway?`)) {
        return;
      }
    }
    
    onComplete(assessments);
  };

  const getProgress = () => {
    const completed = assessments.filter(a => a.implemented).length;
    return Math.round((completed / assessments.length) * 100);
  };

  const currentControlData = iso27001Controls[currentControl];
  const currentAssessments = assessments.filter(a => a.annex === currentControl);

  return (
    <div className="gap-assessment">
      <div className="section-header">
        <h2>Step 2: Gap Assessment</h2>
        <p>Assess your current implementation status against ISO 27001 controls</p>
        
        {/* Infrastructure Context Banner */}
        <div className="info-banner">
          <AlertCircle size={18} />
          <div>
            <strong>Your Infrastructure Context:</strong>
            <div className="context-tags">
              {scopeContext.hasCloud && <span className="tag cloud">Cloud: {scopeContext.cloudProviders.join(', ')}</span>}
              {scopeContext.hasOnPrem && <span className="tag onprem">On-Premise</span>}
              {scopeContext.hasHybrid && <span className="tag hybrid">Hybrid</span>}
              {scopeContext.hasRemoteWork && <span className="tag remote">Remote Work</span>}
              {scopeContext.hasThirdParty && <span className="tag vendor">Third-Party Vendors</span>}
              {scopeContext.hasMobile && <span className="tag mobile">Mobile Devices</span>}
            </div>
            <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
              Questions have been tailored based on your infrastructure and scope.
            </p>
          </div>
        </div>

        {/* Evidence Template Section */}
        <div className="evidence-template-section">
          <h3>Evidence Collection</h3>
          <p>Download the template, fill in your evidence details, and upload it back:</p>
          <div className="template-actions">
            <button className="btn btn-secondary" onClick={generateEvidenceTemplate}>
              <Download size={18} />
              Download Evidence Template (Excel)
            </button>
            <label className="btn btn-secondary upload-btn">
              <Upload size={18} />
              {evidenceTemplate ? `Uploaded: ${evidenceTemplate}` : 'Upload Completed Template'}
              <input
                type="file"
                onChange={handleEvidenceTemplateUpload}
                accept=".xlsx,.xls"
                style={{ display: 'none' }}
              />
            </label>
          </div>
        </div>

        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${getProgress()}%` }}></div>
          <span className="progress-text">{getProgress()}% Complete</span>
        </div>
      </div>

      <div className="control-selector">
        {Object.entries(iso27001Controls).map(([annexId, annex]) => (
          <button
            key={annexId}
            className={`control-tab ${currentControl === annexId ? 'active' : ''}`}
            onClick={() => setCurrentControl(annexId)}
          >
            {annexId}: {annex.name}
            <span className="control-count">
              {currentAssessments.filter(a => a.annex === annexId && a.implemented).length} / 
              {annex.controls.length}
            </span>
          </button>
        ))}
      </div>

      <div className="assessment-container">
        <h3>{currentControl}: {currentControlData.name}</h3>
        
        <div className="controls-grid">
          {currentControlData.controls.map((control) => {
            const assessment = assessments.find(a => a.controlId === control.id) || {};
            const hasQuestions = assessment.questions && assessment.questions.length > 0;
            
            return (
              <div key={control.id} className="control-card">
                <div className="control-header">
                  <h4>{control.id}</h4>
                  {hasQuestions && (
                    <span className="question-indicator">
                      {assessment.questions.length} questions
                    </span>
                  )}
                </div>
                <h5>{control.name}</h5>
                <p className="control-description">{control.description}</p>
                
                <div className="assessment-fields">
                  <div className="field-group">
                    <label>Implementation Status</label>
                    <select
                      value={assessment.implemented || ''}
                      onChange={(e) => handleAssessmentChange(control.id, 'implemented', e.target.value)}
                      className="select-input"
                    >
                      <option value="">Select status...</option>
                      <option value="Fully Implemented">Fully Implemented</option>
                      <option value="Partially Implemented">Partially Implemented</option>
                      <option value="Not Implemented">Not Implemented</option>
                      <option value="Not Applicable">Not Applicable</option>
                    </select>
                  </div>

                  {assessment.implemented && assessment.implemented !== 'Not Applicable' && (
                    <>
                      {/* Context-Specific Questions */}
                      {hasQuestions && (
                        <div className="questions-section">
                          <button 
                            className="questions-toggle"
                            onClick={() => toggleQuestions(control.id)}
                            type="button"
                          >
                            <HelpCircle size={16} />
                            {showQuestions[control.id] ? 'Hide' : 'Show'} Assessment Questions
                            ({Object.keys(assessment.answers || {}).length}/{assessment.questions.length} answered)
                          </button>
                          
                          {showQuestions[control.id] && (
                            <div className="questions-list">
                              {assessment.questions.map((q, idx) => (
                                <div key={q.id} className="question-item">
                                  <label>
                                    {idx + 1}. {q.question}
                                    {q.required && <span className="required">*</span>}
                                  </label>
                                  {q.type === 'text' && (
                                    <input
                                      type="text"
                                      value={assessment.answers?.[q.id] || ''}
                                      onChange={(e) => handleQuestionAnswer(control.id, q.id, e.target.value)}
                                      className="text-input"
                                      placeholder="Enter your answer..."
                                    />
                                  )}
                                  {q.type === 'textarea' && (
                                    <textarea
                                      value={assessment.answers?.[q.id] || ''}
                                      onChange={(e) => handleQuestionAnswer(control.id, q.id, e.target.value)}
                                      className="textarea-input"
                                      rows={3}
                                      placeholder="Enter your answer..."
                                    />
                                  )}
                                  {q.type === 'select' && (
                                    <select
                                      value={assessment.answers?.[q.id] || ''}
                                      onChange={(e) => handleQuestionAnswer(control.id, q.id, e.target.value)}
                                      className="select-input"
                                    >
                                      <option value="">Select an option...</option>
                                      {q.options.map(opt => (
                                        <option key={opt} value={opt}>{opt}</option>
                                      ))}
                                    </select>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      <div className="field-group">
                        <label>Current Implementation Details</label>
                        <textarea
                          value={assessment.currentImplementation || ''}
                          onChange={(e) => handleAssessmentChange(control.id, 'currentImplementation', e.target.value)}
                          placeholder="Describe how this control is currently implemented in your organization..."
                          rows={3}
                          className="textarea-input"
                        />
                      </div>

                      {/* Evidence Upload */}
                      <div className="field-group">
                        <label>Evidence / Supporting Documents</label>
                        <div className="evidence-upload">
                          <label className="upload-label small">
                            <FileSpreadsheet size={16} />
                            Upload Evidence Files
                            <input
                              type="file"
                              onChange={(e) => handleEvidenceUpload(control.id, e)}
                              multiple
                              accept=".pdf,.doc,.docx,.xlsx,.xls,.png,.jpg,.jpeg"
                              style={{ display: 'none' }}
                            />
                          </label>
                          {assessment.evidenceFiles && assessment.evidenceFiles.length > 0 && (
                            <div className="uploaded-files">
                              {assessment.evidenceFiles.map((file, idx) => (
                                <div key={idx} className="file-chip">
                                  <FileSpreadsheet size={14} />
                                  <span>{file.name}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <textarea
                          value={assessment.evidence || ''}
                          onChange={(e) => handleAssessmentChange(control.id, 'evidence', e.target.value)}
                          placeholder="Describe evidence (or use template upload above)..."
                          rows={2}
                          className="textarea-input"
                        />
                      </div>

                      {assessment.implemented !== 'Fully Implemented' && (
                        <>
                          <div className="field-group">
                            <label>Identified Gaps</label>
                            <textarea
                              value={assessment.gaps || ''}
                              onChange={(e) => handleAssessmentChange(control.id, 'gaps', e.target.value)}
                              placeholder="Describe the gaps and missing controls..."
                              rows={2}
                              className="textarea-input"
                            />
                          </div>
                          
                          <div className="field-group">
                            <label>Priority</label>
                            <select
                              value={assessment.priority || ''}
                              onChange={(e) => handleAssessmentChange(control.id, 'priority', e.target.value)}
                              className="select-input"
                            >
                              <option value="">Select priority...</option>
                              <option value="High">High</option>
                              <option value="Medium">Medium</option>
                              <option value="Low">Low</option>
                            </select>
                          </div>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="action-buttons">
        <button className="btn btn-secondary" onClick={exportToExcel}>
          <Download size={18} />
          Export Gap Report
        </button>
        <button className="btn btn-primary" onClick={handleSave}>
          <Save size={18} />
          Save & Continue to Risk Management
        </button>
      </div>
    </div>
  );
};

export default GapAssessment;
