"use client"

import type React from "react"
import { Box, Grid, Card, CardContent, Skeleton } from "@mui/material"

const DashboardLoading: React.FC = () => {
  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Header Skeleton */}
      <Box sx={{ mb: 4 }}>
        <Skeleton variant="text" width={300} height={40} />
        <Skeleton variant="text" width={200} height={24} />
      </Box>

      {/* Stats Cards Skeleton */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[...Array(4)].map((_, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <Box sx={{ flex: 1 }}>
                    <Skeleton variant="text" width={120} height={20} />
                    <Skeleton variant="text" width={80} height={40} />
                    <Skeleton variant="text" width={100} height={16} />
                  </Box>
                  <Skeleton variant="circular" width={56} height={56} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Alert Cards Skeleton */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Skeleton variant="circular" width={40} height={40} />
                  <Box>
                    <Skeleton variant="text" width={120} height={24} />
                    <Skeleton variant="text" width={60} height={32} />
                  </Box>
                </Box>
                <Skeleton variant="rectangular" width={120} height={36} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Skeleton variant="circular" width={40} height={40} />
                  <Box>
                    <Skeleton variant="text" width={120} height={24} />
                    <Skeleton variant="text" width={60} height={32} />
                  </Box>
                </Box>
                <Skeleton variant="rectangular" width={120} height={36} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Recent Orders Skeleton */}
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Skeleton variant="text" width={150} height={24} />
                <Skeleton variant="rectangular" width={100} height={36} />
              </Box>
              {[...Array(4)].map((_, index) => (
                <Box key={index} sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                  <Skeleton variant="circular" width={32} height={32} />
                  <Box sx={{ flex: 1 }}>
                    <Skeleton variant="text" width="60%" height={20} />
                    <Skeleton variant="text" width="40%" height={16} />
                  </Box>
                  <Skeleton variant="rectangular" width={80} height={24} />
                  <Skeleton variant="text" width={80} height={20} />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Sidebar Skeleton */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Skeleton variant="text" width={120} height={24} />
                <Skeleton variant="text" width={60} height={20} />
              </Box>
              {[...Array(4)].map((_, index) => (
                <Box key={index} sx={{ mb: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <Skeleton variant="rectangular" width={48} height={48} sx={{ mr: 2, borderRadius: 1 }} />
                    <Box sx={{ flex: 1 }}>
                      <Skeleton variant="text" width="80%" height={20} />
                      <Skeleton variant="text" width="60%" height={16} />
                    </Box>
                  </Box>
                  <Skeleton variant="rectangular" width="100%" height={6} sx={{ borderRadius: 3 }} />
                </Box>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Skeleton variant="text" width={120} height={24} sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                {[...Array(5)].map((_, index) => (
                  <Grid item xs={index === 0 ? 12 : 6} key={index}>
                    <Skeleton variant="rectangular" width="100%" height={48} />
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default DashboardLoading
