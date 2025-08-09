export interface User {
    id: number
    name: string
    email: string
    phone: string
    first_name?: string
    last_name?: string
    profile_pic?: string
    bank_name?: string
    bank_account?: string
    type: "customer" | "seller" | "admin"
    verified: boolean
    restricted: boolean
    created_at: string
    updated_at: string
  }
  
  export interface UserSession {
    id: number
    user_id: number
    ip: string
    info: {
      country?: string
      city?: string
      browser?: string
      os?: string
    }
    trusted: boolean
    created_at: string
    updated_at: string
  }
  
  export interface UpdateUserData {
    first_name?: string
    last_name?: string
    phone?: string
    bank_name?: string
    bank_account?: string
  }
  
  export interface ChangePasswordData {
    old_password: string
    new_password: string
    confirm_password: string
  }
  
  export interface ProfileFormData {
    first_name: string
    last_name: string
    phone: string
    bank_name: string
    bank_account: string
  }
  