"use client";

import React, { useState, useMemo } from "react";
import {
  Box,
  Typography,
  Container,
  Alert,
  useTheme,
  Button,
} from "@mui/material";
import { useTranslations, useLocale } from "next-intl";
import ProductOffersFilters, { OffersFilters } from '@/components/products/ProductOffersFilters';
import DiscountedProductCard from '@/components/products/DiscountedProductsCard';
import ProductDetailClientView from '@/components/products/ProductDetailClientView';
import ProductOffersSlider from '@/components/products/ProductOffersSlider';
import { mockProducts } from '@/lib/dummy-data';
import { Product, getProductName, getProductDescription } from '@/models/product';
import { motion } from "framer-motion";

const getMinMaxPrice = (products: Product[]) => {
  if (products.length === 0) return [0, 1000];
  const prices = products.map(p => p.price);
  return [Math.min(...prices), Math.max(...prices)];
};

const getMinMaxDiscount = (products: Product[]) => {
  if (products.length === 0) return [0, 100];
  const discounts = products.map(p => p.discount);
  return [Math.min(...discounts), Math.max(...discounts)];
};

const OffersPage = () => {
  const t = useTranslations("OffersPage");
  const locale = useLocale();
  const isRTL = locale === "ar";
  const theme = useTheme();

  const [minPrice, maxPrice] = useMemo(() => getMinMaxPrice(mockProducts), []);
  const [minDiscount, maxDiscount] = useMemo(() => getMinMaxDiscount(mockProducts), []);

  const defaultFilters: OffersFilters = {
    search: "",
    priceRange: [minPrice, maxPrice],
    minDiscount: minDiscount,
    maxDiscount: maxDiscount,
    minRating: 0,
    category: undefined,
  };

  const [filters, setFilters] = useState<OffersFilters>(defaultFilters);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [visibleCount, setVisibleCount] = useState(24);

  // الفلترة مع التأكد من استخدام getProductName/getProductDescription
  const filteredProducts = useMemo(() => {
    return mockProducts
      .filter(p => p.discount >= filters.minDiscount && p.discount <= filters.maxDiscount)
      .filter(p => p.is_featured) // المنتجات المميزة فقط
      .filter(p => {
        const name = getProductName(p, locale).toLowerCase();
        const desc = getProductDescription(p, locale).toLowerCase();
        return (
          !filters.search ||
          name.includes(filters.search.toLowerCase()) ||
          desc.includes(filters.search.toLowerCase())
        );
      })
      .filter(p => !filters.category || p.category === filters.category)
      .filter(p => p.rating >= filters.minRating)
      .filter(p => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]);
  }, [filters, locale]);

  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  return (
    <Container
      maxWidth="xl"
      sx={{
        mt: 5,
        direction: isRTL ? "rtl" : "ltr",
        textAlign: isRTL ? "right" : "left",
        fontFamily: isRTL ? "Cairo, sans-serif" : "Roboto, sans-serif",
      }}
    >


      {/* العنوان */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <Typography
          variant="h1"
          fontWeight={700}
          textAlign="center"
          gutterBottom
          suppressHydrationWarning
          tabIndex={0}
          sx={{
            mb: 6,
            background: `linear-gradient(to ${isRTL ? "left" : "right"}, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontSize: { xs: '2.8rem', sm: '3.7rem', md: '4.7rem' },
            userSelect: "none",
            transition: "all 0.3s ease-in-out",
            '&:hover': {
              backgroundPosition: '100% 0',
              animation: 'gradientMovePro 1.5s linear infinite',
              fontSize: { xs: '2.9rem', sm: '3.9rem', md: '4.9rem' },
            },
          }}
        >
          {t("title")}
        </Typography>
      </motion.div>

      {/* الفلاتر */}
      <Box mb={4}>
        <ProductOffersFilters
          filters={filters}
          onFilterChange={setFilters}
          resultsCount={filteredProducts.length}
          minPrice={minPrice}
          maxPrice={maxPrice}
          minDiscount={minDiscount}
          maxDiscount={maxDiscount}
        />
      </Box>

      {/* سلايدر أعلى الصفحة */}
      {/* <ProductOffersSlider products={mockProducts} /> */} 
      {/* هاي المشكلة  */}

      {/* عرض المنتجات */}
      {filteredProducts.length === 0 ? (
        <Alert severity="warning" sx={{ my: 6, fontSize: 18, fontWeight: 700 }}>
          {isRTL ? "لا توجد منتجات مطابقة للفلتر" : "No products match your filters."}
        </Alert>
      ) : (
        <>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
              },
              gap: 4,
              maxWidth: 1300,
              mx: 'auto',
              justifyItems: 'center',
              alignItems: 'stretch',
              py: 2,
            }}
          >
            {visibleProducts.map(product => (
              <Box
                key={product.id}
                onClick={() => setSelectedProduct(product)}
                sx={{
                  cursor: 'pointer',
                  width: '100%',
                  maxWidth: 420,
                  minHeight: 480,
                  display: 'flex',
                  alignItems: 'stretch',
                  justifyContent: 'center',
                }}
              >
                <DiscountedProductCard product={product} />
              </Box>
            ))}
          </Box>

          {/* زر تحميل المزيد */}
          {hasMore && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
              <Button
                onClick={() => setVisibleCount(c => c + 9)}
                variant="contained"
                size="large"
                sx={{
                  px: 6,
                  py: 1.5,
                  fontSize: 18,
                  fontWeight: 600,
                  borderRadius: 3,
                  background: "linear-gradient(to right, #6a11cb, #2575fc)",
                  color: "#fff",
                  textTransform: "none",
                  boxShadow: "0 3px 12px rgba(0,0,0,0.2)",
                  '&:hover': {
                    opacity: 0.9,
                  }
                }}
              >
                {isRTL ? "عرض المزيد" : "Load More"}
              </Button>
            </Box>
          )}
        </>
      )}

      {/* نافذة تفاصيل المنتج */}
      {selectedProduct && (
        <ProductDetailClientView
          product={selectedProduct}
          open={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </Container>
  );
};

export default OffersPage;
