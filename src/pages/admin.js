import { db } from '../utils/db.js';

export const AdminPage = {
  render() {
    const user = db.getCurrentUser();
    if (!user || user.role !== 'admin') {
      return `
        <div class="glass-panel" style="text-align: center; padding: 4rem; max-width: 600px; margin: 3rem auto;">
          <h2 style="color: var(--accent-rose);">Access Denied</h2>
          <p style="color: var(--text-muted); margin-top: 1rem; margin-bottom: 2rem;">You do not have administrative permissions to view this panel.</p>
          <a href="#/dashboard" class="btn btn-primary">Go to Dashboard</a>
        </div>
      `;
    }

    const stats = db.getAdminStats();
    const logs = db.getAdminLogs();
    const users = db.getUsers();

    // Generate logs rows HTML
    const logRowsHtml = logs.slice(0, 10).map(log => {
      const logDate = new Date(log.date).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }) + ' ' + new Date(log.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });

      return `
        <tr>
          <td style="color: var(--text-muted); font-size: 0.85rem; white-space: nowrap;">${logDate}</td>
          <td>
            <span class="score-badge" style="background: rgba(99, 102, 241, 0.15); color: var(--primary); font-weight: 600; padding: 0.2rem 0.5rem;">
              ${log.action}
            </span>
          </td>
          <td style="font-size: 0.9rem; color: var(--text-main);">${log.details}</td>
        </tr>
      `;
    }).join('');

    // Generate users rows HTML
    const userRowsHtml = users.map(u => {
      const registerDate = new Date(u.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });

      const roleBadgeColor = u.role === 'admin' 
        ? 'background: rgba(168, 85, 247, 0.15); color: var(--secondary);'
        : 'background: rgba(16, 185, 129, 0.15); color: var(--accent-emerald);';

      return `
        <tr>
          <td>
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <div class="avatar" style="width: 32px; height: 32px; font-size: 0.85rem;">${u.name.charAt(0)}</div>
              <span style="font-weight: 600;">${u.name}</span>
            </div>
          </td>
          <td style="font-size: 0.9rem; color: var(--text-muted);">${u.email}</td>
          <td>
            <span class="score-badge" style="${roleBadgeColor} font-size: 0.75rem;">
              ${u.role.toUpperCase()}
            </span>
          </td>
          <td style="font-size: 0.9rem; color: var(--text-muted);">${registerDate}</td>
        </tr>
      `;
    }).join('');

    return `
      <div class="admin-wrapper">
        <div class="analysis-header" style="margin-bottom: 2rem;">
          <div class="analysis-headline">
            <h1>Admin Control Panel</h1>
            <p>System metrics, audit trails, and data resets</p>
          </div>
          <button id="db-reset-btn" class="btn btn-danger" style="font-size: 0.9rem;">
            Reset DB Seed
          </button>
        </div>

        <!-- Metric Counter Panel -->
        <div class="admin-card-row">
          <div class="glass-card stat-card">
            <span class="stat-label">Total Users</span>
            <div class="stat-val" style="color: var(--primary);">${stats.totalUsers}</div>
            <span style="font-size: 0.8rem; color: var(--text-muted);">
              Admin: 1 | Student: ${stats.totalStudents}
            </span>
          </div>

          <div class="glass-card stat-card">
            <span class="stat-label">Resume Scans</span>
            <div class="stat-val" style="color: var(--secondary);">${stats.totalScans}</div>
            <span style="font-size: 0.8rem; color: var(--text-muted);">
              Total parser conversions
            </span>
          </div>

          <div class="glass-card stat-card">
            <span class="stat-label">System Avg Score</span>
            <div class="stat-val" style="color: var(--accent-emerald);">${stats.averageScore}%</div>
            <span style="font-size: 0.8rem; color: var(--text-muted);">
              Goal average is 75%
            </span>
          </div>

          <div class="glass-card stat-card">
            <span class="stat-label">Storage Bytes</span>
            <div class="stat-val" style="color: var(--accent-amber);">${Math.round(JSON.stringify(localStorage).length / 1024)} KB</div>
            <span style="font-size: 0.8rem; color: var(--text-muted);">
              LocalStorage footprint
            </span>
          </div>
        </div>

        <!-- System Logs and User tables -->
        <div class="grid-2" style="margin-bottom: 3rem; align-items: start;">
          <!-- Left: User Registration list -->
          <div class="glass-panel" style="padding: 1.5rem;">
            <h3 style="font-size: 1.2rem; font-weight: 700; margin-bottom: 1rem; color: var(--primary);">System User Registry</h3>
            <div class="admin-table-container">
              <table class="admin-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Registered</th>
                  </tr>
                </thead>
                <tbody>
                  ${userRowsHtml}
                </tbody>
              </table>
            </div>
          </div>

          <!-- Right: System Activity Log logs -->
          <div class="glass-panel" style="padding: 1.5rem;">
            <h3 style="font-size: 1.2rem; font-weight: 700; margin-bottom: 1rem; color: var(--secondary);">Security Audit Log</h3>
            <div class="admin-table-container">
              <table class="admin-table">
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>Action</th>
                    <th>Details</th>
                  </tr>
                </thead>
                <tbody>
                  ${logRowsHtml}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- System Reset Drawer -->
        <section class="glass-panel" style="padding: 2rem; margin-bottom: 3rem; border-color: rgba(244, 63, 94, 0.2);">
          <h3 style="font-size: 1.2rem; font-weight: 700; margin-bottom: 0.5rem; color: var(--accent-rose);">Dangerous Controls Zone</h3>
          <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1.25rem;">
            Perform system diagnostic state wipes. These commands execute client-side and clear cookies/caches saved in this browser window.
          </p>
          <div style="display: flex; gap: 1rem;">
            <button id="clear-scans-btn" class="btn btn-secondary" style="border-color: rgba(244, 63, 94, 0.3); color: #fda4af;">
              Clear All Scans History
            </button>
            <button id="purge-users-btn" class="btn btn-secondary">
              Purge Custom Accounts
            </button>
          </div>
        </section>
      </div>
    `;
  },

  init(routerCallback) {
    const dbResetBtn = document.getElementById('db-reset-btn');
    const clearScansBtn = document.getElementById('clear-scans-btn');
    const purgeUsersBtn = document.getElementById('purge-users-btn');

    if (dbResetBtn) {
      dbResetBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to reset the database? This restores default users and mock scan data, wiping any custom changes.')) {
          localStorage.clear();
          db.init(); // reinitialize default users & history
          window.showToast('Database reset to seed state!', 'success');
          if (routerCallback) routerCallback();
        }
      });
    }

    if (clearScansBtn) {
      clearScansBtn.addEventListener('click', () => {
        if (confirm('Clear all resume scanning reports history? This cannot be undone.')) {
          localStorage.setItem('opti_history', JSON.stringify([]));
          db.addAdminLog('History Purge', 'Admin cleared all scan records.');
          window.showToast('Scan history cleared successfully!', 'success');
          if (routerCallback) routerCallback();
        }
      });
    }

    if (purgeUsersBtn) {
      purgeUsersBtn.addEventListener('click', () => {
        if (confirm('Wipe custom accounts and keep only seed data?')) {
          localStorage.removeItem('opti_users');
          db.init(); // restores DEFAULT_USERS
          db.addAdminLog('User Purge', 'Admin purged custom accounts.');
          window.showToast('Custom users purged.', 'success');
          if (routerCallback) routerCallback();
        }
      });
    }
  }
};
