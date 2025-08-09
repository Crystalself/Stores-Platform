// components/admin/StatCard.tsx
"use client"

import React from "react"
import { Paper, Typography, Box } from "@mui/material"
import { SxProps, Theme } from "@mui/system"

interface StatCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  color?: "primary" | "secondary" | "success" | "error" | "info" | "warning"
  sx?: SxProps<Theme>
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color = "primary", sx }) => {
  return (
    <Paper
      elevation={3}
      sx={{
        display: "flex",
        alignItems: "center",
        p: 3,
        gap: 2,
        height: "100%",
        ...sx,
      }}
    >
      <Box
        sx={{
          bgcolor: `${color}.main`,
          color: "white",
          p: 1.5,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 28,
        }}
      >
        {icon}
      </Box>

      <Box>
        <Typography variant="h6" fontWeight="bold">
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {title}
        </Typography>
      </Box>
    </Paper>
  )
}

export default StatCard
