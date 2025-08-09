import { apiGet, apiPutForm } from '@/lib/api';

export type EditableProduct = {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  discount: number;
  category: string;
  thumbnail_image?: string;
  images?: string[];
};

export type ApiSimpleResponse = {
  statusCode: number;
  message: string;
};

type BackendProduct = {
  id: number;
  name: string;
  description: string;
  price: number | string;
  discount?: number | string;
  in_stock?: boolean | number;
  category?: string;
  thumbnail_image?: string;
  images?: string | string[];
};

export async function fetchProductById(productId: number): Promise<EditableProduct | null> {
  const res = await apiGet<{ statusCode: number; data: BackendProduct; message: string }>(
    '/v1/product/details',
    { id: productId }
  );
  const p = res?.data;
  if (!p) return null;
  return {
    id: p.id,
    name: p.name ?? '',
    description: p.description ?? '',
    price: Number(p.price ?? 0),
    stock: p.in_stock ? 1 : 0,
    discount: Number(p.discount ?? 0),
    category: p.category ?? 'FASHION',
    thumbnail_image: p.thumbnail_image,
    images: Array.isArray(p.images) ? p.images : (() => {
      try { return JSON.parse((p.images as string) || '[]'); } catch { return []; }
    })(),
  };
}

export async function updateProduct(formData: FormData): Promise<ApiSimpleResponse> {
  return apiPutForm<ApiSimpleResponse>('/v1/user/seller/product/edit', formData);
}
