import { auditAppPermissions } from '../src/services/permissionAuditor';

describe('On-Device Permission Auditor', () => {
  test('flags SMS + INTERNET combo as CRITICAL risk for non-system app', () => {
    const res = auditAppPermissions({
      appName: 'Super Flashlight',
      packageName: 'com.flashlight.superbright',
      permissions: ['android.permission.INTERNET', 'android.permission.READ_SMS'],
      isSystemApp: false,
    });

    expect(res.riskLevel).toBe('CRITICAL');
    expect(res.flaggedReasons[0]).toContain('OTP stealer');
  });

  test('treats benign utility app with zero permissions as SAFE', () => {
    const res = auditAppPermissions({
      appName: 'Offline Calculator',
      packageName: 'com.calc.offline',
      permissions: [],
      isSystemApp: false,
    });

    expect(res.riskLevel).toBe('SAFE');
    expect(res.riskScore).toBe(0);
  });

  test('does not over-penalize system apps', () => {
    const res = auditAppPermissions({
      appName: 'Google Messages',
      packageName: 'com.google.android.apps.messaging',
      permissions: ['android.permission.INTERNET', 'android.permission.READ_SMS'],
      isSystemApp: true,
    });

    expect(res.riskLevel).toBe('SAFE');
  });
});
