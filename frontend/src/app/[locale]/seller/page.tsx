// src/app/[locale]/seller/products/add/page.tsx

"use client"

import React, { useState } from "react"
import { Box, Typography, Button, useTheme, useMediaQuery, Paper, Fade } from "@mui/material"
import { ArrowBack } from "@mui/icons-material"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"

import ProductForm, { type ProductFormData } from "@/components/products/ProductForm"
// استيراد الدوال المحدثة من ملف الـ API
import { addProductData, uploadProductImages } from "@/api/apiService" 
import { useLocale } from "next-intl"

const AddProductPage: React.FC = () => {
  const router = useRouter()
  const t = useTranslations("seller")
  const locale = useLocale(''); 
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"))

  const handleSubmit = async (data: ProductFormData) => {
    setLoading(true)
    setError(null)
    
    let newProductId: string | null = null;

    try {
      // --- الخطوة الأولى: إرسال البيانات النصية كـ JSON ---
      const productJsonData = {
        name: data.name,
        description: data.description,
        category: data.category,
        price: data.price,
      }

      const createResponse = await addProductData(productJsonData);

      // تأكد من أن الباك إند يعيد معرّف المنتج. هذا مثال مقترح.
      newProductId = createResponse.data?.data?.id; 
      if (!newProductId) {
        throw new Error("Product ID was not returned from the server.");
      }

      // --- الخطوة الثانية: إرسال الصور كـ FormData ---
      const filesFormData = new FormData();
      if (data.thumbnail_image) {
        filesFormData.append('thumbnail_image', data.thumbnail_image);
      }
      if (data.images && data.images.length > 0) {
        data.images.forEach(file => {
          filesFormData.append('images', file);
        });
      }

      // نتحقق من وجود ملفات لرفعها قبل إرسال الطلب الثاني
      if (filesFormData.has('thumbnail_image') || filesFormData.has('images')) {
          await uploadProductImages(newProductId, filesFormData);
      }
      
      // --- النجاح الكامل ---
      // يمكنك إضافة إشعار نجاح هنا (Snackbar)
      router.push(`${locale}/seller/products/manage`);

    } catch (err) {
      console.error("Failed to add product:", err);
      // يمكنك هنا إضافة منطق أكثر تفصيلاً، مثلاً إذا نجحت الخطوة 1 وفشلت الخطوة 2
      // يمكنك إعلام المستخدم بأن المنتج تم إنشاؤه ولكن فشل رفع الصور.
      setError(t("addProduct.errors.submitFailed"));
      setLoading(false); // أوقف التحميل فقط في حالة الفشل
    }
  };

  const handleCancel = () => {
    router.back()
  }

  // ... باقي الكود (جزء الـ return) يبقى كما هو بدون أي تغيير
  return (
    <Box
      sx={{
        maxWidth: 900,
        mx: "auto",
        px: isSmallScreen ? 2 : 4,
        py: isSmallScreen ? 3 : 6,
        bgcolor: "#f9f9f9",
        minHeight: "100vh",
      }}
    >
      <Fade in={true} timeout={800}>
        <Paper
          elevation={4}
          sx={{
            p: isSmallScreen ? 3 : 5,
            borderRadius: 3,
            bgcolor: "background.paper",
            transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
            "&:hover": {
              transform: "translateY(-5px)",
              boxShadow: theme.shadows[8],
            },
          }}
        >
          {/* Header */}
          <Box
            sx={{
              mb: 4,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            <Typography
              variant={isSmallScreen ? "h5" : "h4"}
              component="h1"
              sx={{ fontWeight: "bold", color: "text.primary" }}
            >
              {t("addProduct.title")}
            </Typography>

            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={handleCancel}
              sx={{
                px: 2.5,
                py: 1,
                fontWeight: "medium",
                fontSize: 14,
                borderRadius: 2,
                transition: "background-color 0.2s ease, color 0.2s ease",
                "&:hover": {
                  backgroundColor: "primary.lighter",
                  color: "primary.main",
                },
              }}
            >
              {t("common.back")}
            </Button>
          </Box>

          {/* Product Form */}
          <ProductForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            submitButtonText={t("addProduct.review.publishProduct")}
            isLoading={loading}
          />
          
          {error && (
            <Typography color="error" sx={{ mt: 2, textAlign: 'center' }}>
              {error}
            </Typography>
          )}

        </Paper>
      </Fade>
    </Box>
  )
}

export default AddProductPage