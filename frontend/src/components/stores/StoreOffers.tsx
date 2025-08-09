"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Box, Typography } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Product } from "@/models/product";
import { useTranslations, useLocale } from 'next-intl';

// ✅ دالة مساعدة ثابتة
function getRandomIndex(max: number): number {
  return Math.floor(Math.random() * max);
}

const StoreOffers = ({ featuredProducts }: { featuredProducts: Product[] }) => {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('store'); // لو عندك ملفات ترجمة

  return (
    <Box px={{ xs: 1, sm: 2, md: 4 }} py={4}>
      <Typography variant="h4" fontWeight={700} mb={3} textAlign="center">
        🌟 {t("featuredProducts") || "Featured Products"}
      </Typography>

      <Swiper
        spaceBetween={12}
        slidesPerView={1}
        breakpoints={{
          600: { slidesPerView: 2 },
          900: { slidesPerView: 3 },
          1200: { slidesPerView: 4 },
        }}
        loop
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation
        modules={[Autoplay, Navigation, Pagination]}
        style={{ padding: "20px 0", maxWidth: "1000px", height: "auto" }}
      >
        {featuredProducts.map((product) => {
          const hasImages = product.images && product.images.length > 0;
          const imageUrl = hasImages
            ? product.images[getRandomIndex(product.images.length)]
            : "/placeholder.jpg";

          return (
            <SwiperSlide key={product.id}>
              <Box
                onClick={() => router.push(`/${locale}/products/${product.id}`)}
                sx={{
                  position: "relative",
                  overflow: "hidden",
                  borderRadius: 2,
                  boxShadow: 3,
                  cursor: "pointer",
                  height: 280,
                  
                  "&:hover .priceOverlay": {
                    opacity: 1,
                  },
                }}
              >
                <img
                  src={imageUrl}
                  alt={`product.name.${locale}`}
                  loading="lazy"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "16px",
                  }}
                />

                {/* Price Overlay on Hover */}
                <Box
                  className="priceOverlay"
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    width: "100%",
                    bgcolor: "rgba(0, 0, 0, 0.6)",
                    color: "#fff",
                    textAlign: "center",
                    py: 1,
                    opacity: 0,
                    transition: "opacity 0.3s ease",
                  }}
                >
                  <Typography variant="subtitle1" fontWeight="bold">
                    ${product.price.toFixed(2)}
                  </Typography>
                </Box>
              </Box>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </Box>
  );
};

export default StoreOffers;
