"use client"

import { useState } from "react"
import {
  Card,
  CardContent,
  CardHeader,
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
} from "@mui/icons-material"
import { useTranslations } from "next-intl"
import type { UserSession } from "@/types/user"

interface SessionsManagerProps {
  sessions: UserSession[]
  onTerminateSession: (sessionId: number) => Promise<{ success: boolean; message: string }>
  onTerminateAllSessions: () => Promise<{ success: boolean; message: string }>
  loading?: boolean
}

export function SessionsManager({
  sessions,
  onTerminateSession,
  onTerminateAllSessions,
  loading,
}: SessionsManagerProps) {
  const t = useTranslations("profile")
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
      <Card elevation={2}>
        <CardHeader
          title={
            <Box display="flex" alignItems="center" gap={1}>
              <DevicesIcon color="primary" />
              <Typography variant="h6">{t("activeSessions")}</Typography>
            </Box>
          }
          action={
            sessions.length > 1 && (
              <Button
                variant="outlined"
                color="error"
                size="small"
                onClick={() => setTerminateAllDialog(true)}
                disabled={loading}
              >
                {t("terminateAll")}
              </Button>
            )
          }
        />
        <Divider />
        <CardContent>
          {actionResult && (
            <Alert severity={actionResult.success ? "success" : "error"} sx={{ mb: 2 }}>
              {actionResult.message}
            </Alert>
          )}

          <List>
            {sessions.map((session, index) => (
              <ListItem
                key={session.id}
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 2,
                  mb: 1,
                  backgroundColor: index === 0 ? "primary.50" : "background.paper",
                }}
              >
                <ListItemIcon>{getDeviceIcon(session.info.os || "")}</ListItemIcon>
                <ListItemText
                  primary={
                    <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                      <Typography variant="subtitle2">
                        {session.info.browser} • {session.info.os}
                      </Typography>
                      {index === 0 && (
                        <Chip label={t("currentSession")} size="small" color="primary" variant="outlined" />
                      )}
                      {session.trusted ? (
                        <Tooltip title={t("trustedDevice")}>
                          <TrustedIcon color="success" fontSize="small" />
                        </Tooltip>
                      ) : (
                        <Tooltip title={t("untrustedDevice")}>
                          <UntrustedIcon color="warning" fontSize="small" />
                        </Tooltip>
                      )}
                    </Box>
                  }
                  secondary={
                    <Box mt={1}>
                      <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                        <LocationIcon fontSize="small" color="action" />
                        <Typography variant="caption">
                          {session.info.city}, {session.info.country} • {session.ip}
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center" gap={1}>
                        <ScheduleIcon fontSize="small" color="action" />
                        <Typography variant="caption">{formatDate(session.created_at)}</Typography>
                      </Box>
                    </Box>
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
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </ListItemSecondaryAction>
                )}
              </ListItem>
            ))}
          </List>

          {sessions.length === 0 && (
            <Box textAlign="center" py={4}>
              <DevicesIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
              <Typography variant="body1" color="text.secondary">
                {t("noActiveSessions")}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Terminate All Dialog */}
      <Dialog open={terminateAllDialog} onClose={() => setTerminateAllDialog(false)}>
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <SecurityIcon color="error" />
            {t("terminateAllSessions")}
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography>{t("terminateAllConfirmation")}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTerminateAllDialog(false)}>{t("cancel")}</Button>
          <Button onClick={handleTerminateAll} color="error" variant="contained">
            {t("terminateAll")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
