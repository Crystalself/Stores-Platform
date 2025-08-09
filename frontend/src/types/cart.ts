export enum ProductCategory {
  ELECTRONICS = "ELECTRONICS",
  FASHION = "FASHION",
  HOME = "HOME",
  TOYS = "TOYS",
  BOOKS = "BOOKS",
  SPORTS = "SPORTS",
  BEAUTY = "BEAUTY",
  AUTOMOTIVE = "AUTOMOTIVE",
}

export interface Product {
  id: number
  user_id: number
  name: {
    en: string
    ar: string
  }
  description: {
    en: string
    ar: string
  }
  thumbnail_image: string
  images: string[]
  category: ProductCategory
  price: number
  discount: number
  stock: number
  is_featured: boolean
  sell_count: number
  rating: number
  rating_count: number
  created_at: string
  updated_at: string
  tags: string[]
  brand: string
  shipping: {
    free: boolean
    time: string
  }
  is_new: boolean
  is_best_seller: boolean
}

export interface Seller {
  id: number
  username: string
  storeName: string
  email: string
  phone: string
  firstName: string
  lastName: string
  restricted: boolean
  verified: boolean
  bankName: string
  bankAccount: string
  balance: number
  profilePic: string
  profilePic2: string
  createdAt: string
  updatedAt: string
  role: string
  rating: number
  rating_count: number
  followers: number[]
  bio: string
}

export interface CartItem {
  id: number
  cart_id: number
  product_id: number
  product: Product
  seller: Seller
  quantity: number
  total: number
  created_at: string
}

export interface Cart {
  id: number
  user_id: number
  total: number
  created_at: string
  updated_at: string
  items: CartItem[]
}

export type SortBy = "price" | "name" | "rating" | "created_at"
export type SortDirection = "asc" | "desc"

export interface CartFilters {
  sortBy: SortBy
  sortDirection: SortDirection
}

export interface CartTotals {
  totalItems: number
  totalPrice: number
  subtotal: number
  shipping: number
  tax: number
  finalTotal: number
}
