export interface Order {
  id: number
  userId: number
  sellerId: number
  products: OrderProduct[]
  totalAmount: number
  status: OrderStatus
  paymentStatus: PaymentStatus
  shippingAddress: Address
  billingAddress: Address
  paymentMethod: string
  trackingNumber?: string
  notes?: string
  createdAt: string
  updatedAt: string
  deliveredAt?: string
}

export interface OrderProduct {
  productId: number
  product: {
    id: number
    name: string
    thumbnailImage: string
    price: number
  }
  quantity: number
  price: number
  discount: number
}

export interface Address {
  street: string
  city: string
  state: string
  zipCode: string
  country: string
}

export enum OrderStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  PROCESSING = "processing",
  SHIPPED = "shipped",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
  RETURNED = "returned",
}

export enum PaymentStatus {
  PENDING = "pending",
  PAID = "paid",
  FAILED = "failed",
  REFUNDED = "refunded",
}

export interface CreateOrderDTO {
  products: { productId: number; quantity: number }[]
  shippingAddress: Address
  billingAddress: Address
  paymentMethod: string
  notes?: string
}
