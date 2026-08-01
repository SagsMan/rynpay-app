import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface User {
  name: string;
  phone: string;
  balance: number;
  userType: 'personal' | 'agent';
  biometricsEnabled?: boolean;
  avatarColor?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  hasSeenOnboarding: boolean;
  isLoading: boolean;
  login: (phone: string) => Promise<void>;
  signup: (phone: string, userType: 'personal' | 'agent') => Promise<void>;
  logout: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
  updateBalance: (delta: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [ob, ud] = await Promise.all([
          AsyncStorage.getItem('has_seen_onboarding'),
          AsyncStorage.getItem('user_data'),
        ]);
        setHasSeenOnboarding(ob === 'true');
        if (ud) setUser(JSON.parse(ud));
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const login = async (phone: string) => {
    const u: User = { name: 'David', phone, balance: 540248.34, userType: 'personal', biometricsEnabled: true };
    await AsyncStorage.setItem('user_data', JSON.stringify(u));
    setUser(u);
  };

  const signup = async (phone: string, userType: 'personal' | 'agent') => {
    const u: User = { name: 'David', phone, balance: 0, userType, biometricsEnabled: true };
    await AsyncStorage.setItem('user_data', JSON.stringify(u));
    setUser(u);
  };

  const logout = async () => {
    await AsyncStorage.removeItem('user_data');
    setUser(null);
  };

  const completeOnboarding = async () => {
    await AsyncStorage.setItem('has_seen_onboarding', 'true');
    setHasSeenOnboarding(true);
  };

  const updateBalance = (delta: number) => {
    if (!user) return;
    const updated = { ...user, balance: user.balance + delta };
    setUser(updated);
    AsyncStorage.setItem('user_data', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{
      user, isAuthenticated: !!user, hasSeenOnboarding,
      isLoading, login, signup, logout, completeOnboarding, updateBalance,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
