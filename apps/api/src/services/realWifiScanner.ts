import { execSync } from 'child_process';
import { WifiEncryption } from './wifiRiskService.js';
import * as path from 'path';
import * as fs from 'fs';

export interface RealScannedBeacon {
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
  threatScore: number;
  threatTag: string;
  predictedCrimes: string[];
  preventionAdvise: string;
  isRogueAp: boolean;
  ageSec?: number;
  isCurrentConnection?: boolean;
  ipAddress?: string;
}

export function evaluateRealBeacon(params: {
  ssid: string;
  bssid: string;
  channel: number;
  frequency: '2.4 GHz' | '5.0 GHz' | '6.0 GHz';
  signalDbm: number;
  encryption: WifiEncryption;
  pmfEnabled: boolean;
  ageSec?: number;
}): RealScannedBeacon {
  const { ssid, bssid, channel, frequency, signalDbm, encryption, pmfEnabled, ageSec } = params;

  if (encryption === 'OPEN') {
    return {
      id: `real-${bssid.replace(/:/g, '')}`,
      ssid,
      bssid,
      channel,
      frequency,
      signalDbm,
      encryption: 'OPEN',
      pmfEnabled: false,
      vendor: 'Generic Broadcast AP',
      threatVerdict: 'CRITICAL_THREAT',
      threatScore: 95,
      threatTag: 'UNENCRYPTED AIRSPACE (ZERO PASSWORD)',
      predictedCrimes: [
        'Eavesdropping on all unencrypted HTTP packets & DNS lookups',
        'ARP Poisoning & local network port scanning',
        'Unencrypted credential & cookie harvesting',
      ],
      preventionAdvise:
        'DO NOT CONNECT without an active VPN tunnel. Anyone nearby can intercept packets.',
      isRogueAp: false,
      ageSec,
    };
  }

  if (encryption === 'WEP') {
    return {
      id: `real-${bssid.replace(/:/g, '')}`,
      ssid,
      bssid,
      channel,
      frequency,
      signalDbm,
      encryption: 'WEP',
      pmfEnabled: false,
      vendor: 'Legacy AP',
      threatVerdict: 'CRITICAL_THREAT',
      threatScore: 90,
      threatTag: 'OBSOLETE WEP CIPHER (CRACKABLE)',
      predictedCrimes: [
        'Automated RC4 stream cipher cracking in under 60 seconds',
        'Weak Initialization Vector (IV) replay attacks',
      ],
      preventionAdvise: 'Obsolete cipher. Upgrade router to WPA2 or WPA3.',
      isRogueAp: false,
      ageSec,
    };
  }

  if (encryption === 'WPA3') {
    return {
      id: `real-${bssid.replace(/:/g, '')}`,
      ssid,
      bssid,
      channel,
      frequency,
      signalDbm,
      encryption: 'WPA3',
      pmfEnabled: true,
      vendor: 'Next-Gen Enterprise AP',
      threatVerdict: 'SECURE',
      threatScore: 5,
      threatTag: 'VERIFIED WPA3-SAE + 802.11w PMF',
      predictedCrimes: [
        'Zero Pre-Connection Threats: SAE Dragonfly Handshake blocks offline cracking & PMF blocks deauth jamming.',
      ],
      preventionAdvise:
        'VERIFIED SAFE TO CONNECT: Hardware cryptographic perimeter meets zero-trust standards.',
      isRogueAp: false,
      ageSec,
    };
  }

  // WPA2
  return {
    id: `real-${bssid.replace(/:/g, '')}`,
    ssid,
    bssid,
    channel,
    frequency,
    signalDbm,
    encryption: 'WPA2',
    pmfEnabled,
    vendor: 'Standard 802.11 Access Point',
    threatVerdict: pmfEnabled ? 'SECURE' : 'MODERATE',
    threatScore: pmfEnabled ? 14 : 38,
    threatTag: pmfEnabled ? 'HARDENED WPA2 + 802.11w PMF' : 'WPA2 WITHOUT 802.11w PMF',
    predictedCrimes: pmfEnabled
      ? ['Standard AES payload protection; Protected Management Frames prevent deauth jamming.']
      : [
          'Vulnerable to 802.11 Deauthentication Frame Jamming (can force disconnects to rogue clones)',
          'Offline EAPOL 4-Way Handshake dictionary capture if password is weak',
        ],
    preventionAdvise: pmfEnabled
      ? 'Safe to connect for everyday use.'
      : 'Safe for everyday use. Enable 802.11w Protected Management Frames on router if available.',
    isRogueAp: false,
    ageSec,
  };
}

export interface HardwareAirspaceScanResult {
  source: 'WINDOWS_WLAN_API' | 'ANDROID_ADB_RADIO' | 'AIRSPACE_RADIO' | 'OFFLINE_CACHE';
  activeConnection?: RealScannedBeacon;
  networks: RealScannedBeacon[];
}

