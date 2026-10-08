import { adminAuthService, generateTOTPCode, verifyTOTPCode } from '../src/services/adminAuthService';

describe('Phase 8 Admin Console: RBAC and TOTP MFA Authentication', () => {
  const secret = 'JBSWY3DPEHPK3PXP';

  test('generates 6-digit TOTP code and validates successfully', () => {
    const code = generateTOTPCode(secret);
    expect(code).toMatch(/^\d{6}$/);
    expect(verifyTOTPCode(secret, code)).toBe(true);
  });

  test('rejects expired or incorrect TOTP codes', () => {
    expect(verifyTOTPCode(secret, '000000')).toBe(false);
    expect(verifyTOTPCode(secret, 'abc123')).toBe(false);
  });

  test('authenticates admin with valid credentials and TOTP token', () => {
    const code = generateTOTPCode(secret);
    const authResult = adminAuthService.authenticateWithTOTP('admin', code);

    expect(authResult.success).toBe(true);
    expect(authResult.session?.role).toBe('ADMIN');
    expect(authResult.session?.username).toBe('admin');
  });

  test('enforces RBAC permission hierarchy correctly', () => {
    // ADMIN can access ADMIN, EDITOR, and VIEWER operations
    expect(adminAuthService.hasPermission('ADMIN', 'ADMIN')).toBe(true);
    expect(adminAuthService.hasPermission('ADMIN', 'EDITOR')).toBe(true);
    expect(adminAuthService.hasPermission('ADMIN', 'VIEWER')).toBe(true);

    // EDITOR can access EDITOR and VIEWER, but not ADMIN
    expect(adminAuthService.hasPermission('EDITOR', 'ADMIN')).toBe(false);
    expect(adminAuthService.hasPermission('EDITOR', 'EDITOR')).toBe(true);
    expect(adminAuthService.hasPermission('EDITOR', 'VIEWER')).toBe(true);

    // VIEWER can only access VIEWER operations
    expect(adminAuthService.hasPermission('VIEWER', 'ADMIN')).toBe(false);
    expect(adminAuthService.hasPermission('VIEWER', 'EDITOR')).toBe(false);
    expect(adminAuthService.hasPermission('VIEWER', 'VIEWER')).toBe(true);
  });
});
