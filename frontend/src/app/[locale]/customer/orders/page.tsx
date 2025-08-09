"use client"

import type React from "react"

import { useState } from "react"
import {
  Container,
  Typography,
  Box,
  Breadcrumbs,
  Link,
  Fade,
  Pagination,
  Alert,
  CircularProgress,
  Button,
  useMediaQuery,
  useTheme as useMuiTheme,
  Snackbar,
} from "@mui/material"
import { Home as HomeIcon, ShoppingBag as OrdersIcon, Refresh as RefreshIcon } from "@mui/icons-material"
import { useTranslations } from "next-intl"
import { useOrders } from "@/hooks/use-orders"
import { OrderCard } from "@/components/orders/order-card"
import { OrderFiltersComponent } from "@/components/orders/order-filters"
import { OrderStatsComponent } from "@/components/orders/order-stats"
import { OrderDetailsModal } from "@/components/orders/order-details-modal"

export default function OrdersPage() {
  const t = useTranslations("orders")
  const muiTheme = useMuiTheme()
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("md"))
  const {
    orders,
    loading,
    error,
    filters,
    orderStats,
    loadOrders,
    cancelOrder,
    reorderItems,
    getOrderDetails,
    updateFilters,
  } = useOrders()

  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null)
  const [detailsModalOpen, setDetailsModalOpen] = useState(false)
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
    open: false,
    message: "",
    severity: "success",
  })

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    const newOffset = (page - 1) * filters.limit
    updateFilters({ offset: newOffset })
  }

  const handleViewDetails = (orderId: number) => {
    setSelectedOrderId(orderId)
    setDetailsModalOpen(true)
  }

  const handleReorder = async (orderId: number) => {
    const success = await reorderItems(orderId)
    setSnackbar({
      open: true,
      message: success ? t("reorderSuccess") : t("reorderError"),
      severity: success ? "success" : "error",
    })
    return success
  }

  const handleCancelOrder = async (orderId: number) => {
    const success = await cancelOrder(orderId)
    setSnackbar({
      open: true,
      message: success ? t("cancelSuccess") : t("cancelError"),
      severity: success ? "success" : "error",
    })
    return success
  }

  const totalPages = Math.ceil(orderStats.totalOrders / filters.limit)
  const currentPage = Math.floor(filters.offset / filters.limit) + 1

  return (
    <>
      {/* Animated Background */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: -1,
          background: `
            radial-gradient(circle at 20% 80%, rgba(102, 126, 234, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(118, 75, 162, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(16, 185, 129, 0.1) 0%, transparent 50%),
            linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)
          `,
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23667eea' fillOpacity='0.03'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
            `,
            animation: "float 20s ease-in-out infinite",
          },
          "@keyframes float": {
            "0%, 100%": { transform: "translateY(0px)" },
            "50%": { transform: "translateY(-10px)" },
          },
        }}
      />

      <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 }, position: "relative", zIndex: 1 }}>
        {/* Breadcrumbs */}
        <Fade in timeout={300}>
          <Box mb={3}>
            <Breadcrumbs>
              <Link
                href="/"
                color="inherit"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  textDecoration: "none",
                  "&:hover": { color: "primary.main" },
                  transition: "color 0.2s ease-in-out",
                }}
              >
                <HomeIcon fontSize="small" />
                {t("home")}
              </Link>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "primary.main", fontWeight: 500 }}>
                <OrdersIcon fontSize="small" />
                {t("orders")}
              </Box>
            </Breadcrumbs>
          </Box>
        </Fade>

        {/* Page Header */}
        <Fade in timeout={500}>
          <Box mb={4} textAlign={isMobile ? "center" : "left"}>
            <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2} mb={2}>
              <Typography
                variant={isMobile ? "h4" : "h2"}
                fontWeight="bold"
                sx={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {t("myOrders")}
              </Typography>
              <Button
                variant="contained"
                startIcon={<RefreshIcon />}
                onClick={() => loadOrders()}
                disabled={loading}
                size={isMobile ? "small" : "medium"}
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
                {t("refresh")}
              </Button>
            </Box>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: isMobile ? "auto" : 0 }}>
              {t("ordersDescription")}
            </Typography>
          </Box>
        </Fade>

        {/* Order Statistics */}
        <Fade in timeout={700}>
          <div>
            <OrderStatsComponent stats={orderStats} />
          </div>
        </Fade>

        {/* Filters */}
        <Fade in timeout={900}>
          <div>
            <OrderFiltersComponent
              filters={filters}
              onFiltersChange={updateFilters}
              totalCount={orderStats.totalOrders}
            />
          </div>
        </Fade>

        {/* Error State */}
        {error && (
          <Fade in timeout={1100}>
            <Alert
              severity="error"
              sx={{
                mb: 3,
                borderRadius: 2,
                backgroundColor: "rgba(239, 68, 68, 0.1)",
                border: "1px solid rgba(239, 68, 68, 0.2)",
              }}
            >
              {error}
            </Alert>
          </Fade>
        )}

        {/* Loading State */}
        {loading && orders.length === 0 && (
          <Box display="flex" justifyContent="center" py={8}>
            <CircularProgress size={60} sx={{ color: "primary.main" }} />
          </Box>
        )}

        {/* Orders List */}
        {!loading && orders.length === 0 && !error && (
          <Fade in timeout={1300}>
            <Box textAlign="center" py={8}>
              <Box
                sx={{
                  width: 120,
                  height: 120,
                  borderRadius: "50%",
                  backgroundColor: "rgba(102, 126, 234, 0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mx: "auto",
                  mb: 3,
                }}
              >
                <OrdersIcon sx={{ fontSize: 60, color: "primary.main", opacity: 0.7 }} />
              </Box>
              <Typography variant="h5" color="text.secondary" fontWeight={500} gutterBottom>
                {t("noOrders")}
              </Typography>
              <Typography variant="body1" color="text.secondary" mb={3}>
                {t("noOrdersDescription")}
              </Typography>
              <Button
                variant="contained"
                href="/products"
                size="large"
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
                {t("startShopping")}
              </Button>
            </Box>
          </Fade>
        )}

        {orders.length > 0 && (
          <Fade in timeout={1300}>
            <Box>
              {orders.map((order, index) => (
                <Fade in timeout={1400 + index * 100} key={order.id}>
                  <div>
                    <OrderCard
                      order={order}
                      onCancel={handleCancelOrder}
                      onViewDetails={handleViewDetails}
                      onReorder={handleReorder}
                      loading={loading}
                    />
                  </div>
                </Fade>
              ))}

              {/* Pagination */}
              {totalPages > 1 && (
                <Box display="flex" justifyContent="center" mt={4}>
                  <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                    size={isMobile ? "small" : "medium"}
                    disabled={loading}
                    sx={{
                      "& .MuiPaginationItem-root": {
                        borderRadius: 2,
                        fontWeight: 600,
                      },
                      "& .Mui-selected": {
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        color: "white",
                        "&:hover": {
                          background: "linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)",
                        },
                      },
                    }}
                  />
                </Box>
              )}
            </Box>
          </Fade>
        )}

        {/* Order Details Modal */}
        <OrderDetailsModal
          open={detailsModalOpen}
          onClose={() => setDetailsModalOpen(false)}
          orderId={selectedOrderId}
          onGetOrderDetails={getOrderDetails}
        />

        {/* Success/Error Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{
              width: "100%",
              borderRadius: 2,
              fontWeight: 500,
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </>
  )
}
