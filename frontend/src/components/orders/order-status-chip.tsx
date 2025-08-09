"use client"

import { Box } from "@mui/material"
import {
  Schedule as PendingIcon,
  CheckCircle as ConfirmedIcon,
  Build as ProcessingIcon,
  LocalShipping as ShippedIcon,
  Done as DeliveredIcon,
  Cancel as CancelledIcon,
} from "@mui/icons-material"
import { useTranslations } from "next-intl"
import type { OrderStatus } from "@/types/order"

interface OrderStatusChipProps {
  status: OrderStatus
  size?: "small" | "medium"
}

export function OrderStatusChip({ status, size = "small" }: OrderStatusChipProps) {
  const t = useTranslations("orders")

  const getStatusConfig = (status: OrderStatus) => {
    switch (status) {
      case "PENDING":
        return {
          label: t("statusPending"),
          color: "#f59e0b",
          bgColor: "rgba(245, 158, 11, 0.1)",
          icon: <PendingIcon />,
        }
      case "CONFIRMED":
        return {
          label: t("statusConfirmed"),
          color: "#3b82f6",
          bgColor: "rgba(59, 130, 246, 0.1)",
          icon: <ConfirmedIcon />,
        }
      case "PROCESSING":
        return {
          label: t("statusProcessing"),
          color: "#667eea",
          bgColor: "rgba(102, 126, 234, 0.1)",
          icon: <ProcessingIcon />,
        }
      case "SHIPPED":
        return {
          label: t("statusShipped"),
          color: "#764ba2",
          bgColor: "rgba(118, 75, 162, 0.1)",
          icon: <ShippedIcon />,
        }
      case "DELIVERED":
        return {
          label: t("statusDelivered"),
          color: "#10b981",
          bgColor: "rgba(16, 185, 129, 0.1)",
          icon: <DeliveredIcon />,
        }
      case "CANCELLED":
        return {
          label: t("statusCancelled"),
          color: "#ef4444",
          bgColor: "rgba(239, 68, 68, 0.1)",
          icon: <CancelledIcon />,
        }
      default:
        return {
          label: status,
          color: "#6b7280",
          bgColor: "rgba(107, 114, 128, 0.1)",
          icon: <PendingIcon />,
        }
    }
  }

  const config = getStatusConfig(status)

  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0.5,
        px: size === "small" ? 1.5 : 2,
        py: size === "small" ? 0.5 : 0.75,
        borderRadius: 2,
        backgroundColor: config.bgColor,
        color: config.color,
        border: `1px solid ${config.color}30`,
        fontSize: size === "small" ? "0.75rem" : "0.875rem",
        fontWeight: 600,
        "& .MuiSvgIcon-root": {
          fontSize: size === "small" ? 16 : 20,
        },
      }}
    >
      {config.icon}
      {config.label}
    </Box>
  )
}
