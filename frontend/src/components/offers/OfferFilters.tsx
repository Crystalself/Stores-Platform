"use client";
import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Chip,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider
} from '@mui/material';
import {
  FilterList,
  ExpandMore,
  Clear,
  LocalOffer,
  Timer,
  Category
} from '@mui/icons-material';
import { useTranslations } from 'next-intl';
import { ProductCategory } from '@/models/product';
import { OfferFilter } from '@/models/offer';

interface OfferFiltersProps {
  filters: OfferFilter;
  onFiltersChange: (filters: OfferFilter) => void;
  onClearFilters: () => void;
}

const OfferFilters: React.FC<OfferFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters
}) => {
  const t = useTranslations('Offers');
  const [expanded, setExpanded] = useState<string | false>('filters');

  const handleFilterChange = (key: keyof OfferFilter, value: OfferFilter[keyof OfferFilter]) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const handlePriceRangeChange = (event: Event, newValue: number | number[]) => {
    handleFilterChange('priceRange', newValue as [number, number]);
  };

  const handleDiscountRangeChange = (event: Event, newValue: number | number[]) => {
    handleFilterChange('discountRange', newValue as [number, number]);
  };

  const handleClearFilters = () => {
    onClearFilters();
  };

  const hasActiveFilters = () => {
    return Object.values(filters).some(value => value !== undefined);
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.paper',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FilterList />
          {t('filters.title')}
        </Typography>
        {hasActiveFilters() && (
          <Button
            size="small"
            startIcon={<Clear />}
            onClick={handleClearFilters}
            sx={{ textTransform: 'none' }}
          >
            Clear All
          </Button>
        )}
      </Box>

      <Accordion
        expanded={expanded === 'filters'}
        onChange={() => setExpanded(expanded === 'filters' ? false : 'filters')}
        sx={{ boxShadow: 'none', '&:before': { display: 'none' } }}
      >
        <AccordionSummary
          expandIcon={<ExpandMore />}
          sx={{ px: 0, '& .MuiAccordionSummary-content': { m: 0 } }}
        >
          <Typography variant="subtitle1" fontWeight="bold">
            {t('filters.title')}
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ px: 0 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Category Filter */}
            <Box>
              <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Category />
                {t('filters.category')}
              </Typography>
              <FormControl fullWidth size="small">
                <InputLabel>{t('filters.category')}</InputLabel>
                <Select
                  value={filters.category || ''}
                  label={t('filters.category')}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                >
                  <MenuItem value="">{t('categories.all')}</MenuItem>
                  <MenuItem value={ProductCategory.ELECTRONICS}>{t('categories.electronics')}</MenuItem>
                  <MenuItem value={ProductCategory.FASHION}>{t('categories.fashion')}</MenuItem>
                  <MenuItem value={ProductCategory.HOME_SUPPLIES}>{t('categories.home')}</MenuItem>
                  <MenuItem value={ProductCategory.BEAUTY}>{t('categories.beauty')}</MenuItem>
                  <MenuItem value={ProductCategory.ACCESSORIES}>{t('categories.sports')}</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Divider />

            {/* Price Range Filter */}
            <Box>
              <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 2 }}>
                {t('filters.priceRange')}
              </Typography>
              <Slider
                value={filters.priceRange || [0, 1000]}
                onChange={handlePriceRangeChange}
                valueLabelDisplay="auto"
                min={0}
                max={1000}
                step={10}
                sx={{
                  '& .MuiSlider-thumb': {
                    backgroundColor: 'primary.main',
                  },
                  '& .MuiSlider-track': {
                    backgroundColor: 'primary.main',
                  },
                  '& .MuiSlider-rail': {
                    backgroundColor: 'grey.300',
                  },
                }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  ${filters.priceRange?.[0] || 0}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  ${filters.priceRange?.[1] || 1000}
                </Typography>
              </Box>
            </Box>

            <Divider />

            {/* Discount Range Filter */}
            <Box>
              <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 2 }}>
                {t('filters.discountRange')}
              </Typography>
              <Slider
                value={filters.discountRange || [0, 100]}
                onChange={handleDiscountRangeChange}
                valueLabelDisplay="auto"
                min={0}
                max={100}
                step={5}
                sx={{
                  '& .MuiSlider-thumb': {
                    backgroundColor: 'error.main',
                  },
                  '& .MuiSlider-track': {
                    backgroundColor: 'error.main',
                  },
                  '& .MuiSlider-rail': {
                    backgroundColor: 'grey.300',
                  },
                }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  {filters.discountRange?.[0] || 0}%
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {filters.discountRange?.[1] || 100}%
                </Typography>
              </Box>
            </Box>

            <Divider />

            {/* Sort By Filter */}
            <Box>
              <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
                {t('filters.sortBy')}
              </Typography>
              <FormControl fullWidth size="small">
                <InputLabel>{t('filters.sortBy')}</InputLabel>
                <Select
                  value={filters.sortBy || ''}
                  label={t('filters.sortBy')}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                >
                  <MenuItem value="newest">{t('filters.sortOptions.newest')}</MenuItem>
                  <MenuItem value="oldest">{t('filters.sortOptions.oldest')}</MenuItem>
                  <MenuItem value="priceLow">{t('filters.sortOptions.priceLow')}</MenuItem>
                  <MenuItem value="priceHigh">{t('filters.sortOptions.priceHigh')}</MenuItem>
                  <MenuItem value="discountHigh">{t('filters.sortOptions.discountHigh')}</MenuItem>
                  <MenuItem value="expiringSoon">{t('filters.sortOptions.expiringSoon')}</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Divider />

            {/* Quick Filters */}
            <Box>
              <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 2 }}>
                Quick Filters
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                <Chip
                  label={t('featuredOffers')}
                  color={filters.isFeatured ? 'primary' : 'default'}
                  onClick={() => handleFilterChange('isFeatured', !filters.isFeatured)}
                  icon={<LocalOffer />}
                  clickable
                />
                <Chip
                  label={t('flashDeals')}
                  color={filters.isFlashDeal ? 'error' : 'default'}
                  onClick={() => handleFilterChange('isFlashDeal', !filters.isFlashDeal)}
                  icon={<Timer />}
                  clickable
                />
              </Box>
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>
    </Paper>
  );
};

export default OfferFilters; 