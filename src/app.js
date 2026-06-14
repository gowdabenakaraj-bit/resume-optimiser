import { db } from './utils/db.js';
import { Navbar } from './components/navbar.js';
import { Footer } from './components/footer.js';

// Page imports
import { HomePage } from './pages/home.js';
import { AboutPage } from './pages/about.js';
import { AuthPage } from './pages/auth.js';
import { DashboardPage } from './pages/dashboard.js';
import { UploadPage } from './pages/upload.js';
import { AnalysisPage } from './pages/analysis.js';
import { AdminPage } from './pages/admin.js';

// Define routing maps
const ROUTES = {
  '#/': { component: HomePage, authRequired: false },
  '#/about': { component: AboutPage, authRequired: false },
  '#/login': { component: AuthPage, authRequired: false },
  '#/register': { component: AuthPage, authRequired: false },
  '#/dashboard': { component: DashboardPage, authRequired: true },
  '#/upload': { component: UploadPage, authRequired: true },
  '#/analysis': { component: AnalysisPage, authRequired: true },
  '#/admin': { component: AdminPage, authRequired: true, roleRequired: 'admin' }
};

/**
 * Parses current hash route and retrieves query params
 * e.g. "#/analysis?id=hist_123" => route: "#/analysis", params: { id: "hist_123" }
 */
function parseCurrentRoute() {
  const hash = window.location.hash || '#/';
  const parts = hash.split('?');
  const route = parts[0];
  const params = {};

  if (parts.length > 1) {
    const searchParams = new URLSearchParams(parts[1]);
    for (const [key, value] of searchParams.entries()) {
      params[key] = value;
    }
  }

  return { route, params };
}

/**
 * Main Single Page Application Router Engine
 */
function router() {
  const appContainer = document.getElementById('app');
  if (!appContainer) return;

  const { route, params } = parseCurrentRoute();
  
  // Find route match, default to HomePage if not found
  let routeConfig = ROUTES[route];
  if (!routeConfig) {
    // Graceful fallback for typo hashes or 404s
    window.location.hash = '#/';
    return;
  }

  const user = db.getCurrentUser();

  // Authentication guards
  if (routeConfig.authRequired && !user) {
    window.showToast('Please sign in to access this page.', 'warning');
    window.location.hash = '#/login';
    return;
  }

  // Admin authorization guard
  if (routeConfig.roleRequired && (!user || user.role !== routeConfig.roleRequired)) {
    window.showToast('Access Denied: Administrative permissions required.', 'error');
    window.location.hash = '#/dashboard';
    return;
  }

  // Double-login prevention guard
  if ((route === '#/login' || route === '#/register') && user) {
    window.location.hash = user.role === 'admin' ? '#/admin' : '#/dashboard';
    return;
  }

  // Render Layout
  appContainer.innerHTML = `
    ${Navbar.render()}
    <main class="page-content fadeIn">
      ${routeConfig.component.render(params)}
    </main>
    ${Footer.render()}
    <div id="toast-drawer" class="toast-container"></div>
  `;

  // Initialize event bindings
  Navbar.init(router);
  if (routeConfig.component.init) {
    routeConfig.component.init(router);
  }
}

/**
 * Dynamic Toast Notification System
 */
window.showToast = function(message, type = 'success') {
  const container = document.getElementById('toast-drawer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  // Choose icon based on type
  let icon = `
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="16" x2="12" y2="12"></line>
      <line x1="12" y1="8" x2="12.01" y2="8"></line>
    </svg>
  `; // info/warning default
  
  if (type === 'success') {
    icon = `
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
    `;
  } else if (type === 'error') {
    icon = `
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="15" y1="9" x2="9" y2="15"></line>
        <line x1="9" y1="9" x2="15" y2="15"></line>
      </svg>
    `;
  }

  toast.innerHTML = `
    ${icon}
    <span>${message}</span>
  `;

  container.appendChild(toast);

  // Auto remove after 3.2 seconds
  setTimeout(() => {
    toast.style.animation = 'slideIn 0.3s reverse forwards';
    setTimeout(() => {
      if (toast.parentNode === container) {
        container.removeChild(toast);
      }
    }, 300);
  }, 3200);
};

// Initialize Application Lifecycles
window.addEventListener('hashchange', router);
window.addEventListener('DOMContentLoaded', () => {
  db.init(); // Make sure Database is initialized
  router(); // Boot standard router
});
