"use client";

import React, { useState } from "react";
import {
  Box, Button, Chip, CircularProgress, Dialog, DialogContent, DialogTitle, Divider, Grid, IconButton, Menu, MenuItem, Snackbar, Stack, Tooltip, Typography, useMediaQuery, useTheme, Fade, Alert, Rating,
} from "@mui/material";
import {
  Share, MoreVert, CheckCircle, Info, Report, Search, Block, Close as CloseIcon, Undo, Verified, GppGood,
} from "@mui/icons-material";
import { useTranslations } from "next-intl";
// import MuiLink from "@mui/material/Link";
import { motion } from "framer-motion";
import { User } from "@/models/user";
import { Product } from "@/models/product";
import About from "@/components/stores/About"; // عدل المسار إذا مختلف


export default function StoreHeader({
  seller,
  featuredProducts,
  sellerProducts,
}: {
  seller: User;
  featuredProducts: Product[];
  sellerProducts: Product[];
}) {
  const t = useTranslations("headerOfStore");
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("lg"));

  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollowLoading, setIsFollowLoading] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [dialogType, setDialogType] = useState<
    "about" | "report" | "search" | "block" | "none"
  >("none");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "info"
  >("info");
  const [undoAvailable, setUndoAvailable] = useState(false);

  const handleToggleFollow = () => {
    setIsFollowLoading(true);
    setTimeout(() => {
      setIsFollowing((prev) => !prev);
      setIsFollowLoading(false);
      setSnackbarMessage(
        !isFollowing ? t("followedMessage") : t("unfollowedMessage")
      );
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setUndoAvailable(!isFollowing);
    }, 1000);
  };

  const handleUndoUnfollow = () => {
    setIsFollowing(true);
    setSnackbarOpen(false);
  };

  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(e.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleDialogOpen = (type: typeof dialogType) => {
    setDialogType(type);
    handleMenuClose();
  };

  const handleDialogClose = () => {
    setDialogType("none");
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const isMenuOpen = Boolean(menuAnchorEl);


  const renderDialogContent = () => {
    switch (dialogType) {
      case "about":
        return <About seller={seller} />;        ;
      case "report":
        return <Typography>{t("reportStoreDescription")}</Typography>;
      case "search":
        return <Typography>{t("advancedSearchDescription")}</Typography>;
      case "block":
        return <Typography>{t("blockSellerDescription")}</Typography>;
      default:
        return null;
    }
  };

  const chipStyles = {
    // استخدام ألوان من الثيم لتعمل في الوضع الفاتح والداكن
    bgcolor: theme.palette.mode === 'light' ? 'grey.200' : 'grey.800',
    color: 'text.primary',
    border: '1px solid',
    borderColor: 'divider',

    // تحديد الخصائص التي ستتغير بشكل ناعم
    transition: theme.transitions.create(['transform', 'box-shadow', 'background-color'], {
      duration: theme.transitions.duration.short,
    }),

    // الأنماط عند مرور الماوس
    '&:hover': {
      cursor: 'pointer',
      // تأثير الرفع للأعلى
      transform: 'translateY(-3px)',
      // ظل لإعطاء عمق
      boxShadow: theme.shadows[4],
      // تغيير بسيط في لون الخلفية
      bgcolor: 'secondary.dark', // يصبح اللون أغمق عند الـ hover

    },
  };

  // 2. نمط للشريحة المميزة يورث الأنماط السابقة مع تغيير اللون
  const featuredChipStyles = {
    ...chipStyles, // يرث كل خصائص الحركة والحدود
    bgcolor: 'secondary.main',
    color: 'secondary.contrastText',
    borderColor: 'secondary.dark', // حد بلون أغمق قليلاً

    '&:hover': {
      ...chipStyles['&:hover'], // يرث خصائص الرفع والظل
      bgcolor: 'secondary.dark', // يصبح اللون أغمق عند الـ hover
    }
  };


  return (
    <Box
      sx={{
        display: isLargeScreen ? "flex" : "block",
        gap: 2,
        px: 2,
        py: 4,
        bgcolor: "background.paper",
        borderRadius: 4,
        boxShadow: 4,
      }}
    >
      <Box flex={1} />

      {/* صورة المتجر */}
      <Box
        flex={1}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Box position="relative">
          <Box
            component="img"
            src={seller.profilePic || "/default-profile.png"}
            alt={seller.storeName || seller.firstName + seller.lastName || "Store Image"}
            sx={{
              width: 180,
              height: 180,
              borderRadius: "50%",
              objectFit: "cover",
              border: "3px solid",
              borderColor: "primary.main",
              boxShadow: 3,
            }}
          />
          {seller.verified && (
            <GppGood
              sx={{
                position: "absolute",
                bottom: 8,
                right: 8,
                // اللون الأزرق هو الأكثر تعبيراً عن التوثيق
                color: "primary.main",
                // يمكنك إضافة خلفية بيضاء لجعل الأيقونة بارزة أكثر
                bgcolor: "white",
                borderRadius: "50%",
                fontSize: 28,
              }}
            />
          )}
        </Box>
      </Box>

      {/* معلومات المتجر */}
      <Box flex={1.8} display="flex" flexDirection="column" gap={3}>
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <Typography variant="h4" fontWeight="bold" color="primary">
            {seller.storeName || `${seller.firstName}  ${seller.lastName} store ` || t('welcomeToStore')}
          </Typography>
        </motion.div>

        <Stack direction="row" spacing={1} flexWrap="wrap">
          <Chip
            label={`${t("followers")}: ${seller.followers?.length}`}
            sx={chipStyles}
          />
          <Chip
            label={`${t("ratings")}: ${seller.rating?.toFixed(1) || "4.7"}`}
            sx={chipStyles}
          />
          <Chip
            label={`Products: ${sellerProducts.length || 20}`}
            sx={chipStyles}
          />
          <Chip
            label={`Featured: ${featuredProducts.length || 5}`}
            sx={featuredChipStyles} // استخدام النمط المخصص هنا
          />
        </Stack>

        <Stack direction="row" alignItems="center" gap={2}>
          <Button
            variant={isFollowing ? "outlined" : "contained"}
            color="secondary"
            onClick={handleToggleFollow}
            disabled={isFollowLoading}
            startIcon={
              isFollowLoading ? (
                <CircularProgress size={20} color="inherit" />
              ) : isFollowing ? (
                <CheckCircle color="success" />
              ) : null
            }
            sx={{
              minWidth: 130,
              fontWeight: 600,
              textTransform: "none",
              px: 3,
              py: 1.2,
              borderRadius: 2,
              boxShadow: isFollowing ? "none" : 2,
              transition: "all 0.3s ease-in-out",
            }}
          >
            {isFollowing ? t("unfollow") : t("follow")}
          </Button>

          <Tooltip title={t("moreOptions")}>
            <IconButton
              onClick={handleMenuOpen}
              size="medium"
              sx={{
                border: "1px solid",
                borderColor: "divider",
                p: 1.2,
                borderRadius: 2,
                transition: "0.2s",
                "&:hover": {
                  backgroundColor: "action.hover",
                },
              }}
            >
              <MoreVert />
            </IconButton>
          </Tooltip>
        </Stack>


        <Typography color="text.secondary" fontStyle="italic">
          {seller.bio || `This store offers high-quality products and fast service. Welcome!`}
        </Typography>
      </Box>

      <Box flex={1} />

      {/* Menus, Dialogs, Snackbars */}
      <Menu anchorEl={menuAnchorEl} open={isMenuOpen} onClose={handleMenuClose}>
        <MenuItem onClick={() => handleDialogOpen("about")}> <Info sx={{ mr: 1 }} /> {t("aboutStore")}</MenuItem>
        <MenuItem onClick={() => handleDialogOpen("report")}> <Report sx={{ mr: 1 }} /> {t("reportStore")}</MenuItem>
        <MenuItem onClick={() => handleDialogOpen("search")}> <Search sx={{ mr: 1 }} /> {t("advancedSearch")}</MenuItem>
        <MenuItem onClick={() => handleDialogOpen("block")}> <Block sx={{ mr: 1 }} /> {t("blockSeller")}</MenuItem>
      </Menu>

      <Dialog open={dialogType !== "none"} onClose={handleDialogClose} TransitionComponent={Fade}>
        <DialogTitle>
          {t(dialogType === "about" ? "aboutStore" : dialogType === "report" ? "reportStore" : dialogType === "block" ? "blockSeller" : "searchLabel")}
          <IconButton onClick={handleDialogClose} sx={{ position: "absolute", right: 8, top: 8 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <Divider />
        <DialogContent>{renderDialogContent()}</DialogContent>
      </Dialog>

      <Snackbar open={snackbarOpen} autoHideDuration={undoAvailable ? 10000 : 4000} onClose={handleSnackbarClose}>
        <Alert
          severity={snackbarSeverity}
          action={undoAvailable ? (
            <Button color="inherit" size="small" onClick={handleUndoUnfollow} startIcon={<Undo />}>
              {t("undo")}
            </Button>
          ) : null}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
