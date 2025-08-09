import { Product, ProductCategory } from './product';

export interface Offer extends Product {
  offer_type: OfferType;
  start_date: string;
  end_date: string;
  is_featured: boolean;
  is_flash_deal: boolean;
  max_quantity_per_customer?: number;
  minimum_purchase?: number;
  terms_and_conditions?: string;
  offer_code?: string;
}

export enum OfferType {
  DISCOUNT = 'discount',
  FLASH_DEAL = 'flash_deal',
  BUNDLE = 'bundle',
  FREE_SHIPPING = 'free_shipping',
  BUY_ONE_GET_ONE = 'buy_one_get_one',
  LIMITED_TIME = 'limited_time'
}

export interface OfferFilter {
  category?: ProductCategory;
  priceRange?: [number, number];
  discountRange?: [number, number];
  offerType?: OfferType;
  isFeatured?: boolean;
  isFlashDeal?: boolean;
  sortBy?: 'newest' | 'oldest' | 'priceLow' | 'priceHigh' | 'discountHigh' | 'expiringSoon';
}

export interface OfferCountdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

export type CreateOfferDTO = Omit<Offer, 'id' | 'user_id' | 'sell_count' | 'rating' | 'rating_count' | 'created_at' | 'updated_at'>;
export type UpdateOfferDTO = Partial<CreateOfferDTO>;
