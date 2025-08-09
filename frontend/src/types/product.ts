/**
 * أنواع البيانات المتعلقة بالمنتجات والمتاجر
 * Product and Store Data Types
 */

export interface Product {
  id: string
  name: {
    ar: string
    en: string
  }
  description: {
    ar: string
    en: string
  }
  price: number
  originalPrice?: number
  discount: number
  category: string
  subcategory?: string
  images: string[]
  thumbnailImage: string
  model3D?: string // للمنتجات ثلاثية الأبعاد
  stock: number
  isAvailable: boolean
  isPreSale: boolean
  preSaleTarget?: number
  preSaleRaised?: number
  tags: ProductTag[]
  rating: number
  reviewCount: number
  sellerId: string
  storeId: string
  createdAt: string
  updatedAt: string
  specifications?: ProductSpecification[]
  variants?: ProductVariant[]
}

export interface ProductTag {
  id: string
  name: string
  color: string
  type: "bestseller" | "new" | "limited" | "sale" | "featured"
}

export interface ProductSpecification {
  name: string
  value: string
}

export interface ProductVariant {
  id: string
  name: string
  options: string[]
  priceModifier: number
}

export interface ProductFilter {
  category?: string
  subcategory?: string
  minPrice?: number
  maxPrice?: number
  rating?: number
  tags?: string[]
  inStock?: boolean
  sortBy?: "price_asc" | "price_desc" | "rating" | "newest" | "bestseller"
  search?: string
  page?: number
  limit?: number
}

export interface Store {
  id: string
  name: string
  description: string
  logo: string
  banner: string
  ownerId: string
  rating: number
  reviewCount: number
  isVerified: boolean
  categories: string[]
  location: {
    address: string
    city: string
    coordinates: {
      lat: number
      lng: number
    }
  }
  contactInfo: {
    phone: string
    email: string
    website?: string
  }
  socialMedia: {
    facebook?: string
    instagram?: string
    twitter?: string
  }
  createdAt: string
  updatedAt: string
}
