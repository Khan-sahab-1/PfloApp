import React from 'react';
import {act, create} from 'react-test-renderer';
import {AppState} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import AutoSyncProvider from '../src/offline/AutoSyncProvider';
import {autoSync} from '../src/offline/autoSync';
import {subscribeSession} from '../src/offline/session';
import {enableBackgroundSync} from '../src/offline/backgroundSync';

jest.mock('@react-native-community/netinfo', () => ({addEventListener: jest.fn(() => jest.fn())}));
jest.mock('../src/offline/session', () => ({subscribeSession: jest.fn(() => jest.fn()), getSavedAccount: jest.fn().mockResolvedValue({employee: {id: 1}})}));
jest.mock('../src/offline/autoSync', () => ({autoSync: jest.fn().mockResolvedValue({synced: 0})}));
jest.mock('../src/offline/backgroundSync', () => ({enableBackgroundSync: jest.fn().mockResolvedValue(), disableBackgroundSync: jest.fn().mockResolvedValue()}));
let renderer;
beforeEach(() => {
  jest.useFakeTimers();
  jest.clearAllMocks();
  AppState.currentState = 'active';
});
afterEach(async () => {
  if (renderer) { await act(async () => renderer.unmount()); }
  jest.useRealTimers();
});
test('retries while active and stops after unmount', async () => {
  await act(async () => { renderer = create(<AutoSyncProvider />); });
  autoSync.mockClear();
  await act(async () => { jest.advanceTimersByTime(15000); });
  expect(autoSync).toHaveBeenCalledTimes(1);
  AppState.currentState = 'background';
  await act(async () => { jest.advanceTimersByTime(15000); });
  expect(autoSync).toHaveBeenCalledTimes(1);
  await act(async () => renderer.unmount());
  renderer = null;
  AppState.currentState = 'active';
  jest.advanceTimersByTime(15000);
  expect(autoSync).toHaveBeenCalledTimes(1);
});
test('network recovery triggers immediate sync', async () => {
  await act(async () => { renderer = create(<AutoSyncProvider />); });
  autoSync.mockClear();
  await act(async () => NetInfo.addEventListener.mock.calls[0][0]({isConnected: true}));
  expect(autoSync).toHaveBeenCalledTimes(1);
});
test('native scheduler failure does not prevent foreground sync', async () => {
  const warning = jest.spyOn(console, 'warn').mockImplementation(() => {});
  enableBackgroundSync.mockRejectedValueOnce(new Error('scheduler unavailable'));
  await act(async () => { renderer = create(<AutoSyncProvider />); });
  expect(autoSync).toHaveBeenCalledTimes(1);
  warning.mockRestore();
});

test('login session changes configure scheduling without triggering sync', async () => {
  await act(async () => { renderer = create(<AutoSyncProvider />); });
  autoSync.mockClear();
  enableBackgroundSync.mockClear();
  await act(async () => subscribeSession.mock.calls[0][0]());
  expect(autoSync).not.toHaveBeenCalled();
  expect(enableBackgroundSync).toHaveBeenCalledTimes(1);
});
