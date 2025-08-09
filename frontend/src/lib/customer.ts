import api from "./api"
import type { Order, CreateOrderDTO } from "@/models/order"
import type { CartItem, AddToCartDTO, UpdateCartItemDTO } from "@/models/cart"
import type { Review, CreateReviewDTO } from "@/models/review"
import type { Notification } from "@/models/notification"

export const customerService = {
  // Cart operations
  async getCart(): Promise<CartItem[]> {
    const response = await api.get("/v1/user/cart/all")
    return response.data
  },

  async addToCart(data: AddToCartDTO): Promise<CartItem> {
    const response = await api.post("/v1/user/cart/add", data)
    return response.data
  },

  async updateCartItem(productId: number, data: UpdateCartItemDTO): Promise<CartItem> {
    const response = await api.put(`/v1/user/cart/update-quantity`, {
      productId,
      ...data,
    })
    return response.data
  },

  async removeFromCart(productId: number): Promise<void> {
    await api.delete(`/v1/user/cart/remove-item`, { data: { productId } })
  },

  async clearCart(): Promise<void> {
    await api.delete("/v1/user/cart/remove")
  },

  async checkout(data: CreateOrderDTO): Promise<Order> {
    const response = await api.post("/v1/user/cart/checkout", data)
    return response.data
  },

  // Order operations
  async getOrders(): Promise<Order[]> {
    const response = await api.get("/v1/user/order/all")
    return response.data
  },

  async getOrder(orderId: number): Promise<Order> {
    const response = await api.get(`/v1/user/order/details/${orderId}`)
    return response.data
  },

  async cancelOrder(orderId: number): Promise<void> {
    await api.post(`/v1/user/order/cancel`, { orderId })
  },

  // Review operations
  async createReview(data: CreateReviewDTO): Promise<Review> {
    const response = await api.post("/v1/user/review/create", data)
    return response.data
  },

  async getProductReviews(productId: number): Promise<Review[]> {
    const response = await api.get(`/v1/user/review/product/${productId}`)
    return response.data
  },

  // Notifications
  async getNotifications(): Promise<Notification[]> {
    const response = await api.get("/v1/user/notifications")
    return response.data
  },

  async markNotificationRead(notificationId: number): Promise<void> {
    await api.put(`/v1/user/notifications/${notificationId}/read`)
  },

  // Support
  async createSupportTicket(data: { subject: string; message: string }): Promise<any> {
    const response = await api.post("/v1/user/support/create-ticket", data)
    return response.data
  },

  async getSupportTickets(): Promise<any[]> {
    const response = await api.get("/v1/user/support/all-tickets")
    return response.data
  },
}
