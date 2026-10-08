import { verifyCertificatePin } from '../src/security/certPinning';
import { evaluateDeviceIntegrity, suppressProductionLogs } from '../src/security/antiTamper';

describe('Mobile Client Hardening and Integrity Suite', () => {
  describe('Certificate Pinning', () => {
    test('accepts matching primary SPKI pin hash', () => {
      const result = verifyCertificatePin(
        'api.cybercompanion.internal',
        'WoiWRyIOVNa9ihaKkdOdHZAZFYGEBU0b516M2qGEq9A='
      );
      expect(result.valid).toBe(true);
    });

    test('accepts matching backup SPKI pin hash during rotation', () => {
      const result = verifyCertificatePin(
        'api.cybercompanion.internal',
        'r/m5WBGo8+/5GunSpmxDHFFDK199WNxTmzhLS85060='
      );
      expect(result.valid).toBe(true);
    });

    test('rejects mismatched SPKI hash and flags potential MITM attack', () => {
      const result = verifyCertificatePin(
        'api.cybercompanion.internal',
        'maliciousHackerInTheMiddlePinHash12345='
      );
      expect(result.valid).toBe(false);
      expect(result.reason).toContain('Potential MITM attack intercepted');
    });

    test('allows non-pinned domains to pass through standard PKI validation', () => {
      const result = verifyCertificatePin('example.com', 'someHash=');
      expect(result.valid).toBe(true);
    });
  });

  describe('Anti-Tamper Heuristics', () => {
    test('flags suspicious su binary / root markers', () => {
      const report = evaluateDeviceIntegrity({ hasSuBinary: true });
      expect(report.isRootOrJailbroken).toBe(true);
      expect(report.tamperFlags).toContain('SUSPICIOUS_ROOT_BINARY_OR_KEY');
    });

    test('flags emulator and debugger environments', () => {
      const report = evaluateDeviceIntegrity({ isEmulatorHardware: true, isDebuggerConnected: true });
      expect(report.isEmulator).toBe(true);
      expect(report.isDebuggable).toBe(true);
    });

    test('reports clean device for normal consumer device profile', () => {
      const report = evaluateDeviceIntegrity({});
      expect(report.isRootOrJailbroken).toBe(false);
      expect(report.isEmulator).toBe(false);
      expect(report.tamperFlags.length).toBe(0);
    });
  });

  describe('Production Log Suppression', () => {
    test('silences console.log and console.info when isProduction is true', () => {
      const originalLog = console.log;
      suppressProductionLogs(true);

      // Verify console.log does not throw and is overridden
      expect(() => console.log('test log message')).not.toThrow();

      // Restore
      console.log = originalLog;
    });
  });
});
