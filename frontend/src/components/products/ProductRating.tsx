import React from 'react';
import { Box, Rating, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

interface ProductRatingProps {
  rating: number;
  rating_count: number;
}

const ProductRating: React.FC<ProductRatingProps> = ({ rating, rating_count }) => {
  const t = useTranslations('ProductDetails');
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
      <Rating value={rating} precision={0.1} readOnly />
      <Typography variant="body2" color="text.secondary">
        {rating.toFixed(1)} ({rating_count} {t('reviews')})
      </Typography>
    </Box>
  );
};
export default ProductRating;
