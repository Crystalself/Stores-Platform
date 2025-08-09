// components/products/ProductPost.tsx
"use client";

import React, { useState, useRef } from 'react';
import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Avatar,
  Typography,
  IconButton,
  Button,
  Menu,
  MenuItem,
  Box,
  Chip,
  Divider,
  useTheme,
  Dialog,
  DialogTitle,
  DialogActions,
  Popover,
} from '@mui/material';
import {
  MoreVert,
  Visibility,
  ThumbUp,
  ThumbDown,
  Block as BlockIcon,
} from '@mui/icons-material';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Product, getProductName, getProductDescription } from '@/models/product';
import { User } from '@/models/user';
import ProductDetailClientView from './ProductDetailClientView';
import SellerPreviewCard from '../seller/SellerPreviewCard';
import { mockProducts } from '@/lib/dummy-data';

interface ProductPostProps {
  product: Product;
  seller: User;
  onHide?: (productId: number) => void;
  onDelete?: (productId: number) => void;
  onSave?: (productId: number) => void;
  onInterested?: (productId: number) => void;
  onBlockSeller?: (sellerId: number) => void;
}

const ProductPost: React.FC<ProductPostProps> = ({
  product,
  seller,
  onHide,
  onDelete,
  onSave,
  onInterested,
  onBlockSeller,
}) => {
  const t = useTranslations('ProductFeed');
  const locale = useLocale();
  const theme = useTheme();
  const router = useRouter();
  
  // TODO: الحصول على النصوص المترجمة حسب اللغة الحالية
  const productName = getProductName(product, locale);
  const productDescription = getProductDescription(product, locale);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [isInterested, setIsInterested] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [blockDialogOpen, setBlockDialogOpen] = useState(false);
  const [popoverAnchorEl, setPopoverAnchorEl] = useState<null | HTMLElement>(null);
  const [isHoveringAvatar, setIsHoveringAvatar] = useState(false);
  const [isHoveringPopover, setIsHoveringPopover] = useState(false);
  const hoverTimer = useRef<NodeJS.Timeout | null>(null);

  const isPopoverOpen = isHoveringAvatar || isHoveringPopover;

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleHide = () => {
    onHide?.(product.id);
    handleMenuClose();
  };

  const handleDelete = () => {
    onDelete?.(product.id);
    handleMenuClose();
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    onSave?.(product.id);
    handleMenuClose();
  };

  const handleInterested = () => {
    setIsInterested(!isInterested);
    onInterested?.(product.id);
  };

  const handleBlockSeller = () => {
    onBlockSeller?.(seller.id);
    setBlockDialogOpen(false);
    handleMenuClose();
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const postDate = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - postDate.getTime()) / (1000 * 60));

    if (diffInMinutes < 60) {
      return `${diffInMinutes} ${t('minutes')}`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} ${t('hours')}`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days} ${t('days')}`;
    }
  };

  const finalPrice = product.price - (product.price * (product.discount / 100));

  return (
    <>
      <Card
        sx={{
          mb: 2,
          borderRadius: 2,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          '&:hover': {
            boxShadow: '4px 12px 16px rgba(0,0,0,0.15)',
            transform: 'translateY(-5px)',
          },
          transition: 'all 0.3s ease-in-out',
        }}
      >
        <CardHeader
          avatar={
            <Box
              onMouseEnter={e => {
                hoverTimer.current = setTimeout(() => {
                  setPopoverAnchorEl(e.currentTarget);
                  setIsHoveringAvatar(true);
                }, 1000);
              }}
              onMouseLeave={() => {
                if (hoverTimer.current) {
                  clearTimeout(hoverTimer.current);
                  hoverTimer.current = null;
                }
                setIsHoveringAvatar(false);
              }}
              sx={{ display: 'inline-block' }}
            >
              <Avatar
                src={seller.profilePic}
                alt={`${seller.firstName} ${seller.lastName}`}
                sx={{ width: 48, height: 48, cursor: 'pointer' }}
                onClick={() => router.push(`/stores/${seller.id}`)}
              />
            </Box>
          }
          action={
            <IconButton onClick={handleMenuClick}>
              <MoreVert />
            </IconButton>
          }
          title={
            <Typography
              variant="subtitle1"
              fontWeight="bold"
              sx={{
                cursor: 'pointer',
                '&:hover': {
                  color: theme.palette.primary.main,
                  textDecoration: 'underline',
                  fontSize: '1.15rem',

                },
                transition: 'all 0.3s ease-in-out',

              }}
              onClick={() => router.push(`/store/${seller.id}`)}
            >
              {seller.firstName} {seller.lastName}
            </Typography>
          }
          subheader={`${getTimeAgo(product.created_at)} ${t('ago')}`}
        />

        <CardMedia
          component="img"
          height="300"

          image={product.thumbnail_image}
          alt={productName}
          sx={{ objectFit: 'cover', cursor: 'pointer' }}
          loading="lazy"
          onClick={() => setShowDetails(true)}
        />

        <Popover
          open={isPopoverOpen}
          anchorEl={popoverAnchorEl}
          onClose={() => {
            setIsHoveringAvatar(false);
            setIsHoveringPopover(false);
          }}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          disableRestoreFocus
          onMouseEnter={() => setIsHoveringPopover(true)}
          onMouseLeave={() => {
            setIsHoveringPopover(false);
            setIsHoveringAvatar(false);
          }}
        >
          <SellerPreviewCard
            seller={seller}
            products={mockProducts}
            sellerRating={seller.rating}
            sellerRatingCount={seller.rating_count}
            anchorEl={popoverAnchorEl}
            open={isPopoverOpen}
            onClose={() => {
              setIsHoveringAvatar(false);
              setIsHoveringPopover(false);
            }}
          />
        </Popover>

        <CardContent>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            {productName}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5" color="primary.main" fontWeight="bold">
              ₪{finalPrice.toFixed(2)}
            </Typography>
            {product.discount > 0 && (
              <Chip label={`خصم ${product.discount}%`} color="error" size="small" sx={{ ml: 2 }} />
            )}
          </Box>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              mb: 2,
            }}
          >
            {productDescription || 'buy now'}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              ⭐ {product.rating} ({product.rating_count})
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • {product.sell_count} مبيعات
            </Typography>
          </Box>
        </CardContent>

        <Divider />

        <CardActions sx={{ justifyContent: 'space-between', px: 2, py: 1 }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              startIcon={isInterested ? <ThumbDown /> : <ThumbUp />}
              onClick={handleInterested}
              sx={{
                color: isInterested ? theme.palette.error.main : 'text.secondary',
              }}
            >
              {isInterested ? 'غير مهتم' : t('interested')}
            </Button>
          </Box>

          <Button
            variant="contained"
            color="primary"
            startIcon={<Visibility />}
            onClick={() => setShowDetails(true)}
            sx={{ borderRadius: 2, px: 3, fontWeight: 'bold' }}
          >
            {t('viewDetails')}
          </Button>
        </CardActions>
      </Card>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleHide}>{t('hidePost')}</MenuItem>
        <MenuItem onClick={handleSave}>{isSaved ? 'إلغاء الحفظ' : t('savePost')}</MenuItem>
        <MenuItem onClick={() => setBlockDialogOpen(true)} sx={{ color: 'error.main' }}>
          <BlockIcon fontSize="small" sx={{ mr: 1 }} /> حظر البائع
        </MenuItem>
        {onDelete && (
          <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
            {t('deletePost')}
          </MenuItem>
        )}
      </Menu>

      <Dialog open={blockDialogOpen} onClose={() => setBlockDialogOpen(false)}>
        <DialogTitle>هل أنت متأكد من حظر هذا البائع؟</DialogTitle>
        <DialogActions>
          <Button onClick={() => setBlockDialogOpen(false)}>إلغاء</Button>
          <Button onClick={handleBlockSeller} color="error">حظر</Button>
        </DialogActions>
      </Dialog>

      <ProductDetailClientView product={product} open={showDetails} onClose={() => setShowDetails(false)} />
    </>
  );
};

export default ProductPost;
