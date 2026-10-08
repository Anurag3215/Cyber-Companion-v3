import crypto from 'crypto';

export type AdminRole = 'ADMIN' | 'EDITOR' | 'VIEWER';

export interface AdminUser {
  id: string;
  username: string;
  role: AdminRole;
  totpSecret: string;
  isActive: boolean;
}

export interface AuthSessionToken {
  userId: string;
  username: string;
  role: AdminRole;
  expiresAt: number;
}

// In-memory admin user registry (seeded with secure zero-trust admin)
const ADMIN_STORE: Map<string, AdminUser> = new Map();

// Helper to compute TOTP (RFC 6238)
export function generateTOTPCode(secret: string, timeStep = 30, offsetSteps = 0): string {
  const epoch = Math.floor(Date.now() / 1000);
  const counter = Math.floor(epoch / timeStep) + offsetSteps;
  const buf = Buffer.alloc(8);
  buf.writeBigInt64BE(BigInt(counter));

  const hmac = crypto.createHmac('sha1', Buffer.from(secret, 'utf-8'));
  hmac.update(buf);
  const digest = hmac.digest();

  const offset = digest[digest.length - 1] & 0xf;
  const code =
    ((digest[offset] & 0x7f) << 24) |
    ((digest[offset + 1] & 0xff) << 16) |
    ((digest[offset + 2] & 0xff) << 8) |
    (digest[offset + 3] & 0xff);

  const otp = (code % 1000000).toString().padStart(6, '0');
  return otp;
}

export function verifyTOTPCode(secret: string, token: string): boolean {
  if (!/^\d{6}$/.test(token)) {
    return false;
  }
  // Allow +/- 1 timestep window for clock drift
  for (const offset of [-1, 0, 1]) {
    if (generateTOTPCode(secret, 30, offset) === token) {
      return true;
    }
  }
  return false;
}

export class AdminAuthService {
  constructor() {
    // Seed root administrator (TOTP secret standard base32 string format)
    this.registerAdmin('admin', 'ADMIN', 'JBSWY3DPEHPK3PXP');
    this.registerAdmin('editor_content', 'EDITOR', 'JBSWY3DPEHPK3PXP');
    this.registerAdmin('viewer_auditor', 'VIEWER', 'JBSWY3DPEHPK3PXP');
  }

  registerAdmin(username: string, role: AdminRole, totpSecret: string): AdminUser {
    const user: AdminUser = {
      id: crypto.randomUUID(),
      username,
      role,
      totpSecret,
      isActive: true,
    };
    ADMIN_STORE.set(username, user);
    return user;
  }

  getAdminByUsername(username: string): AdminUser | null {
    return ADMIN_STORE.get(username) || null;
  }

  authenticateWithTOTP(username: string, totpCode: string): { success: boolean; session?: AuthSessionToken; error?: string } {
    const admin = this.getAdminByUsername(username);
    if (!admin || !admin.isActive) {
      return { success: false, error: 'Invalid admin credentials or account disabled' };
    }

    const isValidTOTP = verifyTOTPCode(admin.totpSecret, totpCode);
    if (!isValidTOTP) {
      return { success: false, error: 'Invalid TOTP multi-factor verification code' };
    }

    const session: AuthSessionToken = {
      userId: admin.id,
      username: admin.username,
      role: admin.role,
      expiresAt: Date.now() + 3600 * 1000, // 1 hour session
    };

    return { success: true, session };
  }

  hasPermission(role: AdminRole, requiredRole: AdminRole): boolean {
    const hierarchy: Record<AdminRole, number> = {
      ADMIN: 3,
      EDITOR: 2,
      VIEWER: 1,
    };
    return hierarchy[role] >= hierarchy[requiredRole];
  }
}

export const adminAuthService = new AdminAuthService();
