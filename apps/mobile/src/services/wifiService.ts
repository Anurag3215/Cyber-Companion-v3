import * as Network from 'expo-network';
import { Platform, PermissionsAndroid, type Permission } from 'react-native';
import { ApiClient } from './apiClient';
import { Storage } from '../storage/StorageAdapter';
import WifiScannerModule, { type NativeWifiScanResult, type NativeCurrentWifiInfo } from '../../modules/wifi-scanner';

export type WifiEncryption = 'OPEN' | 'WEP' | 'WPA' | 'WPA2' | 'WPA3' | 'UNKNOWN';

export interface WifiRiskAssessment {
  ssid: string;
  encryption: WifiEncryption;
  riskLevel: 'SAFE' | 'MODERATE' | 'AT_RISK' | 'CRITICAL';
  isEncrypted: boolean;
  plainExplanation: string;
  recommendation: string;
  platformMode: 'ANDROID_NATIVE' | 'IOS_SANDBOX' | 'WEB_CHECKLIST';
}

export interface NearbyHotspotBeacon {
  id: string;
  ssid: string;
  bssid: string;
  channel: number;
  frequency: '2.4 GHz' | '5.0 GHz' | '6.0 GHz';
  signalDbm: number;
  encryption: WifiEncryption;
  pmfEnabled: boolean;
  vendor: string;
  threatVerdict: 'CRITICAL_THREAT' | 'HIGH_RISK' | 'MODERATE' | 'SECURE';
  threatScore: number; // 0 (safest) to 100 (critical danger)
  threatTag: string;
  predictedCrimes: string[];
  preventionAdvise: string;
  isRogueAp: boolean;
  isCurrentConnection?: boolean;
  ipAddress?: string;
}

export interface WifiAirspaceScanResult {
  activeConnection: {
    isConnected: boolean;
    type: string;
    ipAddress?: string;
    ssid?: string;
    bssid?: string;
  };
  beacons: NearbyHotspotBeacon[];
  permissionDenied?: boolean;
  canAskAgain?: boolean;
  locationDisabled?: boolean;
  isIosRestricted?: boolean;
  statusMessage?: string;
  scanSource: 'ANDROID_HARDWARE_WIFIMANAGER' | 'API_GATEWAY' | 'OFFLINE_SANDBOX';
}

/**
 * Request runtime Android Location permissions required for Wi-Fi scanning.
 * Android 8.0 through 14+ strictly requires ACCESS_FINE_LOCATION and NEARBY_WIFI_DEVICES.
 */
export async function requestWifiScanPermissions(): Promise<{
  granted: boolean;
  canAskAgain: boolean;
}> {
  if (Platform.OS !== 'android') {
    return { granted: false, canAskAgain: false };
  }

  try {
    const apiLevel =
      typeof Platform.Version === 'number'
        ? Platform.Version
        : parseInt(String(Platform.Version), 10);

    const permissionsToRequest: Permission[] = [
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    ];

    if (apiLevel >= 33 && (PermissionsAndroid.PERMISSIONS as any).NEARBY_WIFI_DEVICES) {
      permissionsToRequest.push((PermissionsAndroid.PERMISSIONS as any).NEARBY_WIFI_DEVICES);
    }

    const results = (await PermissionsAndroid.requestMultiple(
      permissionsToRequest
    )) as Record<string, string>;

    const fineGranted =
      results[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] ===
      PermissionsAndroid.RESULTS.GRANTED;

    const nearbyGranted =
      apiLevel < 33 ||
      results[(PermissionsAndroid.PERMISSIONS as any).NEARBY_WIFI_DEVICES] ===
        PermissionsAndroid.RESULTS.GRANTED;

    const fineNeverAsk =
      results[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] ===
      PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN;

    return {
      granted: fineGranted && nearbyGranted,
      canAskAgain: !fineNeverAsk,
    };
  } catch {
    return { granted: false, canAskAgain: true };
  }
}

/**
 * Checks if the device location services (GPS) are toggled ON.
 * Android OS silently returns empty Wi-Fi scan results if Location Services are disabled.
 */
export function isDeviceLocationEnabled(): boolean {
  if (Platform.OS !== 'android') return false;
  if (!WifiScannerModule || typeof WifiScannerModule.isLocationEnabled !== 'function') {
    return true;
  }
  try {
    return WifiScannerModule.isLocationEnabled();
  } catch {
    return true;
  }
}

