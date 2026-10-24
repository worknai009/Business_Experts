/**
 * Utility to detect and extract subdomains for routing
 * Examples:
 * - admin.domain.com -> 'admin'
 * - admin.localhost:5173 -> 'admin'
 * - superadmin.domain.com -> 'superadmin'
 * - superadmin.localhost:5173 -> 'superadmin'
 * - ?subdomain=admin -> 'admin' (Development helper)
 */
export function getSubdomain() {
  if (typeof window === 'undefined') return null;

  const hostname = window.location.hostname;
  
  // 1. Check hostname prefixes
  if (hostname.startsWith('superadmin.') || hostname.startsWith('super-admin.')) {
    return 'superadmin';
  }
  if (hostname.startsWith('admin.')) {
    return 'admin';
  }

  // 2. Check dev query param e.g. http://localhost:5173/?subdomain=admin
  const params = new URLSearchParams(window.location.search);
  const subParam = params.get('subdomain');
  if (subParam === 'admin' || subParam === 'superadmin') {
    return subParam;
  }

  return null;
}
