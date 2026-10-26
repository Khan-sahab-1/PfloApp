jest.mock('@react-native-community/netinfo', () => ({fetch: jest.fn(), addEventListener: jest.fn()}));
jest.mock('../src/offline/session', () => ({
  isDisconnected: state => state.isConnected === false || state.isInternetReachable === false,
  restoreSavedAccess: jest.fn(),
}));
import NetInfo from '@react-native-community/netinfo';
import {restoreSavedAccess} from '../src/offline/session';
import {restoreStartup} from '../src/offline/startup';
beforeEach(() => jest.clearAllMocks());
test('offline launch restores saved attendance access', async () => {
  NetInfo.fetch.mockResolvedValue({isConnected: false});
  const saved = {server: 'https://example.com', employee: {id: 144}, mode: 'offline'};
  restoreSavedAccess.mockResolvedValue(saved);
  expect(await restoreStartup()).toBe(saved);
});
test('online launch opens Login instead of restoring the offline dashboard', async () => {
  NetInfo.fetch.mockResolvedValue({isConnected: true, isInternetReachable: true});
  expect(await restoreStartup()).toBeNull();
  expect(restoreSavedAccess).not.toHaveBeenCalled();
});
test('no saved authorized employee still opens Login', async () => {
  NetInfo.fetch.mockResolvedValue({isConnected: false});
  restoreSavedAccess.mockResolvedValue(null);
  expect(await restoreStartup()).toBeNull();
});
