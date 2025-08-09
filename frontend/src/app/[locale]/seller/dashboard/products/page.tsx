"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
} from "@mui/material"
import { Add, Edit, Delete, MoreVert, Search, Visibility, VisibilityOff } from "@mui/icons-material"
import { useTranslations, useLocale } from "next-intl"
import type { Product } from "@/models/product"
import { sellerService } from "@/lib/seller"
import { formatPrice } from "@/lib/utils"

export default function SellerProductsPage() {
  const t = useTranslations("seller.products")
  const locale = useLocale()
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [unlistedProducts, setUnlistedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [tabValue, setTabValue] = useState(0)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const [listedProducts, unlistedProductsData] = await Promise.all([
        sellerService.getProducts(),
        sellerService.getUnlistedProducts(),
      ])
      setProducts(listedProducts)
      setUnlistedProducts(unlistedProductsData)
    } catch (error) {
      console.error("Failed to fetch products:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, product: Product) => {
    setAnchorEl(event.currentTarget)
    setSelectedProduct(product)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedProduct(null)
  }

  const handleEdit = () => {
    if (selectedProduct) {
      router.push(`/${locale}/seller/dashboard/products/edit/${selectedProduct.id}`)
    }
    handleMenuClose()
  }

  const handleDelete = () => {
    setDeleteDialogOpen(true)
    handleMenuClose()
  }

  const confirmDelete = async () => {
    if (selectedProduct) {
      try {
        await sellerService.deleteProduct(selectedProduct.id)
        await fetchProducts()
        setDeleteDialogOpen(false)
        setSelectedProduct(null)
      } catch (error) {
        console.error("Failed to delete product:", error)
      }
    }
  }

  const handleToggleVisibility = async (product: Product) => {
    try {
      if (product.isListed) {
        await sellerService.unlistProduct(product.id)
      } else {
        await sellerService.listProduct(product.id)
      }
      await fetchProducts()
    } catch (error) {
      console.error("Failed to toggle product visibility:", error)
    }
  }

  const filteredProducts = (tabValue === 0 ? products : unlistedProducts).filter(
    (product) =>
      product.name.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.name.ar.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const ProductCard = ({ product }: { product: Product }) => (
    <Card>
      <CardMedia
        component="img"
        height="200"
        image={product.thumbnailImage}
        alt={product.name[locale as keyof typeof product.name]}
      />
      <CardContent>
        <Typography variant="h6" component="h3" noWrap>
          {product.name[locale as keyof typeof product.name]}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {product.category}
        </Typography>
        <Box display="flex" alignItems="center" gap={1} mb={1}>
          <Typography variant="h6" color="primary">
            {formatPrice(product.price * (1 - product.discount / 100))}
          </Typography>
          {product.discount > 0 && (
            <Typography variant="body2" sx={{ textDecoration: "line-through" }}>
              {formatPrice(product.price)}
            </Typography>
          )}
        </Box>
        <Box display="flex" gap={1} mb={1}>
          <Chip
            label={product.isListed ? t("listed") : t("unlisted")}
            color={product.isListed ? "success" : "default"}
            size="small"
          />
          <Chip label={`${product.stock} ${t("inStock")}`} size="small" />
        </Box>
        <Typography variant="body2" color="text.secondary">
          {t("sold")}: {product.sellCount} | {t("rating")}: {product.rating}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          size="small"
          startIcon={product.isListed ? <VisibilityOff /> : <Visibility />}
          onClick={() => handleToggleVisibility(product)}
        >
          {product.isListed ? t("unlist") : t("list")}
        </Button>
        <IconButton size="small" onClick={(e) => handleMenuOpen(e, product)}>
          <MoreVert />
        </IconButton>
      </CardActions>
    </Card>
  )

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          {t("title")}
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => router.push(`/${locale}/seller/dashboard/products/new`)}
        >
          {t("addProduct")}
        </Button>
      </Box>

      {/* Search and Tabs */}
      <Box mb={3}>
        <TextField
          fullWidth
          placeholder={t("searchProducts")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />
        <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
          <Tab label={`${t("listed")} (${products.length})`} />
          <Tab label={`${t("unlisted")} (${unlistedProducts.length})`} />
        </Tabs>
      </Box>

      {/* Products Grid */}
      <Grid container spacing={3}>
        {filteredProducts.map((product) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>

      {filteredProducts.length === 0 && (
        <Box textAlign="center" py={8}>
          <Typography variant="h6" color="text.secondary">
            {searchQuery ? t("noProductsFound") : t("noProducts")}
          </Typography>
        </Box>
      )}

      {/* Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleEdit}>
          <Edit sx={{ mr: 1 }} />
          {t("edit")}
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: "error.main" }}>
          <Delete sx={{ mr: 1 }} />
          {t("delete")}
        </MenuItem>
      </Menu>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>{t("confirmDelete")}</DialogTitle>
        <DialogContent>
          <Typography>
            {t("deleteConfirmation", { name: selectedProduct?.name[locale as keyof typeof selectedProduct.name] })}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>{t("cancel")}</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            {t("delete")}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