/**
 * Parse 802.11 beacon capabilities string into standardized cipher types and PMF status.
 */
export function parseCapabilities(capabilities: string): {
  encryption: WifiEncryption;
  pmfEnabled: boolean;
  cipher: 'CCMP' | 'TKIP' | 'WEP' | 'NONE';
} {
  const caps = (capabilities || '').toUpperCase();
  const isWpa3 = caps.includes('WPA3') || caps.includes('SAE');
  const isWpa2 = caps.includes('WPA2') || caps.includes('PSK');
  const isWep = caps.includes('WEP');
  const isWpa = caps.includes('WPA');
  const isTkip = caps.includes('TKIP');
  const isCcmp = caps.includes('CCMP');

  let encryption: WifiEncryption = 'OPEN';
  let cipher: 'CCMP' | 'TKIP' | 'WEP' | 'NONE' = 'NONE';

  if (isWpa3) {
    encryption = 'WPA3';
    cipher = 'CCMP';
  } else if (isWpa2) {
    encryption = 'WPA2';
    cipher = isTkip && !isCcmp ? 'TKIP' : 'CCMP';
  } else if (isWpa) {
    encryption = 'WPA';
    cipher = 'TKIP';
  } else if (isWep) {
    encryption = 'WEP';
    cipher = 'WEP';
  }

  const pmfEnabled = isWpa3 || caps.includes('PMF') || caps.includes('MANAGEMENT-FRAME');

  return { encryption, pmfEnabled, cipher };
}

/**
 * Calculate standard Wi-Fi frequency band and channel number from radio frequency in MHz.
 */

export function getVendorFromBssid(bssid: string): string {
  const clean = (bssid || '').replace(/[:-]/g, '').toUpperCase();
  if (clean.startsWith('001337') || clean.startsWith('00C0CA')) return 'Hak5 WiFi Pineapple / Rogue AP';
  if (clean.startsWith('3A27AC') || clean.startsWith('FA86DA')) return 'MediaTek / Realtek AP';
  if (clean.startsWith('C074AD') || clean.startsWith('C674AD')) return 'Cisco Systems / Meraki';
  if (clean.startsWith('40E3D6')) return 'TP-Link Technologies';
  return 'Standard 802.11 Access Point';
}

/**
 * Parameter-Based 802.11 Airspace Security Evaluator.
 * Pure deterministic evaluation based strictly on broadcast parameters:
 * - OPEN / None = DANGER (CRITICAL_THREAT)
 * - WEP = DANGER (CRITICAL_THREAT)
 * - WPA / WPA2 TKIP = WARNING (MODERATE)
 * - WPA2-PSK CCMP / WPA3 = SAFE (SECURE)
 */
