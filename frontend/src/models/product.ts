export interface LocalizedText {
  en: string
  ar: string
}

export interface Product {
  id: number
  userId: number
  name: LocalizedText
  description: LocalizedText
  thumbnailImage: string
  images: string[]
  category: ProductCategory
  price: number
  discount: number
  stock: number
  isFeatured: boolean
  sellCount: number
  rating: number
  ratingCount: number
  createdAt: string
  updatedAt: string
  tags: string[]
  brand: string
  shipping: { free: boolean; time: string }
  isNew: boolean
  isBestSeller: boolean
  isListed: boolean
}

export enum ProductCategory {
  FASHION = "Fashion",
  ELECTRONICS = "Electronics",
  HOME_SUPPLIES = "Home Supplies",
  ACCESSORIES = "Accessories",
  BEAUTY = "Beauty",
  BOOKS = "Books",
  TOYS = "Toys",
  SPORTS = "Sports",
  HOME = "Home",
}

export interface CreateProductDTO {
  name: LocalizedText
  description: LocalizedText
  thumbnailImage: string
  images: string[]
  category: ProductCategory
  price: number
  discount: number
  stock: number
  tags: string[]
  brand: string
}

export interface UpdateProductDTO extends Partial<CreateProductDTO> {
  isFeatured?: boolean
  isListed?: boolean
}

export const getLocalizedText = (text: LocalizedText, locale: string): string => {
  return text[locale as keyof LocalizedText] || text.en || ""
}

export const getProductName = (product: Product, locale: string): string => {
  return getLocalizedText(product.name, locale)
}

export const getProductDescription = (product: Product, locale: string): string => {
  return getLocalizedText(product.description, locale)
}
