'use client';

import { fetchProductById } from '@/lib/dummy-data';
import { notFound } from 'next/navigation';
import { Product } from '@/models/product';
import ProductDetailClientView from '@/components/products/ProductDetailClientView';
import { useState, useEffect } from 'react';
import { Box, CircularProgress } from '@mui/material';

interface ProductPageProps {
  params: { productId: string };
}

export default function ProductPageWrapper({ params }: ProductPageProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [open, setOpen] = useState(true); // نبدأ بفتح الـ Dialog مباشرة

  useEffect(() => {
    const id = parseInt(params.productId);
    fetchProductById(id).then((res) => {
      if (!res) return notFound();
      setProduct(res);
    });
  }, [params.productId]);

  if (!product) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <ProductDetailClientView
      product={product}
      open={open}
      onClose={() => setOpen(false)}
    />
  );
}