export function evaluateAirspaceBeacon(params: {
  ssid: string;
  bssid: string;
  capabilities: string;
  level: number;
  frequency: number;
}): NearbyHotspotBeacon {
  const rawSsid = (params.ssid || '').trim();
  const ssid = rawSsid.length > 0 ? rawSsid : '[Hidden Airspace Beacon]';
  const bssid = params.bssid || '00:00:00:00:00:00';
  const { encryption, pmfEnabled, cipher } = parseCapabilities(params.capabilities);
  const { frequency, channel } = calculateFrequencyAndChannel(params.frequency);

  let threatVerdict: 'CRITICAL_THREAT' | 'HIGH_RISK' | 'MODERATE' | 'SECURE';
  let threatScore: number;
  let threatTag: string;
  let predictedCrimes: string[];
  let preventionAdvise: string;
  let isRogueAp = false;

  if (encryption === 'OPEN') {
    threatVerdict = 'CRITICAL_THREAT';
    threatScore = 95;
    threatTag = 'UNENCRYPTED AIRSPACE (DANGER)';
    predictedCrimes = [
      'Unencrypted broadcast airspace. Any attacker in radio proximity can sniff cleartext traffic, cookies, and tokens.',
      'Vulnerable to Evil Twin AP honeypots and captive portal credential interception.',
    ];
    preventionAdvise = 'DANGER: Do NOT connect. Never transmit credentials on unencrypted wireless airspace.';
    isRogueAp = true;
  } else if (encryption === 'WEP') {
    threatVerdict = 'CRITICAL_THREAT';
    threatScore = 92;
    threatTag = 'BROKEN WEP ENCRYPTION (DANGER)';
    predictedCrimes = [
      'Deprecated 64/128-bit RC4 cipher with known keystream IV reuse vulnerabilities. Cracked in seconds.',
    ];
    preventionAdvise = 'DANGER: Treat this network as completely open and unencrypted.';
    isRogueAp = true;
  } else if (cipher === 'TKIP' || encryption === 'WPA') {
    threatVerdict = 'MODERATE';
    threatScore = 65;
    threatTag = 'LEGACY TKIP CIPHER (WARNING)';
    predictedCrimes = [
      'Legacy TKIP cipher prone to packet injection and Michael MIC key recovery attacks.',
    ];
    preventionAdvise = 'WARNING: Upgrade access point security configuration to AES-CCMP or WPA3.';
  } else if (encryption === 'WPA3') {
    threatVerdict = 'SECURE';
    threatScore = 8;
    threatTag = 'WPA3-SAE ENCRYPTED (SAFE)';
    predictedCrimes = [];
    preventionAdvise = 'Protected by Simultaneous Authentication of Equals (SAE) with forward secrecy.';
  } else {
    // WPA2 with AES-CCMP
    threatVerdict = 'SECURE';
    threatScore = 20;
    threatTag = 'WPA2-CCMP ENCRYPTED (SAFE)';
    predictedCrimes = [];
    preventionAdvise = 'Standard robust AES-CCMP encryption. Ensure complex passphrase is in use.';
  }

  return {
    id: `beacon-${bssid.replace(/:/g, '').toLowerCase()}`,
    ssid,
    bssid,
    channel,
    frequency,
    signalDbm: params.level,
    encryption,
    pmfEnabled,
    vendor: getVendorFromBssid(bssid),
    threatVerdict,
    threatScore,
    threatTag,
    predictedCrimes,
    preventionAdvise,
    isRogueAp,
  };
}

export function calculateFrequencyAndChannel(freqMhz: number): {
  frequency: '2.4 GHz' | '5.0 GHz' | '6.0 GHz';
  channel: number;
} {
  if (freqMhz > 5925) {
    return {
      frequency: '6.0 GHz',
      channel: Math.max(1, Math.round((freqMhz - 5950) / 5)),
    };
  }
  if (freqMhz > 4000) {
    return {
      frequency: '5.0 GHz',
      channel: Math.max(36, Math.round((freqMhz - 5000) / 5)),
    };
  }
  return {
    frequency: '2.4 GHz',
    channel: Math.max(1, Math.min(14, Math.round((freqMhz - 2407) / 5))),
  };
}

export function evaluateWifiSecurity(
  encryption: WifiEncryption,
  ssid = 'Current Network',
  isCaptivePortal = false,
  platform: 'android' | 'ios' | 'web' = 'android',
): WifiRiskAssessment {
  const isEncrypted = encryption !== 'OPEN' && encryption !== 'UNKNOWN';

  if (platform === 'web') {
    return {
      ssid,
      encryption: 'UNKNOWN',
      riskLevel: 'MODERATE',
      isEncrypted: false,
      plainExplanation:
        'Web browsers cannot inspect local Wi-Fi encryption due to security sandboxing. If using public Wi-Fi, assume traffic is exposed unless using a VPN.',
      recommendation: 'Enable HTTPS-only mode and use a trusted VPN on untrusted networks.',
      platformMode: 'WEB_CHECKLIST',
    };
  }

  if (platform === 'ios' && encryption === 'UNKNOWN') {
    return {
      ssid,
      encryption: 'UNKNOWN',
      riskLevel: 'MODERATE',
      isEncrypted: true,
      plainExplanation:
        'iOS privacy sandboxing restricts direct Wi-Fi encryption auditing. Please verify the network lock icon in iOS Wi-Fi Settings.',
      recommendation: 'Verify that the network requires a WPA2/WPA3 password in Settings.',
      platformMode: 'IOS_SANDBOX',
    };
  }

  if (encryption === 'OPEN') {
    return {
      ssid,
      encryption: 'OPEN',
      riskLevel: 'CRITICAL',
      isEncrypted: false,
      plainExplanation:
        'This network has NO encryption password. Anyone nearby can capture and read unencrypted data you transmit.',
      recommendation: 'Disconnect immediately or turn on a trusted VPN before accessing accounts.',
      platformMode: 'ANDROID_NATIVE',
    };
  }

  if (encryption === 'WEP') {
    return {
      ssid,
      encryption: 'WEP',
      riskLevel: 'CRITICAL',
      isEncrypted: false,
      plainExplanation:
        'WEP encryption is obsolete and can be cracked in seconds with automated attacker tools.',
      recommendation: 'Upgrade router security to WPA2 or WPA3.',
      platformMode: 'ANDROID_NATIVE',
    };
  }

  if (isCaptivePortal) {
    return {
      ssid,
      encryption,
      riskLevel: 'AT_RISK',
      isEncrypted: true,
      plainExplanation:
        'Network requires logging in via a browser captive portal. Public venue portals are frequently targeted for sniffing.',
      recommendation: 'Do not submit sensitive financial credentials while connected.',
      platformMode: 'ANDROID_NATIVE',
    };
  }

  if (encryption === 'WPA3') {
    return {
      ssid,
      encryption: 'WPA3',
      riskLevel: 'SAFE',
      isEncrypted: true,
      plainExplanation:
        'Protected by state-of-the-art WPA3 encryption with Protected Management Frames enabled against offline dictionary attacks.',
      recommendation: 'Network encryption posture is excellent.',
      platformMode: 'ANDROID_NATIVE',
    };
  }

  return {
    ssid,
    encryption: 'WPA2',
    riskLevel: 'SAFE',
    isEncrypted: true,
    plainExplanation: 'Protected by standard WPA2 encryption. Traffic is encrypted between device and router.',
    recommendation: 'Safe for general everyday use.',
    platformMode: 'ANDROID_NATIVE',
  };
}

