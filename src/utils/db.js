/* OptiCV Local Database and State Management Engine */

const DB_KEYS = {
  USERS: 'opti_users',
  SESSION: 'opti_session',
  HISTORY: 'opti_history',
  ADMIN_LOGS: 'opti_admin_logs'
};

// Seed Data
const DEFAULT_USERS = [
  {
    id: 'user_1',
    name: 'Alex Rivera',
    email: 'student@opticv.com',
    password: 'password123',
    role: 'student', // student / fresher
    createdAt: '2026-05-10T10:00:00.000Z'
  },
  {
    id: 'user_2',
    name: 'Admin User',
    email: 'admin@opticv.com',
    password: 'admin123',
    role: 'admin',
    createdAt: '2026-04-01T09:00:00.000Z'
  }
];

const DEFAULT_HISTORY = [
  {
    id: 'hist_1',
    userId: 'user_1',
    resumeName: 'Alex_Rivera_WebDev.pdf',
    jobTitle: 'Frontend React Developer',
    score: 82,
    date: '2026-06-10T14:30:00.000Z',
    report: {
      keywordScore: 85,
      formattingScore: 90,
      impactScore: 75,
      readabilityScore: 80,
      keywords: {
        matched: ['React', 'JavaScript', 'HTML5', 'CSS3', 'Git', 'REST APIs', 'Redux'],
        missing: ['TypeScript', 'Next.js', 'Webpack', 'Jest']
      },
      audit: [
        { type: 'success', title: 'Action Verbs Check', desc: 'Used strong action verbs like "Designed", "Built", and "Optimized".' },
        { type: 'success', title: 'Section Headings', desc: 'All standard sections (Education, Experience, Projects, Skills) were found.' },
        { type: 'warning', title: 'Missing Core Skills', desc: 'Add "TypeScript" and "Next.js" since they are highly requested in the job description.' },
        { type: 'success', title: 'Resume Length', desc: 'Good word count and single page layout.' }
      ]
    }
  },
  {
    id: 'hist_2',
    userId: 'user_1',
    resumeName: 'Alex_Rivera_General.pdf',
    jobTitle: 'Software Engineer Intern',
    score: 58,
    date: '2026-06-08T11:15:00.000Z',
    report: {
      keywordScore: 45,
      formattingScore: 70,
      impactScore: 60,
      readabilityScore: 65,
      keywords: {
        matched: ['Python', 'SQL', 'Algorithms'],
        missing: ['Docker', 'AWS', 'Unit Testing', 'CI/CD', 'Java']
      },
      audit: [
        { type: 'warning', title: 'Weak Action Verbs', desc: 'Contains passive verbs like "responsible for" and "assisted in".' },
        { type: 'danger', title: 'Missing Docker/AWS', desc: 'Cloud infrastructure keywords are completely absent.' },
        { type: 'success', title: 'Font Readability', desc: 'Clean, legible font usage and size hierarchies.' }
      ]
    }
  }
];

const DEFAULT_ADMIN_LOGS = [
  { id: 'log_1', action: 'User registration', details: 'Alex Rivera (student) signed up.', date: '2026-05-10T10:00:00.000Z' },
  { id: 'log_2', action: 'Resume Scan', details: 'User Alex Rivera scanned Alex_Rivera_General.pdf (Score: 58)', date: '2026-06-08T11:15:00.000Z' },
  { id: 'log_3', action: 'Resume Scan', details: 'User Alex Rivera scanned Alex_Rivera_WebDev.pdf (Score: 82)', date: '2026-06-10T14:30:00.000Z' }
];

// Database Class
class LocalDB {
  constructor() {
    this.init();
  }

  init() {
    if (!localStorage.getItem(DB_KEYS.USERS)) {
      localStorage.setItem(DB_KEYS.USERS, JSON.stringify(DEFAULT_USERS));
    }
    if (!localStorage.getItem(DB_KEYS.HISTORY)) {
      localStorage.setItem(DB_KEYS.HISTORY, JSON.stringify(DEFAULT_HISTORY));
    }
    if (!localStorage.getItem(DB_KEYS.ADMIN_LOGS)) {
      localStorage.setItem(DB_KEYS.ADMIN_LOGS, JSON.stringify(DEFAULT_ADMIN_LOGS));
    }
  }

  // User Management
  getUsers() {
    return JSON.parse(localStorage.getItem(DB_KEYS.USERS)) || [];
  }

  registerUser(name, email, password, role = 'student') {
    const users = this.getUsers();
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error('An account with this email already exists.');
    }

    const newUser = {
      id: 'user_' + Date.now(),
      name,
      email: email.toLowerCase(),
      password,
      role,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem(DB_KEYS.USERS, JSON.stringify(users));
    this.addAdminLog('User registration', `${name} (${role}) signed up.`);
    return newUser;
  }

  login(email, password) {
    const users = this.getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (!user) {
      throw new Error('Invalid email or password.');
    }

    const session = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    localStorage.setItem(DB_KEYS.SESSION, JSON.stringify(session));
    this.addAdminLog('User login', `${user.name} logged in.`);
    return session;
  }

  logout() {
    const currentUser = this.getCurrentUser();
    if (currentUser) {
      this.addAdminLog('User logout', `${currentUser.name} logged out.`);
    }
    localStorage.removeItem(DB_KEYS.SESSION);
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem(DB_KEYS.SESSION)) || null;
  }

  // Resume History Management
  getHistory(userId = null) {
    const history = JSON.parse(localStorage.getItem(DB_KEYS.HISTORY)) || [];
    if (userId) {
      return history.filter(item => item.userId === userId).sort((a, b) => new Date(b.date) - new Date(a.date));
    }
    return history.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  saveAnalysis(userId, resumeName, jobTitle, score, report) {
    const history = JSON.parse(localStorage.getItem(DB_KEYS.HISTORY)) || [];
    const newRecord = {
      id: 'hist_' + Date.now(),
      userId,
      resumeName,
      jobTitle,
      score,
      date: new Date().toISOString(),
      report
    };

    history.push(newRecord);
    localStorage.setItem(DB_KEYS.HISTORY, JSON.stringify(history));

    const user = this.getUsers().find(u => u.id === userId);
    const userName = user ? user.name : 'Unknown';
    this.addAdminLog('Resume Scan', `User ${userName} scanned ${resumeName} (Score: ${score})`);
    
    return newRecord;
  }

  // Admin Logs & Stats
  getAdminLogs() {
    const logs = JSON.parse(localStorage.getItem(DB_KEYS.ADMIN_LOGS)) || [];
    return logs.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  addAdminLog(action, details) {
    const logs = JSON.parse(localStorage.getItem(DB_KEYS.ADMIN_LOGS)) || [];
    logs.push({
      id: 'log_' + Date.now(),
      action,
      details,
      date: new Date().toISOString()
    });
    localStorage.setItem(DB_KEYS.ADMIN_LOGS, JSON.stringify(logs.slice(-200))); // Keep last 200 logs
  }

  getAdminStats() {
    const users = this.getUsers();
    const history = this.getHistory();
    const students = users.filter(u => u.role === 'student').length;
    
    let totalScore = 0;
    history.forEach(h => totalScore += h.score);
    const avgScore = history.length > 0 ? Math.round(totalScore / history.length) : 0;

    return {
      totalUsers: users.length,
      totalStudents: students,
      totalScans: history.length,
      averageScore: avgScore
    };
  }
}

export const db = new LocalDB();
