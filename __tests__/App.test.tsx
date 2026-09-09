/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';

jest.mock('@react-navigation/native', () => ({
  NavigationContainer: ({children}: {children: React.ReactNode}) => children,
}));

jest.mock('react-redux', () => ({
  Provider: ({children}: {children: React.ReactNode}) => children,
}));

jest.mock('../src/redux/store', () => ({store: {}}));

jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const {View} = require('react-native');
  return {
    SafeAreaProvider: ({children}: {children: React.ReactNode}) => children,
    SafeAreaView: ({children, ...props}: {children: React.ReactNode}) =>
      React.createElement(View, props, children),
  };
});

jest.mock('../src/route/Routes', () => {
  const React = require('react');
  const {View} = require('react-native');
  return () => React.createElement(View, {testID: 'routes'});
});

jest.mock('react-native-flash-message', () => {
  const React = require('react');
  const {View} = require('react-native');
  return () => React.createElement(View, {testID: 'flash-message'});
});

test('renders the Android application shell', async () => {
  let renderer: ReactTestRenderer.ReactTestRenderer;

  await ReactTestRenderer.act(() => {
    renderer = ReactTestRenderer.create(<App />);
  });

  expect(renderer!.root.findByProps({testID: 'routes'})).toBeTruthy();
  expect(renderer!.root.findByProps({testID: 'flash-message'})).toBeTruthy();
});
