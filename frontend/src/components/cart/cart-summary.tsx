"use client"

import { useTranslations } from "next-intl"
import { Card, CardContent, Typography, Button, Divider, Box, Chip, List, ListItem, ListItemText } from "@mui/material"
import {
  ShoppingCart as ShoppingCartIcon,
  Payment as PaymentIcon,
  LocalShipping as ShippingIcon,
  Security as SecurityIcon,
} from "@mui/icons-material"
import type { CartTotals } from "@/types/cart"

interface CartSummaryProps {
  totals: CartTotals
  onCheckout: () => void
  loading?: boolean
}

export function CartSummary({ totals, onCheckout, loading }: CartSummaryProps) {
  const t = useTranslations("cart")

  return (
    <Card elevation={3} sx={{ position: "sticky", top: 20 }}>
      <CardContent>
        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <ShoppingCartIcon color="primary" />
          <Typography variant="h6" fontWeight="bold">
            {t("orderSummary")}
          </Typography>
        </Box>

        <List dense>
          <ListItem sx={{ px: 0 }}>
            <ListItemText primary={t("items")} />
            <Typography variant="body2">{totals.totalItems}</Typography>
          </ListItem>

          <ListItem sx={{ px: 0 }}>
            <ListItemText primary={t("subtotal")} />
            <Typography variant="body2">${totals.subtotal.toFixed(2)}</Typography>
          </ListItem>

          <ListItem sx={{ px: 0 }}>
            <ListItemText
              primary={
                <Box display="flex" alignItems="center" gap={1}>
                  <ShippingIcon fontSize="small" />
                  {t("shipping")}
                  {totals.shipping === 0 && <Chip label={t("free")} size="small" color="success" />}
                </Box>
              }
            />
            <Typography variant="body2">${totals.shipping.toFixed(2)}</Typography>
          </ListItem>

          <ListItem sx={{ px: 0 }}>
            <ListItemText primary={t("tax")} />
            <Typography variant="body2">${totals.tax.toFixed(2)}</Typography>
          </ListItem>
        </List>

        <Divider sx={{ my: 2 }} />

        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6" fontWeight="bold">
            {t("total")}
          </Typography>
          <Typography variant="h6" fontWeight="bold" color="primary.main">
            ${totals.finalTotal.toFixed(2)}
          </Typography>
        </Box>

        {totals.subtotal > 100 && (
          <Box mb={2}>
            <Chip
              label={t("freeShippingEarned")}
              color="success"
              variant="outlined"
              size="small"
              sx={{ width: "100%" }}
            />
          </Box>
        )}

        {totals.subtotal > 50 && totals.subtotal < 100 && (
          <Box mb={2}>
            <Chip
              label={t("almostFreeShipping", { amount: (100 - totals.subtotal).toFixed(2) })}
              color="info"
              variant="outlined"
              size="small"
              sx={{ width: "100%" }}
            />
          </Box>
        )}

        <Button
          variant="contained"
          size="large"
          fullWidth
          onClick={onCheckout}
          disabled={loading || totals.totalItems === 0}
          startIcon={<PaymentIcon />}
          sx={{
            py: 1.5,
            fontSize: "1.1rem",
            fontWeight: "bold",
            mb: 1,
          }}
        >
          {t("proceedToCheckout")}
        </Button>

        <Box display="flex" alignItems="center" justifyContent="center" gap={1} mt={1}>
          <SecurityIcon fontSize="small" color="action" />
          <Typography variant="caption" color="text.secondary">
            {t("secureCheckout")}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
}
