"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { SessionProvider, useSession, signIn, signOut } from "next-auth/react"
import type { User, AuthSession } from "@/types/auth"

/**
 * مزود السياق للمصادقة - يدير حالة المستخدم والجلسة
 * Authentication Context Provider - Manages user state and session
 */

interface AuthContextType {
  user: User | null
  session: AuthSession | null
  loading: boolean
  isAuthenticated: boolean
  login: (credentials: any) => Promise<void>
  logout: () => Promise<void>
  updateUser: (userData: Partial<User>) => void
  refreshSession: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

function AuthProviderInner({ children }: AuthProviderProps) {
  const { data: session, status } = useSession()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // تحديث بيانات المستخدم عند تغيير الجلسة
  useEffect(() => {
    if (status === "loading") {
      setLoading(true)
      return
    }

    if (session?.user) {
      // تحويل بيانات الجلسة إلى نموذج المستخدم
      const userData: User = {
        id: session.user.id || "",
        email: session.user.email || "",
        firstName: session.user.name?.split(" ")[0] || "",
        lastName: session.user.name?.split(" ").slice(1).join(" ") || "",
        phone: "",
        profilePic: session.user.image || undefined,
        role: (session.user as any).role || "customer",
        isVerified: true,
        credits: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setUser(userData)
    } else {
      setUser(null)
    }

    setLoading(false)
  }, [session, status])

  const login = async (credentials: any) => {
    setLoading(true)
    try {
      const result = await signIn("credentials", {
        ...credentials,
        redirect: false,
      })

      if (result?.error) {
        throw new Error(result.error)
      }
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    setLoading(true)
    try {
      await signOut({ redirect: false })
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData })
    }
  }

  const refreshSession = async () => {
    // إعادة تحديث الجلسة من الخادم
    window.location.reload()
  }

  const value: AuthContextType = {
    user,
    session: session as AuthSession | null,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
    updateUser,
    refreshSession,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function AuthProvider({ children }: AuthProviderProps) {
  return (
    <SessionProvider>
      <AuthProviderInner>{children}</AuthProviderInner>
    </SessionProvider>
  )
}
