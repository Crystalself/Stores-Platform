export interface Notification {
  id: number
  userId: number
  title: string
  message: string
  type: NotificationType
  isRead: boolean
  data?: any
  createdAt: string
}

export enum NotificationType {
  ORDER = "order",
  PAYMENT = "payment",
  PRODUCT = "product",
  SYSTEM = "system",
  PROMOTION = "promotion",
}

export interface CreateNotificationDTO {
  userId: number
  title: string
  message: string
  type: NotificationType
  data?: any
}
