"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
  TextField,
  Box,
  Chip,
  Tooltip,
  Fade,
  CircularProgress,
  Rating,
  Avatar,
} from "@mui/material"
import {
  Delete as DeleteIcon,
  Store as StoreIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  LocalShipping as ShippingIcon,
  Verified as VerifiedIcon,
  Star as StarIcon,
  TrendingUp as TrendingUpIcon,
  NewReleases as NewIcon,
} from "@mui/icons-material"
import type { CartItem as CartItemType } from "@/types/cart"
import { useLocale } from "next-intl"

interface CartItemProps {
  item: CartItemType
  onQuantityChange: (productId: number, quantity: number) => void
  onRemove: (productId: number) => void
  loading?: boolean
}

export function CartItem({ item, onQuantityChange, onRemove, loading }: CartItemProps) {
  const t = useTranslations("cart")
  const locale = useLocale()
  const router = useRouter()
  const [isUpdating, setIsUpdating] = useState(false)

  const { product, seller, quantity } = item
  const discount = product.discount ?? 0
  const originalPrice = product.price
  const discountedPrice = useMemo(() => originalPrice * (1 - discount / 100), [originalPrice, discount])
  const totalPrice = useMemo(() => discountedPrice * quantity, [discountedPrice, quantity])

  const handleQuantityChange = async (newQuantity: number) => {
    const validQuantity = Math.max(1, Math.min(newQuantity, product.stock))
    if (validQuantity === quantity) return

    setIsUpdating(true)
    await onQuantityChange(product.id, validQuantity)
    setIsUpdating(false)
  }

  const handleRemove = async () => {
    setIsUpdating(true)
    await onRemove(product.id)
    setIsUpdating(false)
  }

  const handleProductClick = () => {
    router.push(`/${locale}/products/${product.id}`)
  }

  const handleSellerClick = () => {
    if (seller) {
      router.push(`/${locale}/stores/${seller.id}`)
    }
  }

  return (
    <Fade in timeout={300}>
      <Card
        elevation={2}
        sx={{
          display: "flex",
          mb: 2,
          transition: "all 0.3s ease",
          "&:hover": {
            elevation: 4,
            transform: "translateY(-2px)",
          },
          opacity: isUpdating ? 0.7 : 1,
          position: "relative",
        }}
      >
        {/* Product Badges */}
        <Box sx={{ position: "absolute", top: 8, left: 8, zIndex: 1 }}>
          {product.is_new && (
            <Chip icon={<NewIcon />} label={t("new")} size="small" color="success" sx={{ mb: 0.5, display: "block" }} />
          )}
          {product.is_best_seller && (
            <Chip
              icon={<TrendingUpIcon />}
              label={t("bestSeller")}
              size="small"
              color="warning"
              sx={{ mb: 0.5, display: "block" }}
            />
          )}
          {product.is_featured && (
            <Chip icon={<StarIcon />} label={t("featured")} size="small" color="primary" sx={{ display: "block" }} />
          )}
        </Box>

        {/* Product Image */}
        <CardMedia
          component="img"
          sx={{
            width: 180,
            height: 180,
            objectFit: "cover",
            cursor: "pointer",
            transition: "transform 0.3s ease",
            "&:hover": {
              transform: "scale(1.05)",
            },
          }}
          image={product.thumbnail_image}
          alt={product.name[locale as keyof typeof product.name]}
          onClick={handleProductClick}
        />

        {/* Product Details */}
        <CardContent sx={{ flex: 1, p: 2 }}>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start">
            <Box flex={1}>
              {/* Product Name & Brand */}
              <Box mb={1}>
                <Typography
                  variant="h6"
                  component="h3"
                  sx={{
                    cursor: "pointer",
                    "&:hover": { color: "primary.main" },
                    transition: "color 0.2s ease",
                    fontWeight: "bold",
                    mb: 0.5,
                  }}
                  onClick={handleProductClick}
                >
                  {product.name[locale as keyof typeof product.name]}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t("brand")}: {product.brand}
                </Typography>
              </Box>

              {/* Rating & Reviews */}
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <Rating value={product.rating} precision={0.1} size="small" readOnly />
                <Typography variant="body2" color="text.secondary">
                  ({product.rating}) • {product.rating_count} {t("reviews")}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • {product.sell_count} {t("sold")}
                </Typography>
              </Box>

              {/* Seller Info */}
              {seller && (
                <Box
                  display="flex"
                  alignItems="center"
                  gap={1}
                  mb={1}
                  sx={{
                    cursor: "pointer",
                    "&:hover": { color: "primary.main" },
                    transition: "color 0.2s ease",
                    p: 1,
                    borderRadius: 1,
                    backgroundColor: "grey.50",
                  }}
                  onClick={handleSellerClick}
                >
                  <Avatar src={seller.profilePic} sx={{ width: 24, height: 24 }}>
                    {seller.firstName[0]}
                  </Avatar>
                  <StoreIcon fontSize="small" />
                  <Typography variant="body2">{seller.storeName}</Typography>
                  {seller.verified && <VerifiedIcon fontSize="small" color="primary" />}
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <Rating value={seller.rating} precision={0.1} size="small" readOnly />
                    <Typography variant="caption">({seller.rating_count})</Typography>
                  </Box>
                </Box>
              )}

              {/* Tags */}
              <Box display="flex" flexWrap="wrap" gap={0.5} mb={1}>
                {product.tags.slice(0, 3).map((tag) => (
                  <Chip key={tag} label={tag} size="small" variant="outlined" />
                ))}
              </Box>

              {/* Shipping Info */}
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <ShippingIcon fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  {product.shipping.free ? t("freeShipping") : t("paidShipping")} • {product.shipping.time}
                </Typography>
              </Box>

              {/* Price */}
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <Typography variant="h6" color="primary.main" fontWeight="bold">
                  ${totalPrice.toFixed(2)}
                </Typography>
                {discount > 0 && (
                  <>
                    <Typography variant="body2" color="text.secondary" sx={{ textDecoration: "line-through" }}>
                      ${(originalPrice * quantity).toFixed(2)}
                    </Typography>
                    <Chip label={`-${discount}%`} size="small" color="error" />
                  </>
                )}
                <Typography variant="caption" color="text.secondary">
                  (${discountedPrice.toFixed(2)} {t("each")})
                </Typography>
              </Box>

              {/* Quantity Controls */}
              <Box display="flex" alignItems="center" gap={1}>
                <IconButton
                  size="small"
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1 || isUpdating || loading}
                  color="primary"
                >
                  <RemoveIcon />
                </IconButton>

                <TextField
                  type="number"
                  value={quantity}
                  onChange={(e) => {
                    const value = Number.parseInt(e.target.value)
                    if (!isNaN(value)) {
                      handleQuantityChange(value)
                    }
                  }}
                  size="small"
                  sx={{ width: 80 }}
                  inputProps={{
                    min: 1,
                    max: product.stock,
                    step: 1,
                  }}
                  disabled={isUpdating || loading}
                  error={quantity > product.stock}
                />

                <IconButton
                  size="small"
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= product.stock || isUpdating || loading}
                  color="primary"
                >
                  <AddIcon />
                </IconButton>

                <Typography variant="body2" color="text.secondary" ml={1}>
                  {product.stock} {t("inStock")}
                </Typography>
              </Box>

              {quantity >= product.stock && (
                <Typography variant="caption" color="warning.main" sx={{ mt: 0.5, display: "block" }}>
                  {t("maxQuantityReached")}
                </Typography>
              )}
            </Box>

            {/* Remove Button */}
            <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
              <Tooltip title={t("remove")}>
                <IconButton
                  color="error"
                  onClick={handleRemove}
                  disabled={isUpdating || loading}
                  sx={{
                    "&:hover": {
                      backgroundColor: "error.light",
                      color: "white",
                    },
                  }}
                >
                  {isUpdating ? <CircularProgress size={24} /> : <DeleteIcon />}
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Fade>
  )
}
