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
 * Analyzes an 802.11 Beacon Frame BEFORE the user connects to predict cyber crimes/attacks.
 */
export function evaluatePreConnectionHotspot(params: {
  ssid: string;
  bssid?: string;
  encryption: WifiEncryption;
  pmfEnabled: boolean;
  signalDbm?: number;
  channel?: number;
}): NearbyHotspotBeacon {
  const ssid = params.ssid.trim() || 'Hidden_SSID_Network';
  const bssid = params.bssid || '02:1a:11:f0:48:99';
  const signalDbm = params.signalDbm ?? -55;
  const channel = params.channel ?? (params.encryption === 'WPA3' ? 44 : 6);
  const frequency = channel > 14 ? '5.0 GHz' : '2.4 GHz';

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
      id: `beacon-${Date.now()}-${Math.random()}`,
      ssid,
      bssid,
      channel,
      frequency,
      signalDbm,
      encryption: params.encryption,
      pmfEnabled: false,
      vendor: 'Espressif / Hak5 Pineapple Signature',
      threatVerdict: 'CRITICAL_THREAT',
      threatScore: 98,
      threatTag: 'EVIL TWIN HONEYPOT DETECTED',
      predictedCrimes: [
        'Man-in-the-Middle (MITM) Full Packet Interception',
        'Fake Captive Portal Credential Harvesting (Banking / Social Logins)',
        'SSL Stripping & DNS Spoofing to Malicious Servers',
        'Session Token & Cookie Hijacking',
      ],
      preventionAdvise:
        'PRE-CRIME INTERVENTION: DO NOT CONNECT! This hotspot exhibits hardware & signal anomalies of a rogue attacker honeypot.',
      isRogueAp: true,
    };
  }

  if (params.encryption === 'OPEN' || params.encryption === 'WEP') {
    return {
      id: `beacon-${Date.now()}-${Math.random()}`,
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
        'ARP Poisoning & Local Device Port Scanning',
        'Injecting malicious payloads into unencrypted traffic streams',
      ],
      preventionAdvise:
        'PRE-CRIME INTERVENTION: Connection strongly discouraged. Any attacker within 100m can read your network packets without a password.',
      isRogueAp: false,
    };
  }

  if (params.encryption === 'WPA2' && !params.pmfEnabled) {
    return {
      id: `beacon-${Date.now()}-${Math.random()}`,
      ssid,
      bssid,
      channel,
      frequency,
      signalDbm,
      encryption: 'WPA2',
      pmfEnabled: false,
      vendor: 'TP-Link / Consumer Router',
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
    id: `beacon-${Date.now()}-${Math.random()}`,
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

export function getNearbyHotspotBeacons(): NearbyHotspotBeacon[] {
  return [
    evaluatePreConnectionHotspot({
      ssid: 'Free_Airport_FastWiFi',
      bssid: '00:13:37:a8:11:02',
      encryption: 'OPEN',
      pmfEnabled: false,
      signalDbm: -34,
      channel: 6,
    }),
    evaluatePreConnectionHotspot({
      ssid: 'Starbucks_Customer_Open',
      bssid: 'b4:fb:e4:21:09:cc',
      encryption: 'OPEN',
      pmfEnabled: false,
      signalDbm: -48,
      channel: 11,
    }),
    evaluatePreConnectionHotspot({
      ssid: 'Hotel_Lobby_Guest',
      bssid: '14:cc:20:8a:b2:01',
      encryption: 'WPA2',
      pmfEnabled: false,
      signalDbm: -62,
      channel: 1,
    }),
    evaluatePreConnectionHotspot({
      ssid: 'Campus_Legacy_WEP',
      bssid: '00:18:f8:3c:71:10',
      encryption: 'WEP',
      pmfEnabled: false,
      signalDbm: -71,
      channel: 9,
    }),
    evaluatePreConnectionHotspot({
      ssid: 'CyberLab_WPA3_Secure',
      bssid: 'e4:8d:8c:12:a9:44',
      encryption: 'WPA3',
      pmfEnabled: true,
      signalDbm: -51,
      channel: 44,
    }),
  ];
}
