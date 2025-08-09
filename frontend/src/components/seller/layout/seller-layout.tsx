"use client"

import React from "react"
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  useTheme,
  useMediaQuery,
  Tooltip,
} from "@mui/material"
import {
  Notifications,
  AccountCircle,
  Settings,
  Store,
  Logout,
  Menu as MenuIcon,
  Dashboard,
  Inventory2,
  ChevronLeft,
  ChevronRight,
  ExpandLess,
  ExpandMore,
  ShoppingCart,
  AddBox,
  ManageAccounts,
} from "@mui/icons-material"
import { useRouter } from "next/navigation"
import LanguageSwitch from "@/components/LanguageSwitch"
import ThemeSwitch from "@/components/ThemeSwitch"
import { useTranslations, useLocale } from "next-intl"


interface SellerLayoutProps {
  children: React.ReactNode
}

const drawerWidthExpanded = 240
const drawerWidthCollapsed = 60

const SellerLayout: React.FC<SellerLayoutProps> = ({ children }) => {
  const t = useTranslations("seller")
  const locale = useLocale();
  const router = useRouter()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  // drawer مفتوح أو مصغر
  const [drawerOpen, setDrawerOpen] = React.useState(true)
  const [mobileOpen, setMobileOpen] = React.useState(false)

  // حالة فتح/إغلاق القوائم الفرعية
  const [openProductsSubmenu, setOpenProductsSubmenu] = React.useState(false)

  const [notificationAnchor, setNotificationAnchor] = React.useState<null | HTMLElement>(null)
  const [profileAnchor, setProfileAnchor] = React.useState<null | HTMLElement>(null)

  const toggleDrawer = () => setDrawerOpen(!drawerOpen)
  const handleMobileDrawerToggle = () => setMobileOpen(!mobileOpen)

  const handleNotificationClick = (e: React.MouseEvent<HTMLElement>) => setNotificationAnchor(e.currentTarget)
  const handleNotificationClose = () => setNotificationAnchor(null)

  const handleProfileClick = (e: React.MouseEvent<HTMLElement>) => setProfileAnchor(e.currentTarget)
  const handleProfileClose = () => setProfileAnchor(null)

  const handleLogout = async () => {
    try {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      router.push(`/${locale}/auth/login`)
    } catch (error) {
      console.error("Logout error:", error)
    }
    handleProfileClose()
  }

  // toggle submenus
  const toggleProductsSubmenu = () => setOpenProductsSubmenu(!openProductsSubmenu)

  // محتوى Drawer مع القوائم الفرعية
  const drawer = (
    <Box
      sx={{
        width: drawerOpen ? drawerWidthExpanded : drawerWidthCollapsed,
        overflowX: "hidden",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* زر الطي / التوسيع */}
      <Box
        sx={{
          display: "flex",
          justifyContent: drawerOpen ? "flex-end" : "center",
          alignItems: "center",
          p: 1,
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Tooltip title={drawerOpen ? "طي القائمة" : "توسيع القائمة"}>
          <IconButton onClick={toggleDrawer} size="small">
            {drawerOpen ? <ChevronLeft /> : <ChevronRight />}
          </IconButton>
        </Tooltip>
      </Box>

      {/* عنوان عند التوسيع */}
      {drawerOpen && (
        <Typography variant="h6" sx={{ m: 2, fontWeight: "bold" }}>
          {t("dashboard.title")}
        </Typography>
      )}

      <Divider />

      <List sx={{ flexGrow: 1 }}>
        {/* Dashboard */}
        <ListItemButton
          onClick={() => router.push(`/${locale}/seller/dashboard`)}
          sx={{ justifyContent: drawerOpen ? "initial" : "center", px: 2.5 }}
        >
          <ListItemIcon
            sx={{ minWidth: 0, mr: drawerOpen ? 3 : "auto", justifyContent: "center" }}
          >
            <Dashboard />
          </ListItemIcon>
          {drawerOpen && <ListItemText primary={t("navigation.dashboard")} />}
        </ListItemButton>

        {/* Orders with submenu */}
        <ListItemButton
  onClick={() => router.push(`/${locale}/seller/orders`)}
  sx={{ justifyContent: drawerOpen ? "initial" : "center", px: 2.5 }}
>
  <ListItemIcon
    sx={{ minWidth: 0, mr: drawerOpen ? 3 : "auto", justifyContent: "center" }}
  >
    <ShoppingCart />
  </ListItemIcon>
  {drawerOpen && <ListItemText primary={t("navigation.orders") || "Orders"} />}
</ListItemButton>


        {/* Products with submenu */}
        <ListItemButton
          onClick={toggleProductsSubmenu}
          sx={{ justifyContent: drawerOpen ? "initial" : "center", px: 2.5 }}
        >
          <ListItemIcon
            sx={{ minWidth: 0, mr: drawerOpen ? 3 : "auto", justifyContent: "center" }}
          >
            <Inventory2 />
          </ListItemIcon>
          {drawerOpen && <ListItemText primary={t("navigation.products")} />}
          {drawerOpen && (openProductsSubmenu ? <ExpandLess /> : <ExpandMore />)}
        </ListItemButton>

        <Collapse in={openProductsSubmenu} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton
              sx={{ pl: drawerOpen ? 6 : 2, justifyContent: drawerOpen ? "initial" : "center" }}
              onClick={() => router.push(`/${locale}/seller/products/3d`)}
            >
              <ListItemIcon
                sx={{ minWidth: 0, mr: drawerOpen ? 3 : "auto", justifyContent: "center" }}
              >
                <Dashboard fontSize="small" />
              </ListItemIcon>
              {drawerOpen && <ListItemText primary="3D" />}
            </ListItemButton>

            <ListItemButton
              sx={{ pl: drawerOpen ? 6 : 2, justifyContent: drawerOpen ? "initial" : "center" }}
              onClick={() => router.push(`/${locale}/seller/products/add`)}
            >
              <ListItemIcon
                sx={{ minWidth: 0, mr: drawerOpen ? 3 : "auto", justifyContent: "center" }}
              >
                <AddBox fontSize="small" />
              </ListItemIcon>
              {drawerOpen && <ListItemText primary="Add" />}
            </ListItemButton>

            <ListItemButton
              sx={{ pl: drawerOpen ? 6 : 2, justifyContent: drawerOpen ? "initial" : "center" }}
              onClick={() => router.push(`/${locale}/seller/products/manage`)}
            >
              <ListItemIcon
                sx={{ minWidth: 0, mr: drawerOpen ? 3 : "auto", justifyContent: "center" }}
              >
                <ManageAccounts fontSize="small" />
              </ListItemIcon>
              {drawerOpen && <ListItemText primary="Manage" />}
            </ListItemButton>
          </List>
        </Collapse>

      </List>

      <Divider />

      {/* Profile و Settings في الأسفل */}
      <List>
        <ListItemButton
          onClick={() => router.push(`/${locale}/seller/profile`)}
          sx={{ justifyContent: drawerOpen ? "initial" : "center", px: 2.5 }}
        >
          <ListItemIcon
            sx={{ minWidth: 0, mr: drawerOpen ? 3 : "auto", justifyContent: "center" }}
          >
            <AccountCircle />
          </ListItemIcon>
          {drawerOpen && <ListItemText primary={t("navigation.profile")} />}
        </ListItemButton>

        <ListItemButton
          onClick={() => router.push(`/${locale}/seller/settings`)}
          sx={{ justifyContent: drawerOpen ? "initial" : "center", px: 2.5 }}
        >
          <ListItemIcon
            sx={{ minWidth: 0, mr: drawerOpen ? 3 : "auto", justifyContent: "center" }}
          >
            <Settings />
          </ListItemIcon>
          {drawerOpen && <ListItemText primary={t("navigation.settings")} />}
        </ListItemButton>

        <ListItemButton onClick={handleLogout} sx={{ justifyContent: drawerOpen ? "initial" : "center", px: 2.5 }}>
          <ListItemIcon
            sx={{ minWidth: 0, mr: drawerOpen ? 3 : "auto", justifyContent: "center" }}
          >
            <Logout />
          </ListItemIcon>
          {drawerOpen && <ListItemText primary={t("navigation.logout")} />}
        </ListItemButton>
      </List>
    </Box>
  )

  return (
    <Box sx={{ display: "flex" }}>
      {/* AppBar */}
      <AppBar
        position="fixed"
        color="default"
        elevation={1}
        sx={{
          width: {
            xs: "100%",
            md: `calc(100% - ${drawerOpen ? drawerWidthExpanded : drawerWidthCollapsed}px)`,
          },
          ml: {
            md: `${drawerOpen ? drawerWidthExpanded : drawerWidthCollapsed}px`,
          },
          bgcolor: "background.paper",
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Toolbar>
          {/* زر القائمة في الموبايل */}
          {isMobile && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleMobileDrawerToggle}
              sx={{ mr: 2, display: { md: "none" } }}
              aria-label="open drawer"
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* زر القائمة في الديسكتوب */}

          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: "bold" }}>
            {t("dashboard.title")}
          </Typography>

          <LanguageSwitch />
          <ThemeSwitch />

          <IconButton color="inherit" onClick={handleNotificationClick} sx={{ mx: 1 }}>
            <Badge badgeContent={3} color="error">
              <Notifications />
            </Badge>
          </IconButton>

          <IconButton onClick={handleProfileClick} sx={{ ml: 1 }}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: "primary.main" }}>
              <AccountCircle />
            </Avatar>
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Drawer الموبايل */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleMobileDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { width: drawerWidthExpanded },
        }}
      >
        {drawer}
      </Drawer>

      {/* Drawer الديسكتوب */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": {
            width: drawerOpen ? drawerWidthExpanded : drawerWidthCollapsed,
            boxSizing: "border-box",
            overflowX: "hidden",
            transition: theme.transitions.create("width", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.standard,
            }),
          },
        }}
        open
      >
        {drawer}
      </Drawer>

      {/* المحتوى الرئيسي */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "background.default",
          p: 3,
          mt: "64px",
          minHeight: "calc(100vh - 64px)",
          transition: theme.transitions.create("margin", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.standard,
          }),
          ml: {
            md: drawerOpen ? `${drawerWidthExpanded}px` : `${drawerWidthCollapsed}px`,
          },
        }}
      >
        {children}
      </Box>

      {/* Notification Menu */}
      <Menu anchorEl={notificationAnchor} open={Boolean(notificationAnchor)} onClose={handleNotificationClose}>
        <MenuItem onClick={handleNotificationClose}>
          <Box sx={{ display: "flex", flexDirection: "column", minWidth: 250 }}>
            <Typography variant="body2" sx={{ fontWeight: "bold" }}>
              طلب جديد #1234
            </Typography>
            <Typography variant="caption" color="text.secondary">
              منذ 5 دقائق
            </Typography>
          </Box>
        </MenuItem>
        <MenuItem onClick={handleNotificationClose}>
          <Box sx={{ display: "flex", flexDirection: "column", minWidth: 250 }}>
            <Typography variant="body2" sx={{ fontWeight: "bold" }}>
              مخزون منخفض: منتج ABC
            </Typography>
            <Typography variant="caption" color="text.secondary">
              منذ ساعة
            </Typography>
          </Box>
        </MenuItem>
        <MenuItem onClick={handleNotificationClose}>
          <Box sx={{ display: "flex", flexDirection: "column", minWidth: 250 }}>
            <Typography variant="body2" sx={{ fontWeight: "bold" }}>
              تقييم جديد 5 نجوم
            </Typography>
            <Typography variant="caption" color="text.secondary">
              منذ يوم
            </Typography>
          </Box>
        </MenuItem>
      </Menu>

      {/* Profile Menu */}
      <Menu anchorEl={profileAnchor} open={Boolean(profileAnchor)} onClose={handleProfileClose}>
        <MenuItem onClick={() => router.push("/seller/profile")}>
          <AccountCircle sx={{ mr: 1 }} />
          {t("navigation.profile")}
        </MenuItem>
        <MenuItem onClick={() => router.push("/seller/store-settings")}>
          <Store sx={{ mr: 1 }} />
          {t("navigation.storeSettings")}
        </MenuItem>
        <MenuItem onClick={() => router.push("/seller/settings")}>
          <Settings sx={{ mr: 1 }} />
          {t("navigation.settings")}
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <Logout sx={{ mr: 1 }} />
          {t("navigation.logout")}
        </MenuItem>
      </Menu>
    </Box>
  )
}

export default SellerLayout
