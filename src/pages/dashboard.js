import { db } from '../utils/db.js';

export const DashboardPage = {
  render() {
    const user = db.getCurrentUser();
    if (!user) return `<div class="loader-container"><div class="spinner"></div></div>`;

    const history = db.getHistory(user.id);
    const stats = this.calculateStats(history);

    // Calculate score color class
    let scoreColorClass = 'score-low';
    if (stats.avgScore >= 80) scoreColorClass = 'score-high';
    else if (stats.avgScore >= 50) scoreColorClass = 'score-mid';

    // Generate history list HTML
    let historyListHtml = '';
    if (history.length === 0) {
      historyListHtml = `
        <div class="glass-card" style="text-align: center; padding: 3rem 2rem;">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-dim)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom: 1rem;">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <line x1="10" y1="9" x2="8" y2="9"></line>
          </svg>
          <h3 style="font-size: 1.2rem; font-weight: 600; margin-bottom: 0.5rem;">No Optimization History</h3>
          <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 1.5rem; max-width: 400px; margin-left: auto; margin-right: auto;">
            Scan your resume against a target job description to see your ATS compatibility report.
          </p>
          <a href="#/upload" class="btn btn-primary">Scan Resume Now</a>
        </div>
      `;
    } else {
      historyListHtml = `
        <div class="history-list">
          ${history.map(item => {
            let itemScoreClass = 'score-low';
            if (item.score >= 80) itemScoreClass = 'score-high';
            else if (item.score >= 50) itemScoreClass = 'score-mid';

            const formattedDate = new Date(item.date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });

            return `
              <div class="glass-card history-item">
                <div class="history-info">
                  <span class="history-title">${item.jobTitle}</span>
                  <span class="history-date" style="display: flex; align-items: center; gap: 0.5rem;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    ${formattedDate}
                  </span>
                  <span style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.25rem; display: flex; align-items: center; gap: 0.35rem;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                    </svg>
                    File: ${item.resumeName}
                  </span>
                </div>
                <div style="display: flex; align-items: center; gap: 1.5rem;">
                  <div class="history-score">
                    <span class="score-badge ${itemScoreClass}">ATS Match: ${item.score}%</span>
                  </div>
                  <a href="#/analysis?id=${item.id}" class="btn btn-secondary" style="padding: 0.5rem 1rem; font-size: 0.85rem;">
                    View Report
                  </a>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `;
    }

    return `
      <div class="dashboard-grid">
        <!-- Sidebar Navigation -->
        <aside class="dashboard-sidebar">
          <div class="glass-panel" style="padding: 1.5rem;">
            <div class="user-profile">
              <div class="avatar">${user.name.charAt(0)}</div>
              <div>
                <div class="user-info-name">${user.name}</div>
                <div class="user-info-role">${user.role === 'admin' ? 'System Admin' : 'Student Account'}</div>
              </div>
            </div>
            
            <ul class="dash-menu" style="margin-top: 1.5rem;">
              <li class="dash-menu-item active">
                <button onclick="window.location.hash='#/dashboard'">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="3" width="7" height="7"></rect>
                    <rect x="14" y="3" width="7" height="7"></rect>
                    <rect x="14" y="14" width="7" height="7"></rect>
                    <rect x="3" y="14" width="7" height="7"></rect>
                  </svg>
                  My Workspace
                </button>
              </li>
              <li class="dash-menu-item">
                <button onclick="window.location.hash='#/upload'">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 5v14M5 12h14"/>
                  </svg>
                  Optimize Resume
                </button>
              </li>
              <li class="dash-menu-item">
                <button onclick="window.location.hash='#/about'">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                  </svg>
                  ATS Help Docs
                </button>
              </li>
            </ul>
          </div>
        </aside>

        <!-- Main Workspace -->
        <main-content style="display: block;">
          <div class="glass-panel" style="padding: 2rem; margin-bottom: 2rem;">
            <h2 style="font-size: 1.8rem; font-weight: 700; margin-bottom: 0.5rem;">Welcome back, ${user.name}!</h2>
            <p style="color: var(--text-muted); font-size: 1rem;">Here is a summary of your resume's ATS compliance score analysis.</p>
          </div>

          <!-- Stats Widgets -->
          <div class="stat-grid">
            <div class="glass-card stat-card">
              <span class="stat-label">Average ATS Score</span>
              <div class="stat-val ${scoreColorClass}" style="background: none; padding: 0;">${stats.avgScore}%</div>
              <span style="font-size: 0.8rem; color: var(--text-muted); display: block; margin-top: 0.25rem;">
                Target score is 80%+
              </span>
            </div>
            
            <div class="glass-card stat-card">
              <span class="stat-label">Resumes Evaluated</span>
              <div class="stat-val" style="color: var(--primary);">${stats.totalResumes}</div>
              <span style="font-size: 0.8rem; color: var(--text-muted); display: block; margin-top: 0.25rem;">
                All uploads stored securely
              </span>
            </div>

            <div class="glass-card stat-card">
              <span class="stat-label">Latest Match Score</span>
              <div class="stat-val" style="color: var(--secondary);">${stats.latestScore}%</div>
              <span style="font-size: 0.8rem; color: var(--text-muted); display: block; margin-top: 0.25rem;">
                From your latest scanning run
              </span>
            </div>
          </div>

          <!-- Analysis Timeline -->
          <section class="history-section">
            <h3 class="history-header">Recent Optimization History</h3>
            ${historyListHtml}
          </section>
        </main-content>
      </div>
    `;
  },

  init() {
    // Basic init if needed
  },

  calculateStats(history) {
    if (history.length === 0) {
      return { avgScore: 0, totalResumes: 0, latestScore: 0 };
    }

    let sum = 0;
    history.forEach(item => sum += item.score);
    const avgScore = Math.round(sum / history.length);
    const latestScore = history[0].score; // Sorted desc, so first element is latest

    return {
      avgScore,
      totalResumes: history.length,
      latestScore
    };
  }
};
