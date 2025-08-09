"use client"

import { Typography, Button, Paper } from "@mui/material"
import { ShoppingCart as ShoppingCartIcon, ArrowBack as ArrowBackIcon } from "@mui/icons-material"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"

export function EmptyCart() {
  const t = useTranslations("cart")
  const router = useRouter()

  return (
    <Paper
      elevation={2}
      sx={{
        p: 6,
        textAlign: "center",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
      }}
    >
      <ShoppingCartIcon
        sx={{
          fontSize: 120,
          color: "text.secondary",
          mb: 2,
          opacity: 0.5,
        }}
      />
      <Typography variant="h4" gutterBottom fontWeight="bold">
        {t("emptyTitle")}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 400, mx: "auto" }}>
        {t("emptyDescription")}
      </Typography>
      <Button
        variant="contained"
        size="large"
        startIcon={<ArrowBackIcon />}
        onClick={() => router.push("/products")}
        sx={{
          px: 4,
          py: 1.5,
          borderRadius: 2,
          textTransform: "none",
          fontSize: "1.1rem",
        }}
      >
        {t("continueShopping")}
      </Button>
    </Paper>
  )
}
