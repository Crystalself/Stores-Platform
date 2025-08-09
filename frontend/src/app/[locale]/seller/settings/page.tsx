"use client"

import type React from "react"
import { useState } from "react"
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  TextField,
  Tabs,
  Tab,
  Divider,
  Switch,
  FormControlLabel,
  Alert,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Avatar,
  IconButton,
  useTheme,
  alpha,
} from "@mui/material"
import {
  Store,
  Payment,
  LocalShipping,
  Receipt,
  Palette,
  Notifications,
  Integration,
  Add,
  Edit,
  CreditCard,
  AccountBalance,
  Truck,
  Calculate,
  Globe,
  DarkMode,
  LightMode,
  Email,
  Sms,
  Push,
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
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  )
}

const SellerSettings: React.FC = () => {
  const t = useTranslations("seller")
  const theme = useTheme()
  const [tabValue, setTabValue] = useState(0)

  const [storeSettings, setStoreSettings] = useState({
    storeName: "متجر أحمد للإلكترونيات",
    storeDescription: "متجر متخصص في بيع الأجهزة الإلكترونية والاكسسوارات",
    storeUrl: "ahmed-electronics",
    currency: "SAR",
    language: "ar",
    timezone: "Asia/Riyadh",
    autoApproveOrders: true,
    allowReviews: true,
    showInventory: false,
  })

  const [paymentMethods, setPaymentMethods] = useState([
    { id: 1, name: "فيزا/ماستركارد", type: "card", enabled: true, icon: <CreditCard /> },
    { id: 2, name: "مدى", type: "mada", enabled: true, icon: <CreditCard /> },
    { id: 3, name: "تحويل بنكي", type: "bank", enabled: false, icon: <AccountBalance /> },
    { id: 4, name: "الدفع عند الاستلام", type: "cod", enabled: true, icon: <Payment /> },
  ])

  const [shippingMethods, setShippingMethods] = useState([
    { id: 1, name: "الشحن السريع", price: 25, days: "1-2", enabled: true },
    { id: 2, name: "الشحن العادي", price: 15, days: "3-5", enabled: true },
    { id: 3, name: "الشحن المجاني", price: 0, days: "5-7", enabled: false },
  ])

  const [taxSettings, setTaxSettings] = useState({
    vatEnabled: true,
    vatRate: 15,
    includeTaxInPrice: true,
    taxNumber: "123456789",
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNewOrder: true,
    emailLowStock: true,
    emailReviews: false,
    smsNewOrder: true,
    smsLowStock: false,
    pushNewOrder: true,
    pushLowStock: true,
  })

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  const handleStoreSettingChange = (field: string) => (event: any) => {
    setStoreSettings((prev) => ({
      ...prev,
      [field]: event.target.type === "checkbox" ? event.target.checked : event.target.value,
    }))
  }

  const togglePaymentMethod = (id: number) => {
    setPaymentMethods((prev) =>
      prev.map((method) => (method.id === id ? { ...method, enabled: !method.enabled } : method)),
    )
  }

  const toggleShippingMethod = (id: number) => {
    setShippingMethods((prev) =>
      prev.map((method) => (method.id === id ? { ...method, enabled: !method.enabled } : method)),
    )
  }

  const handleTaxSettingChange = (field: string) => (event: any) => {
    setTaxSettings((prev) => ({
      ...prev,
      [field]: event.target.type === "checkbox" ? event.target.checked : event.target.value,
    }))
  }

  const handleNotificationChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setNotificationSettings((prev) => ({
      ...prev,
      [field]: event.target.checked,
    }))
  }

  const handleSaveSettings = () => {
    // TODO: ربط مع الباك إند لحفظ الإعدادات
    console.log("Saving settings...")
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: "bold" }}>
          إعدادات المتجر
        </Typography>
        <Typography variant="body1" color="text.secondary">
          إدارة جميع إعدادات متجرك وتخصيصه حسب احتياجاتك
        </Typography>
      </Box>

      <Card>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={tabValue} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
            <Tab icon={<Store />} label="إعدادات عامة" />
            <Tab icon={<Payment />} label="طرق الدفع" />
            <Tab icon={<LocalShipping />} label="الشحن والتوصيل" />
            <Tab icon={<Receipt />} label="الضرائب" />
            <Tab icon={<Notifications />} label="الإشعارات" />
            <Tab icon={<Palette />} label="المظهر" />
            <Tab icon={<Integration />} label="التكاملات" />
          </Tabs>
        </Box>

        {/* General Settings Tab */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                معلومات المتجر الأساسية
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="اسم المتجر"
                value={storeSettings.storeName}
                onChange={handleStoreSettingChange("storeName")}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="رابط المتجر"
                value={storeSettings.storeUrl}
                onChange={handleStoreSettingChange("storeUrl")}
                variant="outlined"
                InputProps={{
                  startAdornment: <Typography color="text.secondary">store.com/</Typography>,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="وصف المتجر"
                value={storeSettings.storeDescription}
                onChange={handleStoreSettingChange("storeDescription")}
                variant="outlined"
                multiline
                rows={4}
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                الإعدادات الإقليمية
              </Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>العملة</InputLabel>
                <Select value={storeSettings.currency} onChange={handleStoreSettingChange("currency")} label="العملة">
                  <MenuItem value="SAR">ريال سعودي (SAR)</MenuItem>
                  <MenuItem value="USD">دولار أمريكي (USD)</MenuItem>
                  <MenuItem value="EUR">يورو (EUR)</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>اللغة</InputLabel>
                <Select value={storeSettings.language} onChange={handleStoreSettingChange("language")} label="اللغة">
                  <MenuItem value="ar">العربية</MenuItem>
                  <MenuItem value="en">English</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>المنطقة الزمنية</InputLabel>
                <Select
                  value={storeSettings.timezone}
                  onChange={handleStoreSettingChange("timezone")}
                  label="المنطقة الزمنية"
                >
                  <MenuItem value="Asia/Riyadh">الرياض (GMT+3)</MenuItem>
                  <MenuItem value="Asia/Dubai">دبي (GMT+4)</MenuItem>
                  <MenuItem value="Europe/London">لندن (GMT+0)</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                إعدادات الطلبات
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <List>
                <ListItem>
                  <ListItemText
                    primary="الموافقة التلقائية على الطلبات"
                    secondary="قبول الطلبات تلقائياً دون مراجعة يدوية"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={storeSettings.autoApproveOrders}
                      onChange={handleStoreSettingChange("autoApproveOrders")}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <ListItemText primary="السماح بالتقييمات" secondary="السماح للعملاء بتقييم المنتجات" />
                  <ListItemSecondaryAction>
                    <Switch checked={storeSettings.allowReviews} onChange={handleStoreSettingChange("allowReviews")} />
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <ListItemText primary="إظهار كمية المخزون" secondary="عرض كمية المخزون المتاحة للعملاء" />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={storeSettings.showInventory}
                      onChange={handleStoreSettingChange("showInventory")}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Payment Methods Tab */}
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  طرق الدفع المتاحة
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  sx={{
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                  }}
                >
                  إضافة طريقة دفع
                </Button>
              </Box>
            </Grid>

            {paymentMethods.map((method) => (
              <Grid item xs={12} md={6} key={method.id}>
                <Card
                  sx={{
                    border: method.enabled
                      ? `2px solid ${theme.palette.success.main}`
                      : `1px solid ${theme.palette.divider}`,
                    background: method.enabled
                      ? `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.1)} 0%, ${alpha(theme.palette.success.main, 0.05)} 100%)`
                      : "background.paper",
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Avatar sx={{ bgcolor: method.enabled ? "success.main" : "grey.400" }}>{method.icon}</Avatar>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                            {method.name}
                          </Typography>
                          <Chip
                            label={method.enabled ? "مفعل" : "معطل"}
                            color={method.enabled ? "success" : "default"}
                            size="small"
                          />
                        </Box>
                      </Box>
                      <Box>
                        <IconButton>
                          <Edit />
                        </IconButton>
                        <Switch checked={method.enabled} onChange={() => togglePaymentMethod(method.id)} />
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        {/* Shipping Methods Tab */}
        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  طرق الشحن والتوصيل
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  sx={{
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                  }}
                >
                  إضافة طريقة شحن
                </Button>
              </Box>
            </Grid>

            {shippingMethods.map((method) => (
              <Grid item xs={12} key={method.id}>
                <Card
                  sx={{
                    border: method.enabled
                      ? `2px solid ${theme.palette.primary.main}`
                      : `1px solid ${theme.palette.divider}`,
                    background: method.enabled
                      ? `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`
                      : "background.paper",
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                        <Avatar sx={{ bgcolor: method.enabled ? "primary.main" : "grey.400" }}>
                          <Truck />
                        </Avatar>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                            {method.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {method.price === 0 ? "مجاني" : `${method.price} ر.س`} • {method.days} أيام عمل
                          </Typography>
                        </Box>
                        <Chip
                          label={method.enabled ? "مفعل" : "معطل"}
                          color={method.enabled ? "primary" : "default"}
                          size="small"
                        />
                      </Box>
                      <Box>
                        <IconButton>
                          <Edit />
                        </IconButton>
                        <Switch checked={method.enabled} onChange={() => toggleShippingMethod(method.id)} />
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        {/* Tax Settings Tab */}
        <TabPanel value={tabValue} index={3}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                إعدادات ضريبة القيمة المضافة
              </Typography>
              <Alert severity="info" sx={{ mb: 3 }}>
                يجب تفعيل ضريبة القيمة المضافة للمتاجر المسجلة في المملكة العربية السعودية
              </Alert>
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={<Switch checked={taxSettings.vatEnabled} onChange={handleTaxSettingChange("vatEnabled")} />}
                label="تفعيل ضريبة القيمة المضافة"
              />
            </Grid>

            {taxSettings.vatEnabled && (
              <>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="معدل الضريبة (%)"
                    type="number"
                    value={taxSettings.vatRate}
                    onChange={handleTaxSettingChange("vatRate")}
                    variant="outlined"
                    InputProps={{
                      startAdornment: <Calculate sx={{ mr: 1, color: "text.secondary" }} />,
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="الرقم الضريبي"
                    value={taxSettings.taxNumber}
                    onChange={handleTaxSettingChange("taxNumber")}
                    variant="outlined"
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={taxSettings.includeTaxInPrice}
                        onChange={handleTaxSettingChange("includeTaxInPrice")}
                      />
                    }
                    label="تضمين الضريبة في سعر المنتج"
                  />
                </Grid>
              </>
            )}
          </Grid>
        </TabPanel>

        {/* Notifications Tab */}
        <TabPanel value={tabValue} index={4}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                إشعارات البريد الإلكتروني
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <Email />
                  </ListItemIcon>
                  <ListItemText primary="طلبات جديدة" secondary="تلقي إشعار عند وصول طلب جديد" />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={notificationSettings.emailNewOrder}
                      onChange={handleNotificationChange("emailNewOrder")}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Email />
                  </ListItemIcon>
                  <ListItemText primary="مخزون منخفض" secondary="تلقي إشعار عند انخفاض المخزون" />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={notificationSettings.emailLowStock}
                      onChange={handleNotificationChange("emailLowStock")}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Email />
                  </ListItemIcon>
                  <ListItemText primary="تقييمات جديدة" secondary="تلقي إشعار عند وصول تقييم جديد" />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={notificationSettings.emailReviews}
                      onChange={handleNotificationChange("emailReviews")}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </Grid>

            <Grid item xs={12}>
              <Divider />
              <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold", mt: 2 }}>
                إشعارات الرسائل النصية
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <Sms />
                  </ListItemIcon>
                  <ListItemText primary="طلبات جديدة" secondary="تلقي رسالة نصية عند وصول طلب جديد" />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={notificationSettings.smsNewOrder}
                      onChange={handleNotificationChange("smsNewOrder")}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Sms />
                  </ListItemIcon>
                  <ListItemText primary="مخزون منخفض" secondary="تلقي رسالة نصية عند انخفاض المخزون" />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={notificationSettings.smsLowStock}
                      onChange={handleNotificationChange("smsLowStock")}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </Grid>

            <Grid item xs={12}>
              <Divider />
              <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold", mt: 2 }}>
                الإشعارات الفورية
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <Push />
                  </ListItemIcon>
                  <ListItemText primary="طلبات جديدة" secondary="تلقي إشعار فوري عند وصول طلب جديد" />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={notificationSettings.pushNewOrder}
                      onChange={handleNotificationChange("pushNewOrder")}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Push />
                  </ListItemIcon>
                  <ListItemText primary="مخزون منخفض" secondary="تلقي إشعار فوري عند انخفاض المخزون" />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={notificationSettings.pushLowStock}
                      onChange={handleNotificationChange("pushLowStock")}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Appearance Tab */}
        <TabPanel value={tabValue} index={5}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                إعدادات المظهر
              </Typography>
              <Alert severity="info" sx={{ mb: 3 }}>
                قريباً: ستتمكن من تخصيص مظهر متجرك بالكامل
              </Alert>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{ p: 3, textAlign: "center" }}>
                <LightMode sx={{ fontSize: 48, color: "primary.main", mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  المظهر الفاتح
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  مظهر كلاسيكي ونظيف
                </Typography>
                <Button variant="outlined" fullWidth>
                  تطبيق
                </Button>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{ p: 3, textAlign: "center" }}>
                <DarkMode sx={{ fontSize: 48, color: "primary.main", mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  المظهر الداكن
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  مظهر عصري ومريح للعين
                </Typography>
                <Button variant="outlined" fullWidth>
                  تطبيق
                </Button>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Integrations Tab */}
        <TabPanel value={tabValue} index={6}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                التكاملات المتاحة
              </Typography>
              <Alert severity="info" sx={{ mb: 3 }}>
                قريباً: ستتمكن من ربط متجرك مع منصات أخرى
              </Alert>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                    <Avatar sx={{ bgcolor: "primary.main" }}>
                      <Globe />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        Google Analytics
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        تتبع زوار متجرك وسلوكهم
                      </Typography>
                    </Box>
                  </Box>
                  <Button variant="outlined" fullWidth disabled>
                    قريباً
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                    <Avatar sx={{ bgcolor: "secondary.main" }}>
                      <Email />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        MailChimp
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        إدارة قوائم البريد الإلكتروني
                      </Typography>
                    </Box>
                  </Box>
                  <Button variant="outlined" fullWidth disabled>
                    قريباً
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Save Button */}
        <Box sx={{ p: 3, borderTop: 1, borderColor: "divider" }}>
          <Button
            variant="contained"
            size="large"
            onClick={handleSaveSettings}
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              px: 4,
            }}
          >
            حفظ جميع الإعدادات
          </Button>
        </Box>
      </Card>
    </Container>
  )
}

export default SellerSettings