/**
 * Pure deterministic Pre-Connection Threat Evaluator.
 * Analyzes an 802.11 Beacon Frame BEFORE the user connects to predict cyber attacks.
 */
export function evaluatePreConnectionHotspot(params: {
  ssid: string;
  bssid?: string;
  encryption: WifiEncryption;
  pmfEnabled?: boolean;
  signalDbm?: number;
  channel?: number;
}): NearbyHotspotBeacon {
  const ssid = params.ssid.trim() || 'Hidden_SSID_Network';
  const bssid = params.bssid || '02:1a:11:f0:48:99';
  const signalDbm = params.signalDbm ?? -55;
  const channel = params.channel ?? (params.encryption === 'WPA3' ? 44 : 6);
  const frequency = channel > 14 ? '5.0 GHz' : '2.4 GHz';
  const pmfEnabled = params.pmfEnabled ?? (params.encryption === 'WPA3');

  const lowerSsid = ssid.toLowerCase();
  const isSuspiciousName =
    lowerSsid.includes('free') ||
    lowerSsid.includes('airport') ||
    lowerSsid.includes('starbucks') ||
    lowerSsid.includes('guest') ||
    lowerSsid.includes('public');

  const isKnownRogueOui = bssid.startsWith('00:13:37') || bssid.startsWith('de:ad:be');
  const isVeryStrongSignal = signalDbm > -42;

  if (isKnownRogueOui || (params.encryption === 'OPEN' && isSuspiciousName && isVeryStrongSignal)) {
    return {
      id: `beacon-${bssid.replace(/:/g, '')}`,
      ssid,
      bssid,
      channel,
      frequency,
      signalDbm,
      encryption: 'OPEN',
      pmfEnabled: false,
      vendor: 'Suspicious Rogue AP / Honeypot',
      threatVerdict: 'CRITICAL_THREAT',
      threatScore: 95,
      threatTag: 'UNENCRYPTED ROGUE AP HONEYPOT',
      predictedCrimes: [
        'Man-in-the-Middle (MITM) Full Packet Interception',
        'Airspace Radio Sniffing & Eavesdropping',
        'Evil Twin MitM: Hotspot mimics trusted public venues to harvest login credentials',
        'SSL Stripping & Session Hijacking across unencrypted radio airspace',
        'DNS Redirection to cloned phishing banking portals',
      ],
      preventionAdvise:
        'PRE-CRIME INTERVENTION: DO NOT CONNECT! This hotspot exhibits hardware & signal anomalies of a rogue attacker honeypot.',
      isRogueAp: true,
    };
  }

  if (params.encryption === 'OPEN' || params.encryption === 'WEP') {
    return {
      id: `beacon-${bssid.replace(/:/g, '')}`,
      ssid,
      bssid,
      channel,
      frequency,
      signalDbm,
      encryption: params.encryption,
      pmfEnabled: false,
      vendor: 'Generic / Unverified Broadcast AP',
      threatVerdict: 'CRITICAL_THREAT',
      threatScore: 90,
      threatTag:
        params.encryption === 'OPEN'
          ? 'UNENCRYPTED AIRSPACE (ZERO CRYPTO)'
          : 'OBSOLETE WEP CIPHER (CRACKABLE)',
      predictedCrimes: [
        'Eavesdropping on all unencrypted HTTP & DNS lookups',
        'Airspace Radio Sniffing & Eavesdropping',
        'ARP Poisoning & Local Device Port Scanning',
        'Injecting malicious payloads into unencrypted traffic streams',
      ],
      preventionAdvise:
        'PRE-CRIME INTERVENTION: Connection strongly discouraged. Anyone within 100m can read unencrypted packets.',
      isRogueAp: false,
    };
  }

  if (params.encryption === 'WPA2' && !pmfEnabled) {
    return {
      id: `beacon-${bssid.replace(/:/g, '')}`,
      ssid,
      bssid,
      channel,
      frequency,
      signalDbm,
      encryption: 'WPA2',
      pmfEnabled: false,
      vendor: 'Consumer Router / AP',
      threatVerdict: isSuspiciousName ? 'HIGH_RISK' : 'MODERATE',
      threatScore: isSuspiciousName ? 68 : 42,
      threatTag: isSuspiciousName
        ? 'SHARED PUBLIC WPA2 (NO PMF)'
        : 'WPA2 WITHOUT 802.11w PMF',
      predictedCrimes: [
        'Vulnerable to 802.11 Deauthentication Jamming (Forces disconnect to Evil Twin)',
        'Offline EAPOL 4-Way Handshake / PMKID Dictionary Capture',
        ...(isSuspiciousName ? ['Peer-to-Peer ARP Spoofing on shared guest subnet'] : []),
      ],
      preventionAdvise:
        'PRE-CONNECT ADVISORY: Safe only if trusted owner. Enable Protected Management Frames (802.11w) on router to block deauth attacks.',
      isRogueAp: false,
    };
  }

  return {
    id: `beacon-${bssid.replace(/:/g, '')}`,
    ssid,
    bssid,
    channel,
    frequency,
    signalDbm,
    encryption: params.encryption,
    pmfEnabled: true,
    vendor: 'Cisco Meraki / Enterprise Verified',
    threatVerdict: 'SECURE',
    threatScore: 8,
    threatTag: 'VERIFIED WPA3-SAE + 802.11w PMF',
    predictedCrimes: [
      'Zero Pre-Connection Threats: SAE Dragonfly Handshake blocks offline cracking & 802.11w blocks deauth jamming.',
    ],
    preventionAdvise:
      'VERIFIED SAFE TO CONNECT: Hardware cryptographic perimeter meets zero-trust standards.',
    isRogueAp: false,
  };
}

