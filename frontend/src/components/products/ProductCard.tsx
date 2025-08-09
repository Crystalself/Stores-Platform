// components/products/ProductCard.tsx
"use client";

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { Card, CardMedia, Typography, Box, Chip, Avatar, IconButton, Menu, MenuItem, Tooltip, Stack, Button, Rating, Dialog, DialogTitle, DialogContent, DialogActions, Slide } from '@mui/material';
import { MoreVert, Favorite, FavoriteBorder, Visibility, Delete, Block, HideSource } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useLocale } from 'next-intl';
import { Product, getProductName, getProductDescription } from '@/models/product';
import { mockUsers } from '@/lib/mockUsers';
import SellerPreviewCard from '@/components/seller/SellerPreviewCard';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useRouter } from 'next/navigation';
import ShareIcon from '@mui/icons-material/Share';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
dayjs.extend(relativeTime);

interface ProductCardProps {
  product: Product;
  showSnackbar: (msg: string, severity?: 'success'|'error'|'info') => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, showSnackbar }) => {
  const locale = useLocale();
  const productName = getProductName(product, locale);
  const productDescription = getProductDescription(product, locale);
  const seller = mockUsers.find(u => u.id === product.user_id);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [popoverAnchor, setPopoverAnchor] = useState<null | HTMLElement>(null);
  const [showSellerCard, setShowSellerCard] = useState(false);
  const [liked, setLiked] = useState(false);
  const [notInterested, setNotInterested] = useState(false);
  const [dialog, setDialog] = useState<{ open: boolean; action: string }>({ open: false, action: '' });
  const [hidden, setHidden] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const router = useRouter();
  const [sellerCardTimer, setSellerCardTimer] = useState<NodeJS.Timeout | null>(null);
  const [sellerCardHover, setSellerCardHover] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const imageTimer = useRef<NodeJS.Timeout | null>(null);

  if (!seller || hidden || blocked) return null;

  // 3 نقاط
  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleDialogOpen = (action: string) => { setDialog({ open: true, action }); setAnchorEl(null); };
  const handleDialogClose = () => setDialog({ open: false, action: '' });
  const handleDialogConfirm = () => {
    if (dialog.action === 'delete') {
      setHidden(true);
      showSnackbar('تم حذف المنتج بنجاح', 'success');
    } else if (dialog.action === 'hide') {
      setHidden(true);
      showSnackbar('تم إخفاء المنتج', 'info');
    } else if (dialog.action === 'block') {
      setBlocked(true);
      showSnackbar('تم حظر البائع', 'error');
    }
    setDialog({ open: false, action: '' });
  };

  // إعجاب/عدم اهتمام
  const handleLike = () => { setLiked(l => !l); setNotInterested(false); showSnackbar(liked ? 'تم إزالة الاهتمام' : 'تم إضافة المنتج للمفضلة', 'success'); };
  const handleNotInterested = () => { setNotInterested(n => !n); setLiked(false); showSnackbar(notInterested ? 'تم التراجع عن عدم الاهتمام' : 'لن يتم عرض المنتج مجددًا', 'info'); };

  // Seller Preview (اسم البائع)
  const handleSellerNameMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
    setPopoverAnchor(e.currentTarget);
    setShowSellerCard(true);
  };
  const handleSellerNameMouseLeave = () => {
    setShowSellerCard(false);
  };

  // Seller Preview (صورة البائع)
  const handleSellerAvatarMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
    setPopoverAnchor(e.currentTarget);
    if (sellerCardTimer) clearTimeout(sellerCardTimer);
    const timer = setTimeout(() => {
      setShowSellerCard(true);
    }, 1500);
    setSellerCardTimer(timer);
  };
  const handleSellerAvatarMouseLeave = () => {
    if (sellerCardTimer) clearTimeout(sellerCardTimer);
    // لا تخفي البطاقة فورًا إذا كان الماوس فوق البطاقة
    setTimeout(() => {
      if (!sellerCardHover) setShowSellerCard(false);
    }, 200);
  };
  // عند دخول البطاقة
  const handleSellerCardEnter = () => {
    setSellerCardHover(true);
    setShowSellerCard(true);
  };
  // عند مغادرة البطاقة
  const handleSellerCardLeave = () => {
    setSellerCardHover(false);
    setTimeout(() => {
      setShowSellerCard(false);
    }, 200);
  };

  // تاريخ النشر
  const since = dayjs(product.created_at).locale('ar').fromNow();

  // سلايدر الصور عند Hover
  const handleImageMouseEnter = () => {
    if (product.images && product.images.length > 1) {
      let idx = 0;
      imageTimer.current = setInterval(() => {
        idx = (idx + 1) % product.images.length;
        setImageIndex(idx);
      }, 1200);
    }
  };
  const handleImageMouseLeave = () => {
    if (imageTimer.current) clearInterval(imageTimer.current);
    setImageIndex(0);
  };

  // مشاركة المنتج
  const handleShare = () => {
    const url = window.location.origin + `/${locale}/products/${product.id}`;
    if (navigator.share) {
      navigator.share({ title: productName, url });
    } else {
      navigator.clipboard.writeText(url);
      showSnackbar('تم نسخ رابط المنتج!', 'success');
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.01, y: -2 }}
      transition={{ type: 'spring', stiffness: 400, damping: 18 }}
      style={{ width: '100%' }}
      tabIndex={0}
      aria-label={`بطاقة منتج: ${productName}`}
    >
      <Card sx={{ borderRadius: 4, boxShadow: 3, bgcolor: 'background.paper', p: 2, maxWidth: 700, mx: 'auto' }}>
        {/* Header: Seller info + menu */}
        <Stack direction="row" alignItems="center" spacing={2} mb={1}>
          <Box sx={{ position: 'relative' }}>
            <Tooltip title={`زيارة صفحة البائع`}>
              <Avatar
                src={seller.profilePic}
                alt={seller.firstName + ' ' + seller.lastName}
                sx={{ cursor: 'pointer', border: '2px solid', borderColor: 'primary.main' }}
                onClick={() => window.open(`/stores/${seller.id}`, '_blank')}
                onMouseEnter={handleSellerAvatarMouseEnter}
                onMouseLeave={handleSellerAvatarMouseLeave}
              />
            </Tooltip>
            {showSellerCard && (
              <Box
                sx={{ position: 'absolute', top: 60, left: 0, zIndex: 20, animation: 'fadeInSellerCard 0.25s' }}
                onMouseEnter={handleSellerCardEnter}
                onMouseLeave={handleSellerCardLeave}
              >
                <SellerPreviewCard
                  seller={seller}
                  products={[]}
                  anchorEl={popoverAnchor}
                  open={showSellerCard}
                  onClose={handleSellerCardLeave}
                />
              </Box>
            )}
          </Box>
          <Box>
            <Typography
              variant="subtitle1"
              fontWeight={700}
              sx={{
                color: showSellerCard ? 'primary.main' : 'text.primary',
                cursor: 'pointer',
                transition: 'color 0.25s cubic-bezier(.4,2,.6,1)',
                textDecoration: showSellerCard ? 'underline' : 'none',
                fontSize: showSellerCard ? '1.3em' : '1em',
                display: 'inline-block',
              }}
              onMouseEnter={handleSellerNameMouseEnter}
              onMouseLeave={handleSellerNameMouseLeave}
              onClick={() => router.push(`/stores/${seller.id}`)}
            >
              {seller.firstName} {seller.lastName}
            </Typography>
            <Typography variant="caption" color="text.secondary" ml={1}>{since}</Typography>
          </Box>
          <Box flex={1} />
          <IconButton onClick={handleMenuOpen}>
            <MoreVert />
          </IconButton>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
            <MenuItem onClick={() => handleDialogOpen('delete')}><Delete fontSize="small" sx={{ mr: 1 }} /> حذف المنتج</MenuItem>
            <MenuItem onClick={() => handleDialogOpen('hide')}><HideSource fontSize="small" sx={{ mr: 1 }} /> إخفاء المنتج</MenuItem>
            <MenuItem onClick={() => handleDialogOpen('block')}><Block fontSize="small" sx={{ mr: 1 }} /> حظر البائع</MenuItem>
          </Menu>
        </Stack>
        {/* Product image with slider */}
        <Box sx={{ position: 'relative', borderRadius: 3, overflow: 'hidden', mb: 2 }}>
          <CardMedia
            component="img"
            image={product.images && product.images.length > 0 ? product.images[imageIndex] : product.thumbnail_image}
            alt={productName}
            sx={{ width: '100%', height: 320, objectFit: 'cover', borderRadius: 3, boxShadow: 1 }}
            onMouseEnter={handleImageMouseEnter}
            onMouseLeave={handleImageMouseLeave}
          />
          {/* شارات المنتج */}
          {product.is_new && (
            <Chip label="جديد" color="info" sx={{ position: 'absolute', top: 16, left: 16, fontWeight: 'bold', zIndex: 2 }} />
          )}
          {product.is_best_seller && (
            <Chip label="الأكثر مبيعًا" color="success" sx={{ position: 'absolute', top: 16, left: 90, fontWeight: 'bold', zIndex: 2 }} />
          )}
          {product.discount > 0 && (
            <Chip label={`خصم ${product.discount}%`} color="error" sx={{ position: 'absolute', top: 16, left: 180, fontWeight: 'bold', zIndex: 2 }} />
          )}
          {/* نقاط الصور */}
          {product.images && product.images.length > 1 && (
            <Box sx={{ position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 1 }}>
              {product.images.map((_, idx) => (
                <Box key={idx} sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: idx === imageIndex ? 'primary.main' : 'grey.400', transition: 'all 0.2s' }} />
              ))}
            </Box>
          )}
        </Box>
        {/* Description */}
        <Typography variant="body1" color="text.primary" sx={{ mb: 2, fontWeight: 500, lineHeight: 1.7 }}>
          {productDescription.length > 120 ? productDescription.slice(0, 120) + '...' : productDescription}
        </Typography>
        {/* Actions */}
        <Stack direction="row" alignItems="center" spacing={2}>
          <Button
            variant={liked ? 'contained' : 'outlined'}
            color="primary"
            startIcon={liked ? <Favorite /> : <FavoriteBorder />}
            onClick={handleLike}
            sx={{ borderRadius: 2, fontWeight: 'bold', minWidth: 120, transition: 'all 0.2s' }}
            tabIndex={0}
            aria-label={liked ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}
          >
            {liked ? 'مهتم' : 'مهتم'}
          </Button>
          <Button
            variant={notInterested ? 'contained' : 'outlined'}
            color="secondary"
            startIcon={<Visibility />}
            onClick={handleNotInterested}
            sx={{ borderRadius: 2, fontWeight: 'bold', minWidth: 120, transition: 'all 0.2s' }}
            tabIndex={0}
            aria-label={notInterested ? 'إزالة عدم الاهتمام' : 'غير مهتم'}
          >
            {notInterested ? 'غير مهتم' : 'غير مهتم'}
          </Button>
          <IconButton onClick={handleShare} color="info" sx={{ ml: 1 }} tabIndex={0} aria-label="مشاركة المنتج">
            <ShareIcon />
          </IconButton>
          <Box flex={1} />
          <Link href={`/${locale}/products/${product.id}`} passHref legacyBehavior>
            <Button variant="contained" color="info" sx={{ borderRadius: 2, fontWeight: 'bold', px: 4 }} tabIndex={0} aria-label="عرض المنتج">
              عرض المنتج
            </Button>
          </Link>
        </Stack>
        {/* Footer: حالة المنتج وتقييم */}
        <Stack direction="row" alignItems="center" spacing={2} mt={2}>
          <Chip
            label={product.stock > 0 ? `متوفر (${product.stock})` : 'غير متوفر'}
            color={product.stock > 0 ? 'success' : 'error'}
            sx={{ fontWeight: 'bold' }}
          />
          <Rating value={product.rating} precision={0.1} readOnly size="small" sx={{ ml: 1 }} />
          <Typography variant="caption" color="text.secondary">{product.rating.toFixed(1)} ({product.rating_count} تقييم)</Typography>
        </Stack>
        {/* Dialog تأكيد */}
        <Dialog open={dialog.open} onClose={handleDialogClose} TransitionComponent={Slide} keepMounted>
          <DialogTitle>تأكيد الإجراء</DialogTitle>
          <DialogContent>
            <Typography>
              {dialog.action === 'delete' && 'هل أنت متأكد أنك تريد حذف المنتج؟'}
              {dialog.action === 'hide' && 'هل تريد إخفاء المنتج من العرض؟'}
              {dialog.action === 'block' && 'هل تريد حظر هذا البائع؟'}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose}>إلغاء</Button>
            <Button onClick={handleDialogConfirm} color={dialog.action === 'block' ? 'error' : 'primary'} variant="contained">تأكيد</Button>
          </DialogActions>
        </Dialog>
      </Card>
    </motion.div>
  );
};

export default ProductCard;