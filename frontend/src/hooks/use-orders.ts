"use client"

import { useState, useEffect, useMemo } from "react"
import type { Order, OrderFilters, OrderStats, OrderStatus } from "@/types/order"

// Mock orders data
const mockOrders: Order[] = [
  {
    id: 1,
    user_id: 1,
    products: [
      {
        id: 1,
        name: "Wireless Bluetooth Headphones",
        price: 199.99,
        discount: 15,
        quantity: 1,
        thumbnail_image: "https://placehold.co/600x400/2F4F4F/FFFFFF?text=Headphones",
        total: 169.99,
      },
      {
        id: 2,
        name: "USB-C Cable",
        price: 19.99,
        quantity: 2,
        thumbnail_image: "https://placehold.co/600x400/4169E1/FFFFFF?text=Cable",
        total: 39.98,
      },
    ],
    total: 209.97,
    message: "Please deliver after 6 PM",
    paid: true,
    delivery: true,
    status: "DELIVERED" as OrderStatus,
    address: "123 Main St, New York, NY 10001",
    created_at: "2025-01-15T10:30:00Z",
    updated_at: "2025-01-18T14:20:00Z",
  },
  {
    id: 2,
    user_id: 1,
    products: [
      {
        id: 3,
        name: "Smart Fitness Watch",
        price: 299.99,
        discount: 25,
        quantity: 1,
        thumbnail_image: "https://placehold.co/600x400/32CD32/FFFFFF?text=Watch",
        total: 224.99,
      },
    ],
    total: 224.99,
    paid: true,
    delivery: false,
    status: "SHIPPED" as OrderStatus,
    address: "456 Oak Ave, Los Angeles, CA 90210",
    created_at: "2025-01-20T09:15:00Z",
    updated_at: "2025-01-22T11:45:00Z",
  },
  {
    id: 3,
    user_id: 1,
    products: [
      {
        id: 4,
        name: "Gaming Mechanical Keyboard",
        price: 149.99,
        discount: 10,
        quantity: 1,
        thumbnail_image: "https://placehold.co/600x400/FF69B4/FFFFFF?text=Keyboard",
        total: 134.99,
      },
      {
        id: 5,
        name: "Gaming Mouse",
        price: 79.99,
        quantity: 1,
        thumbnail_image: "https://placehold.co/600x400/FF7F50/FFFFFF?text=Mouse",
        total: 79.99,
      },
    ],
    total: 214.98,
    paid: false,
    delivery: false,
    status: "PENDING" as OrderStatus,
    address: "789 Pine St, Chicago, IL 60601",
    created_at: "2025-01-25T16:20:00Z",
    updated_at: "2025-01-25T16:20:00Z",
  },
  {
    id: 4,
    user_id: 1,
    products: [
      {
        id: 6,
        name: "Wireless Charger",
        price: 49.99,
        quantity: 1,
        thumbnail_image: "https://placehold.co/600x400/9370DB/FFFFFF?text=Charger",
        total: 49.99,
      },
    ],
    total: 49.99,
    paid: true,
    delivery: false,
    status: "CANCELLED" as OrderStatus,
    address: "321 Elm St, Miami, FL 33101",
    created_at: "2025-01-10T14:30:00Z",
    updated_at: "2025-01-12T09:15:00Z",
  },
  {
    id: 5,
    user_id: 1,
    products: [
      {
        id: 7,
        name: "Bluetooth Speaker",
        price: 89.99,
        discount: 20,
        quantity: 2,
        thumbnail_image: "https://placehold.co/600x400/20B2AA/FFFFFF?text=Speaker",
        total: 143.98,
      },
    ],
    total: 143.98,
    paid: true,
    delivery: false,
    status: "PROCESSING" as OrderStatus,
    address: "654 Maple Dr, Seattle, WA 98101",
    created_at: "2025-01-28T11:45:00Z",
    updated_at: "2025-01-29T08:30:00Z",
  },
]

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<OrderFilters>({
    offset: 0,
    limit: 10,
    order: {
      column: "created_at",
      direction: "desc",
    },
  })

  // Load orders with filters
  const loadOrders = async (newFilters?: Partial<OrderFilters>) => {
    setLoading(true)
    setError(null)

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 800))

      const currentFilters = { ...filters, ...newFilters }

      // TODO: Replace with actual API call
      // const response = await fetch('/api/orders/all', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(currentFilters)
      // })
      // const data = await response.json()

      // Mock filtering and sorting
      let filteredOrders = [...mockOrders]

      // Filter by status
      if (currentFilters.status) {
        filteredOrders = filteredOrders.filter((order) => order.status === currentFilters.status)
      }

      // Filter by date range
      if (currentFilters.dateFrom) {
        filteredOrders = filteredOrders.filter(
          (order) => new Date(order.created_at) >= new Date(currentFilters.dateFrom!),
        )
      }

      if (currentFilters.dateTo) {
        filteredOrders = filteredOrders.filter(
          (order) => new Date(order.created_at) <= new Date(currentFilters.dateTo!),
        )
      }

      // Sort orders
      filteredOrders.sort((a, b) => {
        let comparison = 0
        const { column, direction } = currentFilters.order

        switch (column) {
          case "created_at":
            comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
            break
          case "total":
            comparison = a.total - b.total
            break
          case "status":
            comparison = a.status.localeCompare(b.status)
            break
        }

        return direction === "desc" ? -comparison : comparison
      })

      // Apply pagination
      const startIndex = currentFilters.offset
      const endIndex = startIndex + currentFilters.limit
      const paginatedOrders = filteredOrders.slice(startIndex, endIndex)

      setOrders(paginatedOrders)
      setFilters(currentFilters)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load orders")
    } finally {
      setLoading(false)
    }
  }

  // Get order details
  const getOrderDetails = async (orderId: number): Promise<Order | null> => {
    setLoading(true)
    setError(null)

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      // TODO: Replace with actual API call
      // const response = await fetch('/api/orders/details', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ id: orderId })
      // })
      // const data = await response.json()

      const order = mockOrders.find((o) => o.id === orderId)
      return order || null
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load order details")
      return null
    } finally {
      setLoading(false)
    }
  }

  // Cancel order
  const cancelOrder = async (orderId: number): Promise<boolean> => {
    setLoading(true)
    setError(null)

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // TODO: Replace with actual API call
      // const response = await fetch('/api/orders/cancel', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ id: orderId })
      // })

      // Update local state
      setOrders((prev) =>
        prev.map((order) => (order.id === orderId ? { ...order, status: "CANCELLED" as OrderStatus } : order)),
      )

      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to cancel order")
      return false
    } finally {
      setLoading(false)
    }
  }

  // Calculate order statistics
  const orderStats = useMemo((): OrderStats => {
    const allOrders = mockOrders // In real app, this would be all user orders
    return {
      totalOrders: allOrders.length,
      totalSpent: allOrders.reduce((sum, order) => sum + order.total, 0),
      pendingOrders: allOrders.filter((order) => order.status === "PENDING").length,
      deliveredOrders: allOrders.filter((order) => order.status === "DELIVERED").length,
      cancelledOrders: allOrders.filter((order) => order.status === "CANCELLED").length,
    }
  }, [])

  // Load initial orders
  useEffect(() => {
    loadOrders()
  }, [])

  return {
    orders,
    loading,
    error,
    filters,
    orderStats,
    loadOrders,
    getOrderDetails,
    cancelOrder,
    updateFilters: (newFilters: Partial<OrderFilters>) => loadOrders(newFilters),
  }
}
