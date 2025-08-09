"use client"

import { useTranslations } from "next-intl"
import { Box, FormControl, InputLabel, Select, MenuItem, Paper, Typography } from "@mui/material"
import { Sort as SortIcon } from "@mui/icons-material"
import type { CartFilters, SortBy, SortDirection } from "@/types/cart"

interface CartFiltersProps {
  filters: CartFilters
  onFiltersChange: (filters: Partial<CartFilters>) => void
  itemCount: number
}

export function CartFiltersComponent({ filters, onFiltersChange, itemCount }: CartFiltersProps) {
  const t = useTranslations("cart")

  return (
    <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
        <Box display="flex" alignItems="center" gap={1}>
          <SortIcon color="action" />
          <Typography variant="body1" color="text.secondary">
            {t("showing")} {itemCount} {t("items")}
          </Typography>
        </Box>

        <Box display="flex" gap={2}>
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>{t("sortBy")}</InputLabel>
            <Select
              value={filters.sortBy}
              label={t("sortBy")}
              onChange={(e) => onFiltersChange({ sortBy: e.target.value as SortBy })}
            >
              <MenuItem value="price">{t("byPrice")}</MenuItem>
              <MenuItem value="name">{t("byName")}</MenuItem>
              <MenuItem value="rating">{t("byRating")}</MenuItem>
              <MenuItem value="created_at">{t("byDate")}</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>{t("direction")}</InputLabel>
            <Select
              value={filters.sortDirection}
              label={t("direction")}
              onChange={(e) => onFiltersChange({ sortDirection: e.target.value as SortDirection })}
            >
              <MenuItem value="asc">{t("asc")}</MenuItem>
              <MenuItem value="desc">{t("desc")}</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>
    </Paper>
  )
}
