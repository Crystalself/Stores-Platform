"use client"

import type React from "react"
import { useState } from "react"
import {
  Box,
  Avatar,
  Typography,
  IconButton,
  Badge,
  Tooltip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Chip,
  Grid,
  useMediaQuery,
  useTheme as useMuiTheme,
} from "@mui/material"
import {
  PhotoCamera as PhotoCameraIcon,
  Verified as VerifiedIcon,
  Warning as WarningIcon,
  Star as StarIcon,
  CalendarToday as CalendarIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
} from "@mui/icons-material"
import { useTranslations } from "next-intl"
import { GlassCard } from "../ui/glass-card"
import { ThemeToggle } from "../ui/theme-toggle"
import type { User } from "@/types/user"

interface EnhancedProfileHeaderProps {
  user: User
  onUpdateProfilePicture: (file: File) => Promise<{ success: boolean; message: string }>
  loading?: boolean
}

export function EnhancedProfileHeader({ user, onUpdateProfilePicture, loading }: EnhancedProfileHeaderProps) {
  const t = useTranslations("profile")
  const muiTheme = useMuiTheme()
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("md"))
  const [uploadDialog, setUploadDialog] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setUploadDialog(true)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setUploading(true)
    const result = await onUpdateProfilePicture(selectedFile)
    setUploading(false)

    if (result.success) {
      setUploadDialog(false)
      setSelectedFile(null)
    }
  }

  const formatMemberSince = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    })
  }

  return (
    <>
      <GlassCard sx={{ mb: 4, overflow: "hidden", position: "relative" }}>
        {/* Background Pattern */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "200px",
            background: `linear-gradient(135deg, 
              rgba(102, 126, 234, 0.8) 0%, 
              rgba(118, 75, 162, 0.8) 50%, 
              rgba(255, 119, 198, 0.8) 100%)`,
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fillOpacity='0.1'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E")`,
            },
          }}
        />

        {/* Theme Toggle */}
        <Box sx={{ position: "absolute", top: 16, right: 16, zIndex: 2 }}>
          <ThemeToggle />
        </Box>

        <Box sx={{ position: "relative", zIndex: 1, p: 4 }}>
          <Grid container spacing={3} alignItems="center">
            {/* Avatar Section */}
            <Grid item xs={12} md="auto">
              <Box display="flex" justifyContent={isMobile ? "center" : "flex-start"}>
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  badgeContent={
                    <Tooltip title={t("changeProfilePicture")}>
                      <IconButton
                        size="small"
                        component="label"
                        sx={{
                          backgroundColor: "primary.main",
                          color: "white",
                          width: 40,
                          height: 40,
                          "&:hover": {
                            backgroundColor: "primary.dark",
                            transform: "scale(1.1)",
                          },
                          transition: "all 0.2s ease-in-out",
                        }}
                      >
                        <PhotoCameraIcon />
                        <input type="file" hidden accept="image/*" onChange={handleFileSelect} />
                      </IconButton>
                    </Tooltip>
                  }
                >
                  <Avatar
                    src={user.profile_pic}
                    sx={{
                      width: { xs: 120, md: 140 },
                      height: { xs: 120, md: 140 },
                      border: "4px solid white",
                      boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                      transition: "all 0.3s ease-in-out",
                      "&:hover": {
                        transform: "scale(1.05)",
                      },
                    }}
                  >
                    {user.first_name?.[0]}
                    {user.last_name?.[0]}
                  </Avatar>
                </Badge>
              </Box>
            </Grid>

            {/* User Info Section */}
            <Grid item xs={12} md>
              <Box textAlign={isMobile ? "center" : "left"} color="white">
                {/* Name and Status */}
                <Box
                  display="flex"
                  alignItems="center"
                  gap={1}
                  mb={2}
                  justifyContent={isMobile ? "center" : "flex-start"}
                  flexWrap="wrap"
                >
                  <Typography variant={isMobile ? "h4" : "h3"} fontWeight="bold">
                    {user.first_name} {user.last_name}
                  </Typography>
                  {user.verified && (
                    <Tooltip title={t("verifiedAccount")}>
                      <VerifiedIcon sx={{ color: "success.main", fontSize: 28 }} />
                    </Tooltip>
                  )}
                  {user.restricted && (
                    <Tooltip title={t("restrictedAccount")}>
                      <WarningIcon sx={{ color: "warning.main", fontSize: 28 }} />
                    </Tooltip>
                  )}
                </Box>

                {/* Account Type Chip */}
                <Box mb={2}>
                  <Chip
                    icon={<StarIcon />}
                    label={user.type.toUpperCase()}
                    sx={{
                      backgroundColor: "rgba(255, 255, 255, 0.2)",
                      color: "white",
                      fontWeight: "bold",
                      backdropFilter: "blur(10px)",
                    }}
                  />
                </Box>

                {/* Contact Info */}
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={12} sm={6}>
                    <Box display="flex" alignItems="center" gap={1} justifyContent={isMobile ? "center" : "flex-start"}>
                      <EmailIcon sx={{ fontSize: 20, opacity: 0.9 }} />
                      <Typography variant="body1" sx={{ opacity: 0.9 }}>
                        {user.email}
                      </Typography>
                    </Box>
                  </Grid>
                  {user.phone && (
                    <Grid item xs={12} sm={6}>
                      <Box
                        display="flex"
                        alignItems="center"
                        gap={1}
                        justifyContent={isMobile ? "center" : "flex-start"}
                      >
                        <PhoneIcon sx={{ fontSize: 20, opacity: 0.9 }} />
                        <Typography variant="body1" sx={{ opacity: 0.9 }}>
                          {user.phone}
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                </Grid>

                {/* Member Since */}
                <Box display="flex" alignItems="center" gap={1} justifyContent={isMobile ? "center" : "flex-start"}>
                  <CalendarIcon sx={{ fontSize: 18, opacity: 0.8 }} />
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    {t("memberSince")} {formatMemberSince(user.created_at)}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </GlassCard>

      {/* Upload Dialog */}
      <Dialog
        open={uploadDialog}
        onClose={() => setUploadDialog(false)}
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
        <DialogTitle sx={{ textAlign: "center", pb: 1 }}>
          <Typography variant="h5" fontWeight="bold">
            {t("changeProfilePicture")}
          </Typography>
        </DialogTitle>
        <DialogContent>
          {selectedFile && (
            <Box textAlign="center" py={3}>
              <Box
                sx={{
                  position: "relative",
                  display: "inline-block",
                  borderRadius: 3,
                  overflow: "hidden",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                }}
              >
                <img
                  src={URL.createObjectURL(selectedFile) || "/placeholder.svg"}
                  alt="Preview"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "300px",
                    display: "block",
                  }}
                />
              </Box>
              <Typography variant="body2" color="text.secondary" mt={2} fontWeight={500}>
                {selectedFile.name}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={() => setUploadDialog(false)} disabled={uploading} size="large">
            {t("cancel")}
          </Button>
          <Button onClick={handleUpload} variant="contained" disabled={!selectedFile || uploading} size="large">
            {uploading ? <CircularProgress size={20} sx={{ mr: 1 }} /> : null}
            {uploading ? t("uploading") : t("upload")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
