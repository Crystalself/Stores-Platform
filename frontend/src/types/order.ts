/**
 * أنواع البيانات المتعلقة بالطلبات والعقود
 * Order and Contract Data Types
 */

import type { Product } from "./product" // Assuming Product is defined in another file

export interface Order {
  id: string
  customerId: string
  items: OrderItem[]
  totalAmount: number
  discountAmount: number
  creditsUsed: number
  finalAmount: number
  status: OrderStatus
  paymentMethod: PaymentMethod
  paymentStatus: PaymentStatus
  deliveryMethod: DeliveryMethod
  deliveryAddress?: Address
  deliveryDate?: string
  trackingNumber?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface OrderItem {
  id: string
  productId: string
  product: Product
  quantity: number
  price: number
  totalPrice: number
  selectedVariants?: { [key: string]: string }
}

export type OrderStatus = "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded"

export type PaymentMethod = "credit_card" | "paypal" | "bank_transfer" | "cash_on_delivery" | "credits"

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded"

export type DeliveryMethod = "home_delivery" | "store_pickup" | "express_delivery"

export interface Address {
  id: string
  name: string
  phone: string
  street: string
  city: string
  state: string
  zipCode: string
  country: string
  isDefault: boolean
}

// عقود الاستيراد - Import Contracts
export interface ImportContract {
  id: string
  customerId: string
  merchantId: string
  productId?: string // إذا كان المنتج موجود
  customProduct?: CustomProductRequest // إذا كان منتج مخصص
  quantity: number
  pricePerUnit: number
  totalAmount: number
  status: ContractStatus
  deliveryTimeline: string
  preferredDeliveryDate?: string
  terms: string
  notes?: string
  chatId: string
  createdAt: string
  updatedAt: string
  progress: ContractProgress[]
}

export interface CustomProductRequest {
  name: string
  description: string
  specifications: string
  images?: string[]
  suggestedPrice: number
}

export type ContractStatus =
  | "pending"
  | "negotiating"
  | "accepted"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "disputed"

export interface ContractProgress {
  id: string
  status: string
  description: string
  date: string
  attachments?: string[]
}
