export const authConfig = {
  // OAuth Providers
  google: {
    clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    redirectUri: process.env.NEXT_PUBLIC_OAUTH_REDIRECT_URI || 'http://localhost:3000/auth/oauth/callback',
    scope: 'email profile',
    authUrl: 'https://accounts.google.com/oauth/authorize',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    userInfoUrl: 'https://www.googleapis.com/oauth2/v2/userinfo',
  },
  
  facebook: {
    clientId: process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_ID || '',
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET || '',
    redirectUri: process.env.NEXT_PUBLIC_OAUTH_REDIRECT_URI || 'http://localhost:3000/auth/oauth/callback',
    scope: 'email',
    authUrl: 'https://www.facebook.com/v12.0/dialog/oauth',
    tokenUrl: 'https://graph.facebook.com/v12.0/oauth/access_token',
    userInfoUrl: 'https://graph.facebook.com/me',
  },

  // JWT Configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: '7d',
    refreshExpiresIn: '30d',
  },

  // Password Policy
  password: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
  },

  // Verification
  verification: {
    emailCodeLength: 6,
    smsCodeLength: 6,
    emailExpiryMinutes: 10,
    smsExpiryMinutes: 5,
  },

  // Rate Limiting
  rateLimit: {
    loginAttempts: 5,
    loginWindowMinutes: 15,
    passwordResetAttempts: 3,
    passwordResetWindowMinutes: 60,
  },
};

export type AuthConfig = typeof authConfig; 