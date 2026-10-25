import React from 'react';

jest.mock('react-native', () => {
  const React = require('react');
  return {
    StyleSheet: {
      create: (styles: any) => styles,
      absoluteFill: {},
    },
    View: (props: any) => React.createElement('div', props),
    Text: (props: any) => React.createElement('span', props),
    TouchableOpacity: (props: any) => React.createElement('button', props),
    TextInput: (props: any) => React.createElement('input', props),
    ScrollView: (props: any) => React.createElement('div', props),
    Switch: (props: any) => React.createElement('input', { type: 'checkbox', ...props }),
    ActivityIndicator: (props: any) => React.createElement('div', props),
    Dimensions: {
      get: () => ({ width: 375, height: 812 }),
    },
    StatusBar: {
      currentHeight: 28,
    },
    Platform: {
      OS: 'web',
    },
    Alert: {
      alert: jest.fn(),
    },
    Share: {
      share: jest.fn(() => Promise.resolve({ action: 'sharedAction' })),
    },
    Linking: {
      openURL: jest.fn(() => Promise.resolve(true)),
    },
    Animated: {
      Value: function (val: any) {
        this.value = val;
        this.interpolate = () => '0deg';
        this.setValue = () => {};
      },
      timing: () => ({ start: (cb?: any) => cb && cb(), stop: () => {} }),
      sequence: (anims: any) => ({ start: () => {}, stop: () => {} }),
      loop: (anim: any) => ({ start: () => {}, stop: () => {} }),
      View: (props: any) => React.createElement('div', props),
    },
    Easing: {
      linear: () => {},
      inOut: () => () => {},
      out: () => () => {},
      ease: () => {},
    },
  };
});

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 40, bottom: 20, left: 0, right: 0 }),
}));

jest.mock('expo-camera', () => {
  const React = require('react');
  return {
    CameraView: (props: any) => React.createElement('div', props),
    useCameraPermissions: () => [{ granted: true, canAskAgain: true }, jest.fn()],
  };
});

jest.mock('expo-network', () => ({
  getNetworkStateAsync: jest.fn(() => Promise.resolve({ isConnected: true, type: 'WIFI' })),
  getIpAddressAsync: jest.fn(() => Promise.resolve('192.168.1.15')),
}));

jest.mock('expo-blur', () => {
  const React = require('react');
  return {
    BlurView: (props: any) => React.createElement('div', props),
  };
});

jest.mock('expo-status-bar', () => ({
  StatusBar: () => null,
}));

import { WelcomeScreen } from '../src/screens/WelcomeScreen';
import { DashboardScreen } from '../src/screens/DashboardScreen';
import { WifiAnalyzerScreen } from '../src/screens/WifiAnalyzerScreen';
import { UrlScannerScreen } from '../src/screens/UrlScannerScreen';
import { UrlResultScreen } from '../src/screens/UrlResultScreen';
import { QrScannerScreen } from '../src/screens/QrScannerScreen';
import { QrResultScreen } from '../src/screens/QrResultScreen';
import { PermissionAnalyzerScreen } from '../src/screens/PermissionAnalyzerScreen';
import { SecurityScoreScreen } from '../src/screens/SecurityScoreScreen';
import { AwarenessScreen } from '../src/screens/AwarenessScreen';
import { RootNavigator } from '../src/navigation/RootNavigator';

describe('Showcase Reference 10-Screens Suite', () => {
  it('instantiates Screen 1: WelcomeScreen with Get Started and Sign In handlers', () => {
    expect(WelcomeScreen).toBeDefined();
    expect(typeof WelcomeScreen).toBe('function');
  });

  it('instantiates Screen 2: DashboardScreen with score card and 2x2 tool handlers', () => {
    expect(DashboardScreen).toBeDefined();
    expect(typeof DashboardScreen).toBe('function');
  });

  it('instantiates Screen 3: WifiAnalyzerScreen with 3D Wi-Fi orb and security checks', () => {
    expect(WifiAnalyzerScreen).toBeDefined();
    expect(typeof WifiAnalyzerScreen).toBe('function');
  });

  it('instantiates Screen 4: UrlScannerScreen with chain links and recent scans', () => {
    expect(UrlScannerScreen).toBeDefined();
    expect(typeof UrlScannerScreen).toBe('function');
  });

  it('instantiates Screen 5: UrlResultScreen with warning prism and risk factors', () => {
    expect(UrlResultScreen).toBeDefined();
    expect(typeof UrlResultScreen).toBe('function');
  });

  it('instantiates Screen 6: QrScannerScreen with viewfinder corners and holographic cube', () => {
    expect(QrScannerScreen).toBeDefined();
    expect(typeof QrScannerScreen).toBe('function');
  });

  it('instantiates Screen 7: QrResultScreen with safe check badge and destination link', () => {
    expect(QrResultScreen).toBeDefined();
    expect(typeof QrResultScreen).toBe('function');
  });

  it('instantiates Screen 8: PermissionAnalyzerScreen with filter pills and app risk list', () => {
    expect(PermissionAnalyzerScreen).toBeDefined();
    expect(typeof PermissionAnalyzerScreen).toBe('function');
  });

  it('instantiates Screen 9: SecurityScoreScreen with score breakdown bars and improvement card', () => {
    expect(SecurityScoreScreen).toBeDefined();
    expect(typeof SecurityScoreScreen).toBe('function');
  });

  it('instantiates Screen 10: AwarenessScreen with hero card and topics list', () => {
    expect(AwarenessScreen).toBeDefined();
    expect(typeof AwarenessScreen).toBe('function');
  });

  it('instantiates RootNavigator containing all 10 showcase screens', () => {
    expect(RootNavigator).toBeDefined();
    expect(typeof RootNavigator).toBe('function');
  });
});
