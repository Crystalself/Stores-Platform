"use client";

import React, { useState, useCallback } from "react";
import {
  Box,
  Button,
  CircularProgress,
  ImageList,
  ImageListItem,
  Typography,
  Stack,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { Product } from "@/models/product";
import { useTranslations, useLocale } from 'next-intl';

interface StoreProductsProps {
  sellerProducts: Product[];
}

const PAGE_SIZE = 16;

const StoreProducts: React.FC<StoreProductsProps> = ({ sellerProducts }) => {
  const router = useRouter();
  const theme = useTheme();
  const locale = useLocale();
  const t = useTranslations('store');
  // استعلام لكسر التصميم responsive
  const isXs = useMediaQuery(theme.breakpoints.down("sm")); // هاتف صغير
  const isSm = useMediaQuery(theme.breakpoints.between("sm", "md")); // تابليت صغير
  const isMd = useMediaQuery(theme.breakpoints.between("md", "lg")); // شاشة متوسطة

  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loadingMore, setLoadingMore] = useState(false);

  const handleLoadMore = useCallback(() => {
    if (loadingMore) return;
    setLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, sellerProducts.length));
      setLoadingMore(false);
    }, 800);
  }, [loadingMore, sellerProducts.length]);

  const visibleProducts = sellerProducts.slice(0, visibleCount);

  // تحدد عدد الأعمدة حسب حجم الشاشة
  const getCols = () => {
    if (isXs) return 1;
    if (isSm) return 2;
    if (isMd) return 3;
    return 3;
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", px: 4, py: 6 }}>
      <Typography
        variant="h1"
        fontWeight="bold"
        mb={4}
        textAlign="center"
        sx={{ userSelect: "none", letterSpacing: 1 }}
      >
       🏪 {t('allProducts')}
      </Typography>

      {sellerProducts.length === 0 ? (
        <Typography color="text.secondary" textAlign="center" sx={{ mt: 6 }}>
          {t('noProducts')}
        </Typography>
      ) : (
        <>
          <ImageList variant="standard" cols={getCols()} gap={12} rowHeight={250}>
            {visibleProducts.map((product) => (
              <ImageListItem
                key={product.id}
                sx={{
                  cursor: "pointer",
                  position: "relative",
                  borderRadius: 3,
                  overflow: "hidden",
                  "&:hover .discountBadge": { opacity: 1 },
                  "&:hover img": { transform: "scale(1.05)" },
                  transition: "transform 0.3s ease",
                }}
                onClick={() => router.push(`/${locale}/products/${product.id}`)}
              >
                {/* صورة المنتج */}
                <img
                  src={
                    product.images && product.images.length > 0
                      ? product.images[Math.floor(Math.random() * product.images.length)]
                      : "/placeholder.jpg"
                  }
                  alt={product.name}
                  loading="lazy"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: 12,
                    transition: "transform 0.3s ease",
                  }}
                />

                {/* خصم يظهر عند المرور */}
                {product.discount > 0 && (
                  <Box
                    className="discountBadge"
                    sx={{
                      position: "absolute",
                      top: 15,
                      left: 25,
                      bgcolor: "error.main",
                      color: "common.white",
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 1,
                      fontWeight: "bold",
                      fontSize: 16,
                      opacity: 0,
                      transition: "opacity 0.3s ease",
                      pointerEvents: "none",
                      userSelect: "none",
                    }}
                  >
                    {product.discount}% {t('off')}
                  </Box>
                )}

                {/* السعر أسفل الصورة */}
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    width: "100%",
                    bgcolor: "rgba(0,0,0,0.55)",
                    color: "common.white",
                    textAlign: "center",
                    py: 1,
                    fontWeight: "bold",
                    fontSize: 16,
                    borderBottomLeftRadius: 12,
                    borderBottomRightRadius: 12,
                    userSelect: "none",
                  }}
                >
                  ${product.price.toFixed(2)}
                </Box>
              </ImageListItem>
            ))}
          </ImageList>

          {visibleCount < sellerProducts.length && (
            <Stack direction="row" justifyContent="center" mt={6}>
              <Button
                variant="contained"
                size="large"
                onClick={handleLoadMore}
                disabled={loadingMore}
                sx={{
                  px: 6,
                  borderRadius: 3,
                  fontWeight: "bold",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  transition: "background-color 0.3s ease",
                  "&:hover": {
                    backgroundColor: "primary.dark",
                    boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
                  },
                }}
              >
                {loadingMore ? <CircularProgress size={24} color="inherit" /> : "عرض المزيد"}
              </Button>
            </Stack>
          )}
        </>
      )}
    </Box>
  );
};

export default StoreProducts;
