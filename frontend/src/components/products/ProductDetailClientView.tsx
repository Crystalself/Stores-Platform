// components/products/ProductDetailClientView.tsx
"use client";

import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  Box,
  Button,
  Chip,
  Snackbar,
  Alert,
  Divider,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Close, AddShoppingCart } from '@mui/icons-material';
import { useTranslations, useLocale } from 'next-intl';
import { useCart } from '@/contexts/CartContext';
import { Product, getProductName, getProductDescription } from '@/models/product';
import ProductGallery from '@/components/products/ProductGallery';
import ProductRating from '@/components/products/ProductRating';
import { useRouter } from 'next/navigation';

interface ProductDetailClientViewProps {
  product: Product;
  open: boolean;
  onClose: () => void;
}

const ProductDetailClientView: React.FC<ProductDetailClientViewProps> = ({ product, open, onClose }) => {
  const t = useTranslations('ProductDetails');
  const cartT = useTranslations('Cart');
  const locale = useLocale();
  const router = useRouter();
  const { addToCart } = useCart();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const [showSnackbar, setShowSnackbar] = useState(false);
  const [backUrl, setBackUrl] = useState<string | null>(null);

  const finalPrice = product.price - (product.price * (product.discount / 100));
  const productName = getProductName(product, locale);
  const productDescription = getProductDescription(product, locale);

  const handleAddToCart = () => {
    addToCart(
      {
        ...product,
        name: product.name[locale],
        description: product.description[locale],
      },
      1
    );
    setShowSnackbar(true);
  };

  const handleCloseSnackbar = () => setShowSnackbar(false);

  const handleCloseAndRedirect = () => {
    router.push(backUrl ?? `/${locale}/welcome`);
  };

  useEffect(() => {
    const referrer = document.referrer;
    const localePath = `/${locale}`;

    if (!referrer || referrer === '') {
      // حالة الدخول المباشر بدون referrer
      setBackUrl(`${localePath}/customer`);
    } else if (referrer.includes(`${localePath}/customer/proudcts`)) {
      setBackUrl(`${localePath}/proudcts`);
    } else if (referrer.includes(`${localePath}/customer/proudcts/offers`)) {
      setBackUrl(`${localePath}/offers`);
    } else {
      // أي صفحة غير معروفة، نرجع لـ welcome كخيار افتراضي
      setBackUrl(`${localePath}/welcome`);
    }
  }, [locale]);


  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        fullScreen={fullScreen}
        maxWidth="lg"
        fullWidth
        scroll="body"
        aria-labelledby="product-dialog-title"
      >
        <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" fontWeight="bold">
            {productName}
          </Typography>
          <IconButton onClick={handleCloseAndRedirect} aria-label="close">
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
            <Box sx={{ flex: { xs: '1', md: '1 1 50%' } }}>
              <ProductGallery images={product.images} altText={productName} />
            </Box>
            <Box sx={{ flex: { xs: '1', md: '1 1 50%' } }}>
              <ProductRating rating={product.rating} rating_count={product.rating_count} />

              <Box sx={{ my: 3 }}>
                <Typography
                  variant="h4"
                  color="primary.main"
                  component="span"
                  fontWeight={600}
                  sx={{ fontSize: { xs: '1.75rem', md: '2.125rem' } }}
                >
                  ₪{finalPrice.toFixed(2)}
                </Typography>
                {product.discount > 0 && (
                  <Chip
                    label={`خصم ${product.discount}%`}
                    color="error"
                    sx={{ ml: 2, fontWeight: 'bold' }}
                  />
                )}
              </Box>

              <Typography
                variant="body1"
                fontWeight={500}
                sx={{ mb: 3 }}
                color={product.stock > 0 ? 'success.main' : 'error.main'}
              >
                {product.stock > 0 ? t('availableUnits', { count: product.stock }) : t('outOfStock')}
              </Typography>

              <Button
                variant="contained"
                color="primary"
                size="large"
                startIcon={<AddShoppingCart />}
                sx={{
                  py: 1.5,
                  px: 4,
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  borderRadius: 2,
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                  },
                  transition: 'all 0.3s ease-in-out',
                }}
                disabled={product.stock === 0}
                onClick={handleAddToCart}
              >
                {t('addToCart')}
              </Button>

              <Divider sx={{ my: 4 }} />

              <Typography variant="h6" gutterBottom fontWeight="bold">
                {t('description')}
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ lineHeight: 1.7 }}
              >
                {productDescription}
              </Typography>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      <Snackbar
        open={showSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {cartT('itemAdded')}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ProductDetailClientView;
