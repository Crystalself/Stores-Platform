'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { User } from '@/models/user';
import { mockAuthService } from '@/services/mockAuthService';
import { useRouter } from 'next/navigation';

interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName?: string;
  lastName?: string;
}

interface OAuthCallbackData {
  code: string;
  state?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (identifier: string, password: string, rememberMe?: boolean) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, password: string) => Promise<void>;
  verifyEmail: (code: string) => Promise<void>;
  verifySMS: (code: string) => Promise<void>;
  resendVerificationEmail: () => Promise<void>;
  resendVerificationSMS: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithFacebook: () => Promise<void>;
  handleOAuthCallback: (data: OAuthCallbackData) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const LOCAL_STORAGE_KEY = 'auth_user';


interface AuthProviderProps {
  children: ReactNode;
}


export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();


  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      try {
        const parsed: User = JSON.parse(stored);
        setUser(parsed);
      } catch {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const saveUser = (user: User) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(user));
    setUser(user);

    // 🔀 توجيه حسب الدور
    if (user.role === 'buyer') {
      router.push('/welcome');
    } else if (user.role === 'seller') {
      router.push('/seller/welcome');
    } else if (user.role === 'admin' || user.role === 'manager') {
      router.push('/manager/welcome');
    }
  };

  const login = async (identifier: string, password: string, rememberMe = false) => {
    const loggedInUser = await mockAuthService.login(identifier, password, rememberMe);
    saveUser(loggedInUser); // يتم التوجيه تلقائياً من داخل saveUser
  };

  const register = async (data: RegisterData) => {
    const registeredUser = await mockAuthService.register(data);
    saveUser(registeredUser); // يتم التوجيه تلقائياً من داخل saveUser
  };

  const logout = async () => {
    await mockAuthService.logout();
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setUser(null);
  };

  const forgotPassword = async (email: string) => {
    await mockAuthService.forgotPassword(email);
  };

  const resetPassword = async (token: string, password: string) => {
    await mockAuthService.resetPassword(token, password);
  };

  const verifyEmail = async (code: string) => {
    await mockAuthService.verifyEmail(code);
    const currentUser = mockAuthService.getCurrentUser();
    if (currentUser) saveUser(currentUser);
  };

  const verifySMS = async (code: string) => {
    await mockAuthService.verifySMS(code);
    const currentUser = mockAuthService.getCurrentUser();
    if (currentUser) saveUser(currentUser);
  };

  const resendVerificationEmail = async () => {
    await mockAuthService.resendVerificationEmail();
  };

  const resendVerificationSMS = async () => {
    await mockAuthService.resendVerificationSMS();
  };

  const loginWithGoogle = async () => {
    await mockAuthService.loginWithGoogle();
  };

  const loginWithFacebook = async () => {
    await mockAuthService.loginWithFacebook();
  };

  const handleOAuthCallback = async (data: OAuthCallbackData) => {
    const user = await mockAuthService.handleOAuthCallback(data);
    if (user?.role !== 'buyer') {
      throw new Error('Only buyer accounts are supported.');
    }
    saveUser(user);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    verifyEmail,
    verifySMS,
    resendVerificationEmail,
    resendVerificationSMS,
    loginWithGoogle,
    loginWithFacebook,
    handleOAuthCallback,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
