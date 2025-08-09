import type { CartItem } from "@/types/cart"
import { mockProducts, mockUsers } from "@/lib/dummy-data"

// Data Source Types
export type DataSource = "mock" | "api" | "localStorage"

export class CartService {
  private dataSource: DataSource

  constructor(dataSource: DataSource = "mock") {
    this.dataSource = dataSource
  }

  // Mock Data Service (Active)
  private async getMockCartItems(productIds: number[]): Promise<CartItem[]> {
    return productIds
      .map((productId) => {
        const product = mockProducts.find((p) => p.id === productId)
        if (!product) return null
        const seller = mockUsers.find((u) => u.id === product.user_id)
        return {
          product,
          seller,
          quantity: 1,
        }
      })
      .filter(Boolean) as CartItem[]
  }

  // API Service (Inactive)
  private async getApiCartItems(): Promise<CartItem[]> {
    // TODO: Implement API calls
    /*
    const response = await fetch('/api/v1/user/cart/all', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    return response.json();
    */
    return []
  }

  // LocalStorage Service (Inactive)
  private getLocalStorageCartItems(): CartItem[] {
    // TODO: Implement localStorage logic
    /*
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem("cart_full_items");
    return stored ? JSON.parse(stored) : [];
    */
    return []
  }

  // Main method to get cart items based on data source
  async getCartItems(productIds?: number[]): Promise<CartItem[]> {
    switch (this.dataSource) {
      case "mock":
        return this.getMockCartItems(productIds || [1, 2, 3])
      case "api":
        return this.getApiCartItems()
      case "localStorage":
        return this.getLocalStorageCartItems()
      default:
        return []
    }
  }

  // API Methods (Inactive)
  async addToCart(productId: number, quantity: number): Promise<void> {
    // TODO: Implement API call
    /*
    await fetch('/api/v1/user/cart/add', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product_id: productId, quantity })
    });
    */
  }

  async updateQuantity(productId: number, quantity: number): Promise<void> {
    // TODO: Implement API call
    /*
    await fetch('/api/v1/user/cart/update-quantity', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product_id: productId, quantity })
    });
    */
  }

  async removeItem(productId: number): Promise<void> {
    // TODO: Implement API call
    /*
    await fetch('/api/v1/user/cart/remove-item', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product_id: productId })
    });
    */
  }

  async checkout(address: string, message?: string): Promise<void> {
    // TODO: Implement API call
    /*
    await fetch('/api/v1/user/cart/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: 1, address, message })
    });
    */
  }
}
