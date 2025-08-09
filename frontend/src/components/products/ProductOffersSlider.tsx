"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSwipeable } from "react-swipeable";
import {
  Box,
  Typography,
  Button,
  Chip,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useLocale } from "next-intl";
import { Product } from "@/models/product";
import Image from 'next/image';


const ProductOffersSlider = ({ products }: { products: Product[] }) => {
  const locale = useLocale();
  const isRTL = locale === "ar";
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

  // أعلى 5 منتجات مميزة حسب الخصم (مرتبة نزولاً)
  const topDiscounted = [...products]
    .filter((p) => p.is_featured)
    .sort((a, b) => b.discount - a.discount)
    .slice(0, 5);

  const [current, setCurrent] = useState<number>(0);

  const handlePrev = () =>
    setCurrent((prev) => (prev === 0 ? topDiscounted.length - 1 : prev - 1));
  const handleNext = () =>
    setCurrent((prev) => (prev === topDiscounted.length - 1 ? 0 : prev + 1));

  const swipeHandlers = useSwipeable({
    onSwipedLeft: handleNext,
    onSwipedRight: handlePrev,
    trackMouse: true,
  });

  if (!topDiscounted.length || isSmall) {
    return null;
  }

  const currentProduct = topDiscounted[current];

  return (
    <Box
      {...swipeHandlers}
      sx={{
        position: "relative",
        width: "55  %",
        maxWidth: 1200,
        mx: "auto",
        borderRadius: 6,
        overflow: "hidden",
        boxShadow: 6,
        cursor: "pointer",
        mb: 4,
        userSelect: "none",
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: 450,
          borderRadius: 6,
          overflow: "hidden",
          boxShadow: 6,
          transition: "transform 0.3s ease",
          "&:hover Image": {
            transform: "scale(1.05)",
          },
        }}
      >
        <Image
          src={currentProduct.thumbnail_image}
          alt={isRTL ? currentProduct.name.ar : currentProduct.name.en}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: 24,
            transition: "transform 0.3s ease",
          }}
          draggable={false}
        />

        {/* خصم أعلى الصورة */}
        <Box
          sx={{
            position: "absolute",
            top: 18,
            left: isRTL ? "unset" : 18,
            right: isRTL ? 18 : "unset",
            zIndex: 2,
          }}
        >
          <Chip
            label={
              isRTL
                ? `خصم ${currentProduct.discount}%`
                : `${currentProduct.discount}% OFF`
            }
            color="error"
            size="medium"
            sx={{
              fontWeight: "bold",
              fontSize: 18,
              px: 2.5,
              py: 1,
              borderRadius: 2,
              boxShadow: 3,
              background: "linear-gradient(90deg, #ff512f, #dd2476)",
              color: "white",
            }}
          />
        </Box>

        {/* اسم المنتج وزر view */}
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            bgcolor: "rgba(0,0,0,0.55)",
            color: "white",
            px: 4,
            py: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottomLeftRadius: 24,
            borderBottomRightRadius: 24,
          }}
        >
          <Typography fontWeight={700} fontSize={22} noWrap>
            {isRTL ? currentProduct.name.ar : currentProduct.name.en}
          </Typography>

          <Link href={`/${locale}/products/${currentProduct.id}`} passHref legacyBehavior>
            <Button
              component="a"
              variant="contained"
              color="secondary"
              size="medium"
              sx={{
                fontWeight: 700,
                borderRadius: 2,
                minWidth: 0,
                px: 2,
                py: 0.5,
                fontSize: 16,
                boxShadow: 1,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {isRTL ? "عرض المنتج" : "View"}
            </Button>
          </Link>
        </Box>

        {/* أزرار التنقل */}
        {topDiscounted.length > 1 && (
          <>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              sx={{
                position: "absolute",
                top: "50%",
                left: 16,
                transform: "translateY(-50%)",
                minWidth: 0,
                borderRadius: "50%",
                bgcolor: "rgba(0,0,0,0.4)",
                color: "white",
                zIndex: 3,
                "&:hover": { bgcolor: "primary.main" },
                fontSize: 32,
                px: 1.5,
                py: 1,
              }}
              aria-label={isRTL ? "المنتج السابق" : "Previous product"}
            >
              {isRTL ? "›" : "‹"}
            </Button>

            <Button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              sx={{
                position: "absolute",
                top: "50%",
                right: 16,
                transform: "translateY(-50%)",
                minWidth: 0,
                borderRadius: "50%",
                bgcolor: "rgba(0,0,0,0.4)",
                color: "white",
                zIndex: 3,
                "&:hover": { bgcolor: "primary.main" },
                fontSize: 32,
                px: 1.5,
                py: 1,
              }}
              aria-label={isRTL ? "المنتج التالي" : "Next product"}
            >
              {isRTL ? "‹" : "›"}
            </Button>
          </>
        )}

        {/* نقاط المؤشر */}
        {topDiscounted.length > 1 && (
          <Box
            sx={{
              position: "absolute",
              bottom: 18,
              left: 0,
              right: 0,
              display: "flex",
              justifyContent: "center",
              gap: 1,
              zIndex: 4,
            }}
          >
            {topDiscounted.map((_, idx) => (
              <Box
                key={idx}
                sx={{
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  bgcolor: idx === current ? "primary.main" : "grey.400",
                  border: idx === current ? "2px solid white" : "none",
                  transition: "all 0.2s",
                  cursor: "pointer",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrent(idx);
                }}
                aria-label={
                  isRTL
                    ? `المنتج رقم ${idx + 1}`
                    : `Product number ${idx + 1}`
                }
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    setCurrent(idx);
                  }
                }}
              />
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ProductOffersSlider;
