# ISMS Automation Tool - Project Structure

## Complete File Overview

```
isms-tool/
│
├── 📄 package.json              # Project dependencies and scripts
├── 📄 vite.config.js            # Vite build configuration
├── 📄 netlify.toml              # Netlify deployment configuration
├── 📄 .gitignore               # Git ignore rules
├── 📄 index.html               # HTML entry point
├── 📄 README.md                # Complete project documentation
├── 📄 DEPLOYMENT.md            # Step-by-step deployment guide
│
└── src/
    ├── 📄 main.jsx             # React application entry point
    ├── 📄 App.jsx              # Main application component with routing
    ├── 📄 App.css              # Global styles (comprehensive styling)
    │
    ├── components/             # React components for each step
    │   ├── 📄 ScopingQuestions.jsx      # Step 1: Scoping questionnaire
    │   ├── 📄 GapAssessment.jsx         # Step 2: ISO 27001 gap analysis
    │   ├── 📄 RiskManagement.jsx        # Step 3: Risk register
    │   ├── 📄 PolicyManagement.jsx      # Step 4: Policy uploads
    │   ├── 📄 VAPTManagement.jsx        # Step 5: VAPT tracking
    │   ├── 📄 InternalAudit.jsx         # Step 6: Audit management
    │   └── 📄 Dashboard.jsx             # Step 7: Comprehensive dashboard
    │
    └── data/                   # Static data and configurations
        ├── 📄 scopingQuestions.js       # 68 scoping questions across 12 sections
        └── 📄 iso27001Controls.js       # 93 ISO 27001:2022 Annex A controls
```

## Key Components Explained

### 1. **ScopingQuestions.jsx**
- **Purpose**: Collect organizational information to define ISMS scope
- **Features**:
  - 68 questions across 12 sections
  - Collapsible sections for better UX
  - Progress tracking
  - Auto-save responses
- **Data Flow**: Saves to `scopingData` state → passed to GapAssessment

### 2. **GapAssessment.jsx**
- **Purpose**: Assess current state against ISO 27001 controls
- **Features**:
  - 93 Annex A controls (A.5, A.6, A.7, A.8)
  - Dynamic cloud-specific control highlighting
  - Implementation status tracking
  - Gap identification with priorities
  - Excel export functionality
- **Intelligence**: Detects cloud providers from scoping responses
- **Data Flow**: Receives `scopingData` → Saves to `gapData` → passed to RiskManagement

### 3. **RiskManagement.jsx**
- **Purpose**: Identify and assess information security risks
- **Features**:
  - Manual risk entry
  - Auto-calculation: Likelihood × Impact = Risk Level
  - Treatment planning
  - Risk owner assignment
  - Status tracking
  - Excel export
- **Data Flow**: Receives `gapData` for context → Saves to `riskData`

### 4. **PolicyManagement.jsx**
- **Purpose**: Track and upload security policies
- **Features**:
  - 10 pre-defined required policies
  - Custom policy addition
  - Version control
  - Approval and review date tracking
  - File upload interface
  - CSV export
- **Data Flow**: Independent → Saves to `policyData`

### 5. **VAPTManagement.jsx**
- **Purpose**: Document vulnerability assessment and penetration testing
- **Features**:
  - 3 VAPT types (External, Internal, Cloud)
  - Severity-based findings tracking
  - Report upload
  - Consolidated summary
- **Data Flow**: Independent → Saves to `vaptData`

### 6. **InternalAudit.jsx**
- **Purpose**: Document internal audit process and findings
- **Features**:
  - Audit planning (dates, team, scope)
  - Non-conformity tracking (Major, Minor, Observations)
  - Finding documentation with control references
  - Severity classification
  - Final report upload
- **Data Flow**: Independent → Saves to `auditData`

### 7. **Dashboard.jsx**
- **Purpose**: Comprehensive ISMS overview and reporting
- **Features**:
  - Overall compliance score calculation
  - Gap analysis visualization
  - Risk distribution charts
  - VAPT findings summary
  - Audit results display
  - Actionable recommendations
  - Complete Excel export (all data)
- **Data Flow**: Receives ALL previous data → Generates comprehensive report

## Data Files

### scopingQuestions.js
Contains 68 questions organized in 12 sections:
1. Organization Overview (9 questions)
2. Scope Definition for ISO 27001 (6 questions)
3. Legal, Regulatory, and Contractual Requirements (5 questions)
4. Technology & Information Assets (13 questions)
5. Existing Security Controls (3 questions)
6. People Control (7 questions)
7. Physical Locations and Workforce (3 questions)
8. Risk Context (3 questions)
9. Stakeholders and Governance (2 questions)
10. ISO 27001 Project Goals & Timeline (3 questions)
11. Interfaces & Dependencies (2 questions)
12. Cloud Environment (10 questions)
13. Exclusions (1 question)

