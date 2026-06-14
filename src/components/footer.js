export const Footer = {
  render() {
    return `
      <footer>
        <div class="footer-content">
          <div class="flex-row" style="gap: 0.5rem; font-weight: 700; color: var(--text-main);">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color: var(--primary);">
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <line x1="10" y1="9" x2="8" y2="9"></line>
            </svg>
            OptiCV
          </div>
          <div>
            Built with ❤️ for Freshers & Students to bypass ATS filters.
          </div>
          <div style="display: flex; gap: 1rem;">
            <a href="#/about" class="nav-link" style="font-size: 0.85rem;">ATS Guide</a>
            <a href="#/" class="nav-link" style="font-size: 0.85rem;">Privacy Policy</a>
            <span style="font-size: 0.85rem;">&copy; ${new Date().getFullYear()} OptiCV. All rights reserved.</span>
          </div>
        </div>
      </footer>
    `;
  }
};
