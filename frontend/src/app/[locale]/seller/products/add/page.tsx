// src/app/[locale]/seller/products/add/page.tsx

"use client"

import React, { useState } from "react"
import { Box, Typography, Button, useTheme, useMediaQuery, Paper, Fade, CircularProgress } from "@mui/material"
import { ArrowBack } from "@mui/icons-material"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"

// استيراد المكون والدالة من ملف الـ API
import ProductForm, { type ProductFormData } from "@/components/products/ProductForm"
// import { addProduct } from "@/api/apiService" // <-- 1. استيراد دالة إضافة المنتج

const AddProductPage: React.FC = () => {
  const router = useRouter()
  const t = useTranslations("seller")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null) // لإظهار رسائل الخطأ

  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"))

  const handleSubmit = async (data: ProductFormData) => {
    setLoading(true)
    setError(null) // إعادة تعيين أي أخطاء سابقة

    // تحويل البيانات إلى FormData للتعامل مع رفع الملفات (الصور)
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'images' && Array.isArray(value)) {
        value.forEach(file => {
          formData.append('images', file)
        })
      } else if (value !== null && value !== undefined) {
        formData.append(key, String(value))
      }
    })

    try {
      // 2. استخدام الدالة الفعلية لإضافة المنتج
      // await addProduct(formData)

      // يمكنك هنا إضافة إشعار نجاح (Snackbar)
      // alert("تمت إضافة المنتج بنجاح!") // كحل مؤقت

      router.push("/seller/products/manage")
    } catch (error) {
      console.error("Error adding product:", error)
      setError(t("addProduct.errors.submitFailed")) // إظهار رسالة خطأ للمستخدم
      setLoading(false)
    }
    // لا نحتاج لـ setLoading(false) هنا في حالة النجاح لأن الصفحة ستتغير
  }

  const handleCancel = () => {
    router.back()
  }

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
      {/* 3. إضافة حركة دخول للمحتوى */}
      <Fade in={true} timeout={800}>
        <Paper
          elevation={4}
          sx={{
            p: isSmallScreen ? 3 : 5,
            borderRadius: 3,
            bgcolor: "background.paper",
            // 4. إضافة تأثيرات عند التمرير
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
                // 5. تحسين سلاسة الحركة
                transition: "background-color 0.2s ease, color 0.2s ease",
                "&:hover": {
                  backgroundColor: "primary.lighter", // استخدام لون أخف للتأثير
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
          
          {/* 6. إظهار رسالة الخطأ */}
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