export interface DeviceIntegrityReport {
  isRootOrJailbroken: boolean;
  isEmulator: boolean;
  isDebuggable: boolean;
  tamperFlags: string[];
}

export function evaluateDeviceIntegrity(mockSystemProperties?: Record<string, any>): DeviceIntegrityReport {
  const flags: string[] = [];

  // Check known root / jailbreak file paths or flags
  const props = mockSystemProperties || (typeof window !== 'undefined' ? (window as any).__DEVICE_ENV__ : {});

  if (props?.hasSuBinary || props?.isTestKeys || props?.hasCydia) {
    flags.push('SUSPICIOUS_ROOT_BINARY_OR_KEY');
  }

  if (props?.isEmulatorHardware || props?.isQemu) {
    flags.push('EMULATOR_HARDWARE_DETECTED');
  }

  if (props?.isDebuggerConnected) {
    flags.push('DEBUGGER_ATTACHED');
  }

  return {
    isRootOrJailbroken: flags.includes('SUSPICIOUS_ROOT_BINARY_OR_KEY'),
    isEmulator: flags.includes('EMULATOR_HARDWARE_DETECTED'),
    isDebuggable: flags.includes('DEBUGGER_ATTACHED'),
    tamperFlags: flags,
  };
}

export function suppressProductionLogs(isProduction: boolean): void {
  if (isProduction && typeof console !== 'undefined') {
    const noop = () => {};
    // Suppress console outputs that could leak tokens or user state into logcat / syslog
    console.log = noop;
    console.info = noop;
    console.debug = noop;
    // Retain console.error and console.warn for uncaught fatal boundary diagnostics
  }
}
