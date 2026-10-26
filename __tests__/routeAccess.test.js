import {routeRedirect} from '../src/offline/routeAccess';
const offline = {mode: 'offline', employee: {offline_attendance: true}};
test.each(['Home', 'Tabroutes', 'Selfie', 'Maps', 'OfflineDashboard', 'Crm'])('blocks unauthenticated %s', name => {
  expect(routeRedirect(name, null)).toBe('Login');
});
test.each(['Home', 'Tabroutes', 'Crm', 'Leave'])('blocks online-only %s offline', name => {
  expect(routeRedirect(name, offline)).toBe('OfflineDashboard');
});
test.each(['OfflineDashboard', 'Selfie', 'Maps'])('allows offline attendance screen %s', name => {
  expect(routeRedirect(name, offline)).toBeNull();
});
test('rejects offline access without explicit permission', () => {
  expect(routeRedirect('OfflineDashboard', {mode: 'offline', employee: {offline_attendance: false}})).toBe('Login');
});
test('online session opens home and redirects offline dashboard', () => {
  expect(routeRedirect('Tabroutes', {mode: 'online'})).toBeNull();
  expect(routeRedirect('OfflineDashboard', {mode: 'online'})).toBe('Tabroutes');
});
test('login and password recovery remain public', () => {
  expect(routeRedirect('Login', null)).toBeNull();
  expect(routeRedirect('ForgetPin', null)).toBeNull();
});
