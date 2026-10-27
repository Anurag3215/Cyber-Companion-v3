import {
  evaluateAirspaceBeacon,
  evaluateWifiSecurity,
  evaluatePreConnectionHotspot,
  getNearbyHotspotBeacons,
  scanNearbyWifiAirspace,
  requestWifiScanPermissions,
  isDeviceLocationEnabled,
} from '../src/services/wifiService';
import { Platform, PermissionsAndroid } from 'react-native';

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
    test('parameter-based evaluation: OPEN network flags CRITICAL_THREAT (DANGER)', () => {
      const res = evaluateAirspaceBeacon({
        ssid: 'CoffeeShop_Free',
        bssid: '00:11:22:33:44:55',
        capabilities: '[ESS]',
        level: -60,
        frequency: 2412,
      });
      expect(res.threatVerdict).toBe('CRITICAL_THREAT');
      expect(res.threatScore).toBe(95);
      expect(res.threatTag).toContain('DANGER');
      expect(res.isRogueAp).toBe(true);
    });

    test('parameter-based evaluation: WEP network flags CRITICAL_THREAT (DANGER)', () => {
      const res = evaluateAirspaceBeacon({
        ssid: 'Old_Router_WEP',
        bssid: '00:11:22:33:44:66',
        capabilities: '[WEP][ESS]',
        level: -65,
        frequency: 2437,
      });
      expect(res.threatVerdict).toBe('CRITICAL_THREAT');
      expect(res.threatScore).toBe(92);
      expect(res.threatTag).toContain('DANGER');
    });

    test('parameter-based evaluation: WPA-TKIP flags MODERATE (WARNING)', () => {
      const res = evaluateAirspaceBeacon({
        ssid: 'Legacy_Office_TKIP',
        bssid: '00:11:22:33:44:77',
        capabilities: '[WPA-PSK-TKIP][ESS]',
        level: -70,
        frequency: 5180,
      });
      expect(res.threatVerdict).toBe('MODERATE');
      expect(res.threatScore).toBe(65);
      expect(res.threatTag).toContain('WARNING');
    });

    test('parameter-based evaluation: WPA2-CCMP flags SECURE (SAFE)', () => {
      const res = evaluateAirspaceBeacon({
        ssid: 'Secure_Home_WPA2',
        bssid: '00:11:22:33:44:88',
        capabilities: '[WPA2-PSK-CCMP][ESS]',
        level: -50,
        frequency: 5240,
      });
      expect(res.threatVerdict).toBe('SECURE');
      expect(res.threatScore).toBe(20);
      expect(res.threatTag).toContain('SAFE');
    });

    test('parameter-based evaluation: WPA3-SAE flags SECURE (SAFE)', () => {
      const res = evaluateAirspaceBeacon({
        ssid: 'NextGen_Lab_WPA3',
        bssid: '00:11:22:33:44:99',
        capabilities: '[WPA3-SAE-CCMP][ESS]',
        level: -45,
        frequency: 5745,
      });
      expect(res.threatVerdict).toBe('SECURE');
      expect(res.threatScore).toBe(8);
      expect(res.threatTag).toContain('SAFE');
    });

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
      expect(beacons.length).toBeGreaterThanOrEqual(1);
      expect(beacons.some((b) => b.ssid.includes('AndroidAP') || b.ssid.includes('Neeha') || b.ssid.includes('GUEST'))).toBe(true);
    });
  });

  describe('Native Airspace Scanner & Sandbox Fallbacks', () => {
    test('enforces iOS privacy sandboxing without silent fake beacons', async () => {
      const originalOs = Platform.OS;
      (Platform as any).OS = 'ios';

      const scanResult = await scanNearbyWifiAirspace();

      expect(scanResult.isIosRestricted).toBe(true);
      expect(scanResult.statusMessage).toContain('iOS Privacy Sandboxing');
      expect(scanResult.scanSource).toBe('OFFLINE_SANDBOX');

      (Platform as any).OS = originalOs;
    });

    test('requests Android FINE_LOCATION & NEARBY_WIFI_DEVICES permissions', async () => {
      const originalOs = Platform.OS;
      (Platform as any).OS = 'android';

      const permResult = await requestWifiScanPermissions();
      expect(permResult.granted).toBe(true);

      (Platform as any).OS = originalOs;
    });

    test('returns permissionDenied when Android location permission is rejected', async () => {
      const originalOs = Platform.OS;
      (Platform as any).OS = 'android';

      const origRequestMultiple = PermissionsAndroid.requestMultiple;
      (PermissionsAndroid as any).requestMultiple = jest.fn(async () => ({
        'android.permission.ACCESS_FINE_LOCATION': 'denied',
      }));

      const scanResult = await scanNearbyWifiAirspace();
      expect(scanResult.permissionDenied).toBe(true);
      expect(scanResult.statusMessage).toContain('Location Permission Required');

      (PermissionsAndroid as any).requestMultiple = origRequestMultiple;
      (Platform as any).OS = originalOs;
    });
  });
});
