"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
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
  Grid,
  Paper,
  Skeleton,
  Tabs,
  Tab,
  InputAdornment,
  Tooltip,
} from "@mui/material"
import {
  Add,
  Search,
  MoreVert,
  Edit,
  Delete,
  Visibility,
  TrendingUp,
  TrendingDown,
  FileCopy,
  ToggleOn,
  ToggleOff,
} from "@mui/icons-material"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import Link from "next/link"

// بيانات وهمية مؤقتة
const mockProducts = [
  {
    id: 1,
    name: "هاتف ذكي Samsung Galaxy S24",
    image: "/placeholder.svg?height=60&width=60",
    category: "الإلكترونيات",
    price: 2500,
    stock: 25,
    sales: 45,
    status: "active",
    createdAt: "2024-01-15",
  },
  {
    id: 2,
    name: "لابتوب Dell Inspiron 15",
    image: "/placeholder.svg?height=60&width=60",
    category: "أجهزة الكمبيوتر",
    price: 3200,
    stock: 12,
    sales: 32,
    status: "active",
    createdAt: "2024-01-14",
  },
  {
    id: 3,
    name: "سماعات AirPods Pro",
    image: "/placeholder.svg?height=60&width=60",
    category: "الإكسسوارات",
    price: 850,
    stock: 0,
    sales: 28,
    status: "inactive",
    createdAt: "2024-01-13",
  },
  {
    id: 4,
    name: "ساعة Apple Watch Series 9",
    image: "/placeholder.svg?height=60&width=60",
    category: "الإكسسوارات",
    price: 1200,
    stock: 8,
    sales: 21,
    status: "active",
    createdAt: "2024-01-12",
  },
  {
    id: 5,
    name: "كاميرا Canon EOS R6",
    image: "/placeholder.svg?height=60&width=60",
    category: "التصوير",
    price: 4500,
    stock: 5,
    sales: 15,
    status: "active",
    createdAt: "2024-01-11",
  },
]

const mockCategories = ["الإلكترونيات", "أجهزة الكمبيوتر", "الإكسسوارات", "التصوير", "الألعاب"]

