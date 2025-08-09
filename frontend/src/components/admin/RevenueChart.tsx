// components/admin/RevenueChart.tsx
"use client"

import React from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { Typography } from "@mui/material"

export interface RevenueData {
  month: string
  revenue: number
}

interface Props {
  data: RevenueData[]
}

const RevenueChart: React.FC<Props> = ({ data }) => {
  if (!data || data.length === 0) {
    return <Typography color="text.secondary">لا توجد بيانات حالياً.</Typography>
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="revenue" fill="#4caf50" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

export default RevenueChart
