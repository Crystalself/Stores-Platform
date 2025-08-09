"use client"

import { useState, useMemo } from "react"
import type { CartItem, CartFilters, CartTotals, Product, Seller } from "@/types/cart";
import { ProductCategory } from "@/types/cart" 

// Mock sellers data
const mockSellers: Seller[] = [
  {
    id: 1,
    username: "danielle96",
    storeName: "Abo belal Store",
    email: "jeffreydoyle@hotmail.com",
    phone: "235-116-1559x407",
    firstName: "Danielle",
    lastName: "Johnson",
    restricted: false,
    verified: true,
    bankName: "Martinez, Nielsen and Miller",
    bankAccount: "554055811",
    balance: 5411.69,
    profilePic: "https://api.dicebear.com/7.x/initials/svg?seed=Danielle Johnson",
    profilePic2: "https://api.dicebear.com/7.x/initials/svg?seed=ashrafsohail Johnson",
    createdAt: "2025-04-24T20:37:10",
    updatedAt: "2025-04-24T20:37:10",
    role: "seller",
    rating: 4.7,
    rating_count: 120,
    followers: [2, 3, 4, 7, 6, 8],
    bio: "This store offers high-quality products and fast service. Welcome! from mockdata",
  },
  {
    id: 2,
    username: "ahmed_store",
    storeName: "Ahmed Electronics",
    email: "ahmed@electronics.com",
    phone: "0599999999",
    firstName: "Ahmed",
    lastName: "Salem",
    restricted: false,
    verified: true,
    bankName: "National Bank",
    bankAccount: "123456789",
    balance: 8500.5,
    profilePic: "https://api.dicebear.com/7.x/initials/svg?seed=Ahmed Salem",
    profilePic2: "https://api.dicebear.com/7.x/initials/svg?seed=Ahmed Salem",
    createdAt: "2025-03-15T10:20:30",
    updatedAt: "2025-07-20T10:20:30",
    role: "seller",
    rating: 4.5,
    rating_count: 89,
    followers: [1, 3, 5, 8, 9],
    bio: "Best electronics store in the region with competitive prices",
  },
  {
    id: 3,
    username: "layla_fashion",
    storeName: "Layla Fashion Hub",
    email: "layla@fashion.com",
    phone: "0566666666",
    firstName: "Layla",
    lastName: "Ali",
    restricted: false,
    verified: true,
    bankName: "Commercial Bank",
    bankAccount: "987654321",
    balance: 12300.75,
    profilePic: "https://api.dicebear.com/7.x/initials/svg?seed=Layla Ali",
    profilePic2: "https://api.dicebear.com/7.x/initials/svg?seed=Layla Ali",
    createdAt: "2025-02-10T14:30:45",
    updatedAt: "2025-07-18T14:30:45",
    role: "seller",
    rating: 4.8,
    rating_count: 156,
    followers: [1, 2, 4, 6, 7, 9, 10],
    bio: "Latest fashion trends and high-quality clothing for everyone",
  },
]

