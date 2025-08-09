/**
 * أنواع البيانات المتعلقة بالدردشة والإشعارات
 * Chat and Notification Data Types
 */

import type { User } from "./user" // Assuming User is defined in another file

export interface Chat {
  id: string
  participants: ChatParticipant[]
  type: ChatType
  title?: string
  lastMessage?: Message
  unreadCount: number
  isActive: boolean
  contractId?: string // إذا كانت الدردشة مرتبطة بعقد
  createdAt: string
  updatedAt: string
}

export interface ChatParticipant {
  userId: string
  user: User
  role: "customer" | "merchant" | "admin"
  joinedAt: string
  lastSeenAt?: string
}

export type ChatType = "direct" | "contract" | "support"

export interface Message {
  id: string
  chatId: string
  senderId: string
  sender: User
  content: string
  type: MessageType
  attachments?: MessageAttachment[]
  replyTo?: string
  isRead: boolean
  createdAt: string
  updatedAt: string
}

export type MessageType = "text" | "image" | "file" | "system" | "contract_update"

export interface MessageAttachment {
  id: string
  name: string
  url: string
  type: string
  size: number
}

export interface Notification {
  id: string
  userId: string
  type: NotificationType
  title: string
  message: string
  data?: any
  isRead: boolean
  actionUrl?: string
  createdAt: string
}

export type NotificationType =
  | "order_update"
  | "contract_update"
  | "message"
  | "payment"
  | "promotion"
  | "system"
  | "review_request"
