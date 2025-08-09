"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Avatar,
  Box,
  Container,
  InputBase,
  alpha,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
} from "@mui/material"
import {
  Search,
  ShoppingCart,
  Notifications,
  Menu as MenuIcon,
  Home,
  Store,
  LocalOffer,
  Person,
  ExitToApp,
  Dashboard,
} from "@mui/icons-material"
import { useTranslations, useLocale } from "next-intl"
import { motion } from "framer-motion"
import { useAuth } from "@/components/auth/AuthProvider"
import { useCart } from "@/contexts/CartContext"
import { useNotifications } from "@/contexts/NotificationContext"
import LanguageSwitch from "@/components/ui/LanguageSwitch"
import ThemeSwitch from "@/components/ui/ThemeSwitch"

/**
 * شريط التنقل الرئيسي للموقع
 * Main Navigation Header Component
 */

export default function Header() {
  const t = useTranslations("navbar")
  const locale = useLocale()
  const router = useRouter()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  const { user, logout, isAuthenticated } = useAuth()
  const { totalItems } = useCart()
  const { unreadCount } = useNotifications()

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // معالج فتح قائمة المستخدم
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  // معالج إغلاق قائمة المستخدم
  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  // معالج البحث
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/${locale}/products?search=${encodeURIComponent(searchQuery)}`)
      setSearchQuery("")
    }
  }

  // معالج تسجيل الخروج
  const handleLogout = async () => {
    await logout()
    handleMenuClose()
    router.push("/")
  }

  // عناصر القائمة المحمولة
  const mobileMenuItems = [
    { label: t("home"), icon: Home, href: "/" },
    { label: t("products"), icon: Store, href: "/products" },
    { label: t("offers"), icon: LocalOffer, href: "/offers" },
    ...(isAuthenticated
      ? [
          { label: t("profile"), icon: Person, href: "/profile" },
          { label: t("orders"), icon: ShoppingCart, href: "/orders" },
          ...(user?.role === "seller"
            ? [{ label: t("sellerDashboard"), icon: Dashboard, href: "/seller/dashboard" }]
            : []),
          ...(user?.role === "admin"
            ? [{ label: t("adminDashboard"), icon: Dashboard, href: "/admin/dashboard" }]
            : []),
          { label: t("logout"), icon: ExitToApp, action: handleLogout },
        ]
      : [
          { label: t("login"), icon: Person, href: "/auth/login" },
          { label: t("register"), icon: Person, href: "/auth/register" },
        ]),
  ]

  return (
    <>
      <AppBar
        position="sticky"
        elevation={1}
        sx={{
          bgcolor: "background.paper",
          color: "text.primary",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ justifyContent: "space-between", py: 1 }}>
            {/* القائمة المحمولة والشعار */}
            <Box display="flex" alignItems="center" gap={2}>
              {isMobile && (
                <IconButton color="inherit" onClick={() => setMobileMenuOpen(true)} edge="start">
                  <MenuIcon />
                </IconButton>
              )}

              {/* الشعار */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Typography
                  variant="h6"
                  component="div"
                  sx={{
                    cursor: "pointer",
                    fontWeight: "bold",
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                  onClick={() => router.push("/")}
                >
                  IUGaza Store
                </Typography>
              </motion.div>
            </Box>

            {/* شريط البحث - مخفي في الشاشات الصغيرة */}
            {!isMobile && (
              <Box
                component="form"
                onSubmit={handleSearch}
                sx={{
                  position: "relative",
                  borderRadius: 2,
                  backgroundColor: alpha(theme.palette.common.black, 0.05),
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.common.black, 0.1),
                  },
                  marginLeft: 2,
                  marginRight: 2,
                  width: "100%",
                  maxWidth: 400,
                }}
              >
                <Box
                  sx={{
                    padding: "0 16px",
                    height: "100%",
                    position: "absolute",
                    pointerEvents: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Search />
                </Box>
                <InputBase
                  placeholder={t("searchPlaceholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  sx={{
                    color: "inherit",
                    width: "100%",
                    "& .MuiInputBase-input": {
                      padding: "12px 12px 12px 48px",
                      transition: theme.transitions.create("width"),
                    },
                  }}
                />
              </Box>
            )}

            {/* الإجراءات الجانبية */}
            <Box display="flex" alignItems="center" gap={1}>
              {!isMobile && (
                <>
                  <LanguageSwitch />
                  <ThemeSwitch />
                </>
              )}

              {isAuthenticated ? (
                <>
                  {/* سلة التسوق */}
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <IconButton color="inherit" onClick={() => router.push(`/${locale}/cart`)}>
                      <Badge badgeContent={totalItems} color="primary">
                        <ShoppingCart />
                      </Badge>
                    </IconButton>
                  </motion.div>

                  {/* الإشعارات */}
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <IconButton color="inherit" onClick={() => router.push(`/${locale}/notifications`)}>
                      <Badge badgeContent={unreadCount} color="error">
                        <Notifications />
                      </Badge>
                    </IconButton>
                  </motion.div>

                  {/* قائمة المستخدم */}
                  <IconButton size="large" edge="end" onClick={handleMenuOpen} color="inherit">
                    <Avatar src={user?.profilePic} alt={user?.firstName} sx={{ width: 32, height: 32 }}>
                      {user?.firstName?.[0]}
                    </Avatar>
                  </IconButton>

                  {/* قائمة المستخدم المنسدلة */}
                  <Menu
                    anchorEl={anchorEl}
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    keepMounted
                    transformOrigin={{ vertical: "top", horizontal: "right" }}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    PaperProps={{
                      sx: {
                        mt: 1,
                        borderRadius: 2,
                        minWidth: 200,
                        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                      },
                    }}
                  >
                    <MenuItem
                      onClick={() => {
                        router.push(`/${locale}/profile`)
                        handleMenuClose()
                      }}
                    >
                      <Person sx={{ mr: 2 }} />
                      {t("profile")}
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        router.push(`/${locale}/orders`)
                        handleMenuClose()
                      }}
                    >
                      <ShoppingCart sx={{ mr: 2 }} />
                      {t("orders")}
                    </MenuItem>
                    {user?.role === "seller" && (
                      <MenuItem
                        onClick={() => {
                          router.push(`/${locale}/seller/dashboard`)
                          handleMenuClose()
                        }}
                      >
                        <Dashboard sx={{ mr: 2 }} />
                        {t("sellerDashboard")}
                      </MenuItem>
                    )}
                    {user?.role === "admin" && (
                      <MenuItem
                        onClick={() => {
                          router.push(`/${locale}/admin/dashboard`)
                          handleMenuClose()
                        }}
                      >
                        <Dashboard sx={{ mr: 2 }} />
                        {t("adminDashboard")}
                      </MenuItem>
                    )}
                    <MenuItem onClick={handleLogout}>
                      <ExitToApp sx={{ mr: 2 }} />
                      {t("logout")}
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <>
                  <Button color="inherit" onClick={() => router.push(`/${locale}/auth/login`)}>
                    {t("login")}
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => router.push(`/${locale}/auth/register`)}
                    sx={{
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      "&:hover": {
                        background: "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
                      },
                    }}
                  >
                    {t("register")}
                  </Button>
                </>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* القائمة المحمولة */}
      <Drawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        PaperProps={{
          sx: { width: 280, borderRadius: "0 16px 16px 0" },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" fontWeight="bold" mb={2}>
            IUGaza Store
          </Typography>
          <Box mb={2}>
            <LanguageSwitch />
            <ThemeSwitch />
          </Box>
        </Box>

        <List>
          {mobileMenuItems.map((item, index) => (
            <ListItem
              key={index}
              button
              onClick={() => {
                if (item.action) {
                  item.action()
                } else if (item.href) {
                  router.push(`/${locale}${item.href}`)
                }
                setMobileMenuOpen(false)
              }}
            >
              <ListItemIcon>
                <item.icon />
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  )
}
