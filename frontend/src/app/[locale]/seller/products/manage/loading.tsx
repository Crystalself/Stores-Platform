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

const ManageProductsLoading: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      {/* Header Skeleton */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Box>
          <Skeleton variant="text" width={250} height={40} />
          <Skeleton variant="text" width={200} height={24} />
        </Box>
        <Skeleton variant="rectangular" width={150} height={36} />
      </Box>

      <Card>
        <CardContent>
          {/* Search and Filters Skeleton */}
          <Box sx={{ mb: 3 }}>
            <Skeleton variant="rectangular" width="100%" height={56} sx={{ mb: 2 }} />
            <Box sx={{ display: "flex", gap: 2 }}>
              {[1, 2, 3, 4, 5].map((item) => (
                <Skeleton key={item} variant="rectangular" width={80} height={32} />
              ))}
            </Box>
          </Box>

          {/* Table Skeleton */}
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
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
                      <Skeleton variant="rectangular" width={50} height={50} />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" width={150} height={20} />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" width={100} height={20} />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" width={80} height={20} />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" width={40} height={20} />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="rectangular" width={60} height={24} />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" width={40} height={20} />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Skeleton variant="circular" width={32} height={32} />
                        <Skeleton variant="circular" width={32} height={32} />
                      </Box>
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

export default ManageProductsLoading
