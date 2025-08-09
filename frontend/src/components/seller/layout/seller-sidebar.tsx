"use client"

import React from "react"
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography,
  Collapse,
  useTheme,
  useMediaQuery,
} from "@mui/material"
import {
  Dashboard,
  Inventory,
  ShoppingCart,
  People,
  Analytics,
  Assessment,
  Settings,
  Store,
  Person,
  Support,
  Help,
  ExpandLess,
  ExpandMore,
} from "@mui/icons-material"
import { useRouter, usePathname } from "next/navigation"
import { useTranslations } from "next-intl"
import { useState } from "react"
import LanguageSwitch from "@/components/LanguageSwitch"
import ThemeSwitch from "@/components/ThemeSwitch"

interface SellerSidebarProps {
  open: boolean
  onClose: () => void
  drawerWidth: number
}

const SellerSidebar: React.FC<SellerSidebarProps> = ({ open, onClose, drawerWidth }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const router = useRouter()
  const pathname = usePathname()
  const t = useTranslations("seller.sidebar")
  const [productsOpen, setProductsOpen] = useState(true)

  const menuItems = [
    {
      key: "dashboard",
      label: t("dashboard"),
      icon: <Dashboard />,
      path: "/seller/dashboard",
    },
    {
      key: "products",
      label: t("products"),
      icon: <Inventory />,
      hasSubmenu: true,
      submenu: [
        {
          key: "manageProducts",
          label: t("manageProducts"),
          path: "/seller/products/manage",
        },
        {
          key: "addProduct",
          label: t("addProduct"),
          path: "/seller/products/add",
        },
      ],
    },
    {
      key: "orders",
      label: t("orders"),
      icon: <ShoppingCart />,
      path: "/seller/orders",
    },
    {
      key: "customers",
      label: t("customers"),
      icon: <People />,
      path: "/seller/customers",
    },
    {
      key: "analytics",
      label: t("analytics"),
      icon: <Analytics />,
      path: "/seller/analytics",
    },
    {
      key: "reports",
      label: t("reports"),
      icon: <Assessment />,
      path: "/seller/reports",
    },
  ]

  const settingsItems = [
    {
      key: "storeSettings",
      label: t("storeSettings"),
      icon: <Store />,
      path: "/seller/store-settings",
    },
    {
      key: "profile",
      label: t("profile"),
      icon: <Person />,
      path: "/seller/profile",
    },
    {
      key: "settings",
      label: t("settings"),
      icon: <Settings />,
      path: "/seller/settings",
    },
  ]

  const supportItems = [
    {
      key: "support",
      label: t("support"),
      icon: <Support />,
      path: "/seller/support",
    },
    {
      key: "help",
      label: t("help"),
      icon: <Help />,
      path: "/seller/help",
    },
  ]

  const handleNavigation = (path: string) => {
    router.push(path)
    if (isMobile) {
      onClose()
    }
  }

  const isActive = (path: string) => {
    return pathname === path
  }

  const isParentActive = (submenu: any[]) => {
    return submenu.some((item) => pathname === item.path)
  }

  const drawer = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Logo */}
      <Box sx={{ p: 2, textAlign: "center", borderBottom: 1, borderColor: "divider" }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: "bold", color: "primary.main" }}>
          IUGaza Store
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {t("dashboard")}
        </Typography>
      </Box>

      {/* Main Navigation */}
      <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
        <List>
          {menuItems.map((item) => (
            <React.Fragment key={item.key}>
              {item.hasSubmenu ? (
                <>
                  <ListItem disablePadding>
                    <ListItemButton
                      onClick={() => setProductsOpen(!productsOpen)}
                      selected={isParentActive(item.submenu || [])}
                      sx={{
                        minHeight: 48,
                        px: 2.5,
                        "&.Mui-selected": {
                          backgroundColor: "primary.light",
                          color: "primary.contrastText",
                          "& .MuiListItemIcon-root": {
                            color: "primary.contrastText",
                          },
                        },
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: 3,
                          justifyContent: "center",
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText primary={item.label} />
                      {productsOpen ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                  </ListItem>
                  <Collapse in={productsOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {item.submenu?.map((subItem) => (
                        <ListItem key={subItem.key} disablePadding>
                          <ListItemButton
                            onClick={() => handleNavigation(subItem.path)}
                            selected={isActive(subItem.path)}
                            sx={{
                              pl: 4,
                              minHeight: 40,
                              "&.Mui-selected": {
                                backgroundColor: "primary.main",
                                color: "primary.contrastText",
                                "&:hover": {
                                  backgroundColor: "primary.dark",
                                },
                              },
                            }}
                          >
                            <ListItemText primary={subItem.label} />
                          </ListItemButton>
                        </ListItem>
                      ))}
                    </List>
                  </Collapse>
                </>
              ) : (
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => handleNavigation(item.path)}
                    selected={isActive(item.path)}
                    sx={{
                      minHeight: 48,
                      px: 2.5,
                      "&.Mui-selected": {
                        backgroundColor: "primary.main",
                        color: "primary.contrastText",
                        "& .MuiListItemIcon-root": {
                          color: "primary.contrastText",
                        },
                        "&:hover": {
                          backgroundColor: "primary.dark",
                        },
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: 3,
                        justifyContent: "center",
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.label} />
                  </ListItemButton>
                </ListItem>
              )}
            </React.Fragment>
          ))}
        </List>

        <Divider sx={{ my: 1 }} />

        {/* Settings */}
        <List>
          {settingsItems.map((item) => (
            <ListItem key={item.key} disablePadding>
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                selected={isActive(item.path)}
                sx={{
                  minHeight: 48,
                  px: 2.5,
                  "&.Mui-selected": {
                    backgroundColor: "primary.main",
                    color: "primary.contrastText",
                    "& .MuiListItemIcon-root": {
                      color: "primary.contrastText",
                    },
                    "&:hover": {
                      backgroundColor: "primary.dark",
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: 3,
                    justifyContent: "center",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Divider sx={{ my: 1 }} />

        {/* Support */}
        <List>
          {supportItems.map((item) => (
            <ListItem key={item.key} disablePadding>
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                selected={isActive(item.path)}
                sx={{
                  minHeight: 48,
                  px: 2.5,
                  "&.Mui-selected": {
                    backgroundColor: "primary.main",
                    color: "primary.contrastText",
                    "& .MuiListItemIcon-root": {
                      color: "primary.contrastText",
                    },
                    "&:hover": {
                      backgroundColor: "primary.dark",
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: 3,
                    justifyContent: "center",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Language and Theme Switches */}
      <Box sx={{ p: 2, borderTop: 1, borderColor: "divider" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
          <Typography variant="caption" color="text.secondary">
            اللغة والثيم
          </Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <LanguageSwitch />
          <ThemeSwitch />
        </Box>
      </Box>
    </Box>
  )

  return (
    <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }} aria-label="seller navigation">
      <Drawer
        variant={isMobile ? "temporary" : "persistent"}
        open={open}
        onClose={onClose}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            borderRight: 1,
            borderColor: "divider",
          },
        }}
      >
        {drawer}
      </Drawer>
    </Box>
  )
}

export default SellerSidebar