### iso27001Controls.js
Contains all 93 ISO 27001:2022 Annex A controls:
- **A.5**: Organizational Controls (37 controls)
- **A.6**: People Controls (8 controls)
- **A.7**: Physical Controls (14 controls)
- **A.8**: Technological Controls (34 controls)

Each control includes:
- Control ID (e.g., A.5.1)
- Control name
- Full control description

## Key Features Implementation

### 1. **Dynamic Questioning**
```javascript
// In GapAssessment.jsx
const cloudAnswer = scopingData[58] || scopingData[22] || '';
const cloudMentioned = cloudAnswer.toLowerCase().includes('aws');
// Triggers cloud-specific control highlighting
```

### 2. **Auto-Calculation**
```javascript
// In RiskManagement.jsx
const calculateRiskLevel = (likelihood, impact) => {
  const score = likelihoodValue * impactValue;
  if (score >= 6) return 'Critical';
  // ... more logic
};
```

### 3. **Excel Export**
```javascript
// Uses xlsx library
import * as XLSX from 'xlsx';
const wb = XLSX.utils.book_new();
const ws = XLSX.utils.json_to_sheet(data);
XLSX.utils.book_append_sheet(wb, ws, 'Sheet Name');
XLSX.writeFile(wb, 'filename.xlsx');
```

### 4. **Progress Tracking**
```javascript
const getProgress = () => {
  const completed = assessments.filter(a => a.implemented).length;
  return Math.round((completed / assessments.length) * 100);
};
```

## Workflow Logic

```
User starts → Scoping Questions
                    ↓
                (saves scopingData)
                    ↓
              Gap Assessment ← reads scopingData
                    ↓         (detects cloud, shows relevant controls)
                (saves gapData)
                    ↓
              Risk Management ← reads gapData
                    ↓         (suggests risks from gaps)
                (saves riskData)
                    ↓
              Policy Management
                    ↓
                (saves policyData)
                    ↓
              VAPT Management
                    ↓
                (saves vaptData)
                    ↓
              Internal Audit
                    ↓
                (saves auditData)
                    ↓
              Dashboard ← reads ALL data
                    ↓
              (generates complete report)
```

## Styling Architecture

### CSS Organization
- **Global styles**: Typography, colors, layouts
- **Component-specific**: Each component has dedicated styles
- **Responsive**: Mobile-first approach with media queries
- **Theme**: Purple gradient primary color (#667eea to #764ba2)

### Key CSS Classes
- `.section-header` - Page titles and descriptions
- `.progress-bar` - Visual progress indicators
- `.card` variants - Consistent card layouts
- `.btn-primary/secondary` - Button styles
- `.field-group` - Form field containers

## Technology Choices

### Why Vite?
- Fast development server
- Optimized production builds
- Modern ES modules support
- Zero config for React

### Why React?
- Component reusability
- State management
- Rich ecosystem
- Wide adoption

### Why xlsx Library?
- Comprehensive Excel support
- Client-side processing
- Multiple sheet support
- Format preservation

### Why Netlify?
- Free hosting
- Automatic deployments from Git
- CDN distribution
- Easy custom domains
- HTTPS by default

## Extension Points

### Adding New Steps
1. Create new component in `src/components/`
2. Add to STEPS array in `App.jsx`
3. Add handler functions
4. Update Dashboard to include new data

### Adding Backend Storage
Replace state management with API calls:
```javascript
// Instead of:
const [scopingData, setScopingData] = useState({});

// Use:
const saveScopingData = async (data) => {
  await fetch('/api/scoping', {
    method: 'POST',
    body: JSON.stringify(data)
  });
};
```

### Customizing Controls
Edit `src/data/iso27001Controls.js`:
- Add custom controls
- Modify descriptions
- Add industry-specific controls

### Changing Theme
Edit `src/App.css`:
- Modify color variables
- Update gradient values
- Adjust component styles

## Performance Considerations

- **Code Splitting**: Vite automatically splits code
- **Lazy Loading**: Can implement for heavy components
- **Memoization**: Consider for complex calculations
- **Bundle Size**: Currently optimized, xlsx is largest dependency

## Security Notes

- All processing happens client-side
- No sensitive data sent to servers (unless backend added)
- File uploads stored in browser memory only
- Export functions run locally
- Can add encryption for localStorage persistence

## Browser Compatibility

- **Chrome/Edge**: Full support ✅
- **Firefox**: Full support ✅
- **Safari**: Full support ✅
- **IE11**: Not supported ❌ (use modern browsers)

## Testing Recommendations

1. **Unit Tests**: Jest + React Testing Library
2. **Integration Tests**: Test complete workflows
3. **E2E Tests**: Cypress or Playwright
4. **Manual Testing**: Check all exports work

## Maintenance

- Update dependencies regularly: `npm update`
- Check for security vulnerabilities: `npm audit`
- Monitor bundle size: Check build output
- Review analytics if added

---

This structure provides a scalable, maintainable ISMS automation tool ready for deployment and customization.
