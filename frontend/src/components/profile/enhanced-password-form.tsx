"use client"

import { useState } from "react"
import {
  TextField,
  Button,
  Box,
  Typography,
  Divider,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  LinearProgress,
  useMediaQuery,
  useTheme as useMuiTheme,
} from "@mui/material"
import {
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Security as SecurityIcon,
  Shield as ShieldIcon,
} from "@mui/icons-material"
import { useTranslations } from "next-intl"
import { useForm, Controller } from "react-hook-form"
import { GlassCard } from "../ui/glass-card"
import type { ChangePasswordData } from "@/types/user"

interface EnhancedPasswordFormProps {
  onChangePassword: (data: ChangePasswordData) => Promise<{ success: boolean; message: string }>
  loading?: boolean
}

export function EnhancedPasswordForm({ onChangePassword, loading }: EnhancedPasswordFormProps) {
  const t = useTranslations("profile")
  const muiTheme = useMuiTheme()
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("md"))
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false,
  })
  const [changeResult, setChangeResult] = useState<{ success: boolean; message: string } | null>(null)

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ChangePasswordData>({
    defaultValues: {
      old_password: "",
      new_password: "",
      confirm_password: "",
    },
  })

  const newPassword = watch("new_password")

  const onSubmit = async (data: ChangePasswordData) => {
    const result = await onChangePassword(data)
    setChangeResult(result)

    if (result.success) {
      reset()
      setTimeout(() => setChangeResult(null), 5000)
    }
  }

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }))
  }

  const getPasswordStrength = (password: string) => {
    let strength = 0
    const checks = [
      password.length >= 8,
      /[A-Z]/.test(password),
      /[a-z]/.test(password),
      /[0-9]/.test(password),
      /[^A-Za-z0-9]/.test(password),
    ]

    strength = checks.filter(Boolean).length

    const levels = [
      { text: "Very Weak", color: "error" },
      { text: "Weak", color: "error" },
      { text: "Fair", color: "warning" },
      { text: "Good", color: "info" },
      { text: "Strong", color: "success" },
    ] as const

    return {
      level: levels[strength]?.text || "Very Weak",
      color: levels[strength]?.color || "error",
      score: strength,
      percentage: (strength / 5) * 100,
    }
  }

  const passwordStrength = getPasswordStrength(newPassword || "")

  return (
    <GlassCard>
      {/* Header */}
      <Box
        sx={{
          p: 3,
          pb: 2,
          background: "linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(245, 158, 11, 0.1) 100%)",
          borderRadius: "16px 16px 0 0",
        }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <SecurityIcon color="primary" sx={{ fontSize: 28 }} />
          <Typography variant="h5" fontWeight="bold">
            {t("changePassword")}
          </Typography>
        </Box>
      </Box>

      <Divider />

      <Box sx={{ p: 3 }}>
        {changeResult && (
          <Alert
            severity={changeResult.success ? "success" : "error"}
            sx={{
              mb: 3,
              borderRadius: 2,
              "& .MuiAlert-message": {
                fontWeight: 500,
              },
            }}
          >
            {changeResult.message}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <Box display="flex" flexDirection="column" gap={4}>
            {/* Current Password */}
            <Controller
              name="old_password"
              control={control}
              rules={{ required: t("currentPasswordRequired") }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  type={showPasswords.old ? "text" : "password"}
                  label={t("currentPassword")}
                  error={!!errors.old_password}
                  helperText={errors.old_password?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => togglePasswordVisibility("old")} edge="end">
                          {showPasswords.old ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "rgba(239, 68, 68, 0.05)",
                    },
                  }}
                />
              )}
            />

            {/* New Password */}
            <Controller
              name="new_password"
              control={control}
              rules={{
                required: t("newPasswordRequired"),
                minLength: {
                  value: 8,
                  message: t("passwordMinLength"),
                },
              }}
              render={({ field }) => (
                <Box>
                  <TextField
                    {...field}
                    fullWidth
                    type={showPasswords.new ? "text" : "password"}
                    label={t("newPassword")}
                    error={!!errors.new_password}
                    helperText={errors.new_password?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <ShieldIcon color="action" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => togglePasswordVisibility("new")} edge="end">
                            {showPasswords.new ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "rgba(16, 185, 129, 0.05)",
                      },
                    }}
                  />
                  {field.value && (
                    <Box mt={2} p={2} sx={{ backgroundColor: "rgba(102, 126, 234, 0.05)", borderRadius: 2 }}>
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                        <Typography variant="body2" fontWeight={500}>
                          {t("passwordStrength")}:
                        </Typography>
                        <Typography variant="body2" color={`${passwordStrength.color}.main`} fontWeight="bold">
                          {passwordStrength.level}
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={passwordStrength.percentage}
                        color={passwordStrength.color}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: "rgba(0, 0, 0, 0.1)",
                        }}
                      />
                    </Box>
                  )}
                </Box>
              )}
            />

            {/* Confirm Password */}
            <Controller
              name="confirm_password"
              control={control}
              rules={{
                required: t("confirmPasswordRequired"),
                validate: (value) => value === newPassword || t("passwordsDoNotMatch"),
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  type={showPasswords.confirm ? "text" : "password"}
                  label={t("confirmPassword")}
                  error={!!errors.confirm_password}
                  helperText={errors.confirm_password?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => togglePasswordVisibility("confirm")} edge="end">
                          {showPasswords.confirm ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: "rgba(59, 130, 246, 0.05)",
                    },
                  }}
                />
              )}
            />

            {/* Submit Button */}
            <Box display="flex" justifyContent={isMobile ? "center" : "flex-end"} mt={2}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <SecurityIcon />}
                sx={{
                  minWidth: 180,
                  py: 1.5,
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                  background: "linear-gradient(135deg, #ef4444 0%, #f59e0b 100%)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #dc2626 0%, #d97706 100%)",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                {loading ? t("changing") : t("changePassword")}
              </Button>
            </Box>
          </Box>
        </form>
      </Box>
    </GlassCard>
  )
}
