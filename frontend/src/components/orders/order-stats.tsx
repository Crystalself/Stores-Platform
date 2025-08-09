"use client"

import { Grid, Card, CardContent, Typography, Box, useMediaQuery, useTheme as useMuiTheme } from "@mui/material"
import {
  ShoppingBag as OrdersIcon,
  AttachMoney as MoneyIcon,
  Schedule as PendingIcon,
  Done as DeliveredIcon,
  Cancel as CancelledIcon,
} from "@mui/icons-material"
import { useTranslations } from "next-intl"
import type { OrderStats } from "@/types/order"

interface OrderStatsProps {
  stats: OrderStats
}

export function OrderStatsComponent({ stats }: OrderStatsProps) {
  const t = useTranslations("orders")
  const muiTheme = useMuiTheme()
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("md"))

  const statCards = [
    {
      title: t("totalOrders"),
      value: stats.totalOrders,
      icon: <OrdersIcon />,
      color: "primary.main",
      bgColor: "rgba(102, 126, 234, 0.1)",
    },
    {
      title: t("totalSpent"),
      value: `$${stats.totalSpent.toFixed(2)}`,
      icon: <MoneyIcon />,
      color: "success.main",
      bgColor: "rgba(16, 185, 129, 0.1)",
    },
    {
      title: t("pendingOrders"),
      value: stats.pendingOrders,
      icon: <PendingIcon />,
      color: "warning.main",
      bgColor: "rgba(245, 158, 11, 0.1)",
    },
    {
      title: t("deliveredOrders"),
      value: stats.deliveredOrders,
      icon: <DeliveredIcon />,
      color: "info.main",
      bgColor: "rgba(59, 130, 246, 0.1)",
    },
    {
      title: t("cancelledOrders"),
      value: stats.cancelledOrders,
      icon: <CancelledIcon />,
      color: "error.main",
      bgColor: "rgba(239, 68, 68, 0.1)",
    },
  ]

  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      {statCards.map((stat, index) => (
        <Grid item xs={6} sm={4} md={2.4} key={index}>
          <Card
            elevation={1}
            sx={{
              height: "100%",
              transition: "all 0.3s ease",
              "&:hover": {
                elevation: 3,
                transform: "translateY(-2px)",
              },
            }}
          >
            <CardContent sx={{ p: isMobile ? 2 : 3, textAlign: "center" }}>
              <Box
                sx={{
                  width: isMobile ? 40 : 48,
                  height: isMobile ? 40 : 48,
                  borderRadius: 2,
                  backgroundColor: stat.bgColor,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mx: "auto",
                  mb: 2,
                  color: stat.color,
                }}
              >
                {stat.icon}
              </Box>
              <Typography variant={isMobile ? "h6" : "h5"} fontWeight="bold" color={stat.color} gutterBottom>
                {stat.value}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {stat.title}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}
