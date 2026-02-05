# ISMS Automation Tool

A comprehensive Information Security Management System (ISMS) automation tool for ISO 27001:2022 compliance.

## Features

### 1. **Scoping Questions**
- Interactive questionnaire covering all aspects of ISMS scope
- 12 sections with 68 detailed questions
- Progress tracking
- Responses saved for reference

### 2. **Gap Assessment**
- Complete ISO 27001:2022 Annex A controls (93 controls)
- Dynamic questioning based on scoping responses
- Cloud-specific control identification (AWS, Azure, GCP)
- Control-wise gap identification
- Priority assignment (High, Medium, Low)
- Excel export of gap analysis

### 3. **Risk Management**
- Manual risk entry with auto-calculation
- Likelihood x Impact = Risk Level
- Risk treatment planning
- Risk owner assignment
- Status tracking
- Excel export of risk register

### 4. **Policy Management**
- 10+ required policy templates
- Version control
- Owner assignment
- Approval date tracking
- Review date reminders
- File upload capability
- CSV export of policy register

### 5. **VAPT Management**
- External VAPT
- Internal VAPT
- Cloud Security Assessment
- Findings categorization (Critical, High, Medium, Low)
- Report upload
- Summary dashboard

### 6. **Internal Audit**
- Audit planning with date range
- Non-conformity tracking (Major, Minor, Observations)
- Finding documentation with control references
- Severity classification
- Recommendation tracking
- Final report upload

### 7. **Comprehensive Dashboard**
- Overall compliance score
- Gap analysis visualization
- Risk distribution charts
- VAPT findings summary
- Audit results overview
- Actionable recommendations
- Complete Excel report export

## Technology Stack

- **Frontend**: React 18
- **Build Tool**: Vite
- **UI Components**: Lucide React Icons
- **Excel Export**: SheetJS (xlsx)
- **Deployment**: Netlify

## Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd isms-tool
```

2. Install dependencies:
```bash
npm install
```

3. Run development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Deployment to Netlify

### Method 1: GitHub Integration (Recommended)

1. Push your code to GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-github-repo-url>
git push -u origin main
```

2. Go to [Netlify](https://app.netlify.com/)
3. Click "New site from Git"
4. Choose GitHub and select your repository
5. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Click "Deploy site"

### Method 2: Netlify CLI

1. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Build the project:
```bash
npm run build
```

3. Deploy:
```bash
netlify deploy --prod
```

### Method 3: Drag and Drop

1. Build the project:
```bash
npm run build
```

2. Go to [Netlify Drop](https://app.netlify.com/drop)
3. Drag and drop the `dist` folder

## Usage Guide

### Step 1: Scoping Questions
- Answer all questions about your organization
- Use the collapsible sections for better navigation
- Progress bar shows completion percentage
- All responses are saved automatically

### Step 2: Gap Assessment
- Review each ISO 27001 control category (A.5 through A.8)
- For each control, select implementation status
- Provide evidence for implemented controls
- Document gaps and assign priorities
- Export gap report to Excel

### Step 3: Risk Management
- Add risks identified from gaps
- Specify asset, threat, and vulnerability
- Rate likelihood and impact
- System auto-calculates risk level
- Plan treatment and assign owners
- Export risk register

### Step 4: Policy Management
- Upload required security policies
- Track version and approval dates
- Set review reminders
- Add custom policies as needed
- Export policy register

### Step 5: VAPT
- Upload VAPT reports
- Record findings by severity
- Track remediation status
- View consolidated findings

### Step 6: Internal Audit
- Set audit dates
- Record findings by control
- Classify non-conformities
- Upload final audit report

### Step 7: Dashboard
- View comprehensive compliance status
- Export complete ISMS report
- Review recommendations
- Track progress across all areas

## File Structure

```
isms-tool/
├── src/
│   ├── components/
│   │   ├── ScopingQuestions.jsx
│   │   ├── GapAssessment.jsx
│   │   ├── RiskManagement.jsx
│   │   ├── PolicyManagement.jsx
│   │   ├── VAPTManagement.jsx
│   │   ├── InternalAudit.jsx
│   │   └── Dashboard.jsx
│   ├── data/
│   │   ├── scopingQuestions.js
│   │   └── iso27001Controls.js
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
├── index.html
├── package.json
├── vite.config.js
├── netlify.toml
└── README.md
```

## Features Breakdown

### Dynamic Questioning
- Gap assessment questions adapt based on scoping responses
- Cloud provider detection triggers cloud-specific controls
- Intelligent form flow based on previous answers

### Excel Export Capabilities
- Gap Assessment Report
- Risk Register
- Policy Register
- VAPT Summary
- Complete ISMS Report (all data consolidated)

### Data Persistence
- All data stored in React state
- Can be extended with localStorage or backend API
- Export functionality preserves all information

## ISO 27001:2022 Coverage

### Annex A Controls Included:
- **A.5**: Organizational Controls (37 controls)
- **A.6**: People Controls (8 controls)
- **A.7**: Physical Controls (14 controls)
- **A.8**: Technological Controls (34 controls)

**Total: 93 controls**

## Customization

### Adding Custom Questions
Edit `src/data/scopingQuestions.js` to add or modify scoping questions.

### Modifying Controls
Edit `src/data/iso27001Controls.js` to customize control descriptions or add custom controls.

### Styling
Modify `src/App.css` to customize the appearance.

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## License

MIT License - feel free to use and modify for your organization's needs.

## Support

For issues or questions, please open an issue in the GitHub repository.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Built with ❤️ for ISO 27001 compliance professionals
