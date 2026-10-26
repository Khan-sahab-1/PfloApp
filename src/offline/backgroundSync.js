import BackgroundFetch from 'react-native-background-fetch';
import {Platform} from 'react-native';
import {getSavedAccount} from './session';
import {autoSync} from './autoSync';

let configured;
const active = new Map();
export async function backgroundSyncTask(event) {
  const taskId = typeof event === 'string' ? event : event.taskId;
  if (event?.timeout) {
    active.get(taskId)?.abort();
    BackgroundFetch.finish(taskId);
    return;
  }
  const controller = new AbortController();
  active.set(taskId, controller);
  const timer = setTimeout(() => controller.abort(), 25000);
  try { await autoSync({signal: controller.signal, maxRecords: 5}); }
  catch (error) { console.warn('[Attendance background sync]', error.message); }
  finally {
    clearTimeout(timer);
    active.delete(taskId);
    BackgroundFetch.finish(taskId);
  }
}
export async function enableBackgroundSync() {
  if (!await getSavedAccount()) { return; }
  if (!configured) {
    configured = BackgroundFetch.configure({
      minimumFetchInterval: 15, stopOnTerminate: false, startOnBoot: true,
      enableHeadless: true, requiredNetworkType: BackgroundFetch.NETWORK_TYPE_ANY,
    }, backgroundSyncTask, taskId => backgroundSyncTask({taskId, timeout: true}))
      .catch(error => { configured = null; throw error; });
  }
  await configured;
  if (!await getSavedAccount()) { await BackgroundFetch.stop(); return; }
  await BackgroundFetch.start();
  if (Platform.OS === 'android') {
    await BackgroundFetch.scheduleTask({
      taskId: 'com.pflo.attendance.sync', delay: 1000, periodic: false,
      stopOnTerminate: false, startOnBoot: true, enableHeadless: true,
      requiredNetworkType: BackgroundFetch.NETWORK_TYPE_ANY,
    });
  }
}
export async function disableBackgroundSync() {
  for (const controller of active.values()) { controller.abort(); }
  await BackgroundFetch.stop();
}
