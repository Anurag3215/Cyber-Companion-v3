import {
  evaluateWifiSecurity,
  evaluatePreConnectionHotspot,
  getNearbyHotspotBeacons,
} from '../src/services/wifiService';

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

  describe('Pre-Connection Airspace Threat Prevention', () => {
    test('detects Evil Twin / Rogue Pineapple honeypot before connecting', () => {
      const beacon = evaluatePreConnectionHotspot({
        ssid: 'Free_Airport_FastWiFi',
        bssid: '00:13:37:a8:11:02',
        encryption: 'OPEN',
        pmfEnabled: false,
        signalDbm: -34,
      });

      expect(beacon.threatVerdict).toBe('CRITICAL_THREAT');
      expect(beacon.isRogueAp).toBe(true);
      expect(beacon.predictedCrimes).toContain(
        'Man-in-the-Middle (MITM) Full Packet Interception',
      );
      expect(beacon.preventionAdvise).toContain('DO NOT CONNECT');
    });

    test('flags unencrypted OPEN hotspot with sniffing crime predictions', () => {
      const beacon = evaluatePreConnectionHotspot({
        ssid: 'Public_Park_Wifi',
        encryption: 'OPEN',
        pmfEnabled: false,
      });

      expect(beacon.threatVerdict).toBe('CRITICAL_THREAT');
      expect(beacon.predictedCrimes.some((c) => c.includes('Eavesdropping'))).toBe(true);
    });

    test('verifies hardened WPA3 with 802.11w PMF as SECURE to connect', () => {
      const beacon = evaluatePreConnectionHotspot({
        ssid: 'CyberLab_WPA3_Enterprise',
        encryption: 'WPA3',
        pmfEnabled: true,
        signalDbm: -50,
      });

      expect(beacon.threatVerdict).toBe('SECURE');
      expect(beacon.threatScore).toBeLessThanOrEqual(10);
      expect(beacon.preventionAdvise).toContain('VERIFIED SAFE TO CONNECT');
    });

    test('retrieves default nearby airspace beacons for passive scanning', () => {
      const beacons = getNearbyHotspotBeacons();
      expect(beacons.length).toBeGreaterThanOrEqual(4);
      expect(beacons.some((b) => b.threatVerdict === 'CRITICAL_THREAT')).toBe(true);
      expect(beacons.some((b) => b.threatVerdict === 'SECURE')).toBe(true);
    });
  });
});