// Mock products data
const mockProducts: Product[] = [
  {
    id: 1,
    user_id: 1,
    name: { en: "Wireless Bluetooth Headphones", ar: "سماعة بلوتوث لاسلكية" },
    description: {
      en: "High-quality wireless headphones with noise cancellation",
      ar: "سماعة لاسلكية عالية الجودة مع إلغاء الضوضاء",
    },
    thumbnail_image: "https://placehold.co/600x400/2F4F4F/FFFFFF?text=Headphones",
    images: [
      "https://placehold.co/800x600/2F4F4F/FFFFFF?text=Headphones+1",
      "https://placehold.co/800x600/2F4F4F/FFFFFF?text=Headphones+2",
      "https://placehold.co/800x600/2F4F4F/FFFFFF?text=Headphones+3",
    ],
    category: ProductCategory.ELECTRONICS,
    price: 199.99,
    discount: 15,
    stock: 25,
    is_featured: true,
    sell_count: 342,
    rating: 4.6,
    rating_count: 89,
    created_at: "2025-06-02T07:19:38.847371",
    updated_at: "2025-07-20T07:19:38.847394",
    tags: ["electronics", "audio", "wireless"],
    brand: "AudioTech",
    shipping: { free: true, time: "2-4 days" },
    is_new: false,
    is_best_seller: true,
  },
  {
    id: 2,
    user_id: 2,
    name: { en: "Men's Cotton T-Shirt", ar: "تيشيرت رجالي قطني" },
    description: { en: "Comfortable cotton t-shirt for everyday wear", ar: "تيشيرت قطني مريح للاستخدام اليومي" },
    thumbnail_image: "https://placehold.co/600x400/FF7F50/FFFFFF?text=T-Shirt",
    images: [
      "https://placehold.co/800x600/FF7F50/FFFFFF?text=T-Shirt+1",
      "https://placehold.co/800x600/FF7F50/FFFFFF?text=T-Shirt+2",
      "https://placehold.co/800x600/FF7F50/FFFFFF?text=T-Shirt+3",
    ],
    category: ProductCategory.FASHION,
    price: 29.99,
    discount: 20,
    stock: 50,
    is_featured: false,
    sell_count: 156,
    rating: 4.3,
    rating_count: 45,
    created_at: "2024-12-17T07:19:38.847511",
    updated_at: "2025-07-20T07:19:38.847516",
    tags: ["fashion", "cotton", "casual"],
    brand: "ComfortWear",
    shipping: { free: false, time: "3-5 days" },
    is_new: true,
    is_best_seller: false,
  },
  {
    id: 3,
    user_id: 3,
    name: { en: "Smart Fitness Watch", ar: "ساعة ذكية للياقة البدنية" },
    description: {
      en: "Advanced fitness tracking with heart rate monitor",
      ar: "تتبع متقدم للياقة البدنية مع مراقب معدل ضربات القلب",
    },
    thumbnail_image: "https://placehold.co/600x400/4169E1/FFFFFF?text=Smart+Watch",
    images: [
      "https://placehold.co/800x600/4169E1/FFFFFF?text=Watch+1",
      "https://placehold.co/800x600/4169E1/FFFFFF?text=Watch+2",
      "https://placehold.co/800x600/4169E1/FFFFFF?text=Watch+3",
    ],
    category: ProductCategory.ELECTRONICS,
    price: 299.99,
    discount: 25,
    stock: 15,
    is_featured: true,
    sell_count: 89,
    rating: 4.7,
    rating_count: 67,
    created_at: "2025-05-15T10:30:20.123456",
    updated_at: "2025-07-19T10:30:20.123456",
    tags: ["electronics", "fitness", "smart"],
    brand: "FitTech",
    shipping: { free: true, time: "1-3 days" },
    is_new: true,
    is_best_seller: true,
  },
  {
    id: 4,
    user_id: 1,
    name: { en: "Gaming Mechanical Keyboard", ar: "لوحة مفاتيح ميكانيكية للألعاب" },
    description: { en: "RGB backlit mechanical keyboard for gaming", ar: "لوحة مفاتيح ميكانيكية مضيئة للألعاب" },
    thumbnail_image: "https://placehold.co/600x400/32CD32/FFFFFF?text=Keyboard",
    images: [
      "https://placehold.co/800x600/32CD32/FFFFFF?text=Keyboard+1",
      "https://placehold.co/800x600/32CD32/FFFFFF?text=Keyboard+2",
    ],
    category: ProductCategory.ELECTRONICS,
    price: 149.99,
    discount: 10,
    stock: 30,
    is_featured: false,
    sell_count: 234,
    rating: 4.4,
    rating_count: 78,
    created_at: "2025-04-20T15:45:30.789012",
    updated_at: "2025-07-18T15:45:30.789012",
    tags: ["gaming", "keyboard", "rgb"],
    brand: "GameGear",
    shipping: { free: true, time: "2-4 days" },
    is_new: false,
    is_best_seller: false,
  },
  {
    id: 5,
    user_id: 2,
    name: { en: "Women's Summer Dress", ar: "فستان صيفي نسائي" },
    description: { en: "Light and comfortable summer dress", ar: "فستان صيفي خفيف ومريح" },
    thumbnail_image: "https://placehold.co/600x400/FF69B4/FFFFFF?text=Summer+Dress",
    images: [
      "https://placehold.co/800x600/FF69B4/FFFFFF?text=Dress+1",
      "https://placehold.co/800x600/FF69B4/FFFFFF?text=Dress+2",
      "https://placehold.co/800x600/FF69B4/FFFFFF?text=Dress+3",
    ],
    category: ProductCategory.FASHION,
    price: 79.99,
    discount: 30,
    stock: 20,
    is_featured: true,
    sell_count: 67,
    rating: 4.5,
    rating_count: 34,
    created_at: "2025-03-10T12:20:15.456789",
    updated_at: "2025-07-17T12:20:15.456789",
    tags: ["fashion", "summer", "dress"],
    brand: "SummerStyle",
    shipping: { free: false, time: "4-6 days" },
    is_new: true,
    is_best_seller: false,
  },
]

