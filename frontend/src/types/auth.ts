import type React from "react"
/**
 * أنواع البيانات المتعلقة بالمصادقة والمستخدمين
 * Authentication and User Data Types
 */

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone: string
  profilePic?: string
  role: "customer" | "seller" | "admin"
  isVerified: boolean
  credits: number
  createdAt: string
  updatedAt: string
}

export interface AuthSession {
  user: User
  accessToken: string
  refreshToken: string
  expiresAt: string
}

export interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

export interface RegisterData {
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
  confirmPassword: string
  acceptTerms: boolean
}

export interface OAuthProvider {
  name: string
  displayName: string
  icon: React.ComponentType
  color: string
}

export interface PasswordResetData {
  email: string
}

export interface PasswordUpdateData {
  token: string
  password: string
  confirmPassword: string
}

export interface OTPVerificationData {
  otp: string
  email: string
}
