import React from 'react';
import { Download, FileText, Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import * as XLSX from 'xlsx';

const Dashboard = ({ scopingData, gapData, riskData, policyData, vaptData, auditData }) => {
  
  const exportCompleteReport = () => {
    const wb = XLSX.utils.book_new();

    // Scoping Summary
    const scopingSummary = Object.entries(scopingData).map(([qId, answer]) => ({
      'Question ID': qId,
      'Response': answer
    }));
    const wsScoping = XLSX.utils.json_to_sheet(scopingSummary);
    XLSX.utils.book_append_sheet(wb, wsScoping, 'Scoping Responses');

    // Gap Assessment
    const gapSummary = gapData.map(g => ({
      'Control ID': g.controlId,
      'Control Name': g.controlName,
      'Annex': g.annex,
      'Status': g.implemented,
      'Gaps': g.gaps,
      'Priority': g.priority
    }));
    const wsGap = XLSX.utils.json_to_sheet(gapSummary);
    XLSX.utils.book_append_sheet(wb, wsGap, 'Gap Assessment');

    // Risk Register
    const riskSummary = riskData.map((r, i) => ({
      'Risk ID': `RISK-${String(i + 1).padStart(3, '0')}`,
      'Asset': r.asset,
      'Threat': r.threat,
      'Likelihood': r.likelihood,
      'Impact': r.impact,
      'Risk Level': r.riskLevel,
      'Treatment': r.treatment,
      'Owner': r.owner,
      'Status': r.status
    }));
    const wsRisk = XLSX.utils.json_to_sheet(riskSummary);
    XLSX.utils.book_append_sheet(wb, wsRisk, 'Risk Register');

    // Policy Register
    const policySummary = policyData.map(p => ({
      'Policy Name': p.name,
      'Version': p.version,
      'Owner': p.owner,
      'Status': p.status,
      'Approved': p.approvedDate,
      'Next Review': p.reviewDate
    }));
    const wsPolicy = XLSX.utils.json_to_sheet(policySummary);
    XLSX.utils.book_append_sheet(wb, wsPolicy, 'Policy Register');

    // VAPT Summary
    const vaptSummary = vaptData.map(v => ({
      'Assessment Type': v.type,
      'Scope': v.scope,
      'Vendor': v.vendor,
      'Start Date': v.startDate,
      'End Date': v.endDate,
      'Critical': v.criticalFindings,
      'High': v.highFindings,
      'Medium': v.mediumFindings,
      'Low': v.lowFindings,
      'Status': v.status
    }));
    const wsVAPT = XLSX.utils.json_to_sheet(vaptSummary);
    XLSX.utils.book_append_sheet(wb, wsVAPT, 'VAPT');

    // Audit Summary
    const auditSummary = [{
      'Start Date': auditData.startDate,
      'End Date': auditData.endDate,
      'Audit Team': auditData.auditTeam,
      'Major NC': auditData.nonConformities?.major || 0,
      'Minor NC': auditData.nonConformities?.minor || 0,
      'Observations': auditData.nonConformities?.observations || 0,
      'Status': auditData.status
    }];
    const wsAudit = XLSX.utils.json_to_sheet(auditSummary);
    XLSX.utils.book_append_sheet(wb, wsAudit, 'Internal Audit');

    XLSX.writeFile(wb, 'ISMS_Complete_Report.xlsx');
  };

  // Calculate statistics
  const stats = {
    totalControls: gapData.length,
    fullyImplemented: gapData.filter(g => g.implemented === 'Fully Implemented').length,
    partiallyImplemented: gapData.filter(g => g.implemented === 'Partially Implemented').length,
    notImplemented: gapData.filter(g => g.implemented === 'Not Implemented').length,
    totalGaps: gapData.filter(g => g.implemented !== 'Fully Implemented' && g.implemented !== 'Not Applicable').length,
    highPriorityGaps: gapData.filter(g => g.priority === 'High').length,
    
    totalRisks: riskData.length,
    criticalRisks: riskData.filter(r => r.riskLevel === 'Critical').length,
    highRisks: riskData.filter(r => r.riskLevel === 'High').length,
    mediumRisks: riskData.filter(r => r.riskLevel === 'Medium').length,
    lowRisks: riskData.filter(r => r.riskLevel === 'Low').length,
    
    totalPolicies: policyData.length,
    uploadedPolicies: policyData.filter(p => p.file).length,
    
    vaptCritical: vaptData.reduce((sum, v) => sum + (parseInt(v.criticalFindings) || 0), 0),
    vaptHigh: vaptData.reduce((sum, v) => sum + (parseInt(v.highFindings) || 0), 0),
    vaptMedium: vaptData.reduce((sum, v) => sum + (parseInt(v.mediumFindings) || 0), 0),
    vaptLow: vaptData.reduce((sum, v) => sum + (parseInt(v.lowFindings) || 0), 0),
    
    majorNC: parseInt(auditData.nonConformities?.major) || 0,
    minorNC: parseInt(auditData.nonConformities?.minor) || 0,
    observations: parseInt(auditData.nonConformities?.observations) || 0
  };

  const complianceScore = stats.totalControls > 0 
    ? Math.round((stats.fullyImplemented / stats.totalControls) * 100)
    : 0;

  return (
    <div className="dashboard">
      <div className="section-header">
        <h2>ISMS Dashboard</h2>
        <p>Complete overview of your ISO 27001 compliance status</p>
      </div>

      <div className="dashboard-summary">
        <div className="summary-card primary">
          <div className="summary-icon">
            <Shield size={32} />
          </div>
          <div className="summary-content">
            <h3>Overall Compliance</h3>
            <div className="compliance-score">{complianceScore}%</div>
            <p>{stats.fullyImplemented} / {stats.totalControls} controls implemented</p>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon">
            <AlertTriangle size={32} />
          </div>
          <div className="summary-content">
            <h3>Critical Items</h3>
            <div className="stat-number">{stats.highPriorityGaps + stats.criticalRisks}</div>
            <p>{stats.highPriorityGaps} gaps + {stats.criticalRisks} critical risks</p>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon">
            <FileText size={32} />
          </div>
          <div className="summary-content">
            <h3>Documentation</h3>
            <div className="stat-number">{stats.uploadedPolicies}</div>
            <p>{stats.uploadedPolicies} / {stats.totalPolicies} policies uploaded</p>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon">
            <CheckCircle size={32} />
          </div>
          <div className="summary-content">
            <h3>Audit Findings</h3>
            <div className="stat-number">{stats.majorNC + stats.minorNC}</div>
            <p>{stats.majorNC} major + {stats.minorNC} minor NC</p>
          </div>
        </div>
      </div>

      <div className="dashboard-sections">
        <div className="dashboard-card">
          <h3>Gap Assessment Status</h3>
          <div className="chart-container">
            <div className="bar-chart">
              <div className="bar-item">
                <div className="bar-label">Fully Implemented</div>
                <div className="bar-wrapper">
                  <div className="bar fully" style={{ width: `${(stats.fullyImplemented / stats.totalControls) * 100}%` }}>
                    {stats.fullyImplemented}
                  </div>
                </div>
              </div>
              <div className="bar-item">
                <div className="bar-label">Partially Implemented</div>
                <div className="bar-wrapper">
                  <div className="bar partial" style={{ width: `${(stats.partiallyImplemented / stats.totalControls) * 100}%` }}>
                    {stats.partiallyImplemented}
                  </div>
                </div>
              </div>
              <div className="bar-item">
                <div className="bar-label">Not Implemented</div>
                <div className="bar-wrapper">
                  <div className="bar not" style={{ width: `${(stats.notImplemented / stats.totalControls) * 100}%` }}>
                    {stats.notImplemented}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <h3>Risk Distribution</h3>
          <div className="risk-distribution">
            <div className="risk-item critical">
              <div className="risk-count">{stats.criticalRisks}</div>
              <div className="risk-label">Critical</div>
            </div>
            <div className="risk-item high">
              <div className="risk-count">{stats.highRisks}</div>
              <div className="risk-label">High</div>
            </div>
            <div className="risk-item medium">
              <div className="risk-count">{stats.mediumRisks}</div>
              <div className="risk-label">Medium</div>
            </div>
            <div className="risk-item low">
              <div className="risk-count">{stats.lowRisks}</div>
              <div className="risk-label">Low</div>
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <h3>VAPT Findings</h3>
          <div className="vapt-summary">
            <div className="vapt-stat">
              <span className="vapt-label">Critical:</span>
              <span className="vapt-value critical">{stats.vaptCritical}</span>
            </div>
            <div className="vapt-stat">
              <span className="vapt-label">High:</span>
              <span className="vapt-value high">{stats.vaptHigh}</span>
            </div>
            <div className="vapt-stat">
              <span className="vapt-label">Medium:</span>
              <span className="vapt-value medium">{stats.vaptMedium}</span>
            </div>
            <div className="vapt-stat">
              <span className="vapt-label">Low:</span>
              <span className="vapt-value low">{stats.vaptLow}</span>
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <h3>Audit Results</h3>
          {auditData.startDate ? (
            <div className="audit-results">
              <p><strong>Audit Period:</strong> {auditData.startDate} to {auditData.endDate}</p>
              <div className="nc-summary">
                <div className="nc-item">
                  <span className="nc-number major">{stats.majorNC}</span>
                  <span className="nc-label">Major NC</span>
                </div>
                <div className="nc-item">
                  <span className="nc-number minor">{stats.minorNC}</span>
                  <span className="nc-label">Minor NC</span>
                </div>
                <div className="nc-item">
                  <span className="nc-number obs">{stats.observations}</span>
                  <span className="nc-label">Observations</span>
                </div>
              </div>
              <p className="audit-status">Status: <strong>{auditData.status}</strong></p>
            </div>
          ) : (
            <p className="no-data">No audit data available</p>
          )}
        </div>
      </div>

      <div className="recommendations-section">
        <h3>Key Recommendations</h3>
        <ul className="recommendations-list">
          {stats.highPriorityGaps > 0 && (
            <li className="recommendation high">
              Address {stats.highPriorityGaps} high-priority gaps identified in the gap assessment
            </li>
          )}
          {stats.criticalRisks > 0 && (
            <li className="recommendation critical">
              Immediate action required for {stats.criticalRisks} critical risks
            </li>
          )}
          {stats.vaptCritical > 0 && (
            <li className="recommendation critical">
              Remediate {stats.vaptCritical} critical vulnerabilities from VAPT
            </li>
          )}
          {stats.majorNC > 0 && (
            <li className="recommendation high">
              Resolve {stats.majorNC} major non-conformities from internal audit
            </li>
          )}
          {stats.uploadedPolicies < stats.totalPolicies && (
            <li className="recommendation medium">
              Complete documentation: {stats.totalPolicies - stats.uploadedPolicies} policies pending upload
            </li>
          )}
          {complianceScore >= 80 && stats.criticalRisks === 0 && (
            <li className="recommendation success">
              Strong compliance foundation - consider scheduling external certification audit
            </li>
          )}
        </ul>
      </div>

      <div className="action-buttons">
        <button className="btn btn-primary" onClick={exportCompleteReport}>
          <Download size={18} />
          Export Complete ISMS Report
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
