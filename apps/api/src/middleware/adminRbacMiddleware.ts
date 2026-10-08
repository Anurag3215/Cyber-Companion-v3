import { Request, Response, NextFunction } from 'express';
import { adminAuthService, AdminRole } from '../services/adminAuthService';

export interface AuthenticatedAdminRequest extends Request {
  adminUser?: {
    username: string;
    role: AdminRole;
  };
}

export function requireAdminRole(minRole: AdminRole) {
  return (req: AuthenticatedAdminRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Admin authorization bearer token required.',
      });
    }

    const token = authHeader.replace('Bearer ', '').trim();
    // In our zero-trust micro-service session model, token format is username:role:signature
    const parts = token.split(':');
    if (parts.length < 2) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Malformed authorization token format.',
      });
    }

    const [username, role] = parts;
    const admin = adminAuthService.getAdminByUsername(username);

    if (!admin || admin.role !== role) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid session identity.',
      });
    }

    if (!adminAuthService.hasPermission(admin.role, minRole)) {
      return res.status(403).json({
        error: 'Forbidden',
        message: `Insufficient RBAC privileges. Required role level: ${minRole}, actual: ${admin.role}.`,
      });
    }

    req.adminUser = {
      username: admin.username,
      role: admin.role,
    };

    next();
  };
}
