import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Storage } from '../storage/StorageAdapter';

export type UserRole = 'USER' | 'ADMIN';

export interface AdminPrivileges {
  canManageRules: boolean;
  canViewTelemetry: boolean;
  canFlushCache: boolean;
  canConfigureGateway: boolean;
}

export interface UserProfile {
  id: string;
  username: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  securityScore: number;
  streakDays: number;
  tier: 'STANDARD' | 'PRO_SENTINEL' | 'ENTERPRISE_ADMIN';
  joinedDate: string;
  adminPrivileges?: AdminPrivileges;
}

export interface AuthValidationResult {
  success: boolean;
  error?: string;
  fieldErrors?: {
    username?: string;
    email?: string;
    password?: string;
    role?: string;
  };
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  role: UserRole;
  isAdmin: boolean;
  signIn: (identifier: string, pass: string, requestedRole?: UserRole) => Promise<AuthValidationResult>;
  signUp: (name: string, username: string, email: string, pass: string, role?: UserRole) => Promise<AuthValidationResult>;
  switchRole: (newRole: UserRole) => Promise<void>;
  loginAsGuest: () => void;
  signOut: () => Promise<void>;
  updateScore: (newScore: number) => void;
}

export const DEFAULT_USER: UserProfile = {
  id: 'usr-arun-01',
  username: 'arun',
  name: 'Arun',
  email: 'arun@cybercompanion.io',
  role: 'USER',
  avatar: '🛡️',
  securityScore: 88,
  streakDays: 7,
  tier: 'PRO_SENTINEL',
  joinedDate: 'October 2026',
  adminPrivileges: {
    canManageRules: false,
    canViewTelemetry: false,
    canFlushCache: false,
    canConfigureGateway: false,
  },
};

export const ADMIN_USER: UserProfile = {
  id: 'adm-arun-root',
  username: 'arun',
  name: 'Arun (Administrator)',
  email: 'arun.admin@cybercompanion.io',
  role: 'ADMIN',
  avatar: '👑',
  securityScore: 98,
  streakDays: 14,
  tier: 'ENTERPRISE_ADMIN',
  joinedDate: 'October 2026',
  adminPrivileges: {
    canManageRules: true,
    canViewTelemetry: true,
    canFlushCache: true,
    canConfigureGateway: true,
  },
};

const STORAGE_KEY_AUTH = '@cyber_companion_auth_session_v2';

