import api from "./api"
import type { Product } from "@/models/product"

export interface ProductFilters {
  search?: string
  category?: string
  minPrice?: number
  maxPrice?: number
  rating?: number
  sortBy?: "newest" | "price_asc" | "price_desc" | "rating" | "popular"
  page?: number
  limit?: number
}

export const productService = {
  async getProducts(filters?: ProductFilters): Promise<{ products: Product[]; total: number }> {
    const params = new URLSearchParams()

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString())
        }
      })
    }

    const response = await api.get(`/v1/product/all?${params.toString()}`)
    return response.data
  },

  async getProduct(productId: number): Promise<Product> {
    const response = await api.get(`/v1/product/details/${productId}`)
    return response.data
  },

  async searchProducts(query: string): Promise<Product[]> {
    const response = await api.get(`/v1/product/search?q=${encodeURIComponent(query)}`)
    return response.data
  },

  async getFeaturedProducts(): Promise<Product[]> {
    const response = await api.get("/v1/product/featured")
    return response.data
  },

  async getNewProducts(): Promise<Product[]> {
    const response = await api.get("/v1/product/new")
    return response.data
  },

  async getBestSellers(): Promise<Product[]> {
    const response = await api.get("/v1/product/bestsellers")
    return response.data
  },
}
