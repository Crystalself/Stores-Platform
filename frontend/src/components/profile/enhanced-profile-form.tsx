"use client"

import { useState } from "react"
import {
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
  Collapse,
  useMediaQuery,
  useTheme as useMuiTheme,
} from "@mui/material"
import {
  Person as PersonIcon,
  Phone as PhoneIcon,
  AccountBalance as BankIcon,
  Save as SaveIcon,
  Refresh as RefreshIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from "@mui/icons-material"
import { useTranslations } from "next-intl"
import { useForm, Controller } from "react-hook-form"
import { GlassCard } from "../ui/glass-card"
import type { User, UpdateUserData, ProfileFormData } from "@/types/user"

interface EnhancedProfileFormProps {
  user: User
  onUpdate: (data: UpdateUserData) => Promise<{ success: boolean; message: string }>
  loading?: boolean
}

export function EnhancedProfileForm({ user, onUpdate, loading }: EnhancedProfileFormProps) {
  const t = useTranslations("profile")
  const muiTheme = useMuiTheme()
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("md"))
  const [updateResult, setUpdateResult] = useState<{ success: boolean; message: string } | null>(null)
  const [bankingExpanded, setBankingExpanded] = useState(false)

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
    <GlassCard>
      {/* Header */}
      <Box
        sx={{
          p: 3,
          pb: 2,
          background: "linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)",
          borderRadius: "16px 16px 0 0",
        }}
      >
        <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
          <Box display="flex" alignItems="center" gap={2}>
            <PersonIcon color="primary" sx={{ fontSize: 28 }} />
            <Typography variant="h5" fontWeight="bold">
              {t("personalInformation")}
            </Typography>
          </Box>
          <IconButton
            onClick={handleReset}
            disabled={!isDirty || loading}
            sx={{
              backgroundColor: "rgba(102, 126, 234, 0.1)",
              "&:hover": {
                backgroundColor: "rgba(102, 126, 234, 0.2)",
                transform: "scale(1.1)",
              },
            }}
          >
            <RefreshIcon />
          </IconButton>
        </Box>
      </Box>

      <Divider />

      <Box sx={{ p: 3 }}>
        {updateResult && (
          <Alert
            severity={updateResult.success ? "success" : "error"}
            sx={{
              mb: 3,
              borderRadius: 2,
              "& .MuiAlert-message": {
                fontWeight: 500,
              },
            }}
          >
            {updateResult.message}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Basic Information */}
          <Box mb={4}>
            <Typography variant="h6" fontWeight="bold" color="primary" gutterBottom sx={{ mb: 3 }}>
              {t("basicInfo")}
            </Typography>

            <Grid container spacing={3}>
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
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: "rgba(102, 126, 234, 0.05)",
                        },
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
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: "rgba(102, 126, 234, 0.05)",
                        },
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
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: "rgba(102, 126, 234, 0.05)",
                        },
                      }}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Box>

          {/* Banking Information - Collapsible */}
          <Box>
            <Button
              onClick={() => setBankingExpanded(!bankingExpanded)}
              sx={{
                mb: 2,
                textTransform: "none",
                fontSize: "1.125rem",
                fontWeight: "bold",
                color: "primary.main",
                "&:hover": {
                  backgroundColor: "rgba(102, 126, 234, 0.1)",
                },
              }}
              endIcon={bankingExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            >
              {t("bankingInfo")}
            </Button>

            <Collapse in={bankingExpanded}>
              <Grid container spacing={3} sx={{ mb: 4 }}>
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
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            backgroundColor: "rgba(118, 75, 162, 0.05)",
                          },
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
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            backgroundColor: "rgba(118, 75, 162, 0.05)",
                          },
                        }}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </Collapse>
          </Box>

          {/* Submit Button */}
          <Box display="flex" justifyContent={isMobile ? "center" : "flex-end"} mt={4}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={!isDirty || loading}
              startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
              sx={{
                minWidth: 180,
                py: 1.5,
                fontSize: "1.1rem",
                fontWeight: "bold",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                "&:hover": {
                  background: "linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)",
                  transform: "translateY(-2px)",
                },
              }}
            >
              {loading ? t("saving") : t("saveChanges")}
            </Button>
          </Box>
        </form>
      </Box>
    </GlassCard>
  )
}
