"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  Box,
  Card,
  CardContent,
  Typography,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  TextField,
  Paper,
  Skeleton,
  InputAdornment,
} from "@mui/material"
import { MoreVert, Visibility, Print, Search, Edit, Cancel } from "@mui/icons-material"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"

// بيانات وهمية للطلبات
const mockOrders = [
  {
    id: "#12345",
    customer: {
      name: "أحمد محمد",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    products: [
      { name: "لابتوب Dell XPS 13", quantity: 1 },
      { name: "ماوس لاسلكي", quantity: 2 },
    ],
    total: 1650,
    status: "pending",
    date: "2024-01-15",
    time: "10:30 ص",
  },
  {
    id: "#12346",
    customer: {
      name: "فاطمة علي",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    products: [{ name: "سماعات Sony", quantity: 1 }],
    total: 300,
    status: "processing",
    date: "2024-01-15",
    time: "09:15 ص",
  },
  {
    id: "#12347",
    customer: {
      name: "محمد حسن",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    products: [
      { name: "هاتف iPhone 15", quantity: 1 },
      { name: "جراب حماية", quantity: 1 },
    ],
    total: 1250,
    status: "shipped",
    date: "2024-01-14",
    time: "02:45 م",
  },
  {
    id: "#12348",
    customer: {
      name: "سارة أحمد",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    products: [{ name: "ساعة Apple Watch", quantity: 1 }],
    total: 400,
    status: "delivered",
    date: "2024-01-14",
    time: "11:20 ص",
  },
  {
    id: "#12349",
    customer: {
      name: "علي محمود",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    products: [{ name: "كاميرا Canon", quantity: 1 }],
    total: 2500,
    status: "cancelled",
    date: "2024-01-13",
    time: "04:10 م",
  },
]

const OrderManagement: React.FC = () => {
  const router = useRouter()
  const t = useTranslations("seller")

  const [orders, setOrders] = useState(mockOrders)
  const [filteredOrders, setFilteredOrders] = useState(mockOrders)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState(0)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [statusDialogOpen, setStatusDialogOpen] = useState(false)
  const [newStatus, setNewStatus] = useState("")

  const statusTabs = [
    { label: t("orders.tabs.all"), value: "all" },
    { label: t("orders.tabs.pending"), value: "pending" },
    { label: t("orders.tabs.processing"), value: "processing" },
    { label: t("orders.tabs.shipped"), value: "shipped" },
    { label: t("orders.tabs.delivered"), value: "delivered" },
    { label: t("orders.tabs.cancelled"), value: "cancelled" },
  ]

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true)
      try {
        // const response = await fetch('/api/v1/user/seller/orders', {
        //   headers: {
        //     'Authorization': `Bearer ${localStorage.getItem('token')}`,
        //   },
        // });
        // const data = await response.json();
        // setOrders(data.orders);

        // بيانات وهمية مؤقتة
        setTimeout(() => {
          setOrders(mockOrders)
          setLoading(false)
        }, 1000)
      } catch (error) {
        console.error("Error fetching orders:", error)
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  useEffect(() => {
    filterOrders()
  }, [searchTerm, activeTab])

  const filterOrders = () => {
    let filtered = orders

    // تصفية حسب البحث
    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // تصفية حسب التبويب
    const statusValue = statusTabs[activeTab].value
    if (statusValue !== "all") {
      filtered = filtered.filter((order) => order.status === statusValue)
    }

    setFilteredOrders(filtered)
  }

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

  const getOrdersCount = (status: string) => {
    if (status === "all") return orders.length
    return orders.filter((order) => order.status === status).length
  }

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, order: any) => {
    setAnchorEl(event.currentTarget)
    setSelectedOrder(order)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedOrder(null)
  }

  const handleUpdateStatus = async () => {
    if (!selectedOrder || !newStatus) return

    setLoading(true)
    try {
      // TODO: ربط مع الباك إند لتحديث حالة الطلب
      // const response = await fetch(`/api/v1/user/seller/orders/${selectedOrder.id}/status`, {
      //   method: 'PUT',
      //   headers: {
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`,
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ status: newStatus }),
      // });

      // تحديث البيانات المحلية مؤقتاً
      const updatedOrders = orders.map((order) =>
        order.id === selectedOrder.id ? { ...order, status: newStatus } : order,
      )
      setOrders(updatedOrders)
      filterOrders()
    } catch (error) {
      console.error("Error updating order status:", error)
    } finally {
      setLoading(false)
      setStatusDialogOpen(false)
      setNewStatus("")
      handleMenuClose()
    }
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10))
    setPage(0)
  }

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Box sx={{ mb: 4 }}>
          <Skeleton variant="text" width={300} height={40} />
          <Skeleton variant="text" width={200} height={24} />
        </Box>
        <Card>
          <CardContent>
            <Skeleton variant="rectangular" height={48} sx={{ mb: 2 }} />
            {[...Array(5)].map((_, index) => (
              <Skeleton key={index} variant="rectangular" height={80} sx={{ mb: 1 }} />
            ))}
          </CardContent>
        </Card>
      </Box>
    )
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: "bold" }}>
          {t("orders.title")}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          إدارة ومتابعة جميع طلبات عملائك
        </Typography>
      </Box>

      <Card>
        <CardContent>
          {/* Search */}
          <TextField
            fullWidth
            placeholder={t("orders.search")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 3 }}
          />

          {/* Status Tabs */}
          <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} sx={{ mb: 3 }}>
            {statusTabs.map((tab, index) => (
              <Tab
                key={tab.value}
                label={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {tab.label}
                    <Chip
                      label={getOrdersCount(tab.value)}
                      size="small"
                      color={index === activeTab ? "primary" : "default"}
                    />
                  </Box>
                }
              />
            ))}
          </Tabs>

          {/* Orders Table */}
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{t("orders.table.orderId")}</TableCell>
                  <TableCell>{t("orders.table.customer")}</TableCell>
                  <TableCell>{t("orders.table.products")}</TableCell>
                  <TableCell>{t("orders.table.total")}</TableCell>
                  <TableCell>{t("orders.table.status")}</TableCell>
                  <TableCell>{t("orders.table.date")}</TableCell>
                  <TableCell>{t("orders.table.actions")}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredOrders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((order) => (
                  <TableRow key={order.id} hover>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                        {order.id}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Avatar src={order.customer.avatar} sx={{ width: 32, height: 32 }} />
                        <Typography variant="body2">{order.customer.name}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        {order.products.slice(0, 2).map((product, index) => (
                          <Typography key={index} variant="caption" display="block">
                            {product.name} (×{product.quantity})
                          </Typography>
                        ))}
                        {order.products.length > 2 && (
                          <Typography variant="caption" color="text.secondary">
                            +{order.products.length - 2} منتجات أخرى
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                        {order.total} {t("common.currency")}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={getStatusText(order.status)} color={getStatusColor(order.status)} size="small" />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{order.date}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {order.time}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <IconButton size="small" onClick={(e) => handleMenuOpen(e, order)}>
                        <MoreVert />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredOrders.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="عدد الصفوف في الصفحة:"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} من ${count !== -1 ? count : `أكثر من ${to}`}`}
          />

          {/* No Orders Message */}
          {filteredOrders.length === 0 && (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography variant="body1" color="text.secondary">
                لا توجد طلبات تطابق البحث
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Action Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={() => router.push(`/seller/orders/${selectedOrder?.id}`)}>
          <Visibility sx={{ mr: 1 }} />
          {t("orders.actions.view")}
        </MenuItem>
        <MenuItem onClick={() => window.print()}>
          <Print sx={{ mr: 1 }} />
          {t("orders.actions.print")}
        </MenuItem>
        {selectedOrder?.status === "pending" && (
          <MenuItem onClick={() => handleUpdateStatus("processing")}>
            <Edit sx={{ mr: 1 }} />
            تحديث إلى "قيد المعالجة"
          </MenuItem>
        )}
        {selectedOrder?.status === "processing" && (
          <MenuItem onClick={() => handleUpdateStatus("shipped")}>
            <Edit sx={{ mr: 1 }} />
            تحديث إلى "تم الشحن"
          </MenuItem>
        )}
        {selectedOrder?.status === "shipped" && (
          <MenuItem onClick={() => handleUpdateStatus("delivered")}>
            <Edit sx={{ mr: 1 }} />
            تحديث إلى "تم التسليم"
          </MenuItem>
        )}
        {(selectedOrder?.status === "pending" || selectedOrder?.status === "processing") && (
          <MenuItem onClick={() => handleUpdateStatus("cancelled")} sx={{ color: "error.main" }}>
            <Cancel sx={{ mr: 1 }} />
            {t("orders.actions.cancel")}
          </MenuItem>
        )}
      </Menu>

      {/* Status Update Dialog */}
      <Dialog open={statusDialogOpen} onClose={() => setStatusDialogOpen(false)}>
        <DialogTitle>{t("orders.updateStatus")}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>{t("orders.status")}</InputLabel>
            <Select value={newStatus} label={t("orders.status")} onChange={(e) => setNewStatus(e.target.value)}>
              <MenuItem value="pending">{t("orders.tabs.pending")}</MenuItem>
              <MenuItem value="processing">{t("orders.tabs.processing")}</MenuItem>
              <MenuItem value="shipped">{t("orders.tabs.shipped")}</MenuItem>
              <MenuItem value="delivered">{t("orders.tabs.delivered")}</MenuItem>
              <MenuItem value="cancelled">{t("orders.tabs.cancelled")}</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusDialogOpen(false)}>{t("common.cancel")}</Button>
          <Button onClick={handleUpdateStatus} variant="contained">
            {t("common.save")}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default OrderManagement
