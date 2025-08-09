"use client"

import { Button, CircularProgress, SvgIcon } from "@mui/material"
import { motion } from "framer-motion"
import type { ComponentType } from "react"

interface SocialButtonProps {
  provider: string
  icon: ComponentType
  color: string
  label: string
  loading: boolean
  onClick: () => void
}

export default function SocialButton({ provider, icon: Icon, color, label, loading, onClick }: SocialButtonProps) {
  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <Button
        fullWidth
        variant="outlined"
        size="large"
        disabled={loading}
        onClick={onClick}
        startIcon={loading ? <CircularProgress size={20} /> : <SvgIcon component={Icon} sx={{ color }} />}
        sx={{
          py: 1.5,
          borderRadius: 2,
          borderColor: "rgba(0, 0, 0, 0.12)",
          color: "text.primary",
          backgroundColor: "white",
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.04)",
            borderColor: color,
            transform: "translateY(-2px)",
            boxShadow: `0 4px 12px ${color}20`,
          },
          transition: "all 0.3s ease",
        }}
      >
        المتابعة مع {label}
      </Button>
    </motion.div>
  )
}
