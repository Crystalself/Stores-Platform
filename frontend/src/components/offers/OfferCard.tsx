"use client";
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  Button,
  IconButton,
  LinearProgress,
  Tooltip,
  Fade
} from '@mui/material';
import {
  LocalOffer,
  Timer,
  ShoppingCart,
  Visibility,
  Favorite,
  FavoriteBorder
} from '@mui/icons-material';
import { useTranslations } from 'next-intl';
import { useCart } from '@/contexts/CartContext';
import { Offer, OfferCountdown } from '@/models/offer';
import ProductRating from '../products/ProductRating';

interface OfferCardProps {
  offer: Offer;
  onViewDetails?: (offer: Offer) => void;
}

const OfferCard: React.FC<OfferCardProps> = ({ offer, onViewDetails }) => {
  const t = useTranslations('Offers');
  const { addToCart } = useCart();
  const [countdown, setCountdown] = useState<OfferCountdown>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false
  });
  const [isFavorite, setIsFavorite] = useState(false);

  const finalPrice = offer.price - (offer.price * (offer.discount / 100));
  const stockPercentage = (offer.stock / 100) * 100; // Assuming max stock is 100

  useEffect(() => {
    const calculateCountdown = () => {
      const now = new Date().getTime();
      const endDate = new Date(offer.end_date).getTime();
      const timeLeft = endDate - now;

      if (timeLeft <= 0) {
        setCountdown({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isExpired: true
        });
        return;
      }

      const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

      setCountdown({
        days,
        hours,
        minutes,
        seconds,
        isExpired: false
      });
    };

    calculateCountdown();
    const timer = setInterval(calculateCountdown, 1000);

    return () => clearInterval(timer);
  }, [offer.end_date]);

  const handleAddToCart = () => {
    addToCart(offer, 1);
  };

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(offer);
    } else {
      // Navigate to offer detail page
      window.location.href = `/offers/${offer.id}`;
    }
  };

  const getOfferTypeColor = () => {
    switch (offer.offer_type) {
      case 'flash_deal':
        return 'error';
      case 'bundle':
        return 'success';
      case 'free_shipping':
        return 'info';
      case 'buy_one_get_one':
        return 'warning';
      default:
        return 'primary';
    }
  };

  const getOfferTypeLabel = () => {
    switch (offer.offer_type) {
      case 'flash_deal':
        return t('flashDeals');
      case 'bundle':
        return 'Bundle';
      case 'free_shipping':
        return 'Free Shipping';
      case 'buy_one_get_one':
        return 'BOGO';
      default:
        return 'Offer';
    }
  };

  return (
    <Fade in={true} timeout={500}>
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'visible',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
          },
          borderRadius: 3,
          border: offer.is_featured ? '2px solid' : '1px solid',
          borderColor: offer.is_featured ? 'primary.main' : 'divider',
        }}
      >
        {/* Featured Badge */}
        {offer.is_featured && (
          <Box
            sx={{
              position: 'absolute',
              top: -8,
              left: 16,
              zIndex: 1,
            }}
          >
            <Chip
              label={t('featuredOffers')}
              color="primary"
              size="small"
              icon={<LocalOffer />}
              sx={{ fontWeight: 'bold' }}
            />
          </Box>
        )}

        {/* Flash Deal Badge */}
        {offer.is_flash_deal && (
          <Box
            sx={{
              position: 'absolute',
              top: -8,
              right: 16,
              zIndex: 1,
            }}
          >
            <Chip
              label={t('flashDeals')}
              color="error"
              size="small"
              icon={<Timer />}
              sx={{ fontWeight: 'bold' }}
            />
          </Box>
        )}

        {/* Favorite Button */}
        <IconButton
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 1,
            backgroundColor: 'rgba(255,255,255,0.9)',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,1)',
            },
          }}
          onClick={() => setIsFavorite(!isFavorite)}
        >
          {isFavorite ? <Favorite color="error" /> : <FavoriteBorder />}
        </IconButton>

        {/* Product Image */}
        <CardMedia
          component="img"
          height="200"
          image={offer.thumbnail_image}
          alt={offer.name}
          sx={{
            objectFit: 'cover',
            position: 'relative',
          }}
          loading="lazy"
          // Optionally add srcSet for WebP if available
        />

        {/* Stock Progress Bar */}
        <Box sx={{ px: 2, pt: 1 }}>
          <Typography variant="caption" color="text.secondary">
            {t('limitedStock')}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={stockPercentage}
            sx={{
              height: 4,
              borderRadius: 2,
              backgroundColor: 'grey.200',
              '& .MuiLinearProgress-bar': {
                borderRadius: 2,
              },
            }}
          />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
            {t('onlyLeft', { count: offer.stock })}
          </Typography>
        </Box>

        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Offer Type */}
          <Box sx={{ mb: 1 }}>
            <Chip
              label={getOfferTypeLabel()}
              color={getOfferTypeColor()}
              size="small"
              sx={{ fontWeight: 'bold' }}
            />
          </Box>

          {/* Product Name */}
          <Typography
            variant="h6"
            component="h3"
            sx={{
              fontWeight: 'bold',
              mb: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              lineHeight: 1.3,
            }}
          >
            {offer.name}
          </Typography>

          {/* Rating */}
          <Box sx={{ mb: 2 }}>
            <ProductRating rating={offer.rating} rating_count={offer.rating_count} />
          </Box>

          {/* Price Section */}
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Typography
                variant="h5"
                color="primary"
                fontWeight="bold"
              >
                ${finalPrice.toFixed(2)}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ textDecoration: 'line-through' }}
              >
                ${offer.price.toFixed(2)}
              </Typography>
              <Chip
                label={`${offer.discount}% OFF`}
                color="error"
                size="small"
                sx={{ fontWeight: 'bold' }}
              />
            </Box>
            <Typography variant="body2" color="success.main" fontWeight="bold">
              {t('saveUpTo')} ${(offer.price - finalPrice).toFixed(2)}
            </Typography>
          </Box>

          {/* Countdown Timer */}
          {!countdown.isExpired ? (
            <Box sx={{ mb: 2, p: 1.5, bgcolor: 'warning.light', borderRadius: 2 }}>
              <Typography variant="caption" color="warning.dark" fontWeight="bold" display="block">
                {t('expiresIn')}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" fontWeight="bold" color="warning.dark">
                    {countdown.days}
                  </Typography>
                  <Typography variant="caption" color="warning.dark">
                    {t('days')}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" fontWeight="bold" color="warning.dark">
                    {countdown.hours}
                  </Typography>
                  <Typography variant="caption" color="warning.dark">
                    {t('hours')}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" fontWeight="bold" color="warning.dark">
                    {countdown.minutes}
                  </Typography>
                  <Typography variant="caption" color="warning.dark">
                    {t('minutes')}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" fontWeight="bold" color="warning.dark">
                    {countdown.seconds}
                  </Typography>
                  <Typography variant="caption" color="warning.dark">
                    {t('seconds')}
                  </Typography>
                </Box>
              </Box>
            </Box>
          ) : (
            <Box sx={{ mb: 2, p: 1.5, bgcolor: 'error.light', borderRadius: 2 }}>
              <Typography variant="body2" color="error.dark" fontWeight="bold" textAlign="center">
                {t('expired')}
              </Typography>
            </Box>
          )}

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 1, mt: 'auto' }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<ShoppingCart />}
              fullWidth
              onClick={handleAddToCart}
              disabled={countdown.isExpired || offer.stock === 0}
              sx={{
                borderRadius: 2,
                fontWeight: 'bold',
                py: 1,
              }}
            >
              {t('addToCart')}
            </Button>
            <Tooltip title={t('viewDetails')}>
              <IconButton
                color="primary"
                onClick={handleViewDetails}
                sx={{
                  border: '1px solid',
                  borderColor: 'primary.main',
                  '&:hover': {
                    backgroundColor: 'primary.light',
                  },
                }}
              >
                <Visibility />
              </IconButton>
            </Tooltip>
          </Box>
        </CardContent>
      </Card>
    </Fade>
  );
};

export default OfferCard; 