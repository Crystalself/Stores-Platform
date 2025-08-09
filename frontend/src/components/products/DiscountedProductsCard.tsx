"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  Tooltip,
  Rating,
  Avatar,
  Link as MuiLink,
} from "@mui/material";
import { useLocale } from "next-intl";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import Link from "next/link";
import { mockUsers } from "@/lib/mockUsers";
import { getProductName } from "@/models/product";

interface DiscountedProductCardProps {
  product: {
    id: string | number;
    price: number;
    discount: number;
    thumbnail_image: string;
    rating: number;
    user_id: string | number;
    is_featured?: boolean;
    category?: string;
  };
}

const DiscountedProductCard: React.FC<DiscountedProductCardProps> = ({ product }) => {
  const locale = useLocale();
  const isRTL = locale === "ar";

  // Calculate discounted price
  const finalPrice = product.price * (1 - product.discount / 100);

  // Find seller info
  const seller = mockUsers.find((u) => u.id === product.user_id);

  // Get localized product name
  const productName = getProductName(product, locale);

  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: 3,
        overflow: "hidden",
        position: "relative",
        transition: "box-shadow 0.3s ease, transform 0.3s ease",
        "&:hover": {
          boxShadow: 8,
          transform: "translateY(-8px) scale(1.05)",
        },
        minHeight: 430,
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.paper",
      }}
      role="article"
      aria-label={productName}
    >
      <Box sx={{ position: "relative", overflow: "hidden" }}>
        <CardMedia
          component="img"
          height="180"
          image={product.thumbnail_image}
          alt={productName}
          sx={{
            objectFit: "cover",
            width: "100%",
            transition: "transform 0.4s ease",
            "&:hover": { transform: "scale(1.1)" },
          }}
          loading="lazy"
        />
        <Chip
          icon={<LocalOfferIcon />}
          label={isRTL ? `خصم ${product.discount}%` : `${product.discount}% OFF`}
          color="error"
          size="small"
          sx={{
            position: "absolute",
            top: 12,
            left: isRTL ? "auto" : 12,
            right: isRTL ? 12 : "auto",
            fontWeight: "bold",
            fontSize: 14,
            borderRadius: 1,
            boxShadow: 2,
            zIndex: 10,
            userSelect: "none",
          }}
          aria-label={isRTL ? `خصم ${product.discount} بالمئة` : `Discount ${product.discount} percent`}
        />
      </Box>

      <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column", px: 2, py: 2 }}>
        {/* Seller Info */}
        {seller && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mb: 1,
              flexDirection: isRTL ? "row-reverse" : "row",
            }}
          >
            <Tooltip
              title={
                isRTL
                  ? `بائع: ${seller.firstName} ${seller.lastName}`
                  : `Seller: ${seller.firstName} ${seller.lastName}`
              }
            >
              <Link href={`/${locale}/stores/${seller.id}`} passHref legacyBehavior>
                <MuiLink
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    textDecoration: "none",
                    color: "text.primary",
                    fontWeight: 600,
                    "&:hover": { color: "primary.main" },
                  }}
                  aria-label={isRTL ? `زيارة صفحة البائع ${seller.firstName}` : `Visit seller ${seller.firstName}`}
                >
                  <Avatar
                    src={seller.profilePic}
                    alt={`${seller.firstName} ${seller.lastName}`}
                    sx={{
                      width: 30,
                      height: 30,
                      ml: isRTL ? 1 : 0,
                      mr: isRTL ? 0 : 1,
                    }}
                  />
                  <Typography variant="body2" fontWeight={700} noWrap>
                    {seller.firstName} {seller.lastName}
                  </Typography>
                </MuiLink>
              </Link>
            </Tooltip>
          </Box>
        )}

        {/* Product Name */}
        <Typography
          gutterBottom
          variant="h6"
          component="h3"
          noWrap
          sx={{ fontWeight: 700, mb: 1, textAlign: isRTL ? "right" : "left" }}
          title={productName}
        >
          {productName}
        </Typography>

        {/* Price */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mb: 1,
            flexDirection: isRTL ? "row-reverse" : "row",
            justifyContent: isRTL ? "flex-end" : "flex-start",
          }}
          aria-label={isRTL ? "السعر بعد الخصم والسعر الأصلي" : "Discounted and original price"}
        >
          <Typography variant="h5" color="primary.main" fontWeight={700} component="span">
            ₪{finalPrice.toFixed(2)}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textDecoration: "line-through" }}
            component="span"
          >
            ₪{product.price.toFixed(2)}
          </Typography>
        </Box>

        {/* Rating */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            mb: 1,
            flexDirection: isRTL ? "row-reverse" : "row",
            justifyContent: isRTL ? "flex-end" : "flex-start",
          }}
          aria-label={isRTL ? `تقييم المنتج ${product.rating.toFixed(1)}` : `Product rating ${product.rating.toFixed(1)}`}
        >
          <Rating value={product.rating} precision={0.1} readOnly size="small" />
          <Typography variant="body2" color="text.secondary" component="span">
            {product.rating.toFixed(1)}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default DiscountedProductCard;
