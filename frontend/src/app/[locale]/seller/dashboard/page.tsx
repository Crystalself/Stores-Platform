"use client"

import type React from "react"
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  LinearProgress,
  Paper,
  useTheme,
  alpha,
} from "@mui/material"
import {
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  Inventory,
  People,
  Add,
  ViewList,
  Assessment,
  Inventory2,
  AttachMoney,
  Warning,
  CheckCircle,
} from "@mui/icons-material"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { useLocale } from "next-intl"

// بيانات وهمية محدثة
const mockStats = {
  totalSales: 125000,
  totalOrders: 1250,
  totalProducts: 85,
  totalCustomers: 450,
  pendingOrders: 12,
  lowStock: 5,
  activeProducts: 78,
  growth: {
    sales: 12.5,
    orders: 8.3,
    products: 15.2,
    customers: 22.1,
  },
}

const mockRecentOrders = [
  {
    id: "#12345",
    customer: "أحمد محمد",
    avatar: "/placeholder.svg?height=40&width=40",
    amount: 250,
    status: "pending",
    date: "2024-01-15",
    items: 3,
  },
  {
    id: "#12346",
    customer: "فاطمة علي",
    avatar: "/placeholder.svg?height=40&width=40",
    amount: 180,
    status: "processing",
    date: "2024-01-15",
    items: 1,
  },
  {
    id: "#12347",
    customer: "محمد حسن",
    avatar: "/placeholder.svg?height=40&width=40",
    amount: 320,
    status: "shipped",
    date: "2024-01-14",
    items: 2,
  },
  {
    id: "#12348",
    customer: "سارة أحمد",
    avatar: "/placeholder.svg?height=40&width=40",
    amount: 95,
    status: "delivered",
    date: "2024-01-14",
    items: 1,
  },
]

const mockTopProducts = [
  {
    name: "لابتوب Dell XPS 13",
    sales: 45,
    revenue: 67500,
    image: "/placeholder.svg?height=40&width=40",
    progress: 85,
    trend: "up",
  },
  {
    name: "سماعات Sony WH-1000XM4",
    sales: 32,
    revenue: 9600,
    image: "/placeholder.svg?height=40&width=40",
    progress: 70,
    trend: "up",
  },
  {
    name: "هاتف iPhone 15 Pro",
    sales: 28,
    revenue: 42000,
    image: "/placeholder.svg?height=40&width=40",
    progress: 60,
    trend: "down",
  },
  {
    name: "ساعة Apple Watch Series 9",
    sales: 25,
    revenue: 12500,
    image: "/placeholder.svg?height=40&width=40",
    progress: 45,
    trend: "up",
  },
]

