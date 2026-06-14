import { db } from '../utils/db.js';

export const AnalysisPage = {
  render(params) {
    const user = db.getCurrentUser();
    if (!user) return `<div class="loader-container"><div class="spinner"></div></div>`;

    // Fetch scan by parameter ID, or fallback to latest scan
    const history = db.getHistory(user.id);
    let scan = null;

    if (params && params.id) {
      scan = history.find(item => item.id === params.id);
    } else if (history.length > 0) {
      scan = history[0];
    }

    if (!scan) {
      return `
        <div class="glass-panel" style="text-align: center; padding: 4rem; max-width: 600px; margin: 3rem auto;">
          <h2>No Report Found</h2>
          <p style="color: var(--text-muted); margin-top: 1rem; margin-bottom: 2rem;">We couldn't locate this analysis report. It may have been deleted.</p>
          <a href="#/upload" class="btn btn-primary">Start New Analysis</a>
        </div>
      `;
    }

    const report = scan.report;
    
    // Determine score assessment
    let assessment = 'Critical Redo';
    let assessmentColor = 'var(--accent-rose)';
    if (scan.score >= 80) {
      assessment = 'Excellent Match';
      assessmentColor = 'var(--accent-emerald)';
    } else if (scan.score >= 50) {
      assessment = 'Needs Optimization';
      assessmentColor = 'var(--accent-amber)';
    }

    // Generate matched keywords badges
    const matchedHtml = report.keywords.matched.length > 0 
      ? report.keywords.matched.map(kw => `
          <span class="keyword-badge keyword-matched">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            ${kw}
          </span>
        `).join('')
      : '<span style="color: var(--text-muted); font-size: 0.9rem;">No keywords matched.</span>';

    // Generate missing keywords badges
    const missingHtml = report.keywords.missing.length > 0
      ? report.keywords.missing.map(kw => `
          <span class="keyword-badge keyword-missing">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            ${kw}
          </span>
        `).join('')
      : '<span style="color: var(--accent-emerald); font-weight: 600; font-size: 0.9rem;">Perfect! No keywords missing.</span>';

    // Generate audit items HTML
    const auditHtml = report.audit.map(item => {
      let icon = '✓';
      let statusClass = 'audit-status-success';
      
      if (item.type === 'warning') {
        icon = '⚠';
        statusClass = 'audit-status-warning';
      } else if (item.type === 'danger') {
        icon = '✗';
        statusClass = 'audit-status-danger';
      }

      return `
        <div class="audit-item">
          <div class="audit-status-icon ${statusClass}">${icon}</div>
          <div class="audit-content">
            <div class="audit-title">${item.title}</div>
            <div class="audit-description">${item.desc}</div>
          </div>
        </div>
      `;
    }).join('');

    return `
      <div class="analysis-wrapper">
        <div class="analysis-header">
          <div class="analysis-headline">
            <h1>ATS Compatibility Report</h1>
            <p>Role: <strong>${scan.jobTitle}</strong> | File: <em>${scan.resumeName}</em></p>
          </div>
          <div style="display: flex; gap: 0.75rem;">
            <a href="#/upload" class="btn btn-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="23 4 23 10 17 10"></polyline>
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
              </svg>
              Scan Again
            </a>
            <button id="print-report-btn" class="btn btn-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                <rect x="6" y="14" width="12" height="8"></rect>
              </svg>
              Print Report
            </button>
          </div>
        </div>

        <div class="analysis-grid">
          <!-- Score Summary Card -->
          <div class="glass-panel score-card">
            <div class="score-chart-container">
              <svg class="score-svg" width="180" height="180" viewBox="0 0 180 180">
                <circle class="score-bg-circle" cx="90" cy="90" r="70"></circle>
                <circle id="report-score-circle" class="score-fill-circle" cx="90" cy="90" r="70" stroke="${assessmentColor}" stroke-dasharray="439.8" stroke-dashoffset="439.8"></circle>
              </svg>
              <div class="score-text-overlay">
                <div class="score-num">${scan.score}%</div>
                <div class="score-label">ATS Score</div>
              </div>
            </div>
            
            <div class="score-commentary" style="color: ${assessmentColor};">${assessment}</div>
            
            <div style="width: 100%; text-align: left; display: flex; flex-direction: column; gap: 0.75rem; margin-top: 1rem; border-top: 1px solid var(--border-light); padding-top: 1.25rem;">
              <div style="display: flex; justify-content: space-between; font-size: 0.9rem;">
                <span style="color: var(--text-muted);">Keyword Match</span>
                <span style="font-weight: 600;">${report.keywordScore}%</span>
              </div>
              <div style="display: flex; justify-content: space-between; font-size: 0.9rem;">
                <span style="color: var(--text-muted);">Formatting & Layout</span>
                <span style="font-weight: 600;">${report.formattingScore}%</span>
              </div>
              <div style="display: flex; justify-content: space-between; font-size: 0.9rem;">
                <span style="color: var(--text-muted);">Impact & Action Verbs</span>
                <span style="font-weight: 600;">${report.impactScore}%</span>
              </div>
              <div style="display: flex; justify-content: space-between; font-size: 0.9rem;">
                <span style="color: var(--text-muted);">Readability</span>
                <span style="font-weight: 600;">${report.readabilityScore}%</span>
              </div>
            </div>
          </div>

          <!-- Report Details -->
          <div class="glass-panel" style="padding: 2rem;">
            <div class="report-tabs">
              <button class="report-tab-btn active" data-tab="keywords">Keyword Match</button>
              <button class="report-tab-btn" data-tab="formatting">Layout & Format</button>
              <button class="report-tab-btn" data-tab="suggestions">Improvement Tips</button>
            </div>

            <!-- Keyword Panel -->
            <div id="panel-keywords" class="report-panel active">
              <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 1.5rem;">
                Applicant Tracking Systems parse candidate profiles looking for matching skills listed in the job post. Below are the keywords identified in the job description and your matching alignment.
              </p>
              
              <div class="keyword-grid">
                <div class="glass-card keyword-box" style="border-color: rgba(16, 185, 129, 0.15);">
                  <div class="keyword-box-title" style="color: var(--accent-emerald);">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                    Matched Keywords (${report.keywords.matched.length})
                  </div>
                  <div class="keywords-container">
                    ${matchedHtml}
                  </div>
                </div>

                <div class="glass-card keyword-box" style="border-color: rgba(244, 63, 94, 0.15);">
                  <div class="keyword-box-title" style="color: var(--accent-rose);">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="12"></line>
                      <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    Missing Keywords (${report.keywords.missing.length})
                  </div>
                  <div class="keywords-container">
                    ${missingHtml}
                  </div>
                </div>
              </div>

              <div class="glass-card" style="margin-top: 1.5rem; background: rgba(99, 102, 241, 0.05); border-color: rgba(99, 102, 241, 0.15);">
                <div style="font-weight: 600; display: flex; align-items: center; gap: 0.5rem; color: var(--primary); margin-bottom: 0.5rem;">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                  </svg>
                  How to fix missing keywords:
                </div>
                <p style="font-size: 0.9rem; color: var(--text-muted); line-height: 1.5;">
                  Integrate these missing terms naturally into your project descriptions and work history statements. For example, instead of just writing "Built a database", write "Engineered a relational <strong>SQL</strong> database schema with <strong>query optimization</strong> techniques."
                </p>
              </div>
            </div>

            <!-- Formatting Panel -->
            <div id="panel-formatting" class="report-panel">
              <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 1.5rem;">
                ATS systems fail to parse profiles if sections are unidentifiable, contact details are missing, or text layouts are cluttered. Review this structural audit report to improve parse success.
              </p>
              
              <div class="audit-list">
                ${auditHtml}
              </div>
            </div>

            <!-- Suggestions Panel -->
            <div id="panel-suggestions" class="report-panel">
              <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 1.5rem;">
                Action verbs show ownership, while impact-driven metrics show success. Enhance your resume's style by replacing weak descriptions with achievement-focused wording.
              </p>
              
              <div class="glass-card" style="margin-bottom: 1.5rem; padding: 1.25rem;">
                <h4 style="font-weight: 600; margin-bottom: 1rem; color: var(--primary);">Resume Wording Redo Templates</h4>
                <div style="display: flex; flex-direction: column; gap: 1rem;">
                  <div style="padding-bottom: 0.75rem; border-bottom: 1px solid var(--border-light);">
                    <div style="font-size: 0.8rem; text-transform: uppercase; color: var(--accent-rose); font-weight: 700;">Weak (Avoid)</div>
                    <div style="font-size: 0.95rem; margin-bottom: 0.25rem;">"Was responsible for writing web code and assisted team members."</div>
                    <div style="font-size: 0.8rem; text-transform: uppercase; color: var(--accent-emerald); font-weight: 700; margin-top: 0.5rem;">Strong (Use)</div>
                    <div style="font-size: 0.95rem; font-weight: 500;">"Engineered and deployed responsive user interface modules, collaborating with cross-functional developers in an Agile workflow."</div>
                  </div>
                  
                  <div style="padding-bottom: 0.75rem; border-bottom: 1px solid var(--border-light);">
                    <div style="font-size: 0.8rem; text-transform: uppercase; color: var(--accent-rose); font-weight: 700;">Weak (Avoid)</div>
                    <div style="font-size: 0.95rem; margin-bottom: 0.25rem;">"Worked on making database queries load faster."</div>
                    <div style="font-size: 0.8rem; text-transform: uppercase; color: var(--accent-emerald); font-weight: 700; margin-top: 0.5rem;">Strong (Use)</div>
                    <div style="font-size: 0.95rem; font-weight: 500;">"Optimized backend queries and database schemas, reducing server latency cycles by 35%."</div>
                  </div>

                  <div>
                    <div style="font-size: 0.8rem; text-transform: uppercase; color: var(--accent-rose); font-weight: 700;">Weak (Avoid)</div>
                    <div style="font-size: 0.95rem; margin-bottom: 0.25rem;">"Helped run the university tech club and events."</div>
                    <div style="font-size: 0.8rem; text-transform: uppercase; color: var(--accent-emerald); font-weight: 700; margin-top: 0.5rem;">Strong (Use)</div>
                    <div style="font-size: 0.95rem; font-weight: 500;">"Led student coordination teams, organizing 3 major hackathons that attracted 200+ active participants."</div>
                  </div>
                </div>
              </div>

              <div class="grid-2">
                <div class="glass-card" style="padding: 1.25rem;">
                  <h4 style="font-weight: 600; margin-bottom: 0.5rem; color: var(--text-main);">ATS Formatting Rules</h4>
                  <ul style="color: var(--text-muted); font-size: 0.85rem; padding-left: 1rem; display: flex; flex-direction: column; gap: 0.4rem;">
                    <li>Keep resume to a clean 1-page layout for freshers.</li>
                    <li>Avoid graphics, logos, charts, or images which look like noise to ATS text readers.</li>
                    <li>Ensure tables do not hold critical details as some basic parsers ignore table contents.</li>
                    <li>Export files as standard .pdf or .docx text.</li>
                  </ul>
                </div>
                
                <div class="glass-card" style="padding: 1.25rem;">
                  <h4 style="font-weight: 600; margin-bottom: 0.5rem; color: var(--text-main);">Recruiter Tip</h4>
                  <p style="color: var(--text-muted); font-size: 0.85rem; line-height: 1.4;">
                    Recruiters spend an average of 6 seconds skimming a resume. Place your "Skills" section near the top, followed by "Projects" or "Experience" to maximize readability.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    `;
  },

  init() {
    const scoreCircle = document.getElementById('report-score-circle');
    const printBtn = document.getElementById('print-report-btn');
    const tabBtns = document.querySelectorAll('.report-tab-btn');
    const panels = document.querySelectorAll('.report-panel');

    // Tab switching listener
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const tabTarget = btn.getAttribute('data-tab');
        
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        panels.forEach(p => p.classList.remove('active'));
        const activePanel = document.getElementById(`panel-${tabTarget}`);
        if (activePanel) activePanel.classList.add('active');
      });
    });

    // Animate score circular chart on page display
    if (scoreCircle) {
      const parentScoreCard = scoreCircle.closest('.score-card');
      const scoreText = parentScoreCard ? parentScoreCard.querySelector('.score-num').innerText : '0%';
      const scorePercent = parseInt(scoreText);
      
      setTimeout(() => {
        // Circumference of radius 70 is 2 * PI * 70 = 439.8
        const offset = 439.8 - (439.8 * scorePercent) / 100;
        scoreCircle.style.strokeDashoffset = offset;
      }, 150);
    }

    // Print functionality
    if (printBtn) {
      printBtn.addEventListener('click', () => {
        window.print();
      });
    }
  }
};
