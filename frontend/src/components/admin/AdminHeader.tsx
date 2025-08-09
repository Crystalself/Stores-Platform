// components/admin/AdminHeader.tsx
"use client"

import React from "react"
import {
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  Box,
  IconButton,
} from "@mui/material"
import { useAuth } from "@/contexts/AuthContext"

const AdminHeader: React.FC = () => {
  const { user } = useAuth()

  return (
    <AppBar position="static" elevation={0} color="default">
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography variant="h6" fontWeight="bold">
          لوحة تحكم الأدمن
        </Typography>

        <Box display="flex" alignItems="center" gap={2}>
          <Typography variant="body1">
            {user?.firstName} {user?.lastName}
          </Typography>
          <IconButton>
            <Avatar src={user?.profilePic}>
              {user?.firstName?.charAt(0)}
            </Avatar>
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default AdminHeader
