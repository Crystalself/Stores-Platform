export interface Review {
  id: number
  userId: number
  productId: number
  orderId: number
  rating: number
  comment: string
  images?: string[]
  isVerified: boolean
  createdAt: string
  updatedAt: string
  user: {
    id: number
    firstName: string
    lastName: string
    profilePic: string
  }
}

export interface CreateReviewDTO {
  productId: number
  orderId: number
  rating: number
  comment: string
  images?: string[]
}
