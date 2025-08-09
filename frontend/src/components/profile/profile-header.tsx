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
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material"
import { PhotoCamera as PhotoCameraIcon, Verified as VerifiedIcon, Warning as WarningIcon } from "@mui/icons-material"
import { useTranslations } from "next-intl"
import type { User } from "@/types/user"

interface ProfileHeaderProps {
  user: User
  onUpdateProfilePicture: (file: File) => Promise<{ success: boolean; message: string }>
  loading?: boolean
}

export function ProfileHeader({ user, onUpdateProfilePicture, loading }: ProfileHeaderProps) {
  const t = useTranslations("profile")
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
      <Card elevation={3} sx={{ mb: 4, background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
        <CardContent sx={{ p: 4 }}>
          <Box display="flex" alignItems="center" gap={3}>
            <Box position="relative">
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
                        "&:hover": { backgroundColor: "primary.dark" },
                      }}
                    >
                      <PhotoCameraIcon fontSize="small" />
                      <input type="file" hidden accept="image/*" onChange={handleFileSelect} />
                    </IconButton>
                  </Tooltip>
                }
              >
                <Avatar
                  src={user.profile_pic}
                  sx={{
                    width: 120,
                    height: 120,
                    border: "4px solid white",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                  }}
                >
                  {user.first_name?.[0]}
                  {user.last_name?.[0]}
                </Avatar>
              </Badge>
            </Box>

            <Box flex={1} color="white">
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <Typography variant="h4" fontWeight="bold">
                  {user.first_name} {user.last_name}
                </Typography>
                {user.verified && (
                  <Tooltip title={t("verifiedAccount")}>
                    <VerifiedIcon color="success" />
                  </Tooltip>
                )}
                {user.restricted && (
                  <Tooltip title={t("restrictedAccount")}>
                    <WarningIcon color="warning" />
                  </Tooltip>
                )}
              </Box>

              <Typography variant="body1" sx={{ opacity: 0.9, mb: 1 }}>
                {user.email}
              </Typography>

              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                {t("memberSince")} {formatMemberSince(user.created_at)}
              </Typography>

              <Box mt={2}>
                <Typography variant="caption" sx={{ opacity: 0.7 }}>
                  {t("accountType")}: {user.type.toUpperCase()}
                </Typography>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Upload Dialog */}
      <Dialog open={uploadDialog} onClose={() => setUploadDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{t("changeProfilePicture")}</DialogTitle>
        <DialogContent>
          {selectedFile && (
            <Box textAlign="center" py={2}>
              <img
                src={URL.createObjectURL(selectedFile) || "/placeholder.svg"}
                alt="Preview"
                style={{
                  maxWidth: "100%",
                  maxHeight: "300px",
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              />
              <Typography variant="body2" color="text.secondary" mt={1}>
                {selectedFile.name}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUploadDialog(false)} disabled={uploading}>
            {t("cancel")}
          </Button>
          <Button onClick={handleUpload} variant="contained" disabled={!selectedFile || uploading}>
            {uploading ? <CircularProgress size={20} /> : t("upload")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
