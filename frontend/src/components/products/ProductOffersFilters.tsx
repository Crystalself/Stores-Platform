"use client";
import React from "react";
import {
  Box,
  Stack,
  TextField,
  Button,
  Typography,
  InputAdornment,
  Chip,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  OutlinedInput,
  Slider,
  Badge,
} from "@mui/material";
import { useTranslations, useLocale } from "next-intl";
import SearchIcon from "@mui/icons-material/Search";
import TuneIcon from "@mui/icons-material/Tune";
import FilterListIcon from '@mui/icons-material/FilterList';
import { ProductCategory } from '@/models/product';

export interface OffersFilters {
  search: string;
  priceRange: [number, number];
  minDiscount: number;
  maxDiscount: number;
  minRating: number;
  category?: ProductCategory;
}

const ProductOffersFilters = ({
  filters,
  onFilterChange,
  resultsCount = 0,
  minPrice,
  maxPrice,
  minDiscount,
  maxDiscount
}: {
  filters: OffersFilters;
  onFilterChange: (filters: OffersFilters) => void;
  resultsCount?: number;
  minPrice: number;
  maxPrice: number;
  minDiscount: number;
  maxDiscount: number;
}) => {
  const t = useTranslations("ProductFilters");
  const locale = useLocale();
  const isRTL = locale === "ar";
  const CATEGORY_OPTIONS = Object.values(ProductCategory);

  // حساب عدد الفلاتر النشطة
  const activeFiltersCount =
    (filters.search ? 1 : 0) +
    (filters.category ? 1 : 0) +
    (filters.minRating > 0 ? 1 : 0) +
    (filters.minDiscount > minDiscount || filters.maxDiscount < maxDiscount ? 1 : 0) +
    (filters.priceRange[0] > minPrice || filters.priceRange[1] < maxPrice ? 1 : 0);

  const handleDiscountChange = (_: Event, newValue: number | number[]) => {
    let [minVal, maxVal] = newValue as number[];
    if (minVal > maxVal) minVal = maxVal;
    if (maxVal < minVal) maxVal = minVal;
    onFilterChange({ ...filters, minDiscount: minVal, maxDiscount: maxVal });
  };

  const handlePriceChange = (_: Event, newValue: number | number[]) => {
    let [minVal, maxVal] = newValue as number[];
    if (minVal > maxVal) minVal = maxVal;
    if (maxVal < minVal) maxVal = minVal;
    onFilterChange({ ...filters, priceRange: [minVal, maxVal] });
  };

  return (
    <Box
      sx={{
        p: 3,
        borderRadius: 4,
        boxShadow: 6,
        bgcolor: 'background.paper',
        mb: 4,
        background: 'linear-gradient(135deg, #f8fafc 60%, #e3e8ee 100%)',
        direction: isRTL ? 'rtl' : 'ltr',
        maxWidth: '100%',
        position: 'sticky',
        top: 0,
        zIndex: 20,
        border: '1.5px solid rgba(120,120,180,0.13)',
        backdropFilter: 'blur(8px)',
        backgroundClip: 'padding-box',
        transition: 'box-shadow 0.3s',
        '&:hover': { boxShadow: 8 },
      }}
    >
      <Stack
        direction="row"
        spacing={5}
        alignItems="center"
        sx={{
          flexWrap: 'wrap',
          overflowX: 'hidden',
          justifyContent: isRTL ? 'flex-end' : 'flex-start',
        }}
      >
        {/* أيقونة عدد الفلاتر المفعلة */}
        <Tooltip title={isRTL ? `${activeFiltersCount} فلتر مفعل` : `${activeFiltersCount} active filter(s)`}>
          <Badge
            badgeContent={activeFiltersCount}
            color="primary"
            invisible={activeFiltersCount === 0}
            sx={{ mr: isRTL ? 0 : 1, ml: isRTL ? 1 : 0 }}
          >
            <FilterListIcon color={activeFiltersCount > 0 ? "primary" : "disabled"} fontSize="large" />
          </Badge>
        </Tooltip>

        {/* عدد النتائج */}
        {resultsCount > 0 && (
          <Chip
            label={isRTL ? `${resultsCount} نتيجة` : `${resultsCount} results`}
            color="primary"
            variant="outlined"
            sx={{ fontWeight: 600, fontSize: 15, height: 36, whiteSpace: 'nowrap' }}
          />
        )}

        {/* البحث */}
        <TextField
          label={t('search')}
          value={filters.search}
          onChange={e => onFilterChange({ ...filters, search: e.target.value })}
          size="small"
          sx={{
            minWidth: 140,
            maxWidth: 220,
            flexGrow: 1,
            bgcolor: 'white',
            borderRadius: 2,
            boxShadow: 1,
            '& .MuiOutlinedInput-root': {
              transition: 'box-shadow 0.3s',
              '&:hover': { boxShadow: 4 },
              '&.Mui-focused': { boxShadow: 5 }
            },
            input: {
              textAlign: isRTL ? 'right' : 'left',
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="primary" />
              </InputAdornment>
            ),
            endAdornment: (
              <Tooltip title={isRTL ? 'بحث متقدم' : 'Advanced search'}>
                <InputAdornment position="end">
                  <TuneIcon fontSize="small" sx={{ cursor: 'pointer' }} />
                </InputAdornment>
              </Tooltip>
            ),
          }}
        />

        {/* التصنيف */}
        <FormControl
          sx={{ minWidth: 120, maxWidth: 180, flexGrow: 1, bgcolor: 'white', borderRadius: 2, boxShadow: 1 }}
          size="small"
        >
          <InputLabel>{t('category')}</InputLabel>
          <Select
            value={filters.category || ''}
            label={t('category')}
            onChange={e =>
              onFilterChange({ ...filters, category: e.target.value || undefined })
            }
            sx={{ textAlign: isRTL ? 'right' : 'left' }}
          >
            <MenuItem value="">{t('allCategories')}</MenuItem>
            {CATEGORY_OPTIONS.map(cat => (
              <MenuItem key={cat} value={cat}>{cat}</MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* نطاق الخصم */}
        <Box sx={{ minWidth: 100, maxWidth: 150, flexGrow: 1 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              mb: 0.3,
              px: 1,
              flexDirection: isRTL ? 'row-reverse' : 'row',
            }}
          >
            <Typography
              variant="caption"
              fontWeight={600}
              sx={{
                userSelect: 'none',
                fontSize: '11px',
                whiteSpace: 'nowrap',
              }}
            >
              {isRTL ? 'نطاق الخصم (%)' : 'Discount Range (%)'}
            </Typography>
            <Typography
              variant="caption"
              fontWeight={700}
              color="primary"
              sx={{
                fontSize: '11px',
                minWidth: 45,
                textAlign: isRTL ? 'left' : 'right',
                whiteSpace: 'nowrap',
              }}
            >
              {filters.minDiscount}% - {filters.maxDiscount}%
            </Typography>
          </Box>

          <Slider
            size="small"
            value={[filters.minDiscount, filters.maxDiscount]}
            onChange={handleDiscountChange}
            valueLabelDisplay="auto"
            min={minDiscount}
            max={maxDiscount}
            sx={{ mx: 1 }}
            disableSwap
          />
        </Box>

        {/* تقييم */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 100, maxWidth: 120 }}>
          <Typography
            variant="caption"
            fontWeight={600}
            sx={{
              whiteSpace: 'nowrap',
              userSelect: 'none',
              fontSize: '11px',
            }}
          >
            {t('minRating')}
          </Typography>
          <OutlinedInput
            type="number"
            value={filters.minRating}
            onChange={e =>
              onFilterChange({
                ...filters,
                minRating: Math.max(0, Math.min(5, Number(e.target.value)))
              })
            }
            inputProps={{ min: 0, max: 5, step: 0.1, style: { width: 48, textAlign: 'center', fontSize: '11px' } }}
            size="small"
            endAdornment={
              <InputAdornment position="end" sx={{ fontSize: '12px' }}>★</InputAdornment>
            }
            sx={{
              borderRadius: 2,
              bgcolor: 'white',
              boxShadow: 1,
              height: 30,
              '&:hover': { boxShadow: 3 },
              '&.Mui-focused': { boxShadow: 4 }
            }}
          />
        </Box>

        {/* نطاق السعر */}
        <Box sx={{ minWidth: 180, maxWidth: 220, flexGrow: 1 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              mb: 0.3,
              px: 1,
              flexDirection: isRTL ? 'row-reverse' : 'row',
            }}
          >
            <Typography
              variant="caption"
              fontWeight={600}
              sx={{
                userSelect: 'none',
                fontSize: '11px',
                whiteSpace: 'nowrap'
              }}
            >
              {isRTL ? 'نطاق السعر ($)' : 'Price Range ($)'}
            </Typography>
            <Typography
              variant="caption"
              fontWeight={700}
              color="primary"
              sx={{
                fontSize: '11px',
                minWidth: 65,
                textAlign: isRTL ? 'left' : 'right',
                whiteSpace: 'nowrap'
              }}
            >
              ${filters.priceRange[0]} - ${filters.priceRange[1]}
            </Typography>
          </Box>
          <Slider
            size="small"
            value={filters.priceRange}
            onChange={handlePriceChange}
            valueLabelDisplay="auto"
            min={minPrice}
            max={maxPrice}
            sx={{ mx: 1 }}
            disableSwap
          />
        </Box>


        {/* زر مسح الكل */}
        <Button
          variant="outlined"
          color="secondary"
          sx={{
            borderRadius: 2,
            fontWeight: 700,
            minWidth: 120,
            boxShadow: 2,
            px: 3,
            py: 1.2,
            whiteSpace: 'nowrap',
            transition: 'background-color 0.3s',
            bgcolor: 'rgba(255,255,255,0.9)',
            '&:hover': {
              bgcolor: 'rgba(255,255,255,1)',
              boxShadow: 4,
            }
          }}
          onClick={() =>
            onFilterChange({
              search: "",
              priceRange: [minPrice, maxPrice],
              minDiscount: minDiscount,
              maxDiscount: maxDiscount,
              minRating: 0,
              category: undefined,
            })
          }
        >
          {isRTL ? 'مسح الكل' : 'Clear All'}
        </Button>
      </Stack>
    </Box>
  );
};

export default ProductOffersFilters;
