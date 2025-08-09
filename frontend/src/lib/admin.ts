import api from "./api"
import type { User } from "@/models/user"
import type { Order } from "@/models/order"

export const adminService = {
  // User management
  async getUsers(): Promise<User[]> {
    const response = await api.get("/v1/admin/users")
    return response.data
  },

  async getUser(userId: number): Promise<User> {
    const response = await api.get(`/v1/admin/users/${userId}`)
    return response.data
  },

  async updateUser(userId: number, data: Partial<User>): Promise<User> {
    const response = await api.put(`/v1/admin/users/${userId}`, data)
    return response.data
  },

  async deleteUser(userId: number): Promise<void> {
    await api.delete(`/v1/admin/users/${userId}`)
  },

  async restrictUser(userId: number): Promise<void> {
    await api.post(`/v1/admin/users/${userId}/restrict`)
  },

  async unrestrictUser(userId: number): Promise<void> {
    await api.post(`/v1/admin/users/${userId}/unrestrict`)
  },

  // Order management
  async getAllOrders(): Promise<Order[]> {
    const response = await api.get("/v1/admin/order/all")
    return response.data
  },

  async updateOrderStatus(orderId: number, status: string): Promise<void> {
    await api.put(`/v1/admin/order/update-status`, { orderId, status })
  },

  async markOrderPaid(orderId: number): Promise<void> {
    await api.post(`/v1/admin/order/mark-paid`, { orderId })
  },

  async markOrderDelivered(orderId: number): Promise<void> {
    await api.post(`/v1/admin/order/mark-delivered`, { orderId })
  },

  // Support management
  async getSupportTickets(): Promise<any[]> {
    const response = await api.get("/v1/admin/support/all-tickets")
    return response.data
  },

  async getSupportTicket(ticketId: number): Promise<any> {
    const response = await api.get(`/v1/admin/support/ticket-details/${ticketId}`)
    return response.data
  },

  async updateTicketStatus(ticketId: number, status: string): Promise<void> {
    await api.put(`/v1/admin/support/update-status`, { ticketId, status })
  },

  async sendMessage(ticketId: number, message: string): Promise<void> {
    await api.post(`/v1/admin/support/send-message`, { ticketId, message })
  },

  // Analytics
  async getDashboardStats(): Promise<any> {
    const response = await api.get("/v1/admin/dashboard/stats")
    return response.data
  },

  async getReports(): Promise<any> {
    const response = await api.get("/v1/admin/reports")
    return response.data
  },
}
