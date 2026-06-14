import { db } from '../utils/db.js';

export const HomePage = {
  render() {
    const user = db.getCurrentUser();
    const actionLink = user ? '#/upload' : '#/login';
    
    return `
      <div class="home-page-container">
        <!-- Hero Section -->
        <section class="hero-section">
          <div class="hero-glow"></div>
          <h1 class="hero-title">
            Land Your Dream Interview with <br>
            <span class="glow-text" style="color: var(--primary);">ATS-Optimized Resumes</span>
          </h1>
          <p class="hero-subtitle">
            OptiCV is a free, instant resume scanner tailored for freshers, students, and beginners. Optimize your resume formatting, keywords, and action verbs to pass Applicant Tracking Systems.
          </p>
          <div class="hero-ctas">
            <a href="${actionLink}" class="btn btn-primary btn-lg">Optimize Your Resume Now</a>
            <a href="#/about" class="btn btn-secondary btn-lg">How ATS Works</a>
          </div>
        </section>

        <!-- Stats Counter Panel -->
        <section class="glass-panel" style="padding: 2rem; margin-bottom: 4rem; display: grid; grid-template-columns: repeat(3, 1fr); text-align: center; gap: 2rem;">
          <div>
            <div style="font-size: 2.5rem; font-weight: 800; color: var(--primary);">45,000+</div>
            <div style="color: var(--text-muted); font-size: 0.95rem; font-weight: 500; margin-top: 0.25rem;">Resumes Scanned</div>
          </div>
          <div style="border-left: 1px solid var(--border-light); border-right: 1px solid var(--border-light);">
            <div style="font-size: 2.5rem; font-weight: 800; color: var(--accent-emerald);">84%</div>
            <div style="color: var(--text-muted); font-size: 0.95rem; font-weight: 500; margin-top: 0.25rem;">Higher Response Rates</div>
          </div>
          <div>
            <div style="font-size: 2.5rem; font-weight: 800; color: var(--secondary);">+34 pts</div>
            <div style="color: var(--text-muted); font-size: 0.95rem; font-weight: 500; margin-top: 0.25rem;">Average Score Boost</div>
          </div>
        </section>

        <!-- Features Grid -->
        <section style="margin-bottom: 5rem;">
          <div class="features-header">
            <h2 class="features-title">Designed for Students & Freshers</h2>
            <p class="features-subtitle">Stand out from thousands of applicants with a resume built to beat screening algorithms.</p>
          </div>
          
          <div class="grid-3">
            <div class="glass-card">
              <div class="feature-icon-wrapper">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="9" y1="9" x2="15" y2="9"></line>
                  <line x1="9" y1="13" x2="15" y2="13"></line>
                  <line x1="9" y1="17" x2="11" y2="17"></line>
                </svg>
              </div>
              <h3 class="feature-title">Keyword Analysis</h3>
              <p class="feature-desc">Our smart engine scans the job description and highlights critical technical and soft skills missing from your CV.</p>
            </div>
            
            <div class="glass-card">
              <div class="feature-icon-wrapper" style="background: rgba(168, 85, 247, 0.1); color: var(--secondary);">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <line x1="10" y1="9" x2="8" y2="9"></line>
                </svg>
              </div>
              <h3 class="feature-title">Formatting Audit</h3>
              <p class="feature-desc">Detects parsed headings, layout margins, font compatibility, and missing contact links that cause ATS parsing errors.</p>
            </div>
            
            <div class="glass-card">
              <div class="feature-icon-wrapper" style="background: rgba(16, 185, 129, 0.1); color: var(--accent-emerald);">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polygon points="12 2 2 7 12 12 22 7 12 2 12 2"></polygon>
                  <polyline points="2 17 12 22 22 17"></polyline>
                  <polyline points="2 12 12 17 22 12"></polyline>
                </svg>
              </div>
              <h3 class="feature-title">Readability & Impact</h3>
              <p class="feature-desc">Evaluates word length, bullet density, and replaces passive, weak wording with active, result-oriented statements.</p>
            </div>
          </div>
        </section>

        <!-- Interactive Score Simulator -->
        <section class="glass-panel" style="padding: 2.5rem; margin-bottom: 4rem;">
          <div class="grid-2">
            <div>
              <h2 style="font-size: 2rem; font-weight: 700; margin-bottom: 1rem;">Test the ATS Engine Instantly</h2>
              <p style="color: var(--text-muted); margin-bottom: 1.5rem;">
                Try our mini-simulator. Enter target job skills on the left, paste what you currently have on the right, and see your immediate score alignment calculate dynamically.
              </p>
              <div class="form-group">
                <label class="form-label">Target Skills in Job Ad (Comma Separated)</label>
                <input type="text" id="sim-jd-skills" class="form-input" value="React, Node.js, TypeScript, SQL, Git">
              </div>
              <div class="form-group">
                <label class="form-label">Skills listed in your Resume</label>
                <input type="text" id="sim-resume-skills" class="form-input" value="React, Git, HTML, CSS">
              </div>
            </div>
            <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; border-left: 1px solid var(--border-light); padding-left: 2rem;">
              <div class="score-chart-container" style="width: 140px; height: 140px;">
                <svg class="score-svg" width="140" height="140" viewBox="0 0 140 140">
                  <circle class="score-bg-circle" cx="70" cy="70" r="55"></circle>
                  <circle id="sim-score-circle" class="score-fill-circle" cx="70" cy="70" r="55" stroke="var(--primary)" stroke-dasharray="345.5" stroke-dashoffset="345.5"></circle>
                </svg>
                <div class="score-text-overlay">
                  <div id="sim-score-num" class="score-num" style="font-size: 2.2rem;">0%</div>
                </div>
              </div>
              <div style="text-align: center; margin-top: 1rem;">
                <div id="sim-feedback-title" style="font-weight: 600; font-size: 1.1rem; margin-bottom: 0.25rem;">Needs Improvement</div>
                <div id="sim-feedback-desc" style="color: var(--text-muted); font-size: 0.85rem;">Missing: Node.js, TypeScript, SQL</div>
              </div>
            </div>
          </div>
        </section>

        <!-- Testimonial Section -->
        <section style="text-align: center; margin-bottom: 4rem;">
          <h2 class="features-title" style="margin-bottom: 2.5rem;">Success Stories</h2>
          <div class="grid-3">
            <div class="glass-card" style="text-align: left;">
              <div style="color: var(--accent-amber); margin-bottom: 1rem; font-size: 1.2rem;">★★★★★</div>
              <p style="font-style: italic; color: var(--text-muted); font-size: 0.95rem; margin-bottom: 1.5rem;">
                "Being a fresher, I didn't get any callbacks. OptiCV showed me that my projects section didn't mention 'React' or 'Git' explicitly. Within a week of fixing it, I got my first software engineer intern interview!"
              </p>
              <div style="display: flex; align-items: center; gap: 0.75rem;">
                <div class="avatar" style="width: 36px; height: 36px; font-size: 0.9rem;">S</div>
                <div>
                  <div style="font-weight: 600; font-size: 0.9rem;">Siddharth M.</div>
                  <div style="font-size: 0.75rem; color: var(--text-muted);">CS Student @ IIT</div>
                </div>
              </div>
            </div>
            <div class="glass-card" style="text-align: left;">
              <div style="color: var(--accent-amber); margin-bottom: 1rem; font-size: 1.2rem;">★★★★★</div>
              <p style="font-style: italic; color: var(--text-muted); font-size: 0.95rem; margin-bottom: 1.5rem;">
                "I was using 'responsible for coding' all over my resume. OptiCV's impact audit flagged those and suggested active verbs. My resume ATS score went from 48 to 85, and I got hired!"
              </p>
              <div style="display: flex; align-items: center; gap: 0.75rem;">
                <div class="avatar" style="width: 36px; height: 36px; font-size: 0.9rem;">P</div>
                <div>
                  <div style="font-weight: 600; font-size: 0.9rem;">Priya Sharma</div>
                  <div style="font-size: 0.75rem; color: var(--text-muted);">Junior Web Developer</div>
                </div>
              </div>
            </div>
            <div class="glass-card" style="text-align: left;">
              <div style="color: var(--accent-amber); margin-bottom: 1rem; font-size: 1.2rem;">★★★★★</div>
              <p style="font-style: italic; color: var(--text-muted); font-size: 0.95rem; margin-bottom: 1.5rem;">
                "The drag-and-drop feature and comparison report are so detailed. It acts exactly like a premium checker. Highly recommend it to all freshers trying to get into product companies."
              </p>
              <div style="display: flex; align-items: center; gap: 0.75rem;">
                <div class="avatar" style="width: 36px; height: 36px; font-size: 0.9rem;">K</div>
                <div>
                  <div style="font-weight: 600; font-size: 0.9rem;">Kunal Sen</div>
                  <div style="font-size: 0.75rem; color: var(--text-muted);">Data Analyst Intern</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    `;
  },

  init() {
    const simJdInput = document.getElementById('sim-jd-skills');
    const simResumeInput = document.getElementById('sim-resume-skills');
    const simCircle = document.getElementById('sim-score-circle');
    const simNum = document.getElementById('sim-score-num');
    const simTitle = document.getElementById('sim-feedback-title');
    const simDesc = document.getElementById('sim-feedback-desc');

    function runSimulation() {
      if (!simJdInput || !simResumeInput || !simCircle || !simNum) return;
      
      const jdSkills = simJdInput.value.split(',').map(s => s.trim().toLowerCase()).filter(s => s.length > 0);
      const resSkills = simResumeInput.value.split(',').map(s => s.trim().toLowerCase()).filter(s => s.length > 0);
      
      if (jdSkills.length === 0) {
        simNum.innerText = '0%';
        simCircle.style.strokeDashoffset = '345.5';
        simTitle.innerText = 'Add Target Skills';
        simDesc.innerText = 'List required skills in the left box.';
        return;
      }

      const matched = jdSkills.filter(skill => resSkills.includes(skill));
      const missing = jdSkills.filter(skill => !resSkills.includes(skill));
      
      const scorePercent = Math.round((matched.length / jdSkills.length) * 100);
      
      // Update score display
      simNum.innerText = `${scorePercent}%`;
      
      // Circular stroke dashoffset calculation:
      // Radius = 55, Circumference = 2 * PI * 55 = 345.5
      const offset = 345.5 - (345.5 * scorePercent) / 100;
      simCircle.style.strokeDashoffset = offset;
      
      // Update color based on score
      if (scorePercent >= 80) {
        simCircle.style.stroke = 'var(--accent-emerald)';
        simTitle.innerText = 'Excellent Match!';
        simTitle.style.color = 'var(--accent-emerald)';
      } else if (scorePercent >= 50) {
        simCircle.style.stroke = 'var(--accent-amber)';
        simTitle.innerText = 'Moderate Match';
        simTitle.style.color = 'var(--accent-amber)';
      } else {
        simCircle.style.stroke = 'var(--accent-rose)';
        simTitle.innerText = 'Poor Match';
        simTitle.style.color = 'var(--accent-rose)';
      }

      // Update description
      if (missing.length === 0) {
        simDesc.innerText = 'All target skills are matched!';
      } else {
        const capitalisedMissing = missing.map(s => s.charAt(0).toUpperCase() + s.slice(1));
        simDesc.innerText = `Missing: ${capitalisedMissing.join(', ')}`;
      }
    }

    if (simJdInput && simResumeInput) {
      simJdInput.addEventListener('input', runSimulation);
      simResumeInput.addEventListener('input', runSimulation);
      // Run once on load
      runSimulation();
    }
  }
};
