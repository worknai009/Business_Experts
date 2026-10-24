const ADMIN_TOKEN_KEY = 'admin_panel_token';
const ADMIN_USER_KEY  = 'admin_panel_user';

const SUPER_TOKEN_KEY = 'super_admin_token';
const SUPER_USER_KEY  = 'super_admin_user';

async function postLogin(url, email, password) {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: (email || '').trim().toLowerCase(), password }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.token) {
    throw new Error(data.error || 'Authentication failed. Please check your credentials.');
  }
  return data;
}

/** Admin panel login — ADMIN ya SUPER_ADMIN dono chalega. */
export async function adminLogin(email, password) {
  const normEmail = email.trim().toLowerCase();
  const data = await postLogin('/api/auth/admin-login', normEmail, password);

  sessionStorage.setItem(ADMIN_TOKEN_KEY, data.token);
  sessionStorage.setItem(
    ADMIN_USER_KEY,
    JSON.stringify({
      email: data.email,
      fullName: data.fullName,
      role: data.role,
      loggedInAt: new Date().toISOString(),
    })
  );

  return data;
}

/** Super admin panel login — sirf SUPER_ADMIN. */
export async function superAdminLogin(email, password) {
  const normEmail = email.trim().toLowerCase();
  const data = await postLogin('/api/auth/super-admin-login', normEmail, password);

  sessionStorage.setItem(SUPER_TOKEN_KEY, data.token);
  sessionStorage.setItem(
    SUPER_USER_KEY,
    JSON.stringify({
      email: data.email,
      fullName: data.fullName,
      role: data.role,
      loggedInAt: new Date().toISOString(),
    })
  );

  return data;
}

export function getAdminToken() {
  return sessionStorage.getItem(ADMIN_TOKEN_KEY) || localStorage.getItem(ADMIN_TOKEN_KEY) || null;
}

export function getSuperAdminToken() {
  return sessionStorage.getItem(SUPER_TOKEN_KEY) || localStorage.getItem(SUPER_TOKEN_KEY) || null;
}

export function adminLogout() {
  sessionStorage.removeItem(ADMIN_TOKEN_KEY);
  localStorage.removeItem(ADMIN_TOKEN_KEY);
  sessionStorage.removeItem(ADMIN_USER_KEY);
  localStorage.removeItem(ADMIN_USER_KEY);
}

export function superAdminLogout() {
  sessionStorage.removeItem(SUPER_TOKEN_KEY);
  localStorage.removeItem(SUPER_TOKEN_KEY);
  sessionStorage.removeItem(SUPER_USER_KEY);
  localStorage.removeItem(SUPER_USER_KEY);
}

export async function verifyPanelAccess(token, allowedRoles) {
  if (!token) return false;

  try {
    const response = await fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    }).catch(() => null);

    if (response && response.ok) {
      const user = await response.json().catch(() => null);
      if (user && allowedRoles.includes(user.role)) {
        return true;
      }
      return false;
    }
    if (response && (response.status === 401 || response.status === 403)) {
      adminLogout();
      superAdminLogout();
      return false;
    }
  } catch (e) {
    return false;
  }

  return false;
}
