import { OfferType } from '@/models/offer';

export const OFFERS_CONFIG = {
  // Pagination
  ITEMS_PER_PAGE: 12,
  MAX_ITEMS_PER_CUSTOMER: 10,
  
  // Countdown settings
  COUNTDOWN_UPDATE_INTERVAL: 1000, // 1 second
  
  // Stock thresholds
  LOW_STOCK_THRESHOLD: 5,
  CRITICAL_STOCK_THRESHOLD: 2,
  
  // Price ranges
  PRICE_RANGES: {
    MIN: 0,
    MAX: 10000,
    STEP: 10
  },
  
  // Discount ranges
  DISCOUNT_RANGES: {
    MIN: 0,
    MAX: 100,
    STEP: 5
  },
  
  // Offer types configuration
  OFFER_TYPES: {
    [OfferType.DISCOUNT]: {
      label: 'Discount',
      color: 'primary',
      icon: 'LocalOffer'
    },
    [OfferType.FLASH_DEAL]: {
      label: 'Flash Deal',
      color: 'error',
      icon: 'Timer'
    },
    [OfferType.BUNDLE]: {
      label: 'Bundle',
      color: 'success',
      icon: 'Inventory'
    },
    [OfferType.FREE_SHIPPING]: {
      label: 'Free Shipping',
      color: 'info',
      icon: 'LocalShipping'
    },
    [OfferType.BUY_ONE_GET_ONE]: {
      label: 'BOGO',
      color: 'warning',
      icon: 'TwoWheeler'
    },
    [OfferType.LIMITED_TIME]: {
      label: 'Limited Time',
      color: 'secondary',
      icon: 'AccessTime'
    }
  },
  
  // Animation settings
  ANIMATIONS: {
    CARD_HOVER_DURATION: 300,
    FADE_IN_DURATION: 500,
    COUNTDOWN_PULSE_DURATION: 1000
  },
  
  // API settings
  API: {
    TIMEOUT: 5000,
    RETRY_ATTEMPTS: 3,
    CACHE_DURATION: 5 * 60 * 1000 // 5 minutes
  },
  
  // UI settings
  UI: {
    GRID_BREAKPOINTS: {
      xs: 1,
      sm: 2,
      md: 3,
      lg: 4,
      xl: 5
    },
    CARD_HEIGHT: 400,
    IMAGE_ASPECT_RATIO: 16 / 9,
    BORDER_RADIUS: 12
  },
  
  // Validation rules
  VALIDATION: {
    MIN_PRICE: 0.01,
    MAX_PRICE: 999999.99,
    MIN_DISCOUNT: 0,
    MAX_DISCOUNT: 100,
    MIN_STOCK: 0,
    MAX_STOCK: 999999,
    MIN_TITLE_LENGTH: 3,
    MAX_TITLE_LENGTH: 100,
    MIN_DESCRIPTION_LENGTH: 10,
    MAX_DESCRIPTION_LENGTH: 1000
  },
  
  // Localization
  LOCALE: {
    DEFAULT: 'en',
    SUPPORTED: ['en', 'ar'],
    FALLBACK: 'en'
  }
};

export const getOfferTypeConfig = (type: OfferType) => {
  return OFFERS_CONFIG.OFFER_TYPES[type] || OFFERS_CONFIG.OFFER_TYPES[OfferType.DISCOUNT];
};

export const formatPrice = (price: number, currency: string = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(price);
};

export const formatDiscount = (discount: number) => {
  return `${discount}% OFF`;
};

export const calculateFinalPrice = (originalPrice: number, discount: number) => {
  return originalPrice - (originalPrice * (discount / 100));
};

export const isLowStock = (stock: number) => {
  return stock <= OFFERS_CONFIG.LOW_STOCK_THRESHOLD;
};

export const isCriticalStock = (stock: number) => {
  return stock <= OFFERS_CONFIG.CRITICAL_STOCK_THRESHOLD;
};

export const getStockPercentage = (stock: number, maxStock: number = 100) => {
  return Math.min((stock / maxStock) * 100, 100);
}; 