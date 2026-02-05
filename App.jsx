import React, { useState } from 'react';
import { FileText, Shield, AlertTriangle, Upload, CheckCircle, Calendar, Download } from 'lucide-react';
import ScopingQuestions from './components/ScopingQuestions';
import GapAssessment from './components/GapAssessment';
import RiskManagement from './components/RiskManagement';
import PolicyManagement from './components/PolicyManagement';
import VAPTManagement from './components/VAPTManagement';
import InternalAudit from './components/InternalAudit';
import Dashboard from './components/Dashboard';
import './App.css';

const STEPS = [
  { id: 'scoping', name: 'Scoping Questions', icon: FileText },
  { id: 'gap', name: 'Gap Assessment', icon: Shield },
  { id: 'risk', name: 'Risk Management', icon: AlertTriangle },
  { id: 'policy', name: 'Policy Management', icon: Upload },
  { id: 'vapt', name: 'VAPT', icon: CheckCircle },
  { id: 'audit', name: 'Internal Audit', icon: Calendar },
  { id: 'dashboard', name: 'Dashboard', icon: Download }
];

function App() {
  const [currentStep, setCurrentStep] = useState('scoping');
  const [scopingData, setScopingData] = useState({});
  const [gapData, setGapData] = useState([]);
  const [riskData, setRiskData] = useState([]);
  const [policyData, setPolicyData] = useState([]);
  const [vaptData, setVaptData] = useState([]);
  const [auditData, setAuditData] = useState({});

  const handleScopingComplete = (data) => {
    setScopingData(data);
    setCurrentStep('gap');
  };

  const handleGapComplete = (data) => {
    setGapData(data);
    setCurrentStep('risk');
  };

  const handleRiskComplete = (data) => {
    setRiskData(data);
    setCurrentStep('policy');
  };

  const handlePolicyComplete = (data) => {
    setPolicyData(data);
    setCurrentStep('vapt');
  };

  const handleVAPTComplete = (data) => {
    setVaptData(data);
    setCurrentStep('audit');
  };

  const handleAuditComplete = (data) => {
    setAuditData(data);
    setCurrentStep('dashboard');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'scoping':
        return <ScopingQuestions onComplete={handleScopingComplete} initialData={scopingData} />;
      case 'gap':
        return <GapAssessment scopingData={scopingData} onComplete={handleGapComplete} initialData={gapData} />;
      case 'risk':
        return <RiskManagement gapData={gapData} onComplete={handleRiskComplete} initialData={riskData} />;
      case 'policy':
        return <PolicyManagement onComplete={handlePolicyComplete} initialData={policyData} />;
      case 'vapt':
        return <VAPTManagement onComplete={handleVAPTComplete} initialData={vaptData} />;
      case 'audit':
        return <InternalAudit onComplete={handleAuditComplete} initialData={auditData} />;
      case 'dashboard':
        return (
          <Dashboard
            scopingData={scopingData}
            gapData={gapData}
            riskData={riskData}
            policyData={policyData}
            vaptData={vaptData}
            auditData={auditData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="logo">
            <Shield size={32} />
            <h1>ISMS Automation Tool</h1>
          </div>
          <p className="subtitle">ISO 27001 Compliance Management System</p>
        </div>
      </header>

      <div className="stepper">
        {STEPS.map((step, index) => {
          const Icon = step.icon;
          const isActive = currentStep === step.id;
          const isCompleted = STEPS.findIndex(s => s.id === currentStep) > index;
          
          return (
            <div key={step.id} className="stepper-wrapper">
              <button
                className={`step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                onClick={() => setCurrentStep(step.id)}
                disabled={!isCompleted && !isActive}
              >
                <div className="step-icon">
                  <Icon size={20} />
                </div>
                <span className="step-name">{step.name}</span>
              </button>
              {index < STEPS.length - 1 && <div className="step-connector" />}
            </div>
          );
        })}
      </div>

      <main className="main-content">
        {renderStep()}
      </main>

      <footer className="app-footer">
        <p>© 2024 ISMS Automation Tool | ISO 27001:2022 Compliant</p>
      </footer>
    </div>
  );
}

export default App;
