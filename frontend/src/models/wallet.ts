export interface Wallet {
  id: number
  userId: number
  balance: number
  currency: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Transaction {
  id: number
  walletId: number
  type: TransactionType
  amount: number
  description: string
  reference?: string
  status: TransactionStatus
  createdAt: string
}

export enum TransactionType {
  DEPOSIT = "deposit",
  WITHDRAWAL = "withdrawal",
  PAYMENT = "payment",
  REFUND = "refund",
  COMMISSION = "commission",
}

export enum TransactionStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  FAILED = "failed",
  CANCELLED = "cancelled",
}

export interface CreateTransactionDTO {
  type: TransactionType
  amount: number
  description: string
  reference?: string
}
