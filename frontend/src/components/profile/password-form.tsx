"use client"

import { useState } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  TextField,
  Button,
  Box,
  Typography,
  Divider,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
} from "@mui/material"
import {
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Security as SecurityIcon,
} from "@mui/icons-material"
import { useTranslations } from "next-intl"
import { useForm, Controller } from "react-hook-form"
import type { ChangePasswordData } from "@/types/user"

interface PasswordFormProps {
  onChangePassword: (data: ChangePasswordData) => Promise<{ success: boolean; message: string }>
  loading?: boolean
}

export function PasswordForm({ onChangePassword, loading }: PasswordFormProps) {
  const t = useTranslations("profile")
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
    if (password.length >= 8) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[a-z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++

    const levels = ["Very Weak", "Weak", "Fair", "Good", "Strong"]
    const colors = ["error", "error", "warning", "info", "success"] as const

    return { level: levels[strength] || "Very Weak", color: colors[strength] || "error", score: strength }
  }

  const passwordStrength = getPasswordStrength(newPassword || "")

  return (
    <Card elevation={2}>
      <CardHeader
        title={
          <Box display="flex" alignItems="center" gap={1}>
            <SecurityIcon color="primary" />
            <Typography variant="h6">{t("changePassword")}</Typography>
          </Box>
        }
      />
      <Divider />
      <CardContent>
        {changeResult && (
          <Alert severity={changeResult.success ? "success" : "error"} sx={{ mb: 3 }}>
            {changeResult.message}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <Box display="flex" flexDirection="column" gap={3}>
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
                          <LockIcon color="action" />
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
                  />
                  {field.value && (
                    <Box mt={1}>
                      <Typography variant="caption" color={`${passwordStrength.color}.main`}>
                        {t("passwordStrength")}: {passwordStrength.level}
                      </Typography>
                      <Box
                        sx={{
                          width: "100%",
                          height: 4,
                          backgroundColor: "grey.200",
                          borderRadius: 2,
                          mt: 0.5,
                        }}
                      >
                        <Box
                          sx={{
                            width: `${(passwordStrength.score / 5) * 100}%`,
                            height: "100%",
                            backgroundColor: `${passwordStrength.color}.main`,
                            borderRadius: 2,
                            transition: "all 0.3s ease",
                          }}
                        />
                      </Box>
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
                />
              )}
            />

            {/* Submit Button */}
            <Box display="flex" justifyContent="flex-end" mt={2}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <SecurityIcon />}
                sx={{ minWidth: 160 }}
              >
                {loading ? t("changing") : t("changePassword")}
              </Button>
            </Box>
          </Box>
        </form>
      </CardContent>
    </Card>
  )
}
