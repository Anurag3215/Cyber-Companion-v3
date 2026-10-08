import { evaluateWifiSecurity } from '../src/services/wifiService';

describe('Wi-Fi Security Assessment Service', () => {
  test('flags OPEN network as CRITICAL risk', () => {
    const res = evaluateWifiSecurity('OPEN', 'Airport_Free_WiFi', false, 'android');
    expect(res.riskLevel).toBe('CRITICAL');
    expect(res.isEncrypted).toBe(false);
    expect(res.recommendation).toContain('VPN');
  });

  test('validates WPA3 network as SAFE with high encryption', () => {
    const res = evaluateWifiSecurity('WPA3', 'Home_Secure', false, 'android');
    expect(res.riskLevel).toBe('SAFE');
    expect(res.isEncrypted).toBe(true);
  });

  test('handles captive portal on encrypted networks as AT_RISK', () => {
    const res = evaluateWifiSecurity('WPA2', 'Hotel_Guest', true, 'android');
    expect(res.riskLevel).toBe('AT_RISK');
  });

  test('provides graceful checklist fallback on Web platform', () => {
    const res = evaluateWifiSecurity('UNKNOWN', 'Browser_Network', false, 'web');
    expect(res.platformMode).toBe('WEB_CHECKLIST');
    expect(res.plainExplanation).toContain('Web browsers cannot inspect');
  });
});
