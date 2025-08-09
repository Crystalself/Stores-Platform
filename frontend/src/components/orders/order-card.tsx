"use client"

import { useState } from "react"
import {
  Card,
  CardContent,
  Box,
  Typography,
  Button,
  Avatar,
  Grid,
  Divider,
  IconButton,
  Collapse,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  useMediaQuery,
  useTheme as useMuiTheme,
  CircularProgress,
} from "@mui/material"
import {
  ExpandMore as ExpandMoreIcon,
  LocationOn as LocationIcon,
  Message as MessageIcon,
  Payment as PaymentIcon,
  LocalShipping as ShippingIcon,
  Cancel as CancelIcon,
  Visibility as ViewIcon,
  ShoppingCart as CartIcon,
} from "@mui/icons-material"
import { useTranslations } from "next-intl"
import { OrderStatusChip } from "./order-status-chip"
import type { Order } from "@/types/order"

interface OrderCardProps {
  order: Order
  onCancel: (orderId: number) => Promise<boolean>
  onViewDetails: (orderId: number) => void
  onReorder: (orderId: number) => Promise<boolean>
  loading?: boolean
}

export function OrderCard({ order, onCancel, onViewDetails, onReorder, loading }: OrderCardProps) {
  const t = useTranslations("orders")
  const muiTheme = useMuiTheme()
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("md"))
  const [expanded, setExpanded] = useState(false)
  const [cancelDialog, setCancelDialog] = useState(false)
  const [cancelling, setCancelling] = useState(false)
  const [reordering, setReordering] = useState(false)

  const canCancel = ["PENDING", "CONFIRMED"].includes(order.status)
  const canReorder = ["DELIVERED", "CANCELLED"].includes(order.status)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleCancel = async () => {
    setCancelling(true)
    const success = await onCancel(order.id)
    setCancelling(false)
    if (success) {
      setCancelDialog(false)
    }
  }

  const handleReorder = async () => {
    setReordering(true)
    const success = await onReorder(order.id)
    setReordering(false)
  }

  return (
    <>
      <Card
        elevation={0}
        sx={{
          mb: 3,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 3,
          transition: "all 0.3s ease",
          background: "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.9) 100%)",
          backdropFilter: "blur(10px)",
          "&:hover": {
            borderColor: "primary.main",
            transform: "translateY(-4px)",
            boxShadow: "0 12px 40px rgba(102, 126, 234, 0.15)",
          },
        }}
      >
        <CardContent sx={{ p: 3 }}>
          {/* Header */}
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
            <Box>
              <Typography
                variant="h6"
                fontWeight="bold"
                gutterBottom
                sx={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {t("orderNumber", { number: order.id })}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box
                  component="span"
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    backgroundColor: "primary.main",
                  }}
                />
                {formatDate(order.created_at)}
              </Typography>
            </Box>
            <OrderStatusChip status={order.status} size="medium" />
          </Box>

          {/* Order Summary */}
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              backgroundColor: "rgba(102, 126, 234, 0.05)",
              border: "1px solid rgba(102, 126, 234, 0.1)",
              mb: 3,
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={6} sm={3}>
                <Box display="flex" alignItems="center" gap={1}>
                  <PaymentIcon sx={{ color: "success.main", fontSize: 20 }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block">
                      {t("total")}
                    </Typography>
                    <Typography variant="body2" fontWeight="bold" color="success.main">
                      ${order.total.toFixed(2)}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={6} sm={3}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      backgroundColor: order.paid ? "success.main" : "error.main",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        backgroundColor: "white",
                      }}
                    />
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block">
                      {t("payment")}
                    </Typography>
                    <Typography variant="body2" fontWeight="bold" color={order.paid ? "success.main" : "error.main"}>
                      {order.paid ? t("paid") : t("unpaid")}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={6} sm={3}>
                <Box display="flex" alignItems="center" gap={1}>
                  <ShippingIcon sx={{ color: order.delivery ? "info.main" : "warning.main", fontSize: 20 }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block">
                      {t("delivery")}
                    </Typography>
                    <Typography variant="body2" fontWeight="bold" color={order.delivery ? "info.main" : "warning.main"}>
                      {order.delivery ? t("delivered") : t("pending")}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={6} sm={3}>
                <Box display="flex" alignItems="center" gap={1}>
                  <CartIcon sx={{ color: "primary.main", fontSize: 20 }} />
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block">
                      {t("items")}
                    </Typography>
                    <Typography variant="body2" fontWeight="bold" color="primary.main">
                      {order.products.length} {t("items")}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>

          {/* Products Preview */}
          <Box mb={3}>
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom sx={{ color: "text.primary" }}>
              {t("orderItems")}
            </Typography>
            <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
              {order.products.slice(0, 4).map((product, index) => (
                <Box
                  key={product.id}
                  sx={{
                    position: "relative",
                    ml: index > 0 ? -1 : 0,
                    zIndex: 4 - index,
                  }}
                >
                  <Avatar
                    src={product.thumbnail_image}
                    sx={{
                      width: 48,
                      height: 48,
                      border: "3px solid white",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    }}
                  >
                    {product.name[0]}
                  </Avatar>
                </Box>
              ))}
              {order.products.length > 4 && (
                <Box
                  sx={{
                    ml: 1,
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    backgroundColor: "primary.main",
                    color: "white",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                  }}
                >
                  +{order.products.length - 4}
                </Box>
              )}
            </Box>
          </Box>

          {/* Address */}
          <Box display="flex" alignItems="flex-start" gap={1} mb={2}>
            <LocationIcon sx={{ color: "text.secondary", fontSize: 20, mt: 0.5 }} />
            <Box>
              <Typography variant="caption" color="text.secondary" display="block">
                {t("deliveryAddress")}
              </Typography>
              <Typography variant="body2" color="text.primary" sx={{ fontWeight: 500 }}>
                {order.address}
              </Typography>
            </Box>
          </Box>

          {/* Message */}
          {order.message && (
            <Box display="flex" alignItems="flex-start" gap={1} mb={3}>
              <MessageIcon sx={{ color: "info.main", fontSize: 20, mt: 0.5 }} />
              <Box>
                <Typography variant="caption" color="text.secondary" display="block">
                  {t("orderNote")}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.primary"
                  sx={{
                    fontStyle: "italic",
                    p: 1.5,
                    borderRadius: 2,
                    backgroundColor: "rgba(59, 130, 246, 0.05)",
                    border: "1px solid rgba(59, 130, 246, 0.1)",
                  }}
                >
                  "{order.message}"
                </Typography>
              </Box>
            </Box>
          )}

          <Divider sx={{ my: 2 }} />

          {/* Actions */}
          <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
            <Box display="flex" gap={1} flexWrap="wrap">
              <Button
                variant="contained"
                size="small"
                startIcon={<ViewIcon />}
                onClick={() => onViewDetails(order.id)}
                disabled={loading}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)",
                    transform: "translateY(-1px)",
                  },
                }}
              >
                {t("viewDetails")}
              </Button>

              {canReorder && (
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={reordering ? <CircularProgress size={16} /> : <CartIcon />}
                  onClick={handleReorder}
                  disabled={loading || reordering}
                  sx={{
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 600,
                    borderColor: "success.main",
                    color: "success.main",
                    "&:hover": {
                      backgroundColor: "success.main",
                      color: "white",
                      transform: "translateY(-1px)",
                    },
                  }}
                >
                  {reordering ? t("reordering") : t("reorder")}
                </Button>
              )}

              {canCancel && (
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  startIcon={<CancelIcon />}
                  onClick={() => setCancelDialog(true)}
                  disabled={loading}
                  sx={{
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 600,
                    "&:hover": {
                      backgroundColor: "error.main",
                      color: "white",
                      transform: "translateY(-1px)",
                    },
                  }}
                >
                  {t("cancel")}
                </Button>
              )}
            </Box>

            <IconButton
              onClick={() => setExpanded(!expanded)}
              sx={{
                transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.3s ease",
                backgroundColor: "rgba(102, 126, 234, 0.1)",
                "&:hover": {
                  backgroundColor: "rgba(102, 126, 234, 0.2)",
                },
              }}
            >
              <ExpandMoreIcon />
            </IconButton>
          </Box>

          {/* Expanded Content */}
          <Collapse in={expanded}>
            <Box mt={3}>
              <Divider sx={{ mb: 3 }} />
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ color: "primary.main" }}>
                {t("detailedItems")}
              </Typography>
              <List dense>
                {order.products.map((product) => (
                  <ListItem
                    key={product.id}
                    sx={{
                      px: 0,
                      py: 1,
                      borderRadius: 2,
                      mb: 1,
                      backgroundColor: "rgba(248, 250, 252, 0.5)",
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar src={product.thumbnail_image} variant="rounded" sx={{ width: 56, height: 56 }}>
                        {product.name[0]}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography variant="body2" fontWeight="bold">
                          {product.name}
                        </Typography>
                      }
                      secondary={
                        <Box mt={0.5}>
                          <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                            <Typography variant="caption" color="text.secondary">
                              {t("quantity")}: {product.quantity}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              × ${product.price.toFixed(2)}
                            </Typography>
                            {product.discount && (
                              <Box
                                sx={{
                                  px: 1,
                                  py: 0.25,
                                  borderRadius: 1,
                                  backgroundColor: "error.main",
                                  color: "white",
                                  fontSize: "0.625rem",
                                  fontWeight: 600,
                                }}
                              >
                                -{product.discount}%
                              </Box>
                            )}
                          </Box>
                          <Typography variant="body2" fontWeight="bold" color="success.main">
                            ${product.total.toFixed(2)}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          </Collapse>
        </CardContent>
      </Card>

      {/* Cancel Confirmation Dialog */}
      <Dialog
        open={cancelDialog}
        onClose={() => setCancelDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)",
            backdropFilter: "blur(20px)",
          },
        }}
      >
        <DialogTitle sx={{ textAlign: "center", pb: 1 }}>
          <CancelIcon sx={{ fontSize: 48, color: "error.main", mb: 1 }} />
          <Typography variant="h5" fontWeight="bold">
            {t("cancelOrder")}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ textAlign: "center", py: 3 }}>
          <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
            {t("cancelConfirmation", { orderNumber: order.id })}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0, justifyContent: "center", gap: 2 }}>
          <Button
            onClick={() => setCancelDialog(false)}
            disabled={cancelling}
            variant="outlined"
            size="large"
            sx={{ minWidth: 120 }}
          >
            {t("keepOrder")}
          </Button>
          <Button
            onClick={handleCancel}
            color="error"
            variant="contained"
            disabled={cancelling}
            size="large"
            sx={{ minWidth: 120 }}
            startIcon={cancelling ? <CircularProgress size={20} /> : <CancelIcon />}
          >
            {cancelling ? t("cancelling") : t("confirmCancel")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