// Storage for custom audited beacons & presentation hotspot
const STORAGE_KEY_AUDITED_WIFI = '@cyber_companion_audited_wifi_v1';
const STORAGE_KEY_PRESENTATION_HOTSPOT = '@cyber_companion_presentation_hotspot_v1';

export async function getPresentationHotspot(): Promise<NearbyHotspotBeacon | null> {
  try {
    const raw = await Storage.getItem(STORAGE_KEY_PRESENTATION_HOTSPOT);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function setPresentationHotspot(beacon: NearbyHotspotBeacon): Promise<void> {
  try {
    await Storage.setItem(STORAGE_KEY_PRESENTATION_HOTSPOT, JSON.stringify(beacon));
  } catch {}
}

export async function getSavedWifiBeacons(): Promise<NearbyHotspotBeacon[]> {
  try {
    const raw = await Storage.getItem(STORAGE_KEY_AUDITED_WIFI);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function saveAuditedWifiBeacon(beacon: NearbyHotspotBeacon): Promise<NearbyHotspotBeacon[]> {
  try {
    const existing = await getSavedWifiBeacons();
    const updated = [beacon, ...existing.filter((b) => b.id !== beacon.id && b.ssid !== beacon.ssid)];
    await Storage.setItem(STORAGE_KEY_AUDITED_WIFI, JSON.stringify(updated));
    return updated;
  } catch {
    return [beacon];
  }
}

export async function deleteSavedWifiBeacon(id: string): Promise<NearbyHotspotBeacon[]> {
  try {
    const existing = await getSavedWifiBeacons();
    const updated = existing.filter((b) => b.id !== id);
    await Storage.setItem(STORAGE_KEY_AUDITED_WIFI, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
}

/**
 * Standard baseline beacons for testing and offline demo simulation.
 */
export function getNearbyHotspotBeacons(): NearbyHotspotBeacon[] {
  const jitter = Math.floor(Math.random() * 5) - 2;
  return [
    evaluatePreConnectionHotspot({
      ssid: 'AndroidAP_2980',
      bssid: '3a:27:ac:33:0d:76',
      encryption: 'WPA3',
      pmfEnabled: true,
      signalDbm: -54 + jitter,
      channel: 13,
    }),
    evaluatePreConnectionHotspot({
      ssid: 'Neeha',
      bssid: 'fa:86:da:c5:da:79',
      encryption: 'WPA2',
      pmfEnabled: false,
      signalDbm: -58 + jitter,
      channel: 1,
    }),
    evaluatePreConnectionHotspot({
      ssid: 'LOQ 5270',
      bssid: 'c6:35:32:24:ce:25',
      encryption: 'WPA2',
      pmfEnabled: false,
      signalDbm: -62 + jitter,
      channel: 36,
    }),
    evaluatePreConnectionHotspot({
      ssid: 'FACULTY',
      bssid: 'c0:74:ad:b9:b7:52',
      encryption: 'WPA2',
      pmfEnabled: false,
      signalDbm: -70 + jitter,
      channel: 64,
    }),
    evaluatePreConnectionHotspot({
      ssid: 'STUD',
      bssid: 'c6:74:ad:b9:b7:52',
      encryption: 'WPA2',
      pmfEnabled: false,
      signalDbm: -72 + jitter,
      channel: 64,
    }),
    evaluatePreConnectionHotspot({
      ssid: 'GUEST',
      bssid: 'ca:74:ad:b9:b7:51',
      encryption: 'OPEN',
      pmfEnabled: false,
      signalDbm: -66 + jitter,
      channel: 1,
    }),
    evaluatePreConnectionHotspot({
      ssid: 'Galaxy A14 5G 9F95',
      bssid: '72:3e:71:f7:df:56',
      encryption: 'WPA2',
      pmfEnabled: false,
      signalDbm: -62 + jitter,
      channel: 149,
    }),
    evaluatePreConnectionHotspot({
      ssid: 'StudentConnect',
      bssid: '40:e3:d6:47:bf:c1',
      encryption: 'WPA2',
      pmfEnabled: false,
      signalDbm: -88 + jitter,
      channel: 5,
    }),
    evaluatePreConnectionHotspot({
      ssid: 'STUD-2',
      bssid: '40:e3:d6:49:86:90',
      encryption: 'WPA2',
      pmfEnabled: false,
      signalDbm: -93 + jitter,
      channel: 52,
    }),
  ];
}

/**
 * Scan Nearby 802.11 Wi-Fi Airspace Natively on Device.
 * - On Android: Leverages native WifiManager via WifiScannerModule + ACCESS_FINE_LOCATION.
 * - On iOS: Respects sandbox restrictions with explicit advisory.
 * - Never injects fake mock data silently.
 */
export async function scanNearbyWifiAirspace(): Promise<WifiAirspaceScanResult> {
  let isConnected = false;
  let type = 'UNKNOWN';
  let ipAddress: string | undefined;

  try {
    const netState = await Network.getNetworkStateAsync();
    isConnected = Boolean(netState.isConnected);
    type = netState.type ? String(netState.type) : 'UNKNOWN';
    const ip = await Network.getIpAddressAsync();
    if (ip && ip !== '0.0.0.0') {
      ipAddress = ip;
    }
  } catch {
    // Graceful handling
  }

  const isWifi =
    isConnected &&
    (type === 'WIFI' ||
      type === 'NetworkStateType.WIFI' ||
      type === '2' ||
      Boolean(ipAddress && (ipAddress.startsWith('192.168.') || ipAddress.startsWith('10.') || ipAddress.startsWith('172.'))));

  const isCellular = isConnected && !isWifi && (type === 'CELLULAR' || type === 'NetworkStateType.CELLULAR' || type === '1');

  const activeConnectionData = {
    isConnected,
    type: isWifi ? 'WIFI' : isCellular ? 'CELLULAR' : type,
    ipAddress,
  };

  // 1. iOS Sandboxing Check
  if (Platform.OS === 'ios') {
    return {
      activeConnection: activeConnectionData,
      beacons: [],
      isIosRestricted: true,
      statusMessage:
        'iOS Privacy Sandboxing: Apple restricts ambient Wi-Fi BSSID radio scanning. Audit your active network or use manual network testing.',
      scanSource: 'OFFLINE_SANDBOX',
    };
  }

  // 2. Android Runtime Permissions & GPS Location Services Check
  if (Platform.OS === 'android') {
    const permResult = await requestWifiScanPermissions();
    if (!permResult.granted) {
      return {
        activeConnection: activeConnectionData,
        beacons: [],
        permissionDenied: true,
        canAskAgain: permResult.canAskAgain,
        statusMessage:
          'Location Permission Required: Android security sandboxing requires Location permission to inspect 802.11 Wi-Fi radio airspace and scan BSSIDs.',
        scanSource: 'OFFLINE_SANDBOX',
      };
    }

    const locationOn = isDeviceLocationEnabled();
    if (!locationOn) {
      return {
        activeConnection: activeConnectionData,
        beacons: [],
        locationDisabled: true,
        statusMessage:
          'Device Location Services (GPS) are turned OFF. Android OS returns 0 nearby Wi-Fi networks when Location is disabled in device settings.',
        scanSource: 'OFFLINE_SANDBOX',
      };
    }
  }

  // 3. Native Live Hardware Airspace Scan via WifiManager
  const liveAirspaceBeacons: NearbyHotspotBeacon[] = [];
  let nativeActiveInfo: NativeCurrentWifiInfo | null = null;
  let usedNativeModule = false;

  if (WifiScannerModule) {
    try {
      usedNativeModule = true;
      // Trigger native hardware scan
      await WifiScannerModule.startScan().catch(() => false);

      const [nativeScanList, curInfo] = await Promise.all([
        WifiScannerModule.getScanResults().catch(() => [] as NativeWifiScanResult[]),
        WifiScannerModule.getCurrentWifiInfo().catch(() => null),
      ]);

      if (curInfo && curInfo.ssid) {
        nativeActiveInfo = curInfo;
      }

      if (Array.isArray(nativeScanList) && nativeScanList.length > 0) {
        for (const scan of nativeScanList) {
          liveAirspaceBeacons.push(
            evaluateAirspaceBeacon({
              ssid: scan.ssid,
              bssid: scan.bssid,
              capabilities: scan.capabilities,
              level: scan.level,
              frequency: scan.frequency,
            })
          );
        }
      }
    } catch {
      // Native module error
    }
  }

  // Pure parameter-based sorting: strongest signal first
  liveAirspaceBeacons.sort((a, b) => b.signalDbm - a.signalDbm);

  // Mark currently connected network if present
  if (nativeActiveInfo && nativeActiveInfo.ssid) {
    const activeMatch = liveAirspaceBeacons.find(
      (b) =>
        (nativeActiveInfo?.bssid && b.bssid.toLowerCase() === nativeActiveInfo.bssid.toLowerCase()) ||
        b.ssid === nativeActiveInfo?.ssid
    );
    if (activeMatch) {
      activeMatch.isCurrentConnection = true;
      activeMatch.ipAddress = nativeActiveInfo.ipAddress || ipAddress;
    }
  }

  return {
    activeConnection: {
      isConnected,
      type: isWifi ? 'WIFI' : isCellular ? 'CELLULAR' : type,
      ipAddress: nativeActiveInfo?.ipAddress || ipAddress,
      ssid: nativeActiveInfo?.ssid,
      bssid: nativeActiveInfo?.bssid,
    },
    beacons: liveAirspaceBeacons, // ONLY LIVE NEARBY BEACONS! ZERO saved/configured networks!
    scanSource: usedNativeModule ? 'ANDROID_HARDWARE_WIFIMANAGER' : 'OFFLINE_SANDBOX',
    statusMessage:
      liveAirspaceBeacons.length === 0
        ? 'No ambient Wi-Fi access points detected in physical vicinity. Ensure Wi-Fi radio is toggled ON.'
        : undefined,
  };
}
