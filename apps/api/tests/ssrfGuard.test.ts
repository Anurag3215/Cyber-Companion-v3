import { isPrivateOrLoopbackHost } from '../src/middleware/ssrfGuard';

describe('SSRF & Loopback Host Guard', () => {
  test('blocks loopback IP addresses', () => {
    expect(isPrivateOrLoopbackHost('127.0.0.1')).toBe(true);
    expect(isPrivateOrLoopbackHost('127.255.0.1')).toBe(true);
    expect(isPrivateOrLoopbackHost('localhost')).toBe(true);
  });

  test('blocks cloud metadata endpoints', () => {
    expect(isPrivateOrLoopbackHost('169.254.169.254')).toBe(true);
    expect(isPrivateOrLoopbackHost('metadata.google.internal')).toBe(true);
  });

  test('blocks private RFC 1918 subnets', () => {
    expect(isPrivateOrLoopbackHost('10.0.0.1')).toBe(true);
    expect(isPrivateOrLoopbackHost('192.168.1.1')).toBe(true);
    expect(isPrivateOrLoopbackHost('172.16.0.5')).toBe(true);
    expect(isPrivateOrLoopbackHost('172.31.255.255')).toBe(true);
  });

  test('allows public legitimate web endpoints', () => {
    expect(isPrivateOrLoopbackHost('github.com')).toBe(false);
    expect(isPrivateOrLoopbackHost('google.com')).toBe(false);
    expect(isPrivateOrLoopbackHost('93.184.216.34')).toBe(false); // Example public IP
  });
});
