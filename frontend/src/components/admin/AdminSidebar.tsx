// components/admin/AdminSidebar.tsx
"use client"

import React from "react"
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Divider,
  Box,
} from "@mui/material"
import {
  Dashboard,
  People,
  Store,
  Report,
  Logout,
} from "@mui/icons-material"
import { useRouter } from "next/navigation"

const drawerWidth = 240

const AdminSidebar: React.FC = () => {
  const router = useRouter()

  const navItems = [
    { label: "لوحة التحكم", icon: <Dashboard />, path: "/admin" },
    { label: "المستخدمين", icon: <People />, path: "/admin/users" },
    { label: "المتاجر", icon: <Store />, path: "/admin/stores" },
    { label: "التقارير", icon: <Report />, path: "/admin/reports" },
  ]

  const handleLogout = () => {
    // هنا تقدر تضيف تسجيل الخروج الحقيقي
    router.push("/auth/login")
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: "auto" }}>
        <List>
          {navItems.map((item) => (
            <ListItem button key={item.label} onClick={() => router.push(item.path)}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          <ListItem button onClick={handleLogout}>
            <ListItemIcon>
              <Logout />
            </ListItemIcon>
            <ListItemText primary="تسجيل الخروج" />
          </ListItem>
        </List>
      </Box>
    </Drawer>
  )
}

export default AdminSidebar
