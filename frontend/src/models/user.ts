export type UserRole = "customer" | "seller" | "admin"

export interface User {
  id: number
  username: string
  email: string
  phone: string
  firstName: string
  lastName: string
  profilePic: string
  role: UserRole
  verified: boolean
  restricted: boolean
  balance: number
  bankName?: string
  bankAccount?: string
  createdAt: string
  updatedAt: string

  // Seller specific fields
  storeName?: string
  storeDescription?: string
  storeImage?: string
  rating?: number
  ratingCount?: number
  totalSales?: number

  // Admin specific fields
  permissions?: string[]
}

export interface UserProfile extends Omit<User, "password"> {
  preferences?: {
    language: string
    theme: "light" | "dark" | "auto"
    notifications: {
      email: boolean
      sms: boolean
      push: boolean
    }
  }
}

export interface CreateUserDTO {
  username: string
  email: string
  password: string
  phone: string
  firstName: string
  lastName: string
  role?: UserRole
}

export interface UpdateUserDTO {
  username?: string
  email?: string
  phone?: string
  firstName?: string
  lastName?: string
  profilePic?: string
  storeName?: string
  storeDescription?: string
}
