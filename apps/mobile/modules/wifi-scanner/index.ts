import { requireOptionalNativeModule } from 'expo-modules-core';

export interface NativeWifiScanResult {
  ssid: string;
  bssid: string;
  level: number;
  frequency: number;
  capabilities: string;
  timestamp?: number;
}

export interface NativeCurrentWifiInfo {
  ssid: string;
  bssid: string;
  level: number;
  frequency: number;
  ipAddress?: string;
}

export interface WifiScannerModuleInterface {
  isLocationEnabled(): boolean;
  startScan(): Promise<boolean>;
  getScanResults(): Promise<NativeWifiScanResult[]>;
  getCurrentWifiInfo(): Promise<NativeCurrentWifiInfo | null>;
}

const WifiScannerModule = requireOptionalNativeModule<WifiScannerModuleInterface>('WifiScanner');

export default WifiScannerModule;
