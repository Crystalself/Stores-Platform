"use client"

import { useState } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  TextField,
  Button,
  Grid,
  Box,
  Typography,
  Divider,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
} from "@mui/material"
import {
  Person as PersonIcon,
  Phone as PhoneIcon,
  AccountBalance as BankIcon,
  Save as SaveIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material"
import { useTranslations } from "next-intl"
import { useForm, Controller } from "react-hook-form"
import type { User, UpdateUserData, ProfileFormData } from "@/types/user"

interface ProfileFormProps {
  user: User
  onUpdate: (data: UpdateUserData) => Promise<{ success: boolean; message: string }>
  loading?: boolean
}

export function ProfileForm({ user, onUpdate, loading }: ProfileFormProps) {
  const t = useTranslations("profile")
  const [updateResult, setUpdateResult] = useState<{ success: boolean; message: string } | null>(null)

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    defaultValues: {
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      phone: user.phone || "",
      bank_name: user.bank_name || "",
      bank_account: user.bank_account || "",
    },
  })

  const onSubmit = async (data: ProfileFormData) => {
    const result = await onUpdate(data)
    setUpdateResult(result)

    if (result.success) {
      setTimeout(() => setUpdateResult(null), 5000)
    }
  }

  const handleReset = () => {
    reset({
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      phone: user.phone || "",
      bank_name: user.bank_name || "",
      bank_account: user.bank_account || "",
    })
    setUpdateResult(null)
  }

  return (
    <Card elevation={2}>
      <CardHeader
        title={
          <Box display="flex" alignItems="center" gap={1}>
            <PersonIcon color="primary" />
            <Typography variant="h6">{t("personalInformation")}</Typography>
          </Box>
        }
        action={
          <IconButton onClick={handleReset} disabled={!isDirty || loading}>
            <RefreshIcon />
          </IconButton>
        }
      />
      <Divider />
      <CardContent>
        {updateResult && (
          <Alert severity={updateResult.success ? "success" : "error"} sx={{ mb: 3 }}>
            {updateResult.message}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            {/* Personal Information */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight="bold" color="primary" gutterBottom>
                {t("basicInfo")}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="first_name"
                control={control}
                rules={{ required: t("firstNameRequired") }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label={t("firstName")}
                    error={!!errors.first_name}
                    helperText={errors.first_name?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="last_name"
                control={control}
                rules={{ required: t("lastNameRequired") }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label={t("lastName")}
                    error={!!errors.last_name}
                    helperText={errors.last_name?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="phone"
                control={control}
                rules={{
                  required: t("phoneRequired"),
                  pattern: {
                    value: /^[+]?[\d\s\-()]+$/,
                    message: t("phoneInvalid"),
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label={t("phone")}
                    error={!!errors.phone}
                    helperText={errors.phone?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </Grid>

            {/* Banking Information */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" fontWeight="bold" color="primary" gutterBottom>
                {t("bankingInfo")}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="bank_name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label={t("bankName")}
                    error={!!errors.bank_name}
                    helperText={errors.bank_name?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <BankIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Controller
                name="bank_account"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label={t("bankAccount")}
                    error={!!errors.bank_account}
                    helperText={errors.bank_account?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <BankIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={!isDirty || loading}
                  startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                  sx={{ minWidth: 140 }}
                >
                  {loading ? t("saving") : t("saveChanges")}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}
