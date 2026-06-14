import { db } from '../utils/db.js';

export const Navbar = {
  render() {
    const user = db.getCurrentUser();
    
    // Generate links based on login state and user role
    let navLinks = '';
    
    if (!user) {
      navLinks = `
        <li><a href="#/" class="nav-link" data-link="home">Home</a></li>
        <li><a href="#/about" class="nav-link" data-link="about">About ATS</a></li>
        <li><a href="#/login" class="nav-link btn btn-secondary" style="padding: 0.4rem 1rem;" data-link="login">Sign In</a></li>
        <li><a href="#/register" class="nav-link btn btn-primary" style="padding: 0.4rem 1rem;" data-link="register">Register</a></li>
      `;
    } else {
      if (user.role === 'admin') {
        navLinks = `
          <li><a href="#/admin" class="nav-link" data-link="admin">Admin Panel</a></li>
          <li><a href="#/dashboard" class="nav-link" data-link="dashboard">Student View</a></li>
          <li><a href="#/about" class="nav-link" data-link="about">About</a></li>
          <li class="flex-row" style="gap: 0.75rem; margin-left: 0.5rem;">
            <span class="user-info-role" style="background: rgba(168, 85, 247, 0.2); color: #d8b4fe; padding: 0.2rem 0.5rem; border-radius: 12px; font-weight: 600; font-size: 0.75rem;">Admin</span>
            <button id="logout-btn" class="btn btn-danger" style="padding: 0.4rem 0.8rem; font-size: 0.85rem;">Logout</button>
          </li>
        `;
      } else {
        navLinks = `
          <li><a href="#/dashboard" class="nav-link" data-link="dashboard">Dashboard</a></li>
          <li><a href="#/upload" class="nav-link btn btn-primary" style="padding: 0.4rem 1rem;" data-link="upload">Optimize Resume</a></li>
          <li><a href="#/about" class="nav-link" data-link="about">About</a></li>
          <li class="flex-row" style="gap: 0.75rem; margin-left: 0.5rem;">
            <div class="avatar" style="width: 30px; height: 30px; font-size: 0.8rem;">${user.name.charAt(0)}</div>
            <button id="logout-btn" class="btn btn-secondary" style="padding: 0.4rem 0.8rem; font-size: 0.85rem;">Logout</button>
          </li>
        `;
      }
    }

    return `
      <header class="navbar-container">
        <nav class="navbar">
          <a href="#/" class="logo">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color: var(--primary);">
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <line x1="10" y1="9" x2="8" y2="9"></line>
            </svg>
            OptiCV
          </a>
          <ul class="nav-links">
            ${navLinks}
          </ul>
        </nav>
      </header>
    `;
  },

  init(routerCallback) {
    // Highlight active link based on current hash
    const hash = window.location.hash || '#/';
    let currentLink = 'home';
    if (hash.startsWith('#/about')) currentLink = 'about';
    else if (hash.startsWith('#/login')) currentLink = 'login';
    else if (hash.startsWith('#/register')) currentLink = 'register';
    else if (hash.startsWith('#/dashboard')) currentLink = 'dashboard';
    else if (hash.startsWith('#/upload') || hash.startsWith('#/analysis')) currentLink = 'upload';
    else if (hash.startsWith('#/admin')) currentLink = 'admin';

    const activeEl = document.querySelector(`.nav-link[data-link="${currentLink}"]`);
    if (activeEl) {
      activeEl.classList.add('active');
    }

    // Attach logout functionality
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        db.logout();
        window.location.hash = '#/';
        if (routerCallback) routerCallback();
      });
    }
  }
};
