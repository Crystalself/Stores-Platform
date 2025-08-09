"use client"

import { useTranslations } from "next-intl"
import { useCart } from "@/hooks/use-cart"
import { CartItem } from "@/components/cart/cart-item"
import { CartFiltersComponent } from "@/components/cart/CartFilters"
import { CartSummary } from "@/components/cart/cart-summary"
import { EmptyCart } from "@/components/cart/empty-cart"
import {
  Container,
  Typography,
  Box,
  Grid,
  Button,
  Skeleton,
  Card,
  CardContent,
  Fade,
  Alert,
  Snackbar,
  Paper,
} from "@mui/material"
import { ShoppingCart as ShoppingCartIcon, ClearAll as ClearAllIcon, Info as InfoIcon } from "@mui/icons-material"
import { useState } from "react"

export default function CartPage() {
  const t = useTranslations("cart")
  const { cartItems, loading, filters, totals, updateQuantity, removeItem, updateFilters, clearCart } = useCart()
  const [showSuccess, setShowSuccess] = useState(false)

  const handleCheckout = () => {
    // TODO: Implement checkout logic
    setShowSuccess(true)
    setTimeout(() => {
      alert(t("checkoutSuccess"))
    }, 1000)
  }

  const handleClearCart = () => {
    if (window.confirm(t("confirmClearCart"))) {
      clearCart()
    }
  }

  if (loading && cartItems.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            {[1, 2, 3].map((i) => (
              <Card key={i} sx={{ mb: 2 }}>
                <CardContent>
                  <Box display="flex" gap={2}>
                    <Skeleton variant="rectangular" width={180} height={180} />
                    <Box flex={1}>
                      <Skeleton variant="text" width="60%" height={32} />
                      <Skeleton variant="text" width="40%" height={24} />
                      <Skeleton variant="text" width="30%" height={24} />
                      <Skeleton variant="rectangular" width={200} height={40} sx={{ mt: 2 }} />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Grid>
          <Grid item xs={12} md={4}>
            <Skeleton variant="rectangular" height={400} />
          </Grid>
        </Grid>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Fade in timeout={500}>
        <Box mb={4}>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <Box display="flex" alignItems="center" gap={2}>
              <ShoppingCartIcon sx={{ fontSize: 40, color: "primary.main" }} />
              <Typography variant="h3" fontWeight="bold">
                {t("title")}
              </Typography>
            </Box>
            {cartItems.length > 0 && (
              <Button
                variant="outlined"
                color="error"
                startIcon={<ClearAllIcon />}
                onClick={handleClearCart}
                disabled={loading}
              >
                {t("clearCart")}
              </Button>
            )}
          </Box>
          <Typography variant="body1" color="text.secondary">
            {cartItems.length > 0 ? t("itemsInCart", { count: totals.totalItems }) : t("emptyDescription")}
          </Typography>
        </Box>
      </Fade>

      {cartItems.length === 0 ? (
        <Fade in timeout={700}>
          <div>
            <EmptyCart />
          </div>
        </Fade>
      ) : (
        <Grid container spacing={4}>
          {/* Cart Items */}
          <Grid item xs={12} md={8}>
            <Fade in timeout={600}>
              <div>
                <CartFiltersComponent filters={filters} onFiltersChange={updateFilters} itemCount={cartItems.length} />

                {/* Shipping Alert */}
                {totals.subtotal > 50 && totals.subtotal < 100 && (
                  <Alert severity="info" sx={{ mb: 2 }} icon={<InfoIcon />}>
                    {t("almostFreeShipping", { amount: (100 - totals.subtotal).toFixed(2) })}
                  </Alert>
                )}

                {/* Cart Statistics */}
                <Paper elevation={1} sx={{ p: 2, mb: 3, backgroundColor: "primary.50" }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
                    <Typography variant="body2" color="text.secondary">
                      {t("cartValue")}: <strong>${totals.subtotal.toFixed(2)}</strong>
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t("totalItems")}: <strong>{totals.totalItems}</strong>
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t("estimatedSavings")}:{" "}
                      <strong>
                        $
                        {cartItems
                          .reduce(
                            (sum, item) => sum + ((item.product.price * item.product.discount) / 100) * item.quantity,
                            0,
                          )
                          .toFixed(2)}
                      </strong>
                    </Typography>
                  </Box>
                </Paper>

                <Box>
                  {cartItems.map((item, index) => (
                    <Fade in timeout={300 + index * 100} key={item.product.id}>
                      <div>
                        <CartItem
                          item={item}
                          onQuantityChange={updateQuantity}
                          onRemove={removeItem}
                          loading={loading}
                        />
                      </div>
                    </Fade>
                  ))}
                </Box>
              </div>
            </Fade>
          </Grid>

          {/* Cart Summary */}
          <Grid item xs={12} md={4}>
            <Fade in timeout={800}>
              <div>
                <CartSummary totals={totals} onCheckout={handleCheckout} loading={loading} />
              </div>
            </Fade>
          </Grid>
        </Grid>
      )}

      {/* Success Snackbar */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={3000}
        onClose={() => setShowSuccess(false)}
        message={t("itemUpdated")}
      />
    </Container>
  )
}
