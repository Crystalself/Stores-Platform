export interface Store {
  id: number
  userId: number
  name: string
  description: string
  image: string
  banner: string
  rating: number
  ratingCount: number
  totalProducts: number
  totalSales: number
  isVerified: boolean
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface UpdateStoreDTO {
  name?: string
  description?: string
  image?: string
  banner?: string
}
