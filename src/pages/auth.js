import { db } from '../utils/db.js';

export const AuthPage = {
  render(params) {
    // Determine which tab is active based on parameters or route
    const activeTab = (params && params.tab === 'register') ? 'register' : 'login';
    
    return `
      <div class="auth-wrapper glass-panel">
        <div class="auth-header">
          <h1 class="auth-title">${activeTab === 'login' ? 'Welcome Back' : 'Create Account'}</h1>
          <p class="auth-subtitle">${activeTab === 'login' ? 'Sign in to access your resume reports' : 'Optimize your resume and secure interviews'}</p>
        </div>

        <div class="auth-tabs">
          <button class="auth-tab ${activeTab === 'login' ? 'active' : ''}" id="tab-login-btn">Sign In</button>
          <button class="auth-tab ${activeTab === 'register' ? 'active' : ''}" id="tab-register-btn">Register</button>
        </div>

        <!-- Login Form -->
        <form id="login-form" style="${activeTab === 'login' ? 'display: block;' : 'display: none;'}">
          <div class="form-group">
            <label class="form-label" for="login-email">Email Address</label>
            <input type="email" id="login-email" class="form-input" placeholder="student@opticv.com" required>
          </div>
          <div class="form-group">
            <label class="form-label" for="login-password">Password</label>
            <input type="password" id="login-password" class="form-input" placeholder="••••••••" required>
          </div>
          <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1.5rem; text-align: right;">
            <span style="font-weight: 500;">Default Creds: student@opticv.com / password123</span>
          </div>
          <button type="submit" class="btn btn-primary" style="width: 100%;">Sign In</button>
        </form>

        <!-- Register Form -->
        <form id="register-form" style="${activeTab === 'register' ? 'display: block;' : 'display: none;'}">
          <div class="form-group">
            <label class="form-label" for="reg-name">Full Name</label>
            <input type="text" id="reg-name" class="form-input" placeholder="Alex Rivera" required>
          </div>
          <div class="form-group">
            <label class="form-label" for="reg-email">Email Address</label>
            <input type="email" id="reg-email" class="form-input" placeholder="alex.rivera@example.com" required>
          </div>
          <div class="form-group">
            <label class="form-label" for="reg-role">I am a...</label>
            <select id="reg-role" class="form-select">
              <option value="student">Student / Fresher / Job Seeker</option>
              <option value="admin">HR Recruiter / Admin Mode</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label" for="reg-password">Password</label>
            <input type="password" id="reg-password" class="form-input" placeholder="••••••••" required>
          </div>
          <div class="form-group">
            <label class="form-label" for="reg-confirm">Confirm Password</label>
            <input type="password" id="reg-confirm" class="form-input" placeholder="••••••••" required>
          </div>
          <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 1rem;">Create Account</button>
        </form>
      </div>
    `;
  },

  init(routerCallback) {
    const tabLoginBtn = document.getElementById('tab-login-btn');
    const tabRegisterBtn = document.getElementById('tab-register-btn');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const authTitle = document.querySelector('.auth-title');
    const authSubtitle = document.querySelector('.auth-subtitle');

    // Tab switching
    if (tabLoginBtn && tabRegisterBtn) {
      tabLoginBtn.addEventListener('click', () => {
        tabLoginBtn.classList.add('active');
        tabRegisterBtn.classList.remove('active');
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
        authTitle.innerText = 'Welcome Back';
        authSubtitle.innerText = 'Sign in to access your resume reports';
        window.history.replaceState(null, '', '#/login');
      });

      tabRegisterBtn.addEventListener('click', () => {
        tabRegisterBtn.classList.add('active');
        tabLoginBtn.classList.remove('active');
        registerForm.style.display = 'block';
        loginForm.style.display = 'none';
        authTitle.innerText = 'Create Account';
        authSubtitle.innerText = 'Optimize your resume and secure interviews';
        window.history.replaceState(null, '', '#/register');
      });
    }

    // Handle Login Submission
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value;

        try {
          const session = db.login(email, password);
          window.showToast(`Welcome back, ${session.name}!`, 'success');
          
          if (session.role === 'admin') {
            window.location.hash = '#/admin';
          } else {
            window.location.hash = '#/dashboard';
          }
          if (routerCallback) routerCallback();
        } catch (error) {
          window.showToast(error.message, 'error');
        }
      });
    }

    // Handle Register Submission
    if (registerForm) {
      registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('reg-name').value.trim();
        const email = document.getElementById('reg-email').value.trim();
        const role = document.getElementById('reg-role').value;
        const password = document.getElementById('reg-password').value;
        const confirmPassword = document.getElementById('reg-confirm').value;

        if (password !== confirmPassword) {
          window.showToast('Passwords do not match.', 'error');
          return;
        }

        try {
          db.registerUser(name, email, password, role);
          window.showToast('Registration successful! Please sign in.', 'success');
          
          // Switch to login tab automatically
          tabLoginBtn.click();
          // Pre-populate email
          document.getElementById('login-email').value = email;
          document.getElementById('login-password').focus();
        } catch (error) {
          window.showToast(error.message, 'error');
        }
      });
    }
  }
};
