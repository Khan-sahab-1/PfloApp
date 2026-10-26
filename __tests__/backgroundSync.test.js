jest.mock('react-native-background-fetch', () => ({
  configure: jest.fn().mockResolvedValue(2), start: jest.fn().mockResolvedValue(),
  stop: jest.fn().mockResolvedValue(), scheduleTask: jest.fn().mockResolvedValue(),
  finish: jest.fn(), NETWORK_TYPE_ANY: 1,
}));
jest.mock('../src/offline/session', () => ({getSavedAccount: jest.fn()}));
jest.mock('../src/offline/autoSync', () => ({autoSync: jest.fn().mockResolvedValue({synced: 0})}));
import BackgroundFetch from 'react-native-background-fetch';
import {getSavedAccount} from '../src/offline/session';
import {autoSync} from '../src/offline/autoSync';
import {backgroundSyncTask, enableBackgroundSync, disableBackgroundSync} from '../src/offline/backgroundSync';
beforeEach(() => {jest.clearAllMocks(); getSavedAccount.mockResolvedValue({employee: {id:144}});});
test('scheduler survives ordinary termination and waits for network', async () => {
  await enableBackgroundSync();
  expect(BackgroundFetch.configure).toHaveBeenCalledWith(expect.objectContaining({stopOnTerminate:false,enableHeadless:true,startOnBoot:true,requiredNetworkType:1}), expect.any(Function), expect.any(Function));
});
test('headless callback runs public sync and finishes the OS task', async () => {
  await backgroundSyncTask({taskId:'test'});
  expect(autoSync).toHaveBeenCalledWith(expect.objectContaining({maxRecords:5}));
  expect(BackgroundFetch.finish).toHaveBeenCalledWith('test');
});
test('expired callback finishes without starting a new upload', async () => {
  await backgroundSyncTask({taskId:'expired',timeout:true});
  expect(autoSync).not.toHaveBeenCalled();
  expect(BackgroundFetch.finish).toHaveBeenCalledWith('expired');
});
test('logout stops scheduled work', async () => {
  await disableBackgroundSync();expect(BackgroundFetch.stop).toHaveBeenCalled();
});