// Mock cart items
const mockCartItems: CartItem[] = [
  {
    id: 1,
    cart_id: 1,
    product_id: 1,
    product: mockProducts[0],
    seller: mockSellers[0],
    quantity: 2,
    total: 339.98, // (199.99 * 0.85) * 2
    created_at: "2025-08-01T12:00:00Z",
  },
  {
    id: 2,
    cart_id: 1,
    product_id: 2,
    product: mockProducts[1],
    seller: mockSellers[1],
    quantity: 1,
    total: 23.99, // 29.99 * 0.8
    created_at: "2025-07-30T09:30:00Z",
  },
  {
    id: 3,
    cart_id: 1,
    product_id: 3,
    product: mockProducts[2],
    seller: mockSellers[2],
    quantity: 1,
    total: 224.99, // 299.99 * 0.75
    created_at: "2025-07-28T14:15:00Z",
  },
  {
    id: 4,
    cart_id: 1,
    product_id: 4,
    product: mockProducts[3],
    seller: mockSellers[0],
    quantity: 1,
    total: 134.99, // 149.99 * 0.9
    created_at: "2025-07-25T11:20:00Z",
  },
]

export function useCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>(mockCartItems)
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState<CartFilters>({
    sortBy: "created_at",
    sortDirection: "desc",
  })

  // Sort cart items based on filters
  const sortedCartItems = useMemo(() => {
    return [...cartItems].sort((a, b) => {
      let comparison = 0

      switch (filters.sortBy) {
        case "price":
          comparison = a.product.price - b.product.price
          break
        case "name":
          comparison = a.product.name.en.localeCompare(b.product.name.en)
          break
        case "rating":
          comparison = a.product.rating - b.product.rating
          break
        case "created_at":
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          break
        default:
          comparison = 0
      }

      return filters.sortDirection === "desc" ? -comparison : comparison
    })
  }, [cartItems, filters])

  // Calculate totals
  const totals = useMemo((): CartTotals => {
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)
    const subtotal = cartItems.reduce((sum, item) => {
      const discountedPrice = item.product.price * (1 - item.product.discount / 100)
      return sum + discountedPrice * item.quantity
    }, 0)

    const shipping = subtotal > 100 ? 0 : 9.99
    const tax = subtotal * 0.08
    const finalTotal = subtotal + shipping + tax

    return {
      totalItems,
      totalPrice: subtotal,
      subtotal,
      shipping,
      tax,
      finalTotal,
    }
  }, [cartItems])

  const updateQuantity = async (productId: number, quantity: number) => {
    setLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId
          ? {
              ...item,
              quantity: Math.max(1, Math.min(quantity, item.product.stock)),
              total: item.product.price * (1 - item.product.discount / 100) * quantity,
            }
          : item,
      ),
    )

    setLoading(false)
  }

  const removeItem = async (productId: number) => {
    setLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 300))

    setCartItems((prev) => prev.filter((item) => item.product.id !== productId))

    setLoading(false)
  }

  const updateFilters = (newFilters: Partial<CartFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }))
  }

  const clearCart = async () => {
    setLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    setCartItems([])

    setLoading(false)
  }

  return {
    cartItems: sortedCartItems,
    loading,
    filters,
    totals,
    updateQuantity,
    removeItem,
    updateFilters,
    clearCart,
  }
}
