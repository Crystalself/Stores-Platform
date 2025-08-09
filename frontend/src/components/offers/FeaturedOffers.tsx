"use client";
import React from 'react';
import {
  Box,
  Typography,
  Button,
  Chip
} from '@mui/material';
import {
  ArrowForward
} from '@mui/icons-material';
import { useTranslations } from 'next-intl';
import { Offer } from '@/models/offer';
import OfferCard from './OfferCard';

interface FeaturedOffersProps {
  offers: Offer[];
  onViewAll?: () => void;
}

const FeaturedOffers: React.FC<FeaturedOffersProps> = ({ offers, onViewAll }) => {
  const t = useTranslations('Offers');

  if (!offers.length) {
    return null;
  }

  return (
    <Box sx={{ mb: 6 }}>
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        mb: 3,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        p: 3,
        borderRadius: 3,
        color: 'white'
      }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
            {t('featuredOffers')}
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9 }}>
            {t('subtitle')}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Chip
            label={`${offers.length} Offers`}
            color="primary"
            variant="outlined"
            sx={{ 
              color: 'white', 
              borderColor: 'white',
              '& .MuiChip-label': { color: 'white' }
            }}
          />
          {onViewAll && (
            <Button
              variant="contained"
              endIcon={<ArrowForward />}
              onClick={onViewAll}
              sx={{
                backgroundColor: 'white',
                color: 'primary.main',
                '&:hover': {
                  backgroundColor: 'grey.100',
                },
              }}
            >
              {t('viewAll')}
            </Button>
          )}
        </Box>
      </Box>

      {/* Offers Grid */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 3 }}>
        {offers.map((offer) => (
          <Box key={offer.id}>
            <OfferCard offer={offer} />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default FeaturedOffers; 