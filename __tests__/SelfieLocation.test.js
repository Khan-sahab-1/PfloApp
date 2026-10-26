import React from 'react';
import {act, create} from 'react-test-renderer';
import {Alert, PermissionsAndroid, Platform, TouchableOpacity} from 'react-native';
import {launchCamera} from 'react-native-image-picker';
import {getAttendanceLocation} from '../src/utils/attendanceLocation';
import Selfie from '../src/Screens/Selfie';
jest.mock('react-native-image-picker', () => ({launchCamera: jest.fn()}));
jest.mock('react-native-geolocation-service', () => ({requestAuthorization: jest.fn()}));
jest.mock('../src/utils/attendanceLocation', () => ({getAttendanceLocation: jest.fn()}));
jest.mock('../src/components/HeaderCompo', () => 'Header');
jest.mock('../src/components/Loader', () => 'Loader');
jest.mock('../src/utils/fleshmessage', () => ({showFlashMessage: jest.fn()}));
let renderer, navigation, originalOS, blur;
beforeEach(async () => {
  jest.clearAllMocks();
  jest.useFakeTimers();
  originalOS = Platform.OS;
  Platform.OS = 'android';
  jest.spyOn(PermissionsAndroid, 'request').mockResolvedValue('granted');
  jest.spyOn(PermissionsAndroid, 'requestMultiple').mockResolvedValue({
    'android.permission.ACCESS_FINE_LOCATION': 'granted',
    'android.permission.ACCESS_COARSE_LOCATION': 'granted',
  });
  jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  navigation = {isFocused: jest.fn(() => true), navigate: jest.fn(), addListener: jest.fn((_, callback) => { blur = callback; return jest.fn(); })};
  launchCamera.mockResolvedValue({assets: [{uri: 'file:///selfie.jpg'}]});
  await act(async () => { renderer = create(<Selfie navigation={navigation} route={{params: {}}} />); });
  await act(async () => renderer.root.findAllByType(TouchableOpacity)[0].props.onPress());
});
afterEach(async () => {
  await act(async () => renderer.unmount());
  Platform.OS = originalOS;
  jest.restoreAllMocks();
  jest.useRealTimers();
});
const continuePress = () => renderer.root.findAllByType(TouchableOpacity)[1].props.onPress();
test('double tap starts only one request and navigates once', async () => {
  let finish;
  getAttendanceLocation.mockImplementation(() => new Promise(resolve => { finish = resolve; }));
  let request;
  await act(async () => { request = continuePress(); continuePress(); });
  expect(PermissionsAndroid.requestMultiple).toHaveBeenCalledTimes(1);
  expect(getAttendanceLocation).toHaveBeenCalledTimes(1);
  await act(async () => { finish({latitude: 28, longitude: 77}); await request; });
  expect(navigation.navigate).toHaveBeenCalledTimes(1);
});
test('leaving the screen cancels and ignores a late location', async () => {
  let finish;
  getAttendanceLocation.mockImplementation(() => new Promise(resolve => { finish = resolve; }));
  let request;
  await act(async () => { request = continuePress(); });
  await act(async () => { navigation.isFocused.mockReturnValue(false); blur(); });
  expect(getAttendanceLocation.mock.calls[0][0].signal.aborted).toBe(true);
  await act(async () => { finish({latitude: 28, longitude: 77}); await request; });
  expect(navigation.navigate).not.toHaveBeenCalled();
  expect(Alert.alert).not.toHaveBeenCalled();
});
test('permission failure shows a string error and allows retry', async () => {
  PermissionsAndroid.requestMultiple.mockRejectedValueOnce(new Error('Permission unavailable'));
  await act(async () => continuePress());
  expect(Alert.alert).toHaveBeenCalledWith('Location Error', 'Permission unavailable');
  getAttendanceLocation.mockResolvedValue({latitude: 28, longitude: 77});
  await act(async () => continuePress());
  expect(navigation.navigate).toHaveBeenCalledTimes(1);
});
