export const AboutPage = {
  render() {
    return `
      <div class="about-container">
        <div class="about-header">
          <h1 class="glow-text" style="font-size: 2.2rem; font-weight: 800; background: linear-gradient(135deg, var(--primary), var(--secondary)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; display: inline-block; margin-bottom: 0.5rem;">Understanding ATS Algorithms</h1>
          <p style="color: var(--text-muted); font-size: 1.1rem;">An educational guide for freshers, students, and job seekers on how recruitment engines score your profile.</p>
        </div>

        <section class="about-section glass-panel" style="padding: 2rem;">
          <h2 class="about-section-title">What is an Applicant Tracking System?</h2>
          <p style="color: var(--text-muted); margin-bottom: 1rem;">
            An **Applicant Tracking System (ATS)** is a software application used by human resources departments and recruiters to filter, organize, and track candidates during the hiring process. 
          </p>
          <p style="color: var(--text-muted); margin-bottom: 1rem;">
            Rather than reading all resumes manually, corporate recruiters use search queries and matching filters to highlight top talent. If your resume does not score highly against the job description's core keywords, it may never be seen by a human recruiter.
          </p>
        </section>

        <section class="grid-2" style="margin-bottom: 3rem;">
          <div class="glass-card">
            <h3 style="font-size: 1.15rem; font-weight: 600; margin-bottom: 0.75rem; color: var(--primary); display: flex; align-items: center; gap: 0.5rem;">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              Why 75% of Resumes Are Filtered Out
            </h3>
            <ul style="color: var(--text-muted); font-size: 0.9rem; padding-left: 1.25rem; display: flex; flex-direction: column; gap: 0.5rem;">
              <li><strong>Missing Keywords</strong>: If the job description asks for "TypeScript" and you wrote "JavaScript developer", the algorithm might filter you out for lacking qualifications.</li>
              <li><strong>Graphic Elements</strong>: Text boxes, icons, logos, and custom progress bars appear as scrambled noise to old ATS parsers.</li>
              <li><strong>Passive Language</strong>: Vague bullet points (e.g. "responsible for help desk support") fail to represent active accomplishments.</li>
            </ul>
          </div>
          
          <div class="glass-card">
            <h3 style="font-size: 1.15rem; font-weight: 600; margin-bottom: 0.75rem; color: var(--accent-emerald); display: flex; align-items: center; gap: 0.5rem;">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              Standard ATS Best Practices
            </h3>
            <ul style="color: var(--text-muted); font-size: 0.9rem; padding-left: 1.25rem; display: flex; flex-direction: column; gap: 0.5rem;">
              <li><strong>Clean Layouts</strong>: Stick to a single-column structure with standard, clear margins (0.5 to 1 inch).</li>
              <li><strong>Standard Headers</strong>: Use generic section names like "Experience", "Skills", "Education", and "Projects".</li>
              <li><strong>Active Wording</strong>: Start every single bullet point with a strong action verb (e.g., "Led", "Optimized", "Designed").</li>
              <li><strong>PDF or DOCX</strong>: Always save your CV as standard selectable text format. Never upload scanned images of text.</li>
            </ul>
          </div>
        </section>

        <!-- Dynamic FAQ dropdown list -->
        <section class="glass-panel" style="padding: 2rem; margin-bottom: 3rem;">
          <h2 class="about-section-title" style="margin-bottom: 1.5rem;">Frequently Asked Questions</h2>
          
          <div style="display: flex; flex-direction: column; gap: 1.25rem;">
            <div style="border-bottom: 1px solid var(--border-light); padding-bottom: 1rem;">
              <h4 style="font-weight: 600; margin-bottom: 0.35rem; color: var(--text-main);">Q: Should a fresher use a double-column template?</h4>
              <p style="color: var(--text-muted); font-size: 0.9rem;">
                A: While double-column resumes can look modern to humans, they often cause basic ATS scanners to read horizontal text blocks straight across columns, blending unrelated content and ruining your score. A single-column format is much safer.
              </p>
            </div>
            
            <div style="border-bottom: 1px solid var(--border-light); padding-bottom: 1rem;">
              <h4 style="font-weight: 600; margin-bottom: 0.35rem; color: var(--text-main);">Q: How many keywords should I include?</h4>
              <p style="color: var(--text-muted); font-size: 0.9rem;">
                A: Focus only on the core requirements. Avoid "keyword stuffing" (listing dozens of technologies you don't know). Integrate matched technical skills and core soft skills naturally into your project achievements.
              </p>
            </div>

            <div>
              <h4 style="font-weight: 600; margin-bottom: 0.35rem; color: var(--text-main);">Q: Does OptiCV store my resume files?</h4>
              <p style="color: var(--text-muted); font-size: 0.9rem;">
                A: No. Your files are parsed locally on your device, and analysis data is kept securely in your local browser sandbox (LocalStorage). We do not transmit or sell candidate details.
              </p>
            </div>
          </div>
        </section>
      </div>
    `;
  },

  init() {
    // Basic init if needed
  }
};
