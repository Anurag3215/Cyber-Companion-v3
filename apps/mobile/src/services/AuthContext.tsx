import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Storage } from '../storage/StorageAdapter';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  securityScore: number;
  streakDays: number;
  tier: 'STANDARD' | 'PRO_SENTINEL' | 'ENTERPRISE';
  joinedDate: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (name: string, email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  loginAsGuest: () => void;
  signOut: () => Promise<void>;
  updateScore: (newScore: number) => void;
}

const DEFAULT_USER: UserProfile = {
  id: 'usr-9281',
  name: 'Arun V.',
  email: 'arun@cybercompanion.io',
  avatar: '🛡️',
  securityScore: 78,
  streakDays: 5,
  tier: 'PRO_SENTINEL',
  joinedDate: 'October 2026',
};

const AuthContext = createContext<AuthContextType>({
  user: DEFAULT_USER,
  isAuthenticated: true,
  isLoading: false,
  signIn: async () => ({ success: true }),
  signUp: async () => ({ success: true }),
  loginAsGuest: () => {},
  signOut: async () => {},
  updateScore: () => {},
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(DEFAULT_USER);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    // Check persisted auth session
    const checkSession = async () => {
      try {
        const stored = await Storage.getItem('cyber_user_session');
        if (stored) {
          const parsed = JSON.parse(stored);
          setUser(parsed);
          setIsAuthenticated(true);
        }
      } catch (_e) {
        // Fallback to default user
        setUser(DEFAULT_USER);
        setIsAuthenticated(true);
      }
    };
    checkSession();
  }, []);

  const signIn = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    // Simulate real auth handshake
    await new Promise((resolve) => setTimeout(resolve, 600));
    setIsLoading(false);

    if (!email || !pass) {
      return { success: false, error: 'Email and password are required' };
    }

    if (pass.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters' };
    }

    const signedInUser: UserProfile = {
      id: 'usr-' + Math.floor(1000 + Math.random() * 9000),
      name: email.split('@')[0] || 'User',
      email,
      avatar: '🛡️',
      securityScore: 82,
      streakDays: 3,
      tier: 'PRO_SENTINEL',
      joinedDate: 'Today',
    };

    setUser(signedInUser);
    setIsAuthenticated(true);
    await Storage.setItem('cyber_user_session', JSON.stringify(signedInUser));
    return { success: true };
  };

  const signUp = async (name: string, email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 700));
    setIsLoading(false);

    if (!name || !email || !pass) {
      return { success: false, error: 'All fields are required' };
    }

    if (!email.includes('@')) {
      return { success: false, error: 'Please enter a valid email address' };
    }

    const newUser: UserProfile = {
      id: 'usr-' + Math.floor(1000 + Math.random() * 9000),
      name,
      email,
      avatar: '🛡️',
      securityScore: 70,
      streakDays: 1,
      tier: 'STANDARD',
      joinedDate: 'October 2026',
    };

    setUser(newUser);
    setIsAuthenticated(true);
    await Storage.setItem('cyber_user_session', JSON.stringify(newUser));
    return { success: true };
  };

  const loginAsGuest = () => {
    const guestUser: UserProfile = {
      id: 'guest-preview',
      name: 'Guest Sentinel',
      email: 'guest@cybercompanion.local',
      avatar: '👤',
      securityScore: 75,
      streakDays: 1,
      tier: 'STANDARD',
      joinedDate: 'Active Session',
    };
    setUser(guestUser);
    setIsAuthenticated(true);
  };

  const signOut = async () => {
    setUser(null);
    setIsAuthenticated(false);
    await Storage.removeItem('cyber_user_session');
  };

  const updateScore = (newScore: number) => {
    if (user) {
      const updated = { ...user, securityScore: newScore };
      setUser(updated);
      Storage.setItem('cyber_user_session', JSON.stringify(updated)).catch(() => {});
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        signIn,
        signUp,
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
