import api from "./api"
import type { Product, CreateProductDTO, UpdateProductDTO } from "@/models/product"
import type { Order } from "@/models/order"
import type { Store, UpdateStoreDTO } from "@/models/store"

export const sellerService = {
  // Product operations
  async getProducts(): Promise<Product[]> {
    const response = await api.get("/v1/user/seller/product/all")
    return response.data
  },

  async getUnlistedProducts(): Promise<Product[]> {
    const response = await api.get("/v1/user/seller/product/all-unlisted")
    return response.data
  },

  async getProduct(productId: number): Promise<Product> {
    const response = await api.get(`/v1/user/seller/product/${productId}`)
    return response.data
  },

  async createProduct(data: CreateProductDTO): Promise<Product> {
    const response = await api.post("/v1/user/seller/product/add", data)
    return response.data
  },

  async updateProduct(productId: number, data: UpdateProductDTO): Promise<Product> {
    const response = await api.put(`/v1/user/seller/product/edit/${productId}`, data)
    return response.data
  },

  async deleteProduct(productId: number): Promise<void> {
    await api.delete(`/v1/user/seller/product/${productId}`)
  },

  async listProduct(productId: number): Promise<void> {
    await api.post(`/v1/user/seller/product/enlist`, { productId })
  },

  async unlistProduct(productId: number): Promise<void> {
    await api.post(`/v1/user/seller/product/unlist`, { productId })
  },

  async searchProducts(query: string): Promise<Product[]> {
    const response = await api.get(`/v1/user/seller/product/search?q=${query}`)
    return response.data
  },

  // Order operations
  async getOrders(): Promise<Order[]> {
    const response = await api.get("/v1/seller/orders")
    return response.data
  },

  async updateOrderStatus(orderId: number, status: string): Promise<void> {
    await api.put(`/v1/seller/orders/${orderId}/status`, { status })
  },

  // Store operations
  async getStore(): Promise<Store> {
    const response = await api.get("/v1/user/store")
    return response.data
  },

  async updateStore(data: UpdateStoreDTO): Promise<Store> {
    const response = await api.put("/v1/user/store", data)
    return response.data
  },

  // Analytics
  async getAnalytics(): Promise<any> {
    const response = await api.get("/v1/seller/analytics")
    return response.data
  },

  async getEarnings(): Promise<any> {
    const response = await api.get("/v1/seller/earnings")
    return response.data
  },
}
