const React = require('react');

const dummyComponent = (name) => {
  const Component = (props) => React.createElement(name, props, props.children);
  Component.displayName = name;
  return Component;
};

module.exports = {
  Platform: {
    OS: 'android',
    Version: 33,
    select: (obj) => obj.android || obj.default,
  },
  PermissionsAndroid: {
    PERMISSIONS: {
      ACCESS_FINE_LOCATION: 'android.permission.ACCESS_FINE_LOCATION',
      ACCESS_COARSE_LOCATION: 'android.permission.ACCESS_COARSE_LOCATION',
      NEARBY_WIFI_DEVICES: 'android.permission.NEARBY_WIFI_DEVICES',
      CAMERA: 'android.permission.CAMERA',
    },
    RESULTS: {
      GRANTED: 'granted',
      DENIED: 'denied',
      NEVER_ASK_AGAIN: 'never_ask_again',
    },
    requestMultiple: jest.fn(async (permissions) => {
      const res = {};
      for (const p of permissions) {
        res[p] = 'granted';
      }
      return res;
    }),
    request: jest.fn(async () => 'granted'),
    check: jest.fn(async () => true),
  },
  StyleSheet: {
    create: (styles) => styles,
    absoluteFill: {},
  },
  Linking: {
    openSettings: jest.fn(async () => {}),
    openURL: jest.fn(async () => {}),
  },
  Alert: {
    alert: jest.fn(),
  },
  Animated: {
    Value: function (val) {
      this.value = val;
      this.interpolate = () => '0deg';
      this.setValue = () => {};
    },
    timing: () => ({ start: (cb) => cb && cb(), stop: () => {} }),
    spring: () => ({ start: (cb) => cb && cb(), stop: () => {} }),
    loop: () => ({ start: () => {}, stop: () => {} }),
    sequence: () => ({ start: () => {}, stop: () => {} }),
    parallel: () => ({ start: () => {}, stop: () => {} }),
    View: dummyComponent('Animated.View'),
  },
  Easing: {
    linear: () => {},
    inOut: () => () => {},
    in: () => () => {},
    out: () => () => {},
    ease: () => {},
    sin: () => {},
    quad: () => {},
  },
  PanResponder: {
    create: () => ({ panHandlers: {} }),
  },
  View: dummyComponent('View'),
  Text: dummyComponent('Text'),
  TouchableOpacity: dummyComponent('TouchableOpacity'),
  Modal: dummyComponent('Modal'),
  ScrollView: dummyComponent('ScrollView'),
  ActivityIndicator: dummyComponent('ActivityIndicator'),
  TextInput: dummyComponent('TextInput'),
};
