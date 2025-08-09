"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Box, Container } from "@mui/material"
import { useAuth } from "@/contexts/AuthContext"
import AdminSidebar from "@/components/admin/AdminSidebar"
import AdminHeader from "@/components/admin/AdminHeader"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      router.push("/auth/login")
    }
  }, [user, loading, router])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user || user.role !== "admin") {
    return null
  }

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <AdminSidebar />
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <AdminHeader />
        <Box component="main" sx={{ flexGrow: 1, p: 3, bgcolor: "grey.50" }}>
          <Container maxWidth="xl">{children}</Container>
        </Box>
      </Box>
    </Box>
  )
}