const SellerDashboard: React.FC = () => {
  const t = useTranslations("seller")
  const theme = useTheme()
  const locale = useLocale();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "warning"
      case "processing":
        return "info"
      case "shipped":
        return "primary"
      case "delivered":
        return "success"
      case "cancelled":
        return "error"
      default:
        return "default"
    }
  }

  const getStatusText = (status: string) => {
    return t(`orders.status.${status}`)
  }

  const StatCard = ({ title, value, change, trend, icon, color = "primary" }: any) => (
    <Card
      sx={{
        height: "100%",
        background: `linear-gradient(135deg, ${alpha(theme.palette[color].main, 0.1)} 0%, ${alpha(theme.palette[color].main, 0.05)} 100%)`,
        border: `1px solid ${alpha(theme.palette[color].main, 0.2)}`,
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: theme.shadows[8],
        },
      }}
    >
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Box sx={{ flex: 1 }}>
            <Typography color="text.secondary" gutterBottom variant="body2" sx={{ fontWeight: 500 }}>
              {title}
            </Typography>
            <Typography variant="h4" component="div" sx={{ fontWeight: "bold", mb: 1 }}>
              {typeof value === "number" && title.includes("المبيعات")
                ? `${value.toLocaleString()} ${t("common.currency")}`
                : value.toLocaleString()}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {trend === "up" ? (
                <TrendingUp sx={{ color: "success.main", fontSize: 16, mr: 0.5 }} />
              ) : (
                <TrendingDown sx={{ color: "error.main", fontSize: 16, mr: 0.5 }} />
              )}
              <Typography
                variant="body2"
                sx={{
                  color: trend === "up" ? "success.main" : "error.main",
                  fontWeight: "bold",
                  mr: 1,
                }}
              >
                {change > 0 ? "+" : ""}
                {change}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t("dashboard.stats.thisMonth")}
              </Typography>
            </Box>
          </Box>
          <Avatar
            sx={{
              bgcolor: `${color}.main`,
              width: 56,
              height: 56,
              boxShadow: theme.shadows[4],
            }}
          >
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  )

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: "bold" }}>
          {t("dashboard.welcome")} أحمد محمد 👋
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {t("dashboard.overview")} - {new Date().toLocaleDateString("ar-SA")}
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title={t("dashboard.stats.totalSales")}
            value={mockStats.totalSales}
            change={mockStats.growth.sales}
            trend="up"
            icon={<AttachMoney />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title={t("dashboard.stats.totalOrders")}
            value={mockStats.totalOrders}
            change={mockStats.growth.orders}
            trend="up"
            icon={<ShoppingCart />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title={t("dashboard.stats.totalProducts")}
            value={mockStats.totalProducts}
            change={mockStats.growth.products}
            trend="up"
            icon={<Inventory />}
            color="info"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title={t("dashboard.stats.totalCustomers")}
            value={mockStats.totalCustomers}
            change={mockStats.growth.customers}
            trend="up"
            icon={<People />}
            color="secondary"
          />
        </Grid>
      </Grid>

      {/* Alert Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              background: `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.1)} 0%, ${alpha(theme.palette.warning.main, 0.05)} 100%)`,
              border: `1px solid ${alpha(theme.palette.warning.main, 0.3)}`,
            }}
          >
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar sx={{ bgcolor: "warning.main" }}>
                    <Warning />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                      {t("dashboard.stats.pendingOrders")}
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: "bold", color: "warning.main" }}>
                      {mockStats.pendingOrders}
                    </Typography>
                  </Box>
                </Box>
                <Button
                  variant="contained"
                  color="warning"
                  component={Link}
                  href={`/${locale}/seller/orders`}
                  sx={{ minWidth: 120 }}
                >
                  {t("navigation.viewOrders")}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card
            sx={{
              background: `linear-gradient(135deg, ${alpha(theme.palette.error.main, 0.1)} 0%, ${alpha(theme.palette.error.main, 0.05)} 100%)`,
              border: `1px solid ${alpha(theme.palette.error.main, 0.3)}`,
            }}
          >
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar sx={{ bgcolor: "error.main" }}>
                    <Inventory2 />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                      {t("dashboard.stats.lowStock")}
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: "bold", color: "error.main" }}>
                      {mockStats.lowStock}
                    </Typography>
                  </Box>
                </Box>
                <Button
                  variant="contained"
                  color="error"
                  component={Link}
                  href={`/${locale}/seller/products/manage`}

                  sx={{ minWidth: 120 }}
                >
                  {t("navigation.manageProducts")}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Recent Orders */}
        <Grid item xs={12} lg={8}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h6" component="h2" sx={{ fontWeight: "bold" }}>
                  {t("dashboard.recentOrders.title")}
                </Typography>
                <Button component={Link} href={`/${locale}/seller/orders`} endIcon={<ViewList />}>
                  {t("dashboard.recentOrders.viewAll")}
                </Button>
              </Box>

              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>{t("dashboard.recentOrders.orderId")}</TableCell>
                      <TableCell>{t("dashboard.recentOrders.customer")}</TableCell>
                      <TableCell>{t("dashboard.recentOrders.amount")}</TableCell>
                      <TableCell>{t("dashboard.recentOrders.status")}</TableCell>
                      <TableCell>{t("dashboard.recentOrders.date")}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {mockRecentOrders.map((order) => (
                      <TableRow key={order.id} hover sx={{ cursor: "pointer" }}>
                        <TableCell sx={{ fontWeight: "bold" }}>{order.id}</TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            <Avatar src={order.avatar} sx={{ width: 32, height: 32 }} />
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: "medium" }}>
                                {order.customer}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {order.items} عناصر
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          {order.amount} {t("common.currency")}
                        </TableCell>
                        <TableCell>
                          <Chip label={getStatusText(order.status)} color={getStatusColor(order.status)} size="small" />
                        </TableCell>
                        <TableCell>{order.date}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Top Products & Quick Actions */}
        <Grid item xs={12} lg={4}>
          {/* Top Products */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h6" component="h2" sx={{ fontWeight: "bold" }}>
                  {t("dashboard.topProducts.title")}
                </Typography>
                <Button component={Link} href={`/${locale}/seller/products/manage`} size="small">
                  {t("dashboard.topProducts.viewAll")}
                </Button>
              </Box>

              {mockTopProducts.map((product, index) => (
                <Box key={index} sx={{ mb: 3, "&:last-child": { mb: 0 } }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <Avatar src={product.image} sx={{ mr: 2, width: 48, height: 48 }} variant="rounded" />
                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                      <Typography variant="body2" sx={{ fontWeight: "bold" }} noWrap>
                        {product.name}
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                          {product.sales} {t("dashboard.topProducts.sales")}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          • {product.revenue.toLocaleString()} {t("common.currency")}
                        </Typography>
                        {product.trend === "up" ? (
                          <TrendingUp sx={{ fontSize: 14, color: "success.main" }} />
                        ) : (
                          <TrendingDown sx={{ fontSize: 14, color: "error.main" }} />
                        )}
                      </Box>
                    </Box>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={product.progress}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      "& .MuiLinearProgress-bar": {
                        borderRadius: 3,
                      },
                    }}
                  />
                </Box>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardContent>
              <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: "bold" }}>
                {t("dashboard.quickActions.title")}
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<Add />}
                    component={Link}
                    href={`/${locale}/seller/products/add`}
                    sx={{
                      py: 1.5,
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      "&:hover": {
                        background: "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
                      },
                    }}
                  >
                    {t("dashboard.quickActions.addProduct")}
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<ViewList />}
                    component={Link}
                    href={`/${locale}/seller/orders`}
                    sx={{ py: 1.5 }}
                  >
                    {t("dashboard.quickActions.viewOrders")}
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Inventory2 />}
                    component={Link}
                    href={`/${locale}/seller/products/manage`
}                    sx={{ py: 1.5 }}
                  >
                    {t("dashboard.quickActions.manageInventory")}
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<Assessment />}
                    component={Link}
                    href={`/${locale}/seller/analytics`}
                    sx={{ py: 1.5 }}
                  >
                    {t("dashboard.quickActions.viewReports")}
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<CheckCircle />}
                    component={Link}
                    href={`/${locale}/seller/products/3d`}
                    sx={{ py: 1.5 }}
                  >
                    {t("dashboard.quickActions.add3DProduct")}
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default SellerDashboard
