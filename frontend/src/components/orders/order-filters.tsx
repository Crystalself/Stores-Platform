"use client"

import { useState } from "react"
import {
  Paper,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Grid,
  Typography,
  Chip,
  IconButton,
  Collapse,
  useMediaQuery,
  useTheme as useMuiTheme,
} from "@mui/material"
import {
  FilterList as FilterIcon,
  Clear as ClearIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from "@mui/icons-material"
import { useTranslations } from "next-intl"
import type { OrderFilters, OrderStatus, OrderSortColumn, SortDirection } from "@/types/order"

interface OrderFiltersProps {
  filters: OrderFilters
  onFiltersChange: (filters: Partial<OrderFilters>) => void
  totalCount: number
}

export function OrderFiltersComponent({ filters, onFiltersChange, totalCount }: OrderFiltersProps) {
  const t = useTranslations("orders")
  const muiTheme = useMuiTheme()
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("md"))
  const [expanded, setExpanded] = useState(false)

  const statusOptions: { value: OrderStatus; label: string }[] = [
    { value: "PENDING", label: t("statusPending") },
    { value: "CONFIRMED", label: t("statusConfirmed") },
    { value: "PROCESSING", label: t("statusProcessing") },
    { value: "SHIPPED", label: t("statusShipped") },
    { value: "DELIVERED", label: t("statusDelivered") },
    { value: "CANCELLED", label: t("statusCancelled") },
  ]

  const sortOptions: { value: OrderSortColumn; label: string }[] = [
    { value: "created_at", label: t("sortByDate") },
    { value: "total", label: t("sortByTotal") },
    { value: "status", label: t("sortByStatus") },
  ]

  const clearFilters = () => {
    onFiltersChange({
      status: undefined,
      dateFrom: undefined,
      dateTo: undefined,
      offset: 0,
    })
  }

  const hasActiveFilters = filters.status || filters.dateFrom || filters.dateTo

  return (
    <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
      {/* Header */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Box display="flex" alignItems="center" gap={1}>
          <FilterIcon color="action" />
          <Typography variant="body1" fontWeight={500}>
            {t("filters")} ({totalCount} {t("orders")})
          </Typography>
          {hasActiveFilters && (
            <Chip
              label={t("filtersActive")}
              size="small"
              color="primary"
              onDelete={clearFilters}
              deleteIcon={<ClearIcon />}
            />
          )}
        </Box>

        {isMobile && (
          <IconButton onClick={() => setExpanded(!expanded)}>
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        )}
      </Box>

      {/* Filters Content */}
      <Collapse in={!isMobile || expanded}>
        <Grid container spacing={2} alignItems="center">
          {/* Sort By */}
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>{t("sortBy")}</InputLabel>
              <Select
                value={filters.order.column}
                label={t("sortBy")}
                onChange={(e) =>
                  onFiltersChange({
                    order: {
                      ...filters.order,
                      column: e.target.value as OrderSortColumn,
                    },
                  })
                }
              >
                {sortOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Sort Direction */}
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>{t("order")}</InputLabel>
              <Select
                value={filters.order.direction}
                label={t("order")}
                onChange={(e) =>
                  onFiltersChange({
                    order: {
                      ...filters.order,
                      direction: e.target.value as SortDirection,
                    },
                  })
                }
              >
                <MenuItem value="desc">{t("newest")}</MenuItem>
                <MenuItem value="asc">{t("oldest")}</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Status Filter */}
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>{t("status")}</InputLabel>
              <Select
                value={filters.status || ""}
                label={t("status")}
                onChange={(e) =>
                  onFiltersChange({
                    status: e.target.value ? (e.target.value as OrderStatus) : undefined,
                    offset: 0,
                  })
                }
              >
                <MenuItem value="">{t("allStatuses")}</MenuItem>
                {statusOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Date From */}
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              size="small"
              type="date"
              label={t("dateFrom")}
              value={filters.dateFrom || ""}
              onChange={(e) =>
                onFiltersChange({
                  dateFrom: e.target.value || undefined,
                  offset: 0,
                })
              }
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          {/* Date To */}
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              fullWidth
              size="small"
              type="date"
              label={t("dateTo")}
              value={filters.dateTo || ""}
              onChange={(e) =>
                onFiltersChange({
                  dateTo: e.target.value || undefined,
                  offset: 0,
                })
              }
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          {/* Clear Filters */}
          <Grid item xs={12} sm={6} md={1}>
            <Button
              fullWidth
              variant="outlined"
              size="small"
              onClick={clearFilters}
              disabled={!hasActiveFilters}
              startIcon={<ClearIcon />}
            >
              {t("clear")}
            </Button>
          </Grid>
        </Grid>
      </Collapse>
    </Paper>
  )
}