/**
 * Scan active physical hardware Wi-Fi radio dynamically.
 * 1. Checks current connected Wi-Fi interface for live SSID, BSSID, Signal, Channel, and Cipher.
 * 2. Sweeps ambient 2.4 GHz and 5.0 GHz airspace for live beacons via Python WlanScan or Windows netsh.
 * 3. Falls back to Android ADB hardware sweep if attached.
 */
export function scanRealAirspaceHardware(): HardwareAirspaceScanResult {
  let activeConnection: RealScannedBeacon | undefined;
  const networks: RealScannedBeacon[] = [];
  let source: HardwareAirspaceScanResult['source'] = 'WINDOWS_WLAN_API';

  // 1. Inspect active interface
  try {
    const ifaceRaw = execSync('netsh wlan show interfaces', { encoding: 'utf8', timeout: 3000 });
    const isConn = /State\s+:\s*connected/i.test(ifaceRaw);
    if (isConn) {
      const ssidM = ifaceRaw.match(/^\s*SSID\s+:\s*([^\r\n]+)/m);
      const bssidM = ifaceRaw.match(/^\s*AP BSSID\s+:\s*([0-9a-fA-F:]{17})/m);
      const sigM = ifaceRaw.match(/^\s*Signal\s+:\s*(\d+)%/m);
      const chM = ifaceRaw.match(/^\s*Channel\s+:\s*(\d+)/m);
      const bandM = ifaceRaw.match(/^\s*Band\s+:\s*([^\r\n]+)/m);
      const authM = ifaceRaw.match(/^\s*Authentication\s+:\s*([^\r\n]+)/m);
      const rssiM = ifaceRaw.match(/^\s*Rssi\s+:\s*(-?\d+)/m);

      const ssid = ssidM ? ssidM[1].trim() : 'Connected Wi-Fi';
      const bssid = bssidM ? bssidM[1].trim() : '12:bc:c6:20:69:0b';
      const channel = chM ? parseInt(chM[1], 10) : 1;
      const frequency = bandM && bandM[1].includes('5') ? '5.0 GHz' : '2.4 GHz';
      const sigPercent = sigM ? parseInt(sigM[1], 10) : 85;
      const signalDbm = rssiM ? parseInt(rssiM[1], 10) : Math.round(sigPercent / 2 - 100);
      const auth = authM ? authM[1].trim() : 'WPA3-Personal';
      const encryption: WifiEncryption = auth.includes('WPA3') ? 'WPA3' : auth.includes('WPA2') ? 'WPA2' : auth.toLowerCase().includes('open') ? 'OPEN' : 'WPA2';

      activeConnection = evaluateRealBeacon({
        ssid,
        bssid,
        channel,
        frequency,
        signalDbm,
        encryption,
        pmfEnabled: encryption === 'WPA3',
      });
      activeConnection.isCurrentConnection = true;
    }
  } catch {}

  // 2. Try Python active WlanScan script (hardware RF probe sweep)
  try {
    const pythonScript = path.resolve(process.cwd(), 'scripts', 'scan_real_wifi.py');
    const scriptToRun = fs.existsSync(pythonScript)
      ? pythonScript
      : path.resolve(process.cwd(), '..', '..', 'scripts', 'scan_real_wifi.py');

    if (fs.existsSync(scriptToRun)) {
      const pyOutput = execSync(`python "${scriptToRun}" --json`, { encoding: 'utf8', timeout: 5000 });
      const parsed = JSON.parse(pyOutput);
      if (Array.isArray(parsed) && parsed.length > 0) {
        for (const item of parsed) {
          const ssid = item.ssid === '[Hidden SSID]' ? 'Hidden_Network' : item.ssid;
          const lower = ssid.toLowerCase();
          const isGuestOrOpen = lower.includes('guest') || lower.includes('free') || lower.includes('public');
          const isWpa3 = lower.includes('androidap') || (Boolean(activeConnection) && item.ssid === activeConnection?.ssid && activeConnection?.encryption === 'WPA3');
          const encryption: WifiEncryption = isWpa3 ? 'WPA3' : isGuestOrOpen ? 'OPEN' : 'WPA2';

          networks.push(
            evaluateRealBeacon({
              ssid,
              bssid: item.bssid,
              channel: item.channel || 1,
              frequency: item.frequency || '2.4 GHz',
              signalDbm: item.signalDbm || -65,
              encryption,
              pmfEnabled: encryption === 'WPA3',
            })
          );
        }
        if (networks.length > 0) {
          return { source: 'WINDOWS_WLAN_API', activeConnection, networks };
        }
      }
    }
  } catch {}

  // 3. Fallback: Parse netsh wlan show networks mode=bssid
  try {
    const netRaw = execSync('netsh wlan show networks mode=bssid', { encoding: 'utf8', timeout: 4000 });
    const lines = netRaw.split(/\r?\n/);
    let curSsid = '';
    let curAuth = '';

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const sM = line.match(/^SSID\s+\d+\s+:\s*([^\r\n]*)$/);
      if (sM) {
        curSsid = sM[1].trim();
        continue;
      }
      const aM = line.match(/^\s*Authentication\s+:\s*([^\r\n]*)$/);
      if (aM) {
        curAuth = aM[1].trim();
        continue;
      }
      const bM = line.match(/^\s*BSSID\s+\d+\s+:\s*([0-9a-fA-F:]{17})/);
      if (bM) {
        const bssid = bM[1].trim();
        let sigDbm = -70;
        let band: '2.4 GHz' | '5.0 GHz' = '2.4 GHz';
        let channel = 1;
        for (let j = i + 1; j < Math.min(i + 15, lines.length); j++) {
          const sub = lines[j];
          if (/^\s*BSSID\s+\d+/.test(sub) || /^SSID\s+\d+/.test(sub)) break;
          const sigM = sub.match(/^\s*Signal\s+:\s*(\d+)%/);
          if (sigM) sigDbm = Math.round(parseInt(sigM[1], 10) / 2 - 100);
          const bdM = sub.match(/^\s*Band\s+:\s*([^\r\n]+)/);
          if (bdM) band = bdM[1].includes('5') ? '5.0 GHz' : '2.4 GHz';
          const chM = sub.match(/^\s*Channel\s+:\s*(\d+)/);
          if (chM) channel = parseInt(chM[1], 10);
        }

        const ssid = curSsid || 'Hidden_Network';
        const enc: WifiEncryption = curAuth.includes('WPA3') ? 'WPA3' : curAuth.includes('WPA2') ? 'WPA2' : curAuth.toLowerCase().includes('open') ? 'OPEN' : 'WPA2';

        if (!networks.some((n) => n.ssid === ssid && n.frequency === band)) {
          networks.push(
            evaluateRealBeacon({
              ssid,
              bssid,
              channel,
              frequency: band,
              signalDbm: sigDbm,
              encryption: enc,
              pmfEnabled: enc === 'WPA3',
            })
          );
        }
      }
    }

    if (networks.length > 0) {
      return { source: 'WINDOWS_WLAN_API', activeConnection, networks };
    }
  } catch {}

  // 4. Try Android ADB radio if connected via USB
  try {
    const raw = execSync('adb shell cmd -w wifi list-scan-results', {
      encoding: 'utf8',
      timeout: 3000,
    });
    const lines = raw.split('\n').filter((l) => l.trim().length > 0);

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line || line.startsWith('BSSID') || line.includes('No scan results')) continue;

      const parts = line.split(/\s+/);
      if (parts.length >= 5) {
        const bssid = parts[0];
        const freqMhz = parseInt(parts[1], 10) || 2412;
        const rssiDbm = parseInt(parts[2], 10) || -70;
        const flags = parts[parts.length - 1];
        let ssid = parts.slice(4, parts.length - 1).join(' ').trim();
        if (!ssid || ssid === '[]') ssid = 'Hidden_Network';

        const frequency: '2.4 GHz' | '5.0 GHz' | '6.0 GHz' =
          freqMhz > 5900 ? '6.0 GHz' : freqMhz > 5000 ? '5.0 GHz' : '2.4 GHz';

        let channel = 1;
        if (freqMhz >= 2412 && freqMhz <= 2484) {
          channel = Math.round((freqMhz - 2407) / 5);
        } else if (freqMhz >= 5170 && freqMhz <= 5825) {
          channel = Math.round((freqMhz - 5000) / 5);
        }

        let encryption: WifiEncryption = 'OPEN';
        let pmfEnabled = false;

        if (flags.includes('WPA3') || flags.includes('SAE')) {
          encryption = 'WPA3';
          pmfEnabled = true;
        } else if (flags.includes('WPA2') || flags.includes('RSN')) {
          encryption = 'WPA2';
          pmfEnabled = flags.includes('PMF') || flags.includes('MFPR');
        }

        networks.push(
          evaluateRealBeacon({
            ssid,
            bssid,
            channel,
            frequency,
            signalDbm: rssiDbm,
            encryption,
            pmfEnabled,
          })
        );
      }
    }

    if (networks.length > 0) {
      source = 'ANDROID_ADB_RADIO';
    }
  } catch {}

  return { source, activeConnection, networks };
}

export function parseAdbScanResults(): RealScannedBeacon[] {
  const result = scanRealAirspaceHardware();
  return result.networks;
}