const ManageProducts: React.FC = () => {
  const router = useRouter()
  const t = useTranslations("seller")

  const [products, setProducts] = useState(mockProducts)
  const [filteredProducts, setFilteredProducts] = useState(mockProducts)
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState(0)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const filterOptions = [
    { label: t("products.filters.all"), value: "all" },
    { label: t("products.filters.active"), value: "active" },
    { label: t("products.filters.inactive"), value: "inactive" },
    { label: t("products.filters.outOfStock"), value: "outOfStock" },
    { label: t("products.filters.lowStock"), value: "lowStock" },
  ]

  // TODO: ربط مع الباك إند لجلب المنتجات
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        // const response = await fetch('/api/v1/user/seller/product/all', {
        //   headers: {
        //     'Authorization': `Bearer ${localStorage.getItem('token')}`,
        //   },
        // });
        // const data = await response.json();
        // setProducts(data.products);
        // setFilteredProducts(data.products);

        // بيانات وهمية مؤقتة
        setTimeout(() => {
          setProducts(mockProducts)
          setFilteredProducts(mockProducts)
          setLoading(false)
        }, 1000)
      } catch (error) {
        console.error("Error fetching products:", error)
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  useEffect(() => {
    filterProducts()
  }, [searchTerm, activeTab])

  const filterProducts = () => {
    let filtered = products

    // تصفية حسب البحث
    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // تصفية حسب التبويب
    const filterValue = filterOptions[activeTab].value
    if (filterValue !== "all") {
      filtered = filtered.filter((product) => product.status === filterValue)
    }

    setFilteredProducts(filtered)
  }

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, product: any) => {
    setAnchorEl(event.currentTarget)
    setSelectedProduct(product)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedProduct(null)
  }

  const handleStatusToggle = async (productId: number, currentStatus: string) => {
    setLoading(true)
    try {
      const newStatus = currentStatus === "active" ? "inactive" : "active"

      // TODO: ربط مع الباك إند لتحديث حالة المنتج
      // const response = await fetch(`/api/v1/user/seller/product/${productId}/status`, {
      //   method: 'PUT',
      //   headers: {
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`,
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ status: newStatus }),
      // });

      // if (response.ok) {
      //   setProducts(products.map(p =>
      //     p.id === productId ? { ...p, status: newStatus } : p
      //   ));
      // }

      // بيانات وهمية مؤقتة
      const updatedProducts = products.map((p) => (p.id === productId ? { ...p, status: newStatus } : p))
      setProducts(updatedProducts)
      filterProducts()
    } catch (error) {
      console.error("Error updating product status:", error)
    } finally {
      setLoading(false)
    }
    handleMenuClose()
  }

  const handleDeleteProduct = async () => {
    if (!selectedProduct) return

    setLoading(true)
    try {
      // TODO: ربط مع الباك إند لحذف المنتج
      // const response = await fetch(`/api/v1/user/seller/product/${selectedProduct.id}`, {
      //   method: 'DELETE',
      //   headers: {
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`,
      //   },
      // });

      // if (response.ok) {
      //   setProducts(products.filter(p => p.id !== selectedProduct.id));
      // }

      // بيانات وهمية مؤقتة
      const updatedProducts = products.filter((p) => p.id !== selectedProduct.id)
      setProducts(updatedProducts)
      setFilteredProducts(updatedProducts)
    } catch (error) {
      console.error("Error deleting product:", error)
    } finally {
      setLoading(false)
      setDeleteDialogOpen(false)
      setSelectedProduct(null)
    }
  }

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: t("products.outOfStock"), color: "error" }
    if (stock < 10) return { label: t("products.lowStock"), color: "warning" }
    return { label: t("products.inStock"), color: "success" }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "success"
      case "inactive":
        return "default"
      case "outOfStock":
        return "error"
      case "lowStock":
        return "warning"
      default:
        return "default"
    }
  }

  const getStatusText = (status: string) => {
    return t(`products.status.${status}`)
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
            <Box sx={{ mb: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Skeleton variant="rectangular" height={56} />
                </Grid>
                <Grid item xs={12} md={3}>
                  <Skeleton variant="rectangular" height={56} />
                </Grid>
                <Grid item xs={12} md={3}>
                  <Skeleton variant="rectangular" height={56} />
                </Grid>
                <Grid item xs={12} md={2}>
                  <Skeleton variant="rectangular" height={56} />
                </Grid>
              </Grid>
            </Box>
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
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: "bold" }}>
            {t("products.title")}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            إدارة وتنظيم منتجاتك
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />} component={Link} href="/seller/products/add">
          {t("products.addNew")}
        </Button>
      </Box>

      <Card>
        <CardContent>
          {/* Filters and Search */}
          <Box sx={{ mb: 3 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  placeholder={t("products.search")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={8}>
                <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
                  {filterOptions.map((option, index) => (
                    <Tab key={option.value} label={option.label} />
                  ))}
                </Tabs>
              </Grid>
            </Grid>
          </Box>

          {/* Products Table */}
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{t("products.table.image")}</TableCell>
                  <TableCell>{t("products.table.name")}</TableCell>
                  <TableCell>{t("products.table.category")}</TableCell>
                  <TableCell>{t("products.table.price")}</TableCell>
                  <TableCell>{t("products.table.stock")}</TableCell>
                  <TableCell>{t("products.table.status")}</TableCell>
                  <TableCell>{t("products.table.sales")}</TableCell>
                  <TableCell>{t("products.table.actions")}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredProducts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((product) => {
                  const stockStatus = getStockStatus(product.stock)
                  return (
                    <TableRow key={product.id} hover>
                      <TableCell>
                        <Avatar src={product.image} variant="rounded" sx={{ width: 50, height: 50 }} />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                          {product.name}
                        </Typography>
                      </TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>
                        {product.price} {t("common.currency")}
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          color={product.stock === 0 ? "error" : product.stock <= 5 ? "warning.main" : "text.primary"}
                        >
                          {product.stock}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={getStatusText(product.status)}
                          color={getStatusColor(product.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Typography variant="body2" sx={{ mr: 1 }}>
                            {product.sales}
                          </Typography>
                          {product.sales > 20 ? (
                            <TrendingUp sx={{ color: "success.main", fontSize: 16 }} />
                          ) : (
                            <TrendingDown sx={{ color: "error.main", fontSize: 16 }} />
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Tooltip
                            title={
                              product.status === "active"
                                ? t("products.actions.deactivate")
                                : t("products.actions.activate")
                            }
                          >
                            <IconButton
                              size="small"
                              onClick={() => handleStatusToggle(product.id, product.status)}
                              disabled={loading}
                            >
                              {product.status === "active" ? <ToggleOn color="success" /> : <ToggleOff />}
                            </IconButton>
                          </Tooltip>
                          <IconButton size="small" onClick={(e) => handleMenuOpen(e, product)}>
                            <MoreVert />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredProducts.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="عدد الصفوف في الصفحة:"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} من ${count !== -1 ? count : `أكثر من ${to}`}`}
          />

          {/* No Products Message */}
          {filteredProducts.length === 0 && (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography variant="body1" color="text.secondary">
                لا توجد منتجات تطابق البحث
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Action Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={() => router.push(`/seller/products/edit/${selectedProduct?.id}`)}>
          <Edit sx={{ mr: 1 }} />
          {t("products.actions.edit")}
        </MenuItem>
        <MenuItem onClick={() => router.push(`/seller/products/${selectedProduct?.id}`)}>
          <Visibility sx={{ mr: 1 }} />
          {t("products.actions.view")}
        </MenuItem>
        <MenuItem onClick={() => router.push(`/seller/products/duplicate/${selectedProduct?.id}`)}>
          <FileCopy sx={{ mr: 1 }} />
          {t("products.actions.duplicate")}
        </MenuItem>
        <MenuItem onClick={() => handleDeleteProduct()} sx={{ color: "error.main" }}>
          <Delete sx={{ mr: 1 }} />
          {t("products.actions.delete")}
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>{t("products.deleteConfirm.title")}</DialogTitle>
        <DialogContent>
          <Typography>{t("products.deleteConfirm.message")}</Typography>
          {selectedProduct && (
            <Typography variant="body2" sx={{ mt: 1, fontWeight: "bold" }}>
              {selectedProduct.name}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>{t("products.deleteConfirm.cancel")}</Button>
          <Button onClick={handleDeleteProduct} color="error" disabled={loading}>
            {loading ? t("common.loading") : t("products.deleteConfirm.confirm")}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default ManageProducts
