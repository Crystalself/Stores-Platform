"use client"

import type React from "react"
import {
  Box,
  Card,
  CardContent,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material"

const OrdersLoading: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      {/* Header Skeleton */}
      <Box sx={{ mb: 4 }}>
        <Skeleton variant="text" width={250} height={40} />
        <Skeleton variant="text" width={200} height={24} />
      </Box>

      <Card>
        <CardContent>
          {/* Search Skeleton */}
          <Skeleton variant="rectangular" width="100%" height={56} sx={{ mb: 3 }} />

          {/* Tabs Skeleton */}
          <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <Skeleton key={item} variant="rectangular" width={120} height={32} />
            ))}
          </Box>

          {/* Table Skeleton */}
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  {[1, 2, 3, 4, 5, 6, 7].map((item) => (
                    <TableCell key={item}>
                      <Skeleton variant="text" width={80} height={20} />
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {[1, 2, 3, 4, 5].map((row) => (
                  <TableRow key={row}>
                    <TableCell>
                      <Skeleton variant="text" width={80} height={20} />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Skeleton variant="circular" width={32} height={32} />
                        <Skeleton variant="text" width={100} height={20} />
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" width={120} height={16} />
                      <Skeleton variant="text" width={100} height={14} />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" width={80} height={20} />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="rectangular" width={80} height={24} />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" width={80} height={16} />
                      <Skeleton variant="text" width={60} height={14} />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="circular" width={32} height={32} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  )
}

export default OrdersLoading
