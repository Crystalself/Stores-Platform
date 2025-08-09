"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Box, Typography, Paper } from "@mui/material"
import { useTranslations, useLocale } from "next-intl"
import type { CreateProductDTO } from "@/models/product"
import { sellerService } from "@/lib/seller"
import ProductForm from "@/components/products/ProductForm"

export default function NewProductPage() {
  const t = useTranslations("seller.products")
  const locale = useLocale()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (data: CreateProductDTO) => {
    setLoading(true)
    try {
      await sellerService.createProduct(data)
      router.push(`/${locale}/seller/dashboard/products`)
    } catch (error) {
      console.error("Failed to create product:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" mb={4} fontWeight="bold">
        {t("addNewProduct")}
      </Typography>

      <Paper sx={{ p: 4 }}>
        <ProductForm onSubmit={handleSubmit} loading={loading} submitText={t("createProduct")} />
      </Paper>
    </Box>
  )
}
