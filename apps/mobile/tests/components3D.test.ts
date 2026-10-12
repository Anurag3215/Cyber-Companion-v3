jest.mock('three', () => ({
  Scene: jest.fn(() => ({ add: jest.fn(), rotation: { x: 0, y: 0 } })),
  PerspectiveCamera: jest.fn(() => ({ position: { z: 0 } })),
  WebGLRenderer: jest.fn(() => ({
    setSize: jest.fn(),
    setPixelRatio: jest.fn(),
    render: jest.fn(),
    dispose: jest.fn(),
  })),
  IcosahedronGeometry: jest.fn(() => ({ dispose: jest.fn() })),
  OctahedronGeometry: jest.fn(() => ({ dispose: jest.fn() })),
  TorusGeometry: jest.fn(() => ({ dispose: jest.fn() })),
  SphereGeometry: jest.fn(() => ({ dispose: jest.fn() })),
  BufferGeometry: jest.fn(() => ({ setAttribute: jest.fn(), dispose: jest.fn() })),
  BufferAttribute: jest.fn(),
  MeshBasicMaterial: jest.fn(() => ({ dispose: jest.fn() })),
  PointsMaterial: jest.fn(() => ({ dispose: jest.fn() })),
  Mesh: jest.fn(() => ({ rotation: { x: 0, y: 0, z: 0 }, scale: { set: jest.fn() }, position: { x: 0, y: 0, z: 0 } })),
  Points: jest.fn(),
  Clock: jest.fn(() => ({ getElapsedTime: () => 0 })),
}));

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
    Animated: {
      Value: function (val: any) {
        this.value = val;
        this.interpolate = () => '0deg';
        this.setValue = () => {};
      },
      timing: () => ({ start: (cb?: any) => cb && cb(), stop: () => {} }),
      spring: () => ({ start: (cb?: any) => cb && cb(), stop: () => {} }),
      loop: (anim: any) => ({ start: () => {}, stop: () => {} }),
      sequence: (anims: any) => ({ start: () => {}, stop: () => {} }),
      parallel: (anims: any) => ({ start: () => {}, stop: () => {} }),
      View: (props: any) => React.createElement('div', props),
    },
    Platform: { OS: 'web' },
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
  };
});

import { Cyber3DShieldCore } from '../src/components/Cyber3DShieldCore';
import { TiltCard3D } from '../src/components/TiltCard3D';
import { ThreatRadar3D } from '../src/components/ThreatRadar3D';
import { FloatingParticles3D } from '../src/components/FloatingParticles3D';

describe('3D Interactive UI Components Suite', () => {
  it('instantiates Cyber3DShieldCore without errors', () => {
    expect(Cyber3DShieldCore).toBeDefined();
    expect(typeof Cyber3DShieldCore).toBe('function');
  });

  it('instantiates TiltCard3D without errors', () => {
    expect(TiltCard3D).toBeDefined();
    expect(typeof TiltCard3D).toBe('function');
  });

  it('instantiates ThreatRadar3D without errors', () => {
    expect(ThreatRadar3D).toBeDefined();
    expect(typeof ThreatRadar3D).toBe('function');
  });

  it('instantiates FloatingParticles3D without errors', () => {
    expect(FloatingParticles3D).toBeDefined();
    expect(typeof FloatingParticles3D).toBe('function');
  });
});
