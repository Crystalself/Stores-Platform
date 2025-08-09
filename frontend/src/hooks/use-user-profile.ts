"use client"

import { useState } from "react"
import type { User, UserSession, UpdateUserData, ChangePasswordData } from "@/types/user"

// Mock user data
const mockUser: User = {
  id: 1,
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+1234567890",
  first_name: "John",
  last_name: "Doe",
  profile_pic: "https://api.dicebear.com/7.x/initials/svg?seed=John Doe",
  bank_name: "Chase Bank",
  bank_account: "****1234",
  type: "customer",
  verified: true,
  restricted: false,
  created_at: "2024-01-15T10:30:00Z",
  updated_at: "2025-08-01T14:20:00Z",
}

// Mock sessions data
const mockSessions: UserSession[] = [
  {
    id: 1,
    user_id: 1,
    ip: "192.168.1.100",
    info: {
      country: "United States",
      city: "New York",
      browser: "Chrome 120",
      os: "Windows 11",
    },
    trusted: true,
    created_at: "2025-08-01T14:20:00Z",
    updated_at: "2025-08-01T14:20:00Z",
  },
  {
    id: 2,
    user_id: 1,
    ip: "192.168.1.101",
    info: {
      country: "United States",
      city: "New York",
      browser: "Safari 17",
      os: "macOS Sonoma",
    },
    trusted: false,
    created_at: "2025-07-28T09:15:00Z",
    updated_at: "2025-07-28T09:15:00Z",
  },
  {
    id: 3,
    user_id: 1,
    ip: "10.0.0.50",
    info: {
      country: "United States",
      city: "Los Angeles",
      browser: "Firefox 121",
      os: "Ubuntu 22.04",
    },
    trusted: false,
    created_at: "2025-07-25T16:45:00Z",
    updated_at: "2025-07-25T16:45:00Z",
  },
]

export function useUserProfile() {
  const [user, setUser] = useState<User>(mockUser)
  const [sessions, setSessions] = useState<UserSession[]>(mockSessions)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateProfile = async (data: UpdateUserData) => {
    setLoading(true)
    setError(null)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // TODO: Replace with actual API call
      // const response = await fetch('/api/user/profile', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data)
      // })

      setUser((prev) => ({
        ...prev,
        ...data,
        updated_at: new Date().toISOString(),
      }))

      return { success: true, message: "Profile updated successfully" }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update profile"
      setError(errorMessage)
      return { success: false, message: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const changePassword = async (data: ChangePasswordData) => {
    setLoading(true)
    setError(null)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // TODO: Replace with actual API call
      // const response = await fetch('/api/user/change-password', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     old_password: data.old_password,
      //     new_password: data.new_password
      //   })
      // })

      return { success: true, message: "Password changed successfully" }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to change password"
      setError(errorMessage)
      return { success: false, message: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const updateProfilePicture = async (file: File) => {
    setLoading(true)
    setError(null)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // TODO: Replace with actual API call
      // const formData = new FormData()
      // formData.append('pic', file)
      // const response = await fetch('/api/user/profile-picture', {
      //   method: 'POST',
      //   body: formData
      // })

      // Mock new profile picture URL
      const newProfilePic = `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}&timestamp=${Date.now()}`

      setUser((prev) => ({
        ...prev,
        profile_pic: newProfilePic,
        updated_at: new Date().toISOString(),
      }))

      return { success: true, message: "Profile picture updated successfully" }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update profile picture"
      setError(errorMessage)
      return { success: false, message: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const terminateSession = async (sessionId: number) => {
    setLoading(true)
    setError(null)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      // TODO: Replace with actual API call
      // const response = await fetch(`/api/user/sessions/${sessionId}`, {
      //   method: 'DELETE'
      // })

      setSessions((prev) => prev.filter((session) => session.id !== sessionId))

      return { success: true, message: "Session terminated successfully" }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to terminate session"
      setError(errorMessage)
      return { success: false, message: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const terminateAllSessions = async () => {
    setLoading(true)
    setError(null)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // TODO: Replace with actual API call
      // const response = await fetch('/api/user/sessions/terminate-all', {
      //   method: 'DELETE'
      // })

      // Keep only the current session (first one)
      setSessions((prev) => prev.slice(0, 1))

      return { success: true, message: "All other sessions terminated successfully" }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to terminate sessions"
      setError(errorMessage)
      return { success: false, message: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  return {
    user,
    sessions,
    loading,
    error,
    updateProfile,
    changePassword,
    updateProfilePicture,
    terminateSession,
    terminateAllSessions,
  }
}