const AuthContext = createContext<AuthContextType>({
  user: DEFAULT_USER,
  isAuthenticated: true,
  isLoading: false,
  role: 'USER',
  isAdmin: false,
  signIn: async () => ({ success: true }),
  signUp: async () => ({ success: true }),
  switchRole: async () => {},
  loginAsGuest: () => {},
  signOut: async () => {},
  updateScore: () => {},
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(DEFAULT_USER);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    // Check persisted auth session from local storage
    const checkSession = async () => {
      try {
        const stored = await Storage.getItem(STORAGE_KEY_AUTH);
        if (stored) {
          const parsed = JSON.parse(stored) as UserProfile;
          if (parsed && parsed.username) {
            setUser(parsed);
            setIsAuthenticated(true);
            return;
          }
        }
      } catch {
        // Fallback to default user Arun
      }
      setUser(DEFAULT_USER);
      setIsAuthenticated(true);
    };
    checkSession();
  }, []);

  const validateCredentials = (
    identifier: string,
    pass: string
  ): { valid: boolean; errors: { username?: string; password?: string } } => {
    const errors: { username?: string; password?: string } = {};
    const trimmedId = (identifier || '').trim();
    const trimmedPass = (pass || '').trim();

    if (!trimmedId) {
      errors.username = 'Username or email is required';
    } else if (trimmedId.length < 3) {
      errors.username = 'Username must be at least 3 characters';
    }

    if (!trimmedPass) {
      errors.password = 'Password is required';
    } else if (trimmedPass.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors,
    };
  };

  const signIn = async (
    identifier: string,
    pass: string,
    requestedRole: UserRole = 'USER'
  ): Promise<AuthValidationResult> => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 400));
    setIsLoading(false);

    const validation = validateCredentials(identifier, pass);
    if (!validation.valid) {
      return {
        success: false,
        error: Object.values(validation.errors)[0],
        fieldErrors: validation.errors,
      };
    }

    const trimmedId = identifier.trim().toLowerCase();
    const isAdminLogin = requestedRole === 'ADMIN' || trimmedId === 'admin' || trimmedId.includes('admin');

    const authenticatedUser: UserProfile = isAdminLogin
      ? {
          ...ADMIN_USER,
          name: trimmedId === 'admin' ? 'Administrator' : 'Arun (Administrator)',
          username: trimmedId === 'admin' ? 'admin' : 'arun',
          email: trimmedId.includes('@') ? identifier.trim() : 'arun.admin@cybercompanion.io',
          role: 'ADMIN',
        }
      : {
          ...DEFAULT_USER,
          name: trimmedId === 'arun' ? 'Arun' : trimmedId.split('@')[0],
          username: trimmedId.includes('@') ? trimmedId.split('@')[0] : trimmedId,
          email: trimmedId.includes('@') ? identifier.trim() : `${trimmedId}@cybercompanion.io`,
          role: 'USER',
        };

    setUser(authenticatedUser);
    setIsAuthenticated(true);
    await Storage.setItem(STORAGE_KEY_AUTH, JSON.stringify(authenticatedUser));

    return { success: true };
  };

  const signUp = async (
    name: string,
    username: string,
    email: string,
    pass: string,
    role: UserRole = 'USER'
  ): Promise<AuthValidationResult> => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsLoading(false);

    const errors: { username?: string; email?: string; password?: string } = {};

    if (!name || name.trim().length < 2) {
      errors.username = 'Full name must be at least 2 characters';
    }
    if (!username || username.trim().length < 3) {
      errors.username = 'Username must be at least 3 characters';
    }
    if (!email || !email.includes('@') || !email.includes('.')) {
      errors.email = 'Valid email address is required';
    }
    if (!pass || pass.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (Object.keys(errors).length > 0) {
      return {
        success: false,
        error: Object.values(errors)[0],
        fieldErrors: errors,
      };
    }

    const isAdmin = role === 'ADMIN';
    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      username: username.trim().toLowerCase(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role,
      avatar: isAdmin ? '👑' : '🛡️',
      securityScore: isAdmin ? 95 : 80,
      streakDays: 1,
      tier: isAdmin ? 'ENTERPRISE_ADMIN' : 'PRO_SENTINEL',
      joinedDate: 'October 2026',
      adminPrivileges: {
        canManageRules: isAdmin,
        canViewTelemetry: isAdmin,
        canFlushCache: isAdmin,
        canConfigureGateway: isAdmin,
      },
    };

    setUser(newUser);
    setIsAuthenticated(true);
    await Storage.setItem(STORAGE_KEY_AUTH, JSON.stringify(newUser));

    return { success: true };
  };

  const switchRole = async (newRole: UserRole) => {
    if (!user) return;
    const updated: UserProfile =
      newRole === 'ADMIN'
        ? {
            ...user,
            role: 'ADMIN',
            name: user.name.includes('Admin') ? user.name : `${user.name} (Admin)`,
            avatar: '👑',
            tier: 'ENTERPRISE_ADMIN',
            adminPrivileges: {
              canManageRules: true,
              canViewTelemetry: true,
              canFlushCache: true,
              canConfigureGateway: true,
            },
          }
        : {
            ...user,
            role: 'USER',
            name: user.name.replace(/\s*\(Admin\)/i, ''),
            avatar: '🛡️',
            tier: 'PRO_SENTINEL',
            adminPrivileges: {
              canManageRules: false,
              canViewTelemetry: false,
              canFlushCache: false,
              canConfigureGateway: false,
            },
          };

    setUser(updated);
    await Storage.setItem(STORAGE_KEY_AUTH, JSON.stringify(updated));
  };

  const loginAsGuest = () => {
    const guestUser: UserProfile = {
      id: 'guest-session',
      username: 'guest',
      name: 'Guest Sentinel',
      email: 'guest@cybercompanion.local',
      role: 'USER',
      avatar: '👤',
      securityScore: 75,
      streakDays: 1,
      tier: 'STANDARD',
      joinedDate: 'Active Session',
      adminPrivileges: {
        canManageRules: false,
        canViewTelemetry: false,
        canFlushCache: false,
        canConfigureGateway: false,
      },
    };
    setUser(guestUser);
    setIsAuthenticated(true);
  };

  const signOut = async () => {
    setUser(null);
    setIsAuthenticated(false);
    await Storage.removeItem(STORAGE_KEY_AUTH);
  };

  const updateScore = (newScore: number) => {
    if (user) {
      const updated = { ...user, securityScore: newScore };
      setUser(updated);
      Storage.setItem(STORAGE_KEY_AUTH, JSON.stringify(updated)).catch(() => {});
    }
  };

  const role: UserRole = user?.role || 'USER';
  const isAdmin = role === 'ADMIN';

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        role,
        isAdmin,
        signIn,
        signUp,
        switchRole,
        loginAsGuest,
        signOut,
        updateScore,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
