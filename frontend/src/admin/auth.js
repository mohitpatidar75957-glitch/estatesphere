const API_BASE = '/api';

const DEMO_FALLBACK_USERS = [
  { email: 'superadmin@estatesphere.com', pass: 'admin123', name: 'Super Admin', role: 'SUPER_ADMIN' },
  { email: 'manager@estatesphere.com', pass: 'manager123', name: 'Property Manager', role: 'ADMIN' },
  { email: 'agent@estatesphere.com', pass: 'agent123', name: 'Sales Executive', role: 'SALES_AGENT' }
];

export const authService = {
  async login(email, password, rememberMe = false) {
    const cleanEmail = (email || '').trim();
    const rawPass = password !== undefined && password !== null ? String(password) : '';
    const cleanPass = rawPass.trim();

    if (!cleanEmail) {
      throw new Error('Please enter your email address.');
    }
    if (!cleanPass && !rawPass) {
      throw new Error('Please enter your password.');
    }

    // 1. First check dataStore team database (UI created staff/agents)
    let teamMember = null;
    try {
      const rawTeam = localStorage.getItem('era_team_db_v2');
      if (rawTeam) {
        const teamUsers = JSON.parse(rawTeam);
        if (Array.isArray(teamUsers)) {
          teamMember = teamUsers.find(
            u => u.email && u.email.trim().toLowerCase() === cleanEmail.toLowerCase()
          );
        }
      }
    } catch (_) {}

    if (teamMember) {
      if (teamMember.status === 'DEACTIVATED') {
        throw new Error('Account Deactivated: This account has been deactivated by Super Admin.');
      }
      const memberPass = String(teamMember.password || '');
      const passMatches = memberPass === rawPass || 
                          memberPass.trim() === cleanPass || 
                          memberPass.replace(/\s+/g, '') === rawPass.replace(/\s+/g, '');
      if (memberPass && !passMatches) {
        throw new Error('Incorrect Password: The password entered does not match.');
      }
      const teamSession = {
        token: `team-session-${Date.now()}`,
        user: {
          id: teamMember.id,
          name: teamMember.name,
          email: teamMember.email,
          role: teamMember.role || 'SALES_AGENT',
          permissions: teamMember.permissions
        },
        message: 'Login successful'
      };
      this.saveSession(teamSession.token, teamSession.user, rememberMe);
      return teamSession;
    }

    // 2. Check fallback demo users (Super Admin, Manager, Agent)
    const fallbackUser = DEMO_FALLBACK_USERS.find(
      u => u.email.toLowerCase() === cleanEmail.toLowerCase()
    );

    if (fallbackUser) {
      const fbPass = String(fallbackUser.pass || '');
      const passMatches = fbPass === rawPass || 
                          fbPass.trim() === cleanPass || 
                          fbPass.replace(/\s+/g, '') === rawPass.replace(/\s+/g, '');
      if (!passMatches) {
        throw new Error('Incorrect Password: The password entered does not match.');
      }

      const mockData = {
        token: `demo-session-${Date.now()}`,
        user: {
          id: 1,
          name: fallbackUser.name,
          email: fallbackUser.email,
          role: fallbackUser.role
        },
        message: 'Login successful'
      };

      this.saveSession(mockData.token, mockData.user, rememberMe);
      return mockData;
    }

    // 3. Check Spring Boot backend API
    let res = null;
    let data = null;

    try {
      res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password: cleanPass, rememberMe })
      });
      if (res) {
        try { data = await res.json(); } catch (_) {}
      }
    } catch (err) {}

    // If backend answered with success
    if (res && res.ok && data) {
      this.saveSession(data.token, data.user, rememberMe);
      return data;
    }

    // If backend returned a specific error (e.g. Password galat hai or Email galat hai)
    if (res && data && data.message) {
      throw new Error(data.message);
    }

    // 4. If email is not found in local team, fallback, or backend:
    throw new Error(`Email galat hai: Yeh email ('${cleanEmail}') registered nahi hai.`);
  },

  saveSession(token, user, rememberMe) {
    if (rememberMe) {
      localStorage.setItem('era_admin_token', token);
      localStorage.setItem('era_admin_user', JSON.stringify(user));
      sessionStorage.removeItem('era_admin_token');
      sessionStorage.removeItem('era_admin_user');
    } else {
      sessionStorage.setItem('era_admin_token', token);
      sessionStorage.setItem('era_admin_user', JSON.stringify(user));
      localStorage.removeItem('era_admin_token');
      localStorage.removeItem('era_admin_user');
    }
  },

  getToken() {
    return localStorage.getItem('era_admin_token') || sessionStorage.getItem('era_admin_token');
  },

  getUser() {
    const raw = localStorage.getItem('era_admin_user') || sessionStorage.getItem('era_admin_user');
    try {
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  getRole() {
    const user = this.getUser();
    return user ? user.role : null;
  },

  logout() {
    localStorage.removeItem('era_admin_token');
    localStorage.removeItem('era_admin_user');
    sessionStorage.removeItem('era_admin_token');
    sessionStorage.removeItem('era_admin_user');
    window.location.href = '/admin/login';
  },

  isAuthenticated() {
    return !!this.getToken();
  },

  async verifySession() {
    const token = this.getToken();
    if (!token) return null;

    if (token.startsWith('demo-session-') || token.startsWith('team-session-')) {
      return this.getUser();
    }

    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) {
        const localUser = this.getUser();
        if (localUser) return localUser;
        return null;
      }
      const user = await res.json();
      if (localStorage.getItem('era_admin_token')) {
        localStorage.setItem('era_admin_user', JSON.stringify(user));
      } else {
        sessionStorage.setItem('era_admin_user', JSON.stringify(user));
      }
      return user;
    } catch {
      return this.getUser();
    }
  }
};
