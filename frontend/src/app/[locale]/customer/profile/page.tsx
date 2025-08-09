"use client"

import { Container, Grid, Box, Typography, Breadcrumbs, Link, Fade } from "@mui/material"
import { Home as HomeIcon, Person as PersonIcon } from "@mui/icons-material"
import { useTranslations } from "next-intl"
import { useUserProfile } from "@/hooks/use-user-profile"
import { ProfileHeader } from "@/components/profile/profile-header"
import { ProfileForm } from "@/components/profile/profile-form"
import { PasswordForm } from "@/components/profile/password-form"
import { SessionsManager } from "@/components/profile/sessions-manager"

export default function ProfilePage() {
  const t = useTranslations("profile")
  const {
    user,
    sessions,
    loading,
    updateProfile,
    changePassword,
    updateProfilePicture,
    terminateSession,
    terminateAllSessions,
  } = useUserProfile()

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Fade in timeout={300}>
        <Box mb={3}>
          <Breadcrumbs>
            <Link href="/" color="inherit" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <HomeIcon fontSize="small" />
              {t("home")}
            </Link>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <PersonIcon fontSize="small" />
              {t("profile")}
            </Box>
          </Breadcrumbs>
        </Box>
      </Fade>

      {/* Page Title */}
      <Fade in timeout={500}>
        <Box mb={4}>
          <Typography variant="h3" fontWeight="bold" gutterBottom>
            {t("profileSettings")}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t("profileDescription")}
          </Typography>
        </Box>
      </Fade>

      {/* Profile Header */}
      <Fade in timeout={700}>
        <div>
          <ProfileHeader user={user} onUpdateProfilePicture={updateProfilePicture} loading={loading} />
        </div>
      </Fade>

      {/* Main Content */}
      <Grid container spacing={4}>
        {/* Left Column */}
        <Grid item xs={12} lg={8}>
          <Fade in timeout={900}>
            <Box display="flex" flexDirection="column" gap={4}>
              {/* Profile Form */}
              <ProfileForm user={user} onUpdate={updateProfile} loading={loading} />

              {/* Password Form */}
              <PasswordForm onChangePassword={changePassword} loading={loading} />
            </Box>
          </Fade>
        </Grid>

        {/* Right Column */}
        <Grid item xs={12} lg={4}>
          <Fade in timeout={1100}>
            <div>
              {/* Sessions Manager */}
              <SessionsManager
                sessions={sessions}
                onTerminateSession={terminateSession}
                onTerminateAllSessions={terminateAllSessions}
                loading={loading}
              />
            </div>
          </Fade>
        </Grid>
      </Grid>
    </Container>
  )
}
