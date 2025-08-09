import { User } from '@/models/user';
import { mockUsers } from '@/lib/mockUsers';


// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export interface LoginCredentials {
  email?: string;
  username?: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName?: string;
  lastName?: string;
}

export interface OAuthCallbackData {
  code: string;
  state?: string;
}

class MockAuthService {
  private currentUser: User | null = null;
  private verificationCodes: Map<string, string> = new Map();

  async login(identifier: string, password: string, rememberMe = false): Promise<User> {
    await delay(1000); // Simulate API call

    // Find user by email or username
    const user = mockUsers.find(u => (u.email === identifier || u.username === identifier) && u.password === password);
    
    if (!user) {
      throw new Error('Invalid username/email or password');
    }

    this.currentUser = { ...user, password: undefined };
    if (rememberMe) {
      localStorage.setItem('rememberedUser', JSON.stringify(this.currentUser));
    } else {
      localStorage.removeItem('rememberedUser');
    }
    return this.currentUser;
  }

  async register(data: RegisterData): Promise<User> {
    await delay(1000);

    if (data.password !== data.confirmPassword) {
      throw new Error('Passwords do not match');
    }

    if (data.password.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }

    const existingUser = mockUsers.find(u => u.email === data.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const newUser: User = {
      id: `user_${Date.now()}`,
      email: data.email,
      firstName: data.firstName || '',
      lastName: data.lastName || '',
      isEmailVerified: false,
      isPhoneVerified: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // In a real app, this would be saved to the database
    mockUsers.push({ ...newUser, password: data.password });
    
    return newUser;
  }

  async logout(): Promise<void> {
    await delay(500);
    this.currentUser = null;
  }

  async forgotPassword(email: string): Promise<void> {
    await delay(1000);

    const user = mockUsers.find(u => u.email === email);
    if (!user) {
      // Don't reveal if user exists or not
      return;
    }

    // In a real app, send reset email
    console.log(`Password reset email sent to ${email}`);
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    await delay(1000);

    if (newPassword.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }

    // In a real app, validate token and update password
    console.log(`Password reset with token: ${token}`);
  }

  async verifyEmail(code: string): Promise<void> {
    await delay(1000);

    const expectedCode = this.verificationCodes.get('email');
    if (code !== expectedCode) {
      throw new Error('Invalid verification code');
    }

    if (this.currentUser) {
      this.currentUser.isEmailVerified = true;
    }
  }

  async verifySMS(code: string): Promise<void> {
    await delay(1000);

    const expectedCode = this.verificationCodes.get('sms');
    if (code !== expectedCode) {
      throw new Error('Invalid verification code');
    }

    if (this.currentUser) {
      this.currentUser.isPhoneVerified = true;
    }
  }

  async resendVerificationEmail(): Promise<void> {
    await delay(1000);
    
    const code = Math.random().toString().slice(2, 8);
    this.verificationCodes.set('email', code);
    
    console.log(`Verification email sent with code: ${code}`);
  }

  async resendVerificationSMS(): Promise<void> {
    await delay(1000);
    
    const code = Math.random().toString().slice(2, 8);
    this.verificationCodes.set('sms', code);
    
    console.log(`Verification SMS sent with code: ${code}`);
  }

  async loginWithGoogle(): Promise<void> {
    await delay(1000);
    
    // In a real app, redirect to Google OAuth
    const googleAuthUrl = `https://accounts.google.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.NEXT_PUBLIC_OAUTH_REDIRECT_URI || '')}&response_type=code&scope=email profile`;
    
    window.location.href = googleAuthUrl;
  }

  async loginWithFacebook(): Promise<void> {
    await delay(1000);
    
    // In a real app, redirect to Facebook OAuth
    const facebookAuthUrl = `https://www.facebook.com/v12.0/dialog/oauth?client_id=${process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.NEXT_PUBLIC_OAUTH_REDIRECT_URI || '')}&response_type=code&scope=email`;
    
    window.location.href = facebookAuthUrl;
  }

  async handleOAuthCallback(data: OAuthCallbackData): Promise<User> {
    await delay(1000);

    // In a real app, exchange code for token and get user info
    const mockOAuthUser: User = {
      id: `oauth_user_${Date.now()}`,
      email: 'oauth@example.com',
      firstName: 'OAuth',
      lastName: 'User',
      isEmailVerified: true,
      isPhoneVerified: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.currentUser = mockOAuthUser;
    return mockOAuthUser;
  }

  getCurrentUser(): User | null {
    // Try to get from localStorage if available
    if (!this.currentUser) {
      const remembered = localStorage.getItem('rememberedUser');
      if (remembered) {
        this.currentUser = JSON.parse(remembered);
      }
    }
    return this.currentUser;
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  // Helper method for testing
  setVerificationCode(type: 'email' | 'sms', code: string): void {
    this.verificationCodes.set(type, code);
  }
}

export const mockAuthService = new MockAuthService(); 