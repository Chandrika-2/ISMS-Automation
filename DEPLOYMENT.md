# Quick Deployment Guide

## Step-by-Step Instructions to Deploy on GitHub + Netlify

### 1. Prepare Your GitHub Repository

1. Go to [GitHub](https://github.com) and create a new repository
2. Name it something like `isms-automation-tool`
3. Don't initialize with README (we already have one)
4. Copy the repository URL

### 2. Upload Files to GitHub

Open terminal/command prompt in the `isms-tool` folder and run:

```bash
# Initialize git repository
git init

# Add all files
git add .

# Commit files
git commit -m "Initial commit: ISMS Automation Tool"

# Add your GitHub repository as remote (replace with your URL)
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git

# Push to GitHub
git push -u origin main
```

If you get an error about `main` branch, try:
```bash
git branch -M main
git push -u origin main
```

### 3. Deploy on Netlify

#### Option A: Automatic Deployment (Recommended)

1. Go to [https://app.netlify.com/](https://app.netlify.com/)
2. Sign up or log in (you can use your GitHub account)
3. Click "Add new site" → "Import an existing project"
4. Choose "GitHub" as your Git provider
5. Authorize Netlify to access your GitHub repositories
6. Select your `isms-automation-tool` repository
7. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - Leave other settings as default
8. Click "Deploy site"
9. Wait 2-3 minutes for deployment to complete
10. Your site will be live at a URL like: `https://random-name-12345.netlify.app`
11. You can change this to a custom subdomain in Site settings → Domain management

#### Option B: Manual Deployment

1. In the `isms-tool` folder, run:
```bash
npm install
npm run build
```

2. Go to [https://app.netlify.com/drop](https://app.netlify.com/drop)
3. Drag and drop the `dist` folder onto the page
4. Your site will be deployed instantly!

### 4. Custom Domain (Optional)

1. In Netlify, go to Site settings → Domain management
2. Click "Add custom domain"
3. Follow the instructions to:
   - Add a custom domain you own, OR
   - Change your Netlify subdomain to something memorable

### 5. Environment Setup (If Needed Later)

If you want to add environment variables:
1. Go to Site settings → Build & deploy → Environment
2. Click "Add environment variable"
3. Add your variables

### Troubleshooting

**Build Fails:**
- Check that all dependencies are in `package.json`
- Ensure Node version is compatible (v18 or higher recommended)
- Check build logs in Netlify for specific errors

**Site Loads But Looks Broken:**
- Clear your browser cache
- Check browser console for errors
- Ensure `netlify.toml` is in the root directory

**404 Errors on Page Refresh:**
- Ensure `netlify.toml` has the redirect rule (already included)
- This allows client-side routing to work properly

### Testing Locally Before Deployment

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Updating Your Deployed Site

Whenever you make changes:

```bash
git add .
git commit -m "Description of changes"
git push
```

Netlify will automatically rebuild and redeploy your site!

### Features That Work Out of the Box

✅ All form inputs and data storage (in browser state)
✅ Excel export functionality
✅ File upload interface (files stored in browser)
✅ Progress tracking
✅ All navigation and stepper functionality
✅ Responsive design
✅ Dashboard with charts and statistics

### Notes on Data Persistence

- Currently, data is stored in React component state
- Data persists while navigating between steps
- Data is lost on page refresh
- To add permanent storage, consider:
  - localStorage for client-side persistence
  - Backend API with database for multi-user access
  - Export to Excel regularly to save your work

### Production Checklist

- [ ] All files uploaded to GitHub
- [ ] Site deployed on Netlify
- [ ] Site loads correctly
- [ ] All navigation works
- [ ] Forms can be filled out
- [ ] Export buttons work
- [ ] File uploads show in interface
- [ ] Dashboard displays correctly

### Support

If you encounter issues:
1. Check the browser console for errors (F12 → Console tab)
2. Check Netlify deploy logs
3. Ensure all files from the zip are uploaded
4. Try clearing browser cache and hard refresh (Ctrl+Shift+R)

---

🎉 Congratulations! Your ISMS Automation Tool is now live!
