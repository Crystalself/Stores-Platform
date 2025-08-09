import { Product } from '@/models/product';
import { fetchProductsBySeller } from './dummy-data';

export interface Store {
  id: number;
  name: string;
  description: string;
  logo: string;
  banner: string;
  rating: number;
  rating_count: number;
}

const dummyStores: Store[] = [
  {
    id: 101,
    name: 'الرواد للإلكترونيات',
    description: 'أجهزة إلكترونية حديثة بأسعار منافسة وجودة مضمونة.',
    logo: 'https://placehold.co/100x100/2B3467/fff?text=Logo+101',
    banner: 'https://placehold.co/1200x300/2B3467/fff?text=Store+101+Banner',
    rating: 4.6,
    rating_count: 78,
  },
  {
    id: 102,
    name: 'موبايل سنتر',
    description: 'كل ما تحتاجه من إكسسوارات وأجهزة موبايل أصلية.',
    logo: 'https://placehold.co/100x100/E46F6F/fff?text=Logo+102',
    banner: 'https://placehold.co/1200x300/E46F6F/fff?text=Store+102+Banner',
    rating: 4.4,
    rating_count: 95,
  },
];

export const fetchStoreById = async (id: number): Promise<Store | undefined> => {
  await new Promise((resolve) => setTimeout(resolve, 400));
  return dummyStores.find((store) => store.id === id);
};

export const fetchStoreWithProducts = async (id: number): Promise<{
  store: Store | undefined;
  products: Product[];
}> => {
  const [store, products] = await Promise.all([
    fetchStoreById(id),
    fetchProductsBySeller(id),
  ]);
  return { store, products };
};
