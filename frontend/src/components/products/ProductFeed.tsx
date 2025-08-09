import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Box, Button, Typography, CircularProgress, Stack, Snackbar, Alert } from '@mui/material';
import ProductFilters, { ProductFiltersState } from './ProductFilters';
import ProductCard from './ProductCard';
import { mockProducts } from '@/lib/dummy-data';

const FILTERS_KEY = 'product_filters';
const PAGE_SIZE = 30;

const getMinMaxPrice = (products: any[]) => {
  let min = 0, max = 0;
  if (products.length > 0) {
    min = Math.min(...products.map(p => p.price));
    max = Math.max(...products.map(p => p.price));
  }
  return [min, max];
};

// تأكيد أن النوع يدعم category: string[] و brand: string[]
type ProductFiltersStateFixed = Omit<ProductFiltersState, 'category' | 'brand'> & {
  category: string[];
  brand: string[];
};

const ProductFeed: React.FC = () => {
  // استرجاع الفلاتر من LocalStorage أو الافتراضي
  const [filters, setFilters] = useState<ProductFiltersStateFixed>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(FILTERS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          category: Array.isArray(parsed.category) ? parsed.category : [],
          brand: Array.isArray(parsed.brand) ? parsed.brand : [],
        };
      }
      // بده تعديل لقدام - عشان قصة لو كان فش في كل المنتجات اي brand or category
    }
    return {
      search: '',
      category: [],
      brand: [],
      price: [0, 2000],
      rating: 0,
      order: 'newest',
      freeShipping: false,
      isNew: false,
      isBestSeller: false,
      discount: 0, // 👈 أضف هذا السطر

    };
  });

  const [minPrice, maxPrice] = useMemo(() => getMinMaxPrice(mockProducts), []);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success'|'error'|'info' }>({ open: false, message: '', severity: 'success' });

  // فلترة المنتجات
  const filteredProducts = useMemo(() => {
    const safeFilters: ProductFiltersStateFixed = {
      ...filters,
      category: Array.isArray(filters.category) ? filters.category : [],
      brand: Array.isArray(filters.brand) ? filters.brand : [],
    };
    let result = [...mockProducts];
    console.log('الفلتر:', safeFilters.discount);
    console.log('المنتجات قبل الفلترة:', result.length);
    if (safeFilters.search) {
      const q = safeFilters.search.toLowerCase();
      result = result.filter(p =>
        p.name.en.toLowerCase().includes(q) ||
        p.name.ar.toLowerCase().includes(q) ||
        p.description.en.toLowerCase().includes(q) ||
        p.description.ar.toLowerCase().includes(q)
      );
    }
    if (safeFilters.category.length > 0) {
      result = result.filter(p => safeFilters.category.includes(p.category));
    }
    if (safeFilters.brand.length > 0) {
      result = result.filter(p => safeFilters.brand.includes(p.brand));
    }
    if (safeFilters.price) {
      result = result.filter(p => p.price >= safeFilters.price[0] && p.price <= safeFilters.price[1]);
    }
    if (safeFilters.rating > 0) {
      result = result.filter(p => p.rating >= safeFilters.rating);
    }
    if (safeFilters.freeShipping) {
      result = result.filter(p => p.shipping && p.shipping.free);
    }
    if (safeFilters.isNew) {
      result = result.filter(p => p.is_new);
    }
    if (safeFilters.isBestSeller) {
      result = result.filter(p => p.is_best_seller);
    }
    // هيو 
    if (safeFilters.discount > 0) {
      result = result.filter(p => typeof p.discount === 'number' && p.discount >= safeFilters.discount);
    }
    console.log('المنتجات بعد الفلترة:', result.length);

    
    
    
    // ترتيب
    switch (safeFilters.order) {
      case 'price_asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }
    return result;
  }, [filters]);

  // Infinite scroll
  const loaderRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!loaderRef.current) return;
    const handleScroll = () => {
      if (loadingMore) return;
      const rect = loaderRef.current!.getBoundingClientRect();
      if (rect.top < window.innerHeight + 100 && visibleCount < filteredProducts.length) {
        handleLoadMore();
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadingMore, visibleCount, filteredProducts.length]);

  // إعادة تعيين عند تغيير الفلاتر
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [filters]);

  const handleLoadMore = useCallback(() => {
    if (loadingMore) return;
    setLoadingMore(true);
    setTimeout(() => {
      setVisibleCount(v => Math.min(v + PAGE_SIZE, filteredProducts.length));
      setLoadingMore(false);
    }, 700);
  }, [loadingMore, filteredProducts.length]);

  // زر تحديث المنتجات
  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setFilters({ ...filters }); // إعادة تطبيق الفلاتر
      setRefreshing(false);
      setSnackbar({ open: true, message: 'تم تحديث المنتجات', severity: 'success' });
    }, 800);
  };

  // Snackbar
  const showSnackbar = (message: string, severity: 'success'|'error'|'info' = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  // Empty state
  if (filteredProducts.length === 0) {
    return (
      <Box sx={{ mt: 8, textAlign: 'center' }}>
        <img src="/image/logo/big.png" alt="no results" width={120} style={{ opacity: 0.3 }} />
        <Typography variant="h6" color="text.secondary" mt={2}>لا توجد منتجات مطابقة للبحث أو الفلاتر الحالية</Typography>
        <Button variant="outlined" color="primary" sx={{ mt: 2 }} onClick={() => setFilters({ ...filters, search: '', category: [], brand: [], price: [minPrice, maxPrice], rating: 0, order: 'newest', freeShipping: false, isNew: false, isBestSeller: false })}>
          إعادة تعيين الفلاتر
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Stack direction="row" alignItems="center" spacing={2} mb={2}>
        <ProductFilters
          filters={filters}
          setFilters={setFilters}
          resultCount={filteredProducts.length}
          minPrice={minPrice}
          maxPrice={maxPrice}
        />
        <Button onClick={handleRefresh} variant="outlined" color="primary" disabled={refreshing} sx={{ borderRadius: 2, fontWeight: 'bold', minWidth: 120 }}>
          {refreshing ? <CircularProgress size={20} /> : 'تحديث المنتجات'}
        </Button>
      </Stack>
      <Stack spacing={3}>
        {filteredProducts.slice(0, visibleCount).map(product => (
          <ProductCard key={product.id} product={product} showSnackbar={showSnackbar} />
        ))}
        {loadingMore && Array.from({ length: 3 }).map((_, i) => (
          <Box key={i} sx={{ p: 3, borderRadius: 3, bgcolor: 'background.paper', boxShadow: 1, minHeight: 180, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CircularProgress />
          </Box>
        ))}
      </Stack>
      {visibleCount < filteredProducts.length && (
        <Box ref={loaderRef} sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button onClick={handleLoadMore} variant="contained" color="primary" size="large" disabled={loadingMore} sx={{ borderRadius: 2, px: 6, fontWeight: 'bold' }}>
            {loadingMore ? <CircularProgress size={24} /> : 'عرض المزيد'}
          </Button>
        </Box>
      )}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar(s => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default ProductFeed;
