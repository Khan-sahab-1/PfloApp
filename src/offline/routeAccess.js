const publicScreens = new Set(['Login', 'ForgetPin']);
const offlineScreens = new Set(['OfflineDashboard', 'Selfie', 'Maps']);

export function routeRedirect(name, session) {
  if (publicScreens.has(name)) { return null; }
  if (!session) { return 'Login'; }
  if (session.mode === 'offline') {
    if (session.employee?.offline_attendance !== true) { return 'Login'; }
    return offlineScreens.has(name) ? null : 'OfflineDashboard';
  }
  if (session.mode !== 'online') { return 'Login'; }
  return name === 'OfflineDashboard' ? 'Tabroutes' : null;
}
