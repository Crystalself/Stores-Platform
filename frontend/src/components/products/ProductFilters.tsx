import React, {  useEffect, useMemo } from 'react';
import { Box, TextField, MenuItem, Slider, Rating, Badge, IconButton, Typography, Stack, Chip, Tooltip } from '@mui/material';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import ClearIcon from '@mui/icons-material/Clear';
import SortIcon from '@mui/icons-material/Sort';
import { ProductCategory } from '@/models/product';

export interface ProductFiltersState {
  search: string;
  category: string[];
  brand: string[];
  price: number[];
  rating: number;
  order: string;
  freeShipping: boolean;
  isNew: boolean;
  isBestSeller: boolean;
  discount: number;
}

const defaultFilters: ProductFiltersState = {
  search: '',
  category: [],
  brand: [],
  price: [0, 2000],
  rating: 0,
  order: 'newest',
  freeShipping: false,
  isNew: false,
  isBestSeller: false,
  discount: 0,
};

const categories = Object.entries(ProductCategory).map(([key, value]) => ({ key, value }));
const orderOptions = [
  { value: 'newest', label: 'الأحدث' },
  { value: 'price_asc', label: 'الأرخص' },
  { value: 'price_desc', label: 'الأغلى' },
  { value: 'rating', label: 'الأعلى تقييماً' },
];

interface ProductFiltersProps {
  filters: ProductFiltersState;
  setFilters: (filters: ProductFiltersState) => void;
  resultCount: number;
  minPrice: number;
  maxPrice: number;
}

const FILTERS_KEY = 'product_filters';

const ProductFilters: React.FC<ProductFiltersProps> = ({ filters, setFilters, resultCount, minPrice, maxPrice }) => {
  // حفظ الفلاتر في LocalStorage
  useEffect(() => {
    localStorage.setItem(FILTERS_KEY, JSON.stringify(filters));
  }, [filters]);

  // حساب عدد الفلاتر المفعلة
  const activeFilters = useMemo(() => {
    let count = 0;
    if (filters.search) count++;
    if (filters.category.length > 0) count++;
    if (filters.price[0] > minPrice || filters.price[1] < maxPrice) count++;
    if (filters.rating > 0) count++;
    if (filters.order !== 'newest') count++;
    // if (filters.discount > 0) count++;
    return count;
  }, [filters, minPrice, maxPrice]);

  // تغيير الفلاتر
  const handleChange = (key: keyof ProductFiltersState, value: any) => {
    setFilters({ ...filters, [key]: value });
  };

  // مسح الفلاتر
  const handleClear = () => {
    setFilters({ ...defaultFilters, price: [minPrice, maxPrice] });
  };

  return (
    <Box sx={{ p: 2, mb: 2, borderRadius: 3, boxShadow: 2, bgcolor: 'background.paper', position: 'sticky', top: 0, zIndex: 10 }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" justifyContent="space-between">
        <Stack direction="row" spacing={2} alignItems="center" flex={1}>
          <Badge badgeContent={activeFilters} color="primary" invisible={activeFilters === 0}>
            <FilterAltIcon color={activeFilters > 0 ? 'primary' : 'disabled'} />
          </Badge>
          <TextField
            label="search in proudcts"
            value={filters.search}
            onChange={e => handleChange('search', e.target.value)}
            size="small"
            sx={{ minWidth: 180 }}
            variant="outlined"
          />
          <TextField
            select
            label="cat"
            value={filters.category}
            onChange={e => handleChange('category', e.target.value)}
            size="small"
            sx={{ minWidth: 120 }}
          >
            <MenuItem value="">الكل</MenuItem>
            {categories.map(cat => (
              <MenuItem key={cat.key} value={cat.value}>{cat.value}</MenuItem>
            ))}
          </TextField>
          <Box sx={{ minWidth: 180 }}>
            <Typography variant="caption" color="text.secondary">نطاق السعر</Typography>
            <Slider
              value={filters.price}
              onChange={(_, val) => handleChange('price', val as number[])}
              min={minPrice}
              max={maxPrice}
              valueLabelDisplay="auto"
              step={10}
              sx={{ mt: 1 }}
            />
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">التقييم</Typography>
            <Rating
              value={filters.rating}
              onChange={(_, val) => handleChange('rating', val || 0)}
              precision={0.5}
              sx={{ ml: 1, mt: 1 }}
            />
          </Box>
          <TextField
            select
            label="ترتيب"
            value={filters.order}
            onChange={e => handleChange('order', e.target.value)}
            size="small"
            sx={{ minWidth: 120 }}
            InputProps={{ startAdornment: <SortIcon sx={{ mr: 1 }} /> }}
          >
            {orderOptions.map(opt => (
              <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
            ))}
          </TextField>
          {/* هان الاشي */}
          <TextField
            select
            label="الحد الأدنى للخصم"
            value={filters.discount}
            onChange={(e) => handleChange('discount', parseInt(e.target.value))}
            size="small"
            sx={{ minWidth: 180 }}
          >
            <MenuItem value={0}>بدون فلتر</MenuItem>
            {[5, 10, 15, 20, 25, 30, 40, 50, 60, 70, 80, 90].map((val) => (
              <MenuItem key={val} value={val}>{val}% أو أكثر</MenuItem>
            ))}
          </TextField>


        </Stack>
        <Stack direction="row" spacing={2} alignItems="center">
          <Tooltip title="مسح الفلاتر">
            <IconButton onClick={handleClear} color="error" size="large">
              <ClearIcon />
            </IconButton>
          </Tooltip>
          <Chip label={`عدد النتائج: ${resultCount}`} color="primary" variant="outlined" sx={{ fontWeight: 'bold' }} />
        </Stack>
      </Stack>
    </Box>
  );
};

export default ProductFilters;
