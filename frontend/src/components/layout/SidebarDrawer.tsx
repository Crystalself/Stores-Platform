// components/layout/SidebarDrawer.tsx

"use client";

import React from "react";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Divider,
  Box,
  useTheme,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import StorefrontIcon from "@mui/icons-material/Storefront";
import LogoutIcon from "@mui/icons-material/Logout";

import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";

import { useAuth } from "@/contexts/AuthContext";

export default function SidebarDrawer() {
  const [open, setOpen] = React.useState(false);
  const t = useTranslations("SidebarDrawer");
  const locale = useLocale();
  const router = useRouter();
  const { isAuthenticated, logout } = useAuth();

  // افتح / اغلق السايدبار
  const toggleDrawer = () => setOpen((prev) => !prev);

  // اتجاه السايدبار حسب اللغة (يمين للعربية، يسار للإنجليزية)
  const anchor = locale === "ar" ? "right" : "left";

  // روابط التنقل
  const navLinks = [
    { text: t("home"), icon: <HomeIcon />, href: `/${locale}` },
    { text: t("account"), icon: <AccountCircleIcon />, href: `/${locale}/account` },
    { text: t("wallet"), icon: <AccountBalanceWalletIcon />, href: `/${locale}/wallet` },
    { text: t("cart"), icon: <ShoppingCartIcon />, href: `/${locale}/cart` },
    { text: t("products"), icon: <StorefrontIcon />, href: `/${locale}/products` },
    { text: t("offers"), icon: <LocalOfferIcon />, href: `/${locale}/proudcts/offers` },
  ];

  // عند الضغط على الرابط
  const handleNavigate = (href: string) => {
    router.push(href);
    setOpen(false);
  };

  return (
    <>
      {/* زر فتح السايدبار */}
      <IconButton
        edge="start"
        color="inherit"
        aria-label="open drawer"
        onClick={toggleDrawer}
        sx={{ mr: 2 }}
      >
        <MenuIcon />
      </IconButton>

      {/* السايدبار */}
      <Drawer anchor={anchor} open={open} onClose={toggleDrawer}>
        <Box
          sx={{
            width: 250,
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
          role="presentation"
          onClick={toggleDrawer}
          onKeyDown={(e) => {
            if (e.key === "Tab" || e.key === "Shift") return;
            toggleDrawer();
          }}
        >
          <List>
            {navLinks.map(({ text, icon, href }) => (
              <ListItemButton key={text} onClick={() => handleNavigate(href)}>
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            ))}
          </List>

          <Divider sx={{ my: 1 }} />

          {/* زر تسجيل الخروج أو تسجيل الدخول */}
          {isAuthenticated ? (
            <ListItemButton
              onClick={() => {
                logout();
                setOpen(false);
              }}
            >
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary={t("logout")} />
            </ListItemButton>
          ) : (
            <ListItemButton onClick={() => handleNavigate(`/${locale}/auth/login`)}>
              <ListItemIcon>
                <AccountCircleIcon />
              </ListItemIcon>
              <ListItemText primary={t("login")} />
            </ListItemButton>
          )}
        </Box>
      </Drawer>
    </>
  );
}
