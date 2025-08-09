"use client"

import { useState, useEffect } from "react"
import { Grid, Typography, Box, Paper } from "@mui/material"
import { useTranslations } from "next-intl"
import { People, ShoppingCart, Store, AttachMoney, TrendingUp, Warning } from "@mui/icons-material"
import { adminService } from "@/lib/admin"
import StatCard from "@/components/admin/StatCard"
import RecentActivity from "@/components/admin/RecentActivity"
import UserGrowthChart from "@/components/admin/UserGrowthChart"
import RevenueChart from "@/components/admin/RevenueChart"

interface AdminStats {
  totalUsers: number
  totalOrders: number
  totalStores: number
  totalRevenue: number
  monthlyGrowth: number
  pendingReports: number
  recentActivity: any[]
  userGrowthData: any[]
  revenueData: any[]
}

export default function AdminDashboard() {
  const t = useTranslations("admin.dashboard")
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await adminService.getDashboardStats()
        setStats(data)
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" mb={4} fontWeight="bold">
        {t("title")}
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard title={t("totalUsers")} value={stats?.totalUsers || 0} icon={<People />} color="primary" />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard title={t("totalOrders")} value={stats?.totalOrders || 0} icon={<ShoppingCart />} color="success" />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard title={t("totalStores")} value={stats?.totalStores || 0} icon={<Store />} color="info" />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title={t("totalRevenue")}
            value={`$${stats?.totalRevenue || 0}`}
            icon={<AttachMoney />}
            color="warning"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title={t("monthlyGrowth")}
            value={`${stats?.monthlyGrowth || 0}%`}
            icon={<TrendingUp />}
            color="secondary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard title={t("pendingReports")} value={stats?.pendingReports || 0} icon={<Warning />} color="error" />
        </Grid>
      </Grid>

      {/* Charts and Activity */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" mb={3} fontWeight="bold">
              {t("userGrowth")}
            </Typography>
            <UserGrowthChart data={stats?.userGrowthData || []} />
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" mb={3} fontWeight="bold">
              {t("revenueOverview")}
            </Typography>
            <RevenueChart data={stats?.revenueData || []} />
          </Paper>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" mb={3} fontWeight="bold">
              {t("recentActivity")}
            </Typography>
            <RecentActivity activities={stats?.recentActivity || []} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}
