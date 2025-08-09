"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  Divider,
  Grid,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  IconButton,
  useMediaQuery,
  useTheme as useMuiTheme,
} from "@mui/material"
import {
  Close as CloseIcon,
  LocationOn as LocationIcon,
  Message as MessageIcon,
  Payment as PaymentIcon,
  LocalShipping as ShippingIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  Print as PrintIcon,
  Download as DownloadIcon,
} from "@mui/icons-material"
import { useTranslations } from "next-intl"
import { OrderStatusChip } from "./order-status-chip"
import type { Order, OrderStatus } from "@/types/order"

interface OrderDetailsModalProps {
  open: boolean
  onClose: () => void
  orderId: number | null
  onGetOrderDetails: (orderId: number) => Promise<Order | null>
}

export function OrderDetailsModal({ open, onClose, orderId, onGetOrderDetails }: OrderDetailsModalProps) {
  const t = useTranslations("orders")
  const muiTheme = useMuiTheme()
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("md"))
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open && orderId) {
      loadOrderDetails()
    }
  }, [open, orderId])

  const loadOrderDetails = async () => {
    if (!orderId) return
    setLoading(true)
    try {
      const orderData = await onGetOrderDetails(orderId)
      setOrder(orderData)
    } catch (error) {
      console.error("Failed to load order details:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getOrderSteps = (status: OrderStatus) => {
    const steps = [
      { key: "PENDING", label: t("statusPending"), icon: <ScheduleIcon /> },
      { key: "CONFIRMED", label: t("statusConfirmed"), icon: <CheckIcon /> },
      { key: "PROCESSING", label: t("statusProcessing"), icon: <ShippingIcon /> },
      { key: "SHIPPED", label: t("statusShipped"), icon: <ShippingIcon /> },
      { key: "DELIVERED", label: t("statusDelivered"), icon: <CheckIcon /> },
    ]

    const statusOrder = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"]
    const currentIndex = statusOrder.indexOf(status)

    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
      active: index === currentIndex,
    }))
  }

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    // TODO: Implement PDF download
    console.log("Download order as PDF")
  }

  if (!open) return null

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : 3,
          background: "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)",
          backdropFilter: "blur(20px)",
          maxHeight: "90vh",
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          p: 3,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          position: "relative",
        }}
      >
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h5" fontWeight="bold">
              {order ? t("orderNumber", { number: order.id }) : t("orderDetails")}
            </Typography>
            {order && (
              <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
                {formatDate(order.created_at)}
              </Typography>
            )}
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <IconButton onClick={handlePrint} sx={{ color: "white" }}>
              <PrintIcon />
            </IconButton>
            <IconButton onClick={handleDownload} sx={{ color: "white" }}>
              <DownloadIcon />
            </IconButton>
            <IconButton onClick={onClose} sx={{ color: "white" }}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" py={8}>
            <CircularProgress size={60} />
          </Box>
        ) : order ? (
          <Box>
            {/* Order Status */}
            <Box sx={{ p: 3, backgroundColor: "rgba(102, 126, 234, 0.05)" }}>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
                <Typography variant="h6" fontWeight="bold">
                  {t("orderStatus")}
                </Typography>
                <OrderStatusChip status={order.status} size="medium" />
              </Box>

              {/* Order Progress */}
              {order.status !== "CANCELLED" && (
                <Stepper
                  activeStep={getOrderSteps(order.status).findIndex((step) => step.active)}
                  orientation="horizontal"
                >
                  {getOrderSteps(order.status).map((step, index) => (
                    <Step key={step.key} completed={step.completed}>
                      <StepLabel
                        StepIconComponent={() => (
                          <Box
                            sx={{
                              width: 32,
                              height: 32,
                              borderRadius: "50%",
                              backgroundColor: step.completed
                                ? "success.main"
                                : step.active
                                  ? "primary.main"
                                  : "grey.300",
                              color: "white",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            {step.icon}
                          </Box>
                        )}
                      >
                        <Typography variant="caption" sx={{ fontWeight: step.active ? 600 : 400 }}>
                          {step.label}
                        </Typography>
                      </StepLabel>
                    </Step>
                  ))}
                </Stepper>
              )}
            </Box>

            <Box sx={{ p: 3 }}>
              {/* Order Summary */}
              <Box
                sx={{
                  p: 3,
                  borderRadius: 2,
                  backgroundColor: "rgba(16, 185, 129, 0.05)",
                  border: "1px solid rgba(16, 185, 129, 0.2)",
                  mb: 3,
                }}
              >
                <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: "success.main" }}>
                  {t("orderSummary")}
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={6} sm={3}>
                    <Box textAlign="center">
                      <PaymentIcon sx={{ color: "success.main", fontSize: 32, mb: 1 }} />
                      <Typography variant="h5" fontWeight="bold" color="success.main">
                        ${order.total.toFixed(2)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {t("totalAmount")}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Box textAlign="center">
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: "50%",
                          backgroundColor: order.paid ? "success.main" : "error.main",
                          color: "white",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          mx: "auto",
                          mb: 1,
                        }}
                      >
                        {order.paid ? <CheckIcon /> : <CancelIcon />}
                      </Box>
                      <Typography variant="body2" fontWeight="bold" color={order.paid ? "success.main" : "error.main"}>
                        {order.paid ? t("paid") : t("unpaid")}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {t("paymentStatus")}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Box textAlign="center">
                      <ShippingIcon
                        sx={{ color: order.delivery ? "info.main" : "warning.main", fontSize: 32, mb: 1 }}
                      />
                      <Typography
                        variant="body2"
                        fontWeight="bold"
                        color={order.delivery ? "info.main" : "warning.main"}
                      >
                        {order.delivery ? t("delivered") : t("pending")}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {t("deliveryStatus")}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Box textAlign="center">
                      <Typography variant="h5" fontWeight="bold" color="primary.main" sx={{ mb: 1 }}>
                        {order.products.length}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {t("totalItems")}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>

              {/* Order Items */}
              <Box mb={3}>
                <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: "primary.main" }}>
                  {t("orderItems")}
                </Typography>
                <List>
                  {order.products.map((product) => (
                    <ListItem
                      key={product.id}
                      sx={{
                        p: 2,
                        mb: 1,
                        borderRadius: 2,
                        backgroundColor: "rgba(248, 250, 252, 0.8)",
                        border: "1px solid rgba(0, 0, 0, 0.05)",
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar src={product.thumbnail_image} variant="rounded" sx={{ width: 64, height: 64, mr: 2 }}>
                          {product.name[0]}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="body1" fontWeight="bold">
                            {product.name}
                          </Typography>
                        }
                        secondary={
                          <Box mt={1}>
                            <Box display="flex" alignItems="center" gap={2} mb={1}>
                              <Typography variant="body2" color="text.secondary">
                                {t("quantity")}: {product.quantity}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {t("unitPrice")}: ${product.price.toFixed(2)}
                              </Typography>
                              {product.discount && (
                                <Box
                                  sx={{
                                    px: 1,
                                    py: 0.25,
                                    borderRadius: 1,
                                    backgroundColor: "error.main",
                                    color: "white",
                                    fontSize: "0.75rem",
                                    fontWeight: 600,
                                  }}
                                >
                                  -{product.discount}% {t("discount")}
                                </Box>
                              )}
                            </Box>
                            <Typography variant="h6" fontWeight="bold" color="success.main">
                              ${product.total.toFixed(2)}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Delivery Information */}
              <Box mb={3}>
                <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: "primary.main" }}>
                  {t("deliveryInformation")}
                </Typography>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: "rgba(59, 130, 246, 0.05)",
                    border: "1px solid rgba(59, 130, 246, 0.2)",
                  }}
                >
                  <Box display="flex" alignItems="flex-start" gap={2}>
                    <LocationIcon sx={{ color: "info.main", mt: 0.5 }} />
                    <Box>
                      <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                        {t("deliveryAddress")}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {order.address}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>

              {/* Order Note */}
              {order.message && (
                <Box mb={3}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: "primary.main" }}>
                    {t("orderNote")}
                  </Typography>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      backgroundColor: "rgba(245, 158, 11, 0.05)",
                      border: "1px solid rgba(245, 158, 11, 0.2)",
                    }}
                  >
                    <Box display="flex" alignItems="flex-start" gap={2}>
                      <MessageIcon sx={{ color: "warning.main", mt: 0.5 }} />
                      <Typography variant="body2" sx={{ fontStyle: "italic" }}>
                        "{order.message}"
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        ) : (
          <Box display="flex" justifyContent="center" alignItems="center" py={8}>
            <Typography variant="h6" color="text.secondary">
              {t("orderNotFound")}
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, backgroundColor: "rgba(248, 250, 252, 0.5)" }}>
        <Button onClick={onClose} variant="contained" size="large" fullWidth={isMobile}>
          {t("close")}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
