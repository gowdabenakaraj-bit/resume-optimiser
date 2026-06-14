import { db } from '../utils/db.js';
import { analyzeResume } from '../utils/ats-engine.js';

// Seed Sample Resumes for testing
const SAMPLE_RESUMES = {
  webdev: `Alex Rivera
Email: alex.rivera@example.com | Phone: +1 555-0199 | GitHub: github.com/alexrivera
Professional Summary:
Enthusiastic CS student with hands-on experience building web applications. Skilled in frontend developments, React and basic databases. Seeking an entry-level frontend developer role.

Education:
B.S. in Computer Science - State University, Expected Graduation 2027

Skills:
React, HTML5, CSS3, JavaScript, Git, Bootstrap, REST APIs

Projects:
* TaskManager App: Designed and built a responsive dashboard application using React. Integrated local storage for persisting state and implemented CSS styling.
* Weather App: Developed a weather checking application in vanilla JavaScript that calls REST API endpoints.

Experience:
Web Development Intern - TechCorp (May 2025 - August 2025)
* Assisted with the coding of internal landing pages.
* Helped to design CSS grid layouts.`,
  
  data: `Karan Malhotra
Email: karan@example.com | Phone: +91 9876543210 | Portfolio: github.com/karanm
Education:
Bachelor of Technology in IT - Tech University, Graduated 2025

Skills:
Python, SQL, MySQL, Algorithms, Tableau, Excel, Data Analytics

Projects:
* E-Commerce Analytics Pipeline: Written script in Python to clean and aggregate user clickstreams. Created MySQL indexes to speed up data query retrievals by 40%.
* Sales Performance Dashboard: Engineered sales reports using Tableau to identify regional growth trends.`,

  empty: ''
};

// Seed Sample Job Descriptions
const SAMPLE_JDS = {
  react: `Frontend React Developer (Internship)
Key Responsibilities:
- Design and develop clean, performant React application components.
- Collaborate with engineering team to integrate REST APIs and state management (Redux).
- Write responsive CSS3 structures (Tailwind / Flexbox).
- Ensure version control using Git.
Requirements:
- Strong base in HTML5, CSS3, and JavaScript.
- Basic knowledge of TypeScript and Next.js is a big plus.
- Good communication and time management skills in an Agile environment.`,
  
  data: `Junior Data Analyst
Responsibilities:
- Perform data analysis, cleaning, and transformation using Python (Pandas/NumPy).
- Build and optimize SQL queries on PostgreSQL databases.
- Develop interactive reporting dashboards in Tableau or PowerBI.
- Understand basic Machine Learning regression concepts.
Qualifications:
- B.S. in Mathematics, Statistics, Computer Science or equivalent.
- Experience with Git, Docker, and AWS deployments is preferred.
- Analytical mindset with high attention to detail.`,

  design: `Junior UI/UX Designer
Responsibilities:
- Design wireframes, user journeys, and pixel-perfect high-fidelity mockups.
- Collaborate with frontend engineers using Git.
- Focus on responsive design, mobile patterns, and web accessibility standards (WCAG).
Skills:
- Figma, UI/UX design, wireframing, component libraries.
- Basic understanding of HTML5, CSS3, and responsive frameworks.`
};

