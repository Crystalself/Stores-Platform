import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import FacebookProvider from "next-auth/providers/facebook"
import GitHubProvider from "next-auth/providers/github"
import InstagramProvider from "next-auth/providers/instagram"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("البريد الإلكتروني وكلمة المرور مطلوبان")
        }

        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/user/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: credentials.email,
              password: credentials.password,
            }),
          })

          if (!response.ok) {
            const error = await response.json()
            throw new Error(error.message || "فشل في تسجيل الدخول")
          }

          const data = await response.json()
          return {
            id: data.user.id.toString(),
            email: data.user.email,
            name: `${data.user.firstName} ${data.user.lastName}`,
            image: data.user.profilePic,
            role: data.user.role,
            token: data.token,
          }
        } catch (error) {
          console.error("Auth error:", error)
          throw error
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    InstagramProvider({
      clientId: process.env.INSTAGRAM_CLIENT_ID!,
      clientSecret: process.env.INSTAGRAM_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/auth/login",
    signUp: "/auth/register",
    error: "/auth/error",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user) {
        token.accessToken = account.access_token
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string
      session.user.role = token.role as string
      return session
    },
    async signIn({ user, account, profile }) {
      if (account?.provider !== "credentials") {
        // Handle OAuth sign in
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/user/auth/${account?.provider}/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: user.email,
              name: user.name,
              image: user.image,
              provider: account?.provider,
              providerId: account?.providerAccountId,
            }),
          })

          if (response.ok) {
            const data = await response.json()
            user.role = data.user.role
            return true
          }
        } catch (error) {
          console.error("OAuth sign in error:", error)
          return false
        }
      }
      return true
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
}

export interface AuthUser {
  id: string
  email: string
  name: string
  image?: string
  role: string
}

export interface RegisterData {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
  phone: string
  acceptTerms: boolean
}

export const authService = {
  async register(data: RegisterData) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/user/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "فشل في إنشاء الحساب")
    }

    return response.json()
  },

  async forgotPassword(email: string) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/user/auth/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "فشل في إرسال رابط إعادة تعيين كلمة المرور")
    }

    return response.json()
  },

  async resetPassword(token: string, password: string) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/user/auth/update-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token, password }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "فشل في إعادة تعيين كلمة المرور")
    }

    return response.json()
  },

  async verifyOTP(otp: string) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/user/auth/check-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ otp }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "رمز التحقق غير صحيح")
    }

    return response.json()
  },
}
