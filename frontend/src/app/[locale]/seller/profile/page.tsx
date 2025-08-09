"use client"

import type React from "react"
import { useState } from "react"
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Avatar,
  Tabs,
  Tab,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  IconButton,
  Paper,
  Chip,
} from "@mui/material"
import {
  Person,
  Store,
  AccountBalance,
  Security,
  Notifications,
  Edit,
  Save,
  Cancel,
  CloudUpload,
  Verified,
} from "@mui/icons-material"
import { useTranslations } from "next-intl"

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  )
}

const SellerProfile: React.FC = () => {
  const t = useTranslations("seller")
  const [activeTab, setActiveTab] = useState(0)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)

  // بيانات وهمية للملف الشخصي
  const [profileData, setProfileData] = useState({
    // Personal Info
    firstName: "أحمد",
    lastName: "محمد",
    email: "ahmed@example.com",
    phone: "+966501234567",
    address: "شارع الملك فهد، الرياض",
    city: "الرياض",
    country: "المملكة العربية السعودية",
    postalCode: "12345",
    avatar: "/placeholder.svg?height=120&width=120",

    // Store Info
    storeName: "متجر أحمد للإلكترونيات",
    storeDescription: "متجر متخصص في بيع الأجهزة الإلكترونية والإكسسوارات",
    storeUrl: "ahmed-electronics",
    logo: "/placeholder.svg?height=80&width=80",
    banner: "/placeholder.svg?height=200&width=800",

    // Bank Info
    bankName: "البنك الأهلي السعودي",
    accountNumber: "1234567890",
    iban: "SA1234567890123456789012",
    swiftCode: "NCBKSARI",

    // Security
    twoFactorAuth: true,

    // Notifications
    emailNotifications: true,
    smsNotifications: false,
    orderNotifications: true,
    marketingEmails: false,
  })

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
  }

  const handleInputChange = (field: string, value: any) => {
    setProfileData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      // TODO: ربط مع الباك إند لتحديث الملف الشخصي
      // const response = await fetch('/api/v1/user/profile/edit', {
      //   method: 'PUT',
      //   headers: {
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`,
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(profileData),
      // });

      // if (response.ok) {
      //   setIsEditing(false);
      // }

      // بيانات وهمية مؤقتة
      setTimeout(() => {
        setLoading(false)
        setIsEditing(false)
      }, 1000)
    } catch (error) {
      console.error("Error updating profile:", error)
      setLoading(false)
    }
  }

  const handleImageUpload = (field: string) => {
    // TODO: تنفيذ رفع الصور
    console.log(`Upload image for ${field}`)
  }

  const tabs = [
    { label: t("profile.personalInfo"), icon: <Person /> },
    { label: t("profile.storeInfo"), icon: <Store /> },
    { label: t("profile.bankInfo"), icon: <AccountBalance /> },
    { label: t("profile.security"), icon: <Security /> },
    { label: t("profile.notifications"), icon: <Notifications /> },
  ]

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: "bold" }}>
            {t("profile.title")}
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            {isEditing ? (
              <>
                <Button
                  variant="outlined"
                  startIcon={<Cancel />}
                  onClick={() => setIsEditing(false)}
                  disabled={loading}
                >
                  {t("common.cancel")}
                </Button>
                <Button variant="contained" startIcon={<Save />} onClick={handleSave} disabled={loading}>
                  {loading ? t("common.loading") : t("common.save")}
                </Button>
              </>
            ) : (
              <Button variant="contained" startIcon={<Edit />} onClick={() => setIsEditing(true)}>
                {t("common.edit")}
              </Button>
            )}
          </Box>
        </Box>

        {/* Profile Summary */}
        <Paper sx={{ p: 3, background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", color: "white" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
            <Avatar src={profileData.avatar} sx={{ width: 80, height: 80, border: "3px solid white" }} />
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                  {profileData.firstName} {profileData.lastName}
                </Typography>
                <Verified sx={{ color: "success.light" }} />
              </Box>
              <Typography variant="body1" sx={{ opacity: 0.9, mb: 1 }}>
                {profileData.storeName}
              </Typography>
              <Box sx={{ display: "flex", gap: 1 }}>
                <Chip label="بائع معتمد" size="small" sx={{ bgcolor: "rgba(255,255,255,0.2)", color: "white" }} />
                <Chip label="عضو منذ 2023" size="small" sx={{ bgcolor: "rgba(255,255,255,0.2)", color: "white" }} />
              </Box>
            </Box>
          </Box>
        </Paper>
      </Box>

      <Card>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={activeTab} onChange={handleTabChange} variant="scrollable" scrollButtons="auto" sx={{ px: 2 }}>
            {tabs.map((tab, index) => (
              <Tab key={index} label={tab.label} icon={tab.icon} iconPosition="start" sx={{ minHeight: 64 }} />
            ))}
          </Tabs>
        </Box>

        <CardContent>
          {/* Personal Information */}
          <TabPanel value={activeTab} index={0}>
            <Grid container spacing={3}>
              <Grid item xs={12} sx={{ textAlign: "center", mb: 2 }}>
                <Box sx={{ position: "relative", display: "inline-block" }}>
                  <Avatar src={profileData.avatar} sx={{ width: 120, height: 120, mx: "auto", mb: 2 }} />
                  {isEditing && (
                    <IconButton
                      sx={{
                        position: "absolute",
                        bottom: 8,
                        right: 8,
                        bgcolor: "primary.main",
                        color: "white",
                        "&:hover": { bgcolor: "primary.dark" },
                      }}
                      onClick={() => handleImageUpload("avatar")}
                    >
                      <CloudUpload />
                    </IconButton>
                  )}
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label={t("profile.firstName")}
                  value={profileData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  disabled={!isEditing}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label={t("profile.lastName")}
                  value={profileData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  disabled={!isEditing}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label={t("profile.email")}
                  type="email"
                  value={profileData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  disabled={!isEditing}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label={t("profile.phone")}
                  value={profileData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  disabled={!isEditing}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label={t("profile.address")}
                  value={profileData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  disabled={!isEditing}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label={t("profile.city")}
                  value={profileData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  disabled={!isEditing}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label={t("profile.country")}
                  value={profileData.country}
                  onChange={(e) => handleInputChange("country", e.target.value)}
                  disabled={!isEditing}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label={t("profile.postalCode")}
                  value={profileData.postalCode}
                  onChange={(e) => handleInputChange("postalCode", e.target.value)}
                  disabled={!isEditing}
                />
              </Grid>
            </Grid>
          </TabPanel>

          {/* Store Information */}
          <TabPanel value={activeTab} index={1}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Alert severity="info" sx={{ mb: 3 }}>
                  معلومات المتجر تظهر للعملاء في صفحة المتجر الخاصة بك
                </Alert>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box sx={{ textAlign: "center", mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    {t("profile.logo")}
                  </Typography>
                  <Box sx={{ position: "relative", display: "inline-block" }}>
                    <Avatar src={profileData.logo} sx={{ width: 80, height: 80, mx: "auto" }} variant="rounded" />
                    {isEditing && (
                      <IconButton
                        sx={{
                          position: "absolute",
                          bottom: -8,
                          right: -8,
                          bgcolor: "primary.main",
                          color: "white",
                          "&:hover": { bgcolor: "primary.dark" },
                        }}
                        size="small"
                        onClick={() => handleImageUpload("logo")}
                      >
                        <CloudUpload fontSize="small" />
                      </IconButton>
                    )}
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box sx={{ textAlign: "center", mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    {t("profile.banner")}
                  </Typography>
                  <Box sx={{ position: "relative", display: "inline-block" }}>
                    <Box
                      component="img"
                      src={profileData.banner}
                      sx={{
                        width: 200,
                        height: 100,
                        objectFit: "cover",
                        borderRadius: 1,
                        border: "1px solid",
                        borderColor: "divider",
                      }}
                    />
                    {isEditing && (
                      <IconButton
                        sx={{
                          position: "absolute",
                          bottom: -8,
                          right: -8,
                          bgcolor: "primary.main",
                          color: "white",
                          "&:hover": { bgcolor: "primary.dark" },
                        }}
                        size="small"
                        onClick={() => handleImageUpload("banner")}
                      >
                        <CloudUpload fontSize="small" />
                      </IconButton>
                    )}
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label={t("profile.storeName")}
                  value={profileData.storeName}
                  onChange={(e) => handleInputChange("storeName", e.target.value)}
                  disabled={!isEditing}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label={t("profile.storeDescription")}
                  value={profileData.storeDescription}
                  onChange={(e) => handleInputChange("storeDescription", e.target.value)}
                  disabled={!isEditing}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label={t("profile.storeUrl")}
                  value={profileData.storeUrl}
                  onChange={(e) => handleInputChange("storeUrl", e.target.value)}
                  disabled={!isEditing}
                  helperText="https://store.example.com/your-store-url"
                />
              </Grid>
            </Grid>
          </TabPanel>

          {/* Banking Information */}
          <TabPanel value={activeTab} index={2}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Alert severity="warning" sx={{ mb: 3 }}>
                  معلومات البنك مطلوبة لتحويل أرباحك. جميع المعلومات محمية ومشفرة.
                </Alert>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label={t("profile.bankName")}
                  value={profileData.bankName}
                  onChange={(e) => handleInputChange("bankName", e.target.value)}
                  disabled={!isEditing}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label={t("profile.accountNumber")}
                  value={profileData.accountNumber}
                  onChange={(e) => handleInputChange("accountNumber", e.target.value)}
                  disabled={!isEditing}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label={t("profile.iban")}
                  value={profileData.iban}
                  onChange={(e) => handleInputChange("iban", e.target.value)}
                  disabled={!isEditing}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label={t("profile.swiftCode")}
                  value={profileData.swiftCode}
                  onChange={(e) => handleInputChange("swiftCode", e.target.value)}
                  disabled={!isEditing}
                />
              </Grid>
            </Grid>
          </TabPanel>

          {/* Security */}
          <TabPanel value={activeTab} index={3}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  {t("profile.changePassword")}
                </Typography>
                <Divider sx={{ mb: 3 }} />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField fullWidth type="password" label={t("profile.currentPassword")} disabled={!isEditing} />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField fullWidth type="password" label={t("profile.newPassword")} disabled={!isEditing} />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField fullWidth type="password" label={t("profile.confirmPassword")} disabled={!isEditing} />
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 3 }} />
                <FormControlLabel
                  control={
                    <Switch
                      checked={profileData.twoFactorAuth}
                      onChange={(e) => handleInputChange("twoFactorAuth", e.target.checked)}
                      disabled={!isEditing}
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="body1">{t("profile.twoFactorAuth")}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        إضافة طبقة حماية إضافية لحسابك
                      </Typography>
                    </Box>
                  }
                />
              </Grid>
            </Grid>
          </TabPanel>

          {/* Notifications */}
          <TabPanel value={activeTab} index={4}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  تفضيلات الإشعارات
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  اختر كيف تريد أن نتواصل معك
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={profileData.emailNotifications}
                      onChange={(e) => handleInputChange("emailNotifications", e.target.checked)}
                      disabled={!isEditing}
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="body1">{t("profile.emailNotifications")}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        تلقي إشعارات عبر البريد الإلكتروني
                      </Typography>
                    </Box>
                  }
                />
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={profileData.smsNotifications}
                      onChange={(e) => handleInputChange("smsNotifications", e.target.checked)}
                      disabled={!isEditing}
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="body1">{t("profile.smsNotifications")}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        تلقي إشعارات عبر الرسائل النصية
                      </Typography>
                    </Box>
                  }
                />
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={profileData.orderNotifications}
                      onChange={(e) => handleInputChange("orderNotifications", e.target.checked)}
                      disabled={!isEditing}
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="body1">{t("profile.orderNotifications")}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        إشعارات الطلبات الجديدة وتحديثات الحالة
                      </Typography>
                    </Box>
                  }
                />
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={profileData.marketingEmails}
                      onChange={(e) => handleInputChange("marketingEmails", e.target.checked)}
                      disabled={!isEditing}
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="body1">{t("profile.marketingEmails")}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        نصائح وعروض خاصة لتحسين مبيعاتك
                      </Typography>
                    </Box>
                  }
                />
              </Grid>
            </Grid>
          </TabPanel>
        </CardContent>
      </Card>
    </Box>
  )
}

export default SellerProfile
