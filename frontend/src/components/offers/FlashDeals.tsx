"use client";
import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Chip,
  LinearProgress
} from '@mui/material';
import {
  Timer,
  LocalFireDepartment,
  ArrowForward
} from '@mui/icons-material';
import { useTranslations } from 'next-intl';
import { Offer } from '@/models/offer';
import OfferCard from './OfferCard';

interface FlashDealsProps {
  offers: Offer[];
  onViewAll?: () => void;
}

const FlashDeals: React.FC<FlashDealsProps> = ({ offers, onViewAll }) => {
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
        background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
        p: 3,
        borderRadius: 3,
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background Pattern */}
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          opacity: 0.3
        }} />
        
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <LocalFireDepartment sx={{ fontSize: 32 }} />
            <Typography variant="h4" fontWeight="bold">
              {t('flashDeals')}
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ opacity: 0.9 }}>
            {t('endingSoon')} - {t('subtitle')}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, position: 'relative', zIndex: 1 }}>
          <Chip
            label={`${offers.length} Flash Deals`}
            color="error"
            variant="outlined"
            icon={<Timer />}
            sx={{ 
              color: 'white', 
              borderColor: 'white',
              '& .MuiChip-label': { color: 'white' },
              '& .MuiChip-icon': { color: 'white' }
            }}
          />
          {onViewAll && (
            <Button
              variant="contained"
              endIcon={<ArrowForward />}
              onClick={onViewAll}
              sx={{
                backgroundColor: 'white',
                color: 'error.main',
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

      {/* Flash Deals Grid */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' }, 
        gap: 3 
      }}>
        {offers.map((offer) => (
          <Box key={offer.id} sx={{ position: 'relative' }}>
            {/* Urgency Indicator */}
            <Box sx={{
              position: 'absolute',
              top: 8,
              left: 8,
              zIndex: 2,
              background: 'rgba(255, 107, 107, 0.9)',
              color: 'white',
              px: 1.5,
              py: 0.5,
              borderRadius: 2,
              fontSize: '0.75rem',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: 0.5
            }}>
              <Timer sx={{ fontSize: 16 }} />
              URGENT
            </Box>
            
            <OfferCard offer={offer} />
          </Box>
        ))}
      </Box>

      {/* Progress Bar */}
      <Paper sx={{ mt: 3, p: 2, background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)', color: 'white' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" fontWeight="bold">
            Flash Deals Progress
          </Typography>
          <Typography variant="body2">
            {offers.length} active deals
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={75}
          sx={{
            height: 8,
            borderRadius: 4,
            backgroundColor: 'rgba(255,255,255,0.3)',
            '& .MuiLinearProgress-bar': {
              borderRadius: 4,
              backgroundColor: 'white',
            },
          }}
        />
      </Paper>
    </Box>
  );
};

export default FlashDeals; 