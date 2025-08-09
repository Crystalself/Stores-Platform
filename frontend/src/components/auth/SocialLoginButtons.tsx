"use client"

import { useState } from "react"
import { Box, Button, CircularProgress, SvgIcon, Typography, Divider } from "@mui/material"
import { Google, Facebook, GitHub, Instagram } from "@mui/icons-material"
import { motion } from "framer-motion"
import { signIn } from "next-auth/react"
import type { OAuthProvider } from "@/types/auth"

/**
 * أزرار تسجيل الدخول عبر وسائل التواصل الاجتماعي
 * Social Media Login Buttons Component
 */

const socialProviders: OAuthProvider[] = [
  {
    name: "google",
    displayName: "Google",
    icon: Google,
    color: "#db4437",
  },
  {
    name: "facebook",
    displayName: "Facebook",
    icon: Facebook,
    color: "#4267B2",
  },
  {
    name: "github",
    displayName: "GitHub",
    icon: GitHub,
    color: "#333",
  },
  {
    name: "instagram",
    displayName: "Instagram",
    icon: Instagram,
    color: "#E4405F",
  },
]

interface SocialLoginButtonsProps {
  callbackUrl?: string
  showDivider?: boolean
  dividerText?: string
}

export default function SocialLoginButtons({
  callbackUrl = "/",
  showDivider = true,
  dividerText = "أو المتابعة مع",
}: SocialLoginButtonsProps) {
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null)

  const handleSocialLogin = async (provider: string) => {
    setLoadingProvider(provider)
    try {
      await signIn(provider, { callbackUrl })
    } catch (error) {
      console.error(`فشل في تسجيل الدخول عبر ${provider}:`, error)
    } finally {
      setLoadingProvider(null)
    }
  }

  return (
    <Box>
      {/* الفاصل */}
      {showDivider && (
        <Divider sx={{ my: 4 }}>
          <Typography variant="body2" color="text.secondary">
            {dividerText}
          </Typography>
        </Divider>
      )}

      {/* أزرار وسائل التواصل */}
      <Box display="flex" flexDirection="column" gap={2}>
        {socialProviders.map((provider) => (
          <SocialButton
            key={provider.name}
            provider={provider}
            loading={loadingProvider === provider.name}
            onClick={() => handleSocialLogin(provider.name)}
          />
        ))}
      </Box>
    </Box>
  )
}

interface SocialButtonProps {
  provider: OAuthProvider
  loading: boolean
  onClick: () => void
}

function SocialButton({ provider, loading, onClick }: SocialButtonProps) {
  const Icon = provider.icon

  return (
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <Button
        fullWidth
        variant="outlined"
        size="large"
        disabled={loading}
        onClick={onClick}
        startIcon={
          loading ? <CircularProgress size={20} /> : <SvgIcon component={Icon} sx={{ color: provider.color }} />
        }
        sx={{
          py: 1.5,
          borderRadius: 2,
          borderColor: "rgba(0, 0, 0, 0.12)",
          color: "text.primary",
          backgroundColor: "white",
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.04)",
            borderColor: provider.color,
            transform: "translateY(-2px)",
            boxShadow: `0 4px 12px ${provider.color}20`,
          },
          transition: "all 0.3s ease",
        }}
      >
        المتابعة مع {provider.displayName}
      </Button>
    </motion.div>
  )
}
