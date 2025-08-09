// ✅ Updated SellerPreviewCard.tsx with professional UI and icons
import React, { useMemo, useState } from 'react';
import {
  Box,
  Avatar,
  Typography,
  Button,
  Popover,
  Rating,
  Stack,
  Tooltip
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { Product } from '@/models/product';
import { User } from '@/models/user';
import VerifiedIcon from '@mui/icons-material/Verified';
import StorefrontIcon from '@mui/icons-material/Storefront';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import Fade from '@mui/material/Fade';

interface SellerPreviewCardProps {
  seller: User;
  products: Product[];
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  onPopoverEnter?: () => void;
  onPopoverLeave?: () => void;
  sellerRating?: number;
  sellerRatingCount?: number;
}

function getFakeAvatar(seller: User) {
  if (seller.profilePic && !seller.profilePic.includes('logo/big.png')) return seller.profilePic;
  return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(seller.firstName + ' ' + seller.lastName)}`;
}

const SellerPreviewCard: React.FC<SellerPreviewCardProps> = ({
  seller,
  products,
  anchorEl,
  open,
  onClose,
  onPopoverEnter,
  onPopoverLeave,
  sellerRating,
  sellerRatingCount,
}) => {
  const router = useRouter();
  const currentUserId = 1; // TODO: Replace with real auth user id
  const [isFollowing, setIsFollowing] = useState(seller.followers?.includes(currentUserId) ?? false);

  const { avgRating, totalRatings, productCount } = useMemo(() => {
    const sellerProducts = (products || []).filter(p => p.user_id === seller.id);
    const totalRatings = sellerProducts.reduce((acc, p) => acc + p.rating_count, 0);
    const ratingSum = sellerProducts.reduce((acc, p) => acc + p.rating * p.rating_count, 0);
    const avgRating = totalRatings > 0 ? ratingSum / totalRatings : 0;
    return { avgRating, totalRatings, productCount: sellerProducts.length };
  }, [products, seller.id]);

  const handleVisit = () => {
    router.push(`/store/${seller.id}`);
    onClose();
  };

  const displayRating = typeof sellerRating === 'number' ? sellerRating : avgRating;
  const displayRatingCount = typeof sellerRatingCount === 'number' ? sellerRatingCount : totalRatings;

  const handleFollow = () => {
    setIsFollowing(f => !f);
  };

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      PaperProps={{ sx: { p: 2, minWidth: 270, borderRadius: 3, boxShadow: 4, transition: 'all 0.2s' } }}
      disableRestoreFocus
      onMouseEnter={onPopoverEnter}
      onMouseLeave={onPopoverLeave}
      tabIndex={0}
      aria-label={`بطاقة تعريف البائع: ${seller.firstName} ${seller.lastName}`}
      TransitionComponent={Fade}
      transitionDuration={250}
    >
      <Stack direction="row" spacing={2} alignItems="center">
        <Avatar
          src={getFakeAvatar(seller)}
          alt={`${seller.firstName} ${seller.lastName}`}
          sx={{ width: 56, height: 56 }}
        />
        <Box>
          <Typography variant="subtitle1" fontWeight={700} display="flex" alignItems="center">
            {seller.firstName} {seller.lastName}
            {seller.verified && (
              <Tooltip title="بائع موثوق">
                <VerifiedIcon color="primary" fontSize="small" sx={{ ml: 0.5 }} />
              </Tooltip>
            )}
          </Typography>
          <Rating value={displayRating} precision={0.1} readOnly size="small" />
          <Typography variant="caption" color="text.secondary">
            {displayRating.toFixed(1)} ({displayRatingCount} تقييم)
          </Typography>
        </Box>
      </Stack>

      <Typography variant="body2" mt={1}>
        المنتجات: <b>{productCount}</b>
      </Typography>

      {typeof sellerRating !== 'number' && avgRating > 0 && (
        <Typography variant="caption" color="text.secondary">
          متوسط تقييم المنتجات: {avgRating.toFixed(2)}
        </Typography>
      )}

      <Stack direction="row" spacing={1} mt={2}>
        <Button
          variant={isFollowing ? 'outlined' : 'contained'}
          size="small"
          fullWidth
          startIcon={isFollowing ? <PersonRemoveIcon /> : <PersonAddAlt1Icon />}
          onClick={handleFollow}
          sx={{ textTransform: 'none', borderRadius: 2 }}
          tabIndex={0}
          aria-label={isFollowing ? 'إلغاء المتابعة' : 'متابعة'}
        >
          {isFollowing ? 'إلغاء المتابعة' : 'متابعة'}
        </Button>
        <Button
          variant="contained"
          size="small"
          fullWidth
          onClick={handleVisit}
          startIcon={<StorefrontIcon />}
          sx={{ textTransform: 'none', borderRadius: 2 }}
          tabIndex={0}
          aria-label="زيارة صفحة البائع"
        >
          زيارة المتجر
        </Button>
      </Stack>

      <Button
        variant="text"
        size="small"
        fullWidth
        sx={{ mt: 1, color: 'text.secondary', fontSize: '0.85rem' }}
        tabIndex={-1}
        aria-label="ملخص تقييمات البائع"
        disabled
      >
        تقييم عام: {avgRating.toFixed(2)} | عدد التقييمات: {totalRatings}
      </Button>
    </Popover>
  );
};

export default SellerPreviewCard;
