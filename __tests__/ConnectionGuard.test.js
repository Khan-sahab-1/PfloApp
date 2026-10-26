import React from 'react';
import {act, create} from 'react-test-renderer';
import NetInfo from '@react-native-community/netinfo';
import ConnectionGuard from '../src/offline/ConnectionGuard';
import {getSession, lockSession, subscribeSession} from '../src/offline/session';
import {autoSync} from '../src/offline/autoSync';
jest.mock('@react-native-community/netinfo', () => ({fetch: jest.fn(), addEventListener: jest.fn(() => jest.fn())}));
jest.mock('../src/offline/session', () => ({
  getSession: jest.fn(), lockSession: jest.fn(), restoreOffline: jest.fn(),
  subscribeSession: jest.fn(() => jest.fn()),
  isDisconnected: state => state.isConnected === false || state.isInternetReachable === false,
}));
jest.mock('../src/offline/autoSync', () => ({autoSync: jest.fn().mockResolvedValue({synced: 0})}));
jest.mock('../src/components/BackgroundLocationService', () => ({stopTracking: jest.fn().mockResolvedValue()}));
let renderer;
let navigationRef;
beforeEach(() => {
  jest.clearAllMocks();
  getSession.mockReturnValue({mode: 'offline', server: 'https://example.com'});
  lockSession.mockImplementation(() => getSession.mockReturnValue(null));
  NetInfo.fetch.mockResolvedValue({isConnected: false});
  navigationRef = {isReady: jest.fn(() => true), resetRoot: jest.fn(), addListener: jest.fn(() => jest.fn())};
});
afterEach(async () => { await act(async () => renderer.unmount()); });
test('reconnect opens Login and starts sync without waiting for upload completion', async () => {
  autoSync.mockImplementationOnce(() => new Promise(() => {}));
  await act(async () => { renderer = create(<ConnectionGuard navigationRef={navigationRef} />); });
  await act(async () => NetInfo.addEventListener.mock.calls[0][0]({isConnected: true, isInternetReachable: true}));
  expect(lockSession).toHaveBeenCalledTimes(1);
  expect(navigationRef.resetRoot).toHaveBeenCalledWith({index: 0, routes: [{name: 'Login'}]});
  expect(autoSync).toHaveBeenCalledTimes(1);
});
test('no redirect on disconnected or unknown network', async () => {
  await act(async () => { renderer = create(<ConnectionGuard navigationRef={navigationRef} />); });
  await act(async () => NetInfo.addEventListener.mock.calls[0][0]({isConnected: null}));
  expect(navigationRef.resetRoot).not.toHaveBeenCalled();
  expect(lockSession).not.toHaveBeenCalled();
});
test('rechecks connectivity once navigation is ready', async () => {
  navigationRef.isReady.mockReturnValue(false);
  NetInfo.fetch.mockResolvedValue({isConnected: true});
  await act(async () => { renderer = create(<ConnectionGuard navigationRef={navigationRef} />); });
  navigationRef.isReady.mockReturnValue(true);
  await act(async () => navigationRef.addListener.mock.calls[0][1]());
  expect(navigationRef.resetRoot).toHaveBeenCalledWith({index: 0, routes: [{name: 'Login'}]});
});
test('rechecks a session restored after the initial network event', async () => {
  getSession.mockReturnValue(null);
  NetInfo.fetch.mockResolvedValue({isConnected: true});
  await act(async () => { renderer = create(<ConnectionGuard navigationRef={navigationRef} />); });
  getSession.mockReturnValue({mode: 'offline'});
  await act(async () => subscribeSession.mock.calls[0][0]());
  expect(navigationRef.resetRoot).toHaveBeenCalledWith({index: 0, routes: [{name: 'Login'}]});
});
test('an authenticated online session stays on its current screen', async () => {
  getSession.mockReturnValue({mode: 'online'});
  NetInfo.fetch.mockResolvedValue({isConnected: true});
  await act(async () => { renderer = create(<ConnectionGuard navigationRef={navigationRef} />); });
  expect(navigationRef.resetRoot).not.toHaveBeenCalled();
});