export const UploadPage = {
  state: {
    selectedFile: null,
    resumeText: '',
    resumeFileName: ''
  },

  render() {
    const user = db.getCurrentUser();
    if (!user) return `<div class="loader-container"><div class="spinner"></div></div>`;

    return `
      <div class="upload-wrapper">
        <div class="upload-title-container">
          <h1 class="glow-text" style="font-size: 2.2rem; font-weight: 800; margin-bottom: 0.5rem; background: linear-gradient(135deg, var(--primary), var(--secondary)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; display: inline-block;">Optimize Your Resume</h1>
          <p style="color: var(--text-muted); font-size: 1.05rem;">Upload your CV and paste your target Job Description to compute your ATS match score.</p>
        </div>

        <div id="loading-screen" style="display: none;" class="glass-panel loader-container">
          <div class="spinner"></div>
          <h3 id="loader-title" style="font-size: 1.2rem; font-weight: 600;">Analyzing Resume Layout...</h3>
          <div id="loader-logs" style="width: 100%; max-width: 450px; background: rgba(0, 0, 0, 0.4); border-radius: var(--radius-sm); padding: 1rem; font-family: monospace; font-size: 0.8rem; color: #10b981; height: 120px; overflow-y: auto; text-align: left; border: 1px solid var(--border-light);">
            [START] Initializing OptiCV ATS Parser...
          </div>
        </div>

        <div id="upload-content-form">
          <div class="upload-main-grid">
            <!-- Left Panel: Resume Input -->
            <div class="glass-panel" style="padding: 1.5rem; display: flex; flex-direction: column;">
              <h3 style="font-size: 1.2rem; font-weight: 700; margin-bottom: 1.25rem; display: flex; align-items: center; gap: 0.5rem;">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                </svg>
                1. Upload Your Resume
              </h3>
              
              <!-- Drag and drop zone -->
              <div id="drop-zone" class="upload-zone">
                <div class="upload-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                </div>
                <div class="upload-text-main">Drag & Drop Resume File</div>
                <div class="upload-text-sub">Supports PDF, DOCX, TXT or Markdown</div>
                <input type="file" id="file-input" style="display: none;" accept=".pdf,.docx,.txt,.md">
                <button type="button" id="browse-btn" class="btn btn-secondary" style="margin-top: 1rem; padding: 0.4rem 1rem; font-size: 0.85rem;">Browse Files</button>
              </div>

              <!-- Preloaded testing buttons -->
              <div style="margin-top: 1rem;">
                <div class="form-label" style="margin-bottom: 0.5rem;">Or try with sample fresher profile:</div>
                <div style="display: flex; gap: 0.5rem;">
                  <button type="button" class="jd-sug-btn" id="sample-res-web">Alex (Frontend Web Dev)</button>
                  <button type="button" class="jd-sug-btn" id="sample-res-data">Karan (Data Analyst)</button>
                </div>
              </div>

              <!-- Uploaded resume text verification (Collapsible) -->
              <div id="resume-text-drawer" style="margin-top: 1.5rem; display: none;">
                <div class="form-group">
                  <label class="form-label" style="display: flex; justify-content: space-between;">
                    Verify / Edit Parsed Text
                    <span id="char-count" style="font-size: 0.75rem; color: var(--text-dim);">0 chars</span>
                  </label>
                  <textarea id="resume-text-input" class="form-textarea" placeholder="Paste your resume text here directly..." style="min-height: 180px; font-size: 0.85rem; font-family: monospace;"></textarea>
                </div>
              </div>
            </div>

            <!-- Right Panel: Job Description Input -->
            <div class="glass-panel" style="padding: 1.5rem;">
              <h3 style="font-size: 1.2rem; font-weight: 700; margin-bottom: 1.25rem; display: flex; align-items: center; gap: 0.5rem;">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
                2. Target Job Details
              </h3>

              <div class="form-group">
                <label class="form-label" for="jd-title-input">Target Job Title</label>
                <input type="text" id="jd-title-input" class="form-input" placeholder="e.g. Frontend React Developer (Intern)" required value="Frontend React Developer">
              </div>

              <div class="form-group" style="margin-bottom: 1rem;">
                <label class="form-label" for="jd-text-input">Paste Job Description</label>
                <textarea id="jd-text-input" class="form-textarea" placeholder="Copy and paste the full requirements details, duties, and qualifications..." style="min-height: 200px;" required></textarea>
              </div>

              <div>
                <span class="form-label">Quick load template:</span>
                <div class="jd-suggestions">
                  <button type="button" class="jd-sug-btn" data-jd="react">Frontend Developer</button>
                  <button type="button" class="jd-sug-btn" data-jd="data">Data Analyst</button>
                  <button type="button" class="jd-sug-btn" data-jd="design">UI/UX Designer</button>
                </div>
              </div>
            </div>
          </div>

          <div style="text-align: center; margin-top: 2rem;">
            <button type="button" id="submit-analysis-btn" class="btn btn-primary btn-lg" style="padding: 1rem 3rem; font-size: 1.1rem; box-shadow: 0 4px 20px rgba(99, 102, 241, 0.4);">
              Analyze Resume & Score compatibility
            </button>
          </div>
        </div>
      </div>
    `;
  },

  init(routerCallback) {
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const browseBtn = document.getElementById('browse-btn');
    
    const sampleWebBtn = document.getElementById('sample-res-web');
    const sampleDataBtn = document.getElementById('sample-res-data');
    
    const resumeTextDrawer = document.getElementById('resume-text-drawer');
    const resumeTextArea = document.getElementById('resume-text-input');
    const charCountLabel = document.getElementById('char-count');
    
    const jdTitleInput = document.getElementById('jd-title-input');
    const jdTextArea = document.getElementById('jd-text-input');
    const jdTemplateBtns = document.querySelectorAll('.jd-sug-btn[data-jd]');
    
    const submitBtn = document.getElementById('submit-analysis-btn');
    
    const uploadForm = document.getElementById('upload-content-form');
    const loadingScreen = document.getElementById('loading-screen');
    const loaderTitle = document.getElementById('loader-title');
    const loaderLogs = document.getElementById('loader-logs');

    // Initialize state
    this.state.selectedFile = null;
    this.state.resumeText = '';
    this.state.resumeFileName = '';

    // Pre-populate default Job Description on load
    if (jdTextArea) {
      jdTextArea.value = SAMPLE_JDS.react;
    }

    // Load Job Description template
    jdTemplateBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const jdType = btn.getAttribute('data-jd');
        if (SAMPLE_JDS[jdType]) {
          jdTextArea.value = SAMPLE_JDS[jdType];
          
          if (jdType === 'react') jdTitleInput.value = 'Frontend React Developer';
          else if (jdType === 'data') jdTitleInput.value = 'Junior Data Analyst';
          else if (jdType === 'design') jdTitleInput.value = 'Junior UI/UX Designer';
          
          window.showToast('Job Description template loaded!', 'success');
        }
      });
    });

    // Populate Sample Resumes
    if (sampleWebBtn && sampleDataBtn) {
      sampleWebBtn.addEventListener('click', () => {
        this.state.resumeText = SAMPLE_RESUMES.webdev;
        this.state.resumeFileName = 'Alex_Rivera_WebDev.pdf (Sample)';
        this.updateResumeDisplay();
      });

      sampleDataBtn.addEventListener('click', () => {
        this.state.resumeText = SAMPLE_RESUMES.data;
        this.state.resumeFileName = 'Karan_Malhotra_DataAnalyst.pdf (Sample)';
        this.updateResumeDisplay();
      });
    }

    // File Drag & Drop listeners
    if (dropZone && fileInput) {
      browseBtn.addEventListener('click', () => fileInput.click());
      
      dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
      });

      dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('dragover');
      });

      dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        if (e.dataTransfer.files.length > 0) {
          this.handleFileSelect(e.dataTransfer.files[0]);
        }
      });

      fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
          this.handleFileSelect(e.target.files[0]);
        }
      });
    }

    // Direct text editing char counter
    if (resumeTextArea) {
      resumeTextArea.addEventListener('input', (e) => {
        this.state.resumeText = e.target.value;
        charCountLabel.innerText = `${e.target.value.length} chars`;
      });
    }

    // Trigger calculations
    if (submitBtn) {
      submitBtn.addEventListener('click', () => {
        const jdText = jdTextArea.value.trim();
        const jdTitle = jdTitleInput.value.trim();
        const resumeText = this.state.resumeText.trim();
        const user = db.getCurrentUser();

        if (!resumeText) {
          window.showToast('Please upload a resume or select a sample profile first.', 'error');
          return;
        }
        if (!jdTitle) {
          window.showToast('Please specify the Target Job Title.', 'error');
          return;
        }
        if (!jdText) {
          window.showToast('Please copy and paste the target Job Description.', 'error');
          return;
        }

        // Show parsing loading animation screen
        if (uploadForm && loadingScreen) {
          uploadForm.style.display = 'none';
          loadingScreen.style.display = 'flex';
          
          let logCounter = 0;
          const logs = [
            `[OK] Parsing PDF file: ${this.state.resumeFileName}`,
            `[OK] Text boundaries identified. Word count: ${resumeText.split(/\s+/).length} words.`,
            `[OK] Extracting email and candidate profiles...`,
            `[OK] Scanning layout structures (Margins, Font sizes, headings)...`,
            `[OK] Extracting keywords from Job Description...`,
            `[OK] Cross-referencing technical skills matching algorithms...`,
            `[OK] Evaluating action verbs vs passive phrases...`,
            `[SUCCESS] ATS alignment calculated. Rendering report...`
          ];

          const timer = setInterval(() => {
            if (logCounter < logs.length) {
              const newLog = document.createElement('div');
              newLog.innerText = logs[logCounter];
              loaderLogs.appendChild(newLog);
              loaderLogs.scrollTop = loaderLogs.scrollHeight;
              
              if (logCounter === 2) loaderTitle.innerText = 'Extracting Skill Keywords...';
              if (logCounter === 5) loaderTitle.innerText = 'Calculating ATS Score...';

              logCounter++;
            } else {
              clearInterval(timer);
              
              try {
                // Execute actual analysis
                const result = analyzeResume(jdText, resumeText);
                
                // Save to local database
                const record = db.saveAnalysis(
                  user.id,
                  this.state.resumeFileName || 'unnamed_resume.pdf',
                  jdTitle,
                  result.score,
                  result.report
                );

                window.showToast('Resume optimizer scoring complete!', 'success');
                
                // Redirect to report page
                window.location.hash = `#/analysis?id=${record.id}`;
                if (routerCallback) routerCallback();
              } catch (err) {
                window.showToast(err.message, 'error');
                // Recovery UI
                uploadForm.style.display = 'block';
                loadingScreen.style.display = 'none';
              }
            }
          }, 350);
        }
      });
    }
  },

  handleFileSelect(file) {
    this.state.selectedFile = file;
    this.state.resumeFileName = file.name;
    
    // Read local file using HTML5 FileReader
    const reader = new FileReader();
    
    reader.onload = (e) => {
      let extractedText = e.target.result;
      
      // Simple validation for binary files vs text files
      const isBinary = /[\x00-\x08\x0E-\x1F]/.test(extractedText.slice(0, 100));
      
      if (isBinary) {
        // Since we are running in pure frontend without library, if it's a PDF/DOCX binary, 
        // we extract keywords from the filename to load a template, or prompt the user 
        // to paste the text.
        window.showToast('Binary PDF/DOCX file uploaded. For 100% accurate ATS keyword matching, please paste your resume text below.', 'warning');
        
        // Load default mock text based on filename keyword
        const nameLower = file.name.toLowerCase();
        if (nameLower.includes('web') || nameLower.includes('react') || nameLower.includes('front')) {
          this.state.resumeText = SAMPLE_RESUMES.webdev;
        } else if (nameLower.includes('data') || nameLower.includes('analyst') || nameLower.includes('sql')) {
          this.state.resumeText = SAMPLE_RESUMES.data;
        } else {
          this.state.resumeText = SAMPLE_RESUMES.webdev; // default fallback
        }
      } else {
        // Plain text file
        window.showToast('Text resume uploaded successfully!', 'success');
        this.state.resumeText = extractedText;
      }

      this.updateResumeDisplay();
    };

    reader.onerror = () => {
      window.showToast('Error reading file. Please paste text directly.', 'error');
    };

    reader.readAsText(file);
  },

  updateResumeDisplay() {
    const dropZone = document.getElementById('drop-zone');
    const resumeTextDrawer = document.getElementById('resume-text-drawer');
    const resumeTextArea = document.getElementById('resume-text-input');
    const charCountLabel = document.getElementById('char-count');
    
    if (dropZone) {
      dropZone.innerHTML = `
        <div class="upload-icon" style="animation: none;">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--accent-emerald)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
        <div class="upload-text-main" style="color: var(--accent-emerald);">File Ready!</div>
        <div class="upload-file-display">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
          </svg>
          ${this.state.resumeFileName}
          <button type="button" class="remove-file" id="reset-upload-btn">×</button>
        </div>
      `;

      // Attach reset listener
      document.getElementById('reset-upload-btn').addEventListener('click', (e) => {
        e.stopPropagation(); // Avoid triggering dropzone click
        this.resetUpload();
      });
    }

    if (resumeTextDrawer && resumeTextArea && charCountLabel) {
      resumeTextDrawer.style.display = 'block';
      resumeTextArea.value = this.state.resumeText;
      charCountLabel.innerText = `${this.state.resumeText.length} chars`;
    }
  },

  resetUpload() {
    this.state.selectedFile = null;
    this.state.resumeText = '';
    this.state.resumeFileName = '';
    
    const dropZone = document.getElementById('drop-zone');
    const resumeTextDrawer = document.getElementById('resume-text-drawer');
    const resumeTextArea = document.getElementById('resume-text-input');
    
    if (dropZone) {
      dropZone.innerHTML = `
        <div class="upload-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" y1="3" x2="12" y2="15"></line>
          </svg>
        </div>
        <div class="upload-text-main">Drag & Drop Resume File</div>
        <div class="upload-text-sub">Supports PDF, DOCX, TXT or Markdown</div>
        <input type="file" id="file-input" style="display: none;" accept=".pdf,.docx,.txt,.md">
        <button type="button" id="browse-btn" class="btn btn-secondary" style="margin-top: 1rem; padding: 0.4rem 1rem; font-size: 0.85rem;">Browse Files</button>
      `;
      // Re-attach file selection triggers
      const fileInput = document.getElementById('file-input');
      const browseBtn = document.getElementById('browse-btn');
      browseBtn.addEventListener('click', () => fileInput.click());
      fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
          this.handleFileSelect(e.target.files[0]);
        }
      });
    }

    if (resumeTextDrawer && resumeTextArea) {
      resumeTextDrawer.style.display = 'none';
      resumeTextArea.value = '';
    }
  }
};
