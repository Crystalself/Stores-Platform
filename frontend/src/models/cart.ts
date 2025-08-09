import type { Product } from "./product"

export interface CartItem {
  id: number
  userId: number
  productId: number
  product: Product
  quantity: number
  addedAt: string
}

export interface Cart {
  id: number
  userId: number
  items: CartItem[]
  totalItems: number
  totalAmount: number
  updatedAt: string
}

export interface AddToCartDTO {
  productId: number
  quantity: number
}

export interface UpdateCartItemDTO {
  quantity: number
}
