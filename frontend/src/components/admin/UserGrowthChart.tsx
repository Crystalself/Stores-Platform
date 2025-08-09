// components/admin/UserGrowthChart.tsx
"use client"

import React from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { Typography } from "@mui/material"

export interface UserGrowthData {
  month: string // مثل: "Jan", "Feb", إلخ
  users: number
}

interface Props {
  data: UserGrowthData[]
}

const UserGrowthChart: React.FC<Props> = ({ data }) => {
  if (!data || data.length === 0) {
    return <Typography color="text.secondary">لا توجد بيانات حالياً.</Typography>
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="users" stroke="#1976d2" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  )
}

export default UserGrowthChart
