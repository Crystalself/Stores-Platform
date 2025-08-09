"use client"

import { useState } from "react"
import {
  Typography,
  Box,
  Chip,
  IconButton,
  Button,
  Divider,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Tooltip,
  Grid,
  useMediaQuery,
  useTheme as useMuiTheme,
} from "@mui/material"
import {
  Devices as DevicesIcon,
  Computer as ComputerIcon,
  Smartphone as SmartphoneIcon,
  Tablet as TabletIcon,
  Delete as DeleteIcon,
  Security as SecurityIcon,
  LocationOn as LocationIcon,
  Schedule as ScheduleIcon,
  VerifiedUser as TrustedIcon,
  Warning as UntrustedIcon,
  PowerSettingsNew as PowerIcon,
} from "@mui/icons-material"
import { useTranslations } from "next-intl"
import { GlassCard } from "../ui/glass-card"
import type { UserSession } from "@/types/user"

interface EnhancedSessionsManagerProps {
  sessions: UserSession[]
  onTerminateSession: (sessionId: number) => Promise<{ success: boolean; message: string }>
  onTerminateAllSessions: () => Promise<{ success: boolean; message: string }>
  loading?: boolean
}

export function EnhancedSessionsManager({
  sessions,
  onTerminateSession,
  onTerminateAllSessions,
  loading,
}: EnhancedSessionsManagerProps) {
  const t = useTranslations("profile")
  const muiTheme = useMuiTheme()
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("md"))
  const [terminateAllDialog, setTerminateAllDialog] = useState(false)
  const [actionResult, setActionResult] = useState<{ success: boolean; message: string } | null>(null)

  const getDeviceIcon = (os: string) => {
    const osLower = os.toLowerCase()
    if (osLower.includes("android") || osLower.includes("ios")) {
      return <SmartphoneIcon />
    }
    if (osLower.includes("ipad")) {
      return <TabletIcon />
    }
    return <ComputerIcon />
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleTerminateSession = async (sessionId: number) => {
    const result = await onTerminateSession(sessionId)
    setActionResult(result)
    setTimeout(() => setActionResult(null), 3000)
  }

  const handleTerminateAll = async () => {
    const result = await onTerminateAllSessions()
    setActionResult(result)
    setTerminateAllDialog(false)
    setTimeout(() => setActionResult(null), 3000)
  }

  return (
    <>
      <GlassCard>
        {/* Header */}
        <Box
          sx={{
            p: 3,
            pb: 2,
            background: "linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)",
            borderRadius: "16px 16px 0 0",
          }}
        >
          <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
            <Box display="flex" alignItems="center" gap={2}>
              <DevicesIcon color="primary" sx={{ fontSize: 28 }} />
              <Typography variant="h5" fontWeight="bold">
                {t("activeSessions")}
              </Typography>
              <Chip
                label={sessions.length}
                size="small"
                color="primary"
                sx={{
                  fontWeight: "bold",
                  backgroundColor: "rgba(102, 126, 234, 0.2)",
                }}
              />
            </Box>
            {sessions.length > 1 && (
              <Button
                variant="outlined"
                color="error"
                size="small"
                onClick={() => setTerminateAllDialog(true)}
                disabled={loading}
                startIcon={<PowerIcon />}
                sx={{
                  borderRadius: 2,
                  fontWeight: "bold",
                  "&:hover": {
                    transform: "translateY(-1px)",
                  },
                }}
              >
                {t("terminateAll")}
              </Button>
            )}
          </Box>
        </Box>

        <Divider />

        <Box sx={{ p: 3 }}>
          {actionResult && (
            <Alert
              severity={actionResult.success ? "success" : "error"}
              sx={{
                mb: 3,
                borderRadius: 2,
                "& .MuiAlert-message": {
                  fontWeight: 500,
                },
              }}
            >
              {actionResult.message}
            </Alert>
          )}

          {sessions.length === 0 ? (
            <Box textAlign="center" py={6}>
              <DevicesIcon sx={{ fontSize: 80, color: "text.secondary", mb: 2, opacity: 0.5 }} />
              <Typography variant="h6" color="text.secondary" fontWeight={500}>
                {t("noActiveSessions")}
              </Typography>
            </Box>
          ) : (
            <List sx={{ p: 0 }}>
              {sessions.map((session, index) => (
                <ListItem
                  key={session.id}
                  sx={{
                    border: "1px solid",
                    borderColor: index === 0 ? "primary.main" : "divider",
                    borderRadius: 3,
                    mb: 2,
                    p: 2,
                    background:
                      index === 0
                        ? "linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)"
                        : "rgba(255, 255, 255, 0.5)",
                    backdropFilter: "blur(10px)",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0 8px 25px rgba(0, 0, 0, 0.1)",
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 56 }}>
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        backgroundColor: index === 0 ? "primary.main" : "action.hover",
                        color: index === 0 ? "white" : "text.primary",
                      }}
                    >
                      {getDeviceIcon(session.info.os || "")}
                    </Box>
                  </ListItemIcon>

                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center" gap={1} flexWrap="wrap" mb={1}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {session.info.browser} • {session.info.os}
                        </Typography>
                        {index === 0 && (
                          <Chip label={t("currentSession")} size="small" color="primary" sx={{ fontWeight: "bold" }} />
                        )}
                        <Tooltip title={session.trusted ? t("trustedDevice") : t("untrustedDevice")}>
                          {session.trusted ? (
                            <TrustedIcon color="success" fontSize="small" />
                          ) : (
                            <UntrustedIcon color="warning" fontSize="small" />
                          )}
                        </Tooltip>
                      </Box>
                    }
                    secondary={
                      <Grid container spacing={1} sx={{ mt: 0.5 }}>
                        <Grid item xs={12} sm={6}>
                          <Box display="flex" alignItems="center" gap={1}>
                            <LocationIcon fontSize="small" color="action" />
                            <Typography variant="caption" color="text.secondary">
                              {session.info.city}, {session.info.country}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Box display="flex" alignItems="center" gap={1}>
                            <ScheduleIcon fontSize="small" color="action" />
                            <Typography variant="caption" color="text.secondary">
                              {formatDate(session.created_at)}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="caption" color="text.secondary" sx={{ fontFamily: "monospace" }}>
                            IP: {session.ip}
                          </Typography>
                        </Grid>
                      </Grid>
                    }
                  />

                  {index !== 0 && (
                    <ListItemSecondaryAction>
                      <Tooltip title={t("terminateSession")}>
                        <IconButton
                          edge="end"
                          color="error"
                          onClick={() => handleTerminateSession(session.id)}
                          disabled={loading}
                          sx={{
                            backgroundColor: "rgba(239, 68, 68, 0.1)",
                            "&:hover": {
                              backgroundColor: "rgba(239, 68, 68, 0.2)",
                              transform: "scale(1.1)",
                            },
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </ListItemSecondaryAction>
                  )}
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </GlassCard>

      {/* Terminate All Dialog */}
      <Dialog
        open={terminateAllDialog}
        onClose={() => setTerminateAllDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(20px)",
          },
        }}
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={2}>
            <SecurityIcon color="error" sx={{ fontSize: 32 }} />
            <Typography variant="h5" fontWeight="bold">
              {t("terminateAllSessions")}
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
            {t("terminateAllConfirmation")}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={() => setTerminateAllDialog(false)} size="large">
            {t("cancel")}
          </Button>
          <Button
            onClick={handleTerminateAll}
            color="error"
            variant="contained"
            size="large"
            startIcon={<PowerIcon />}
            sx={{
              fontWeight: "bold",
              "&:hover": {
                transform: "translateY(-1px)",
              },
            }}
          >
            {t("terminateAll")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
