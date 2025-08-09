// components/admin/RecentActivity.tsx
"use client"

import React from "react"
import {
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
  Divider,
  Box,
} from "@mui/material"
import { AccessTime } from "@mui/icons-material"

export interface Activity {
  id: number
  user: string
  action: string
  time: string
  avatarUrl?: string
}

interface RecentActivityProps {
  activities: Activity[]
}

const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => {
  if (activities.length === 0) {
    return <Typography color="text.secondary">لا يوجد نشاط حديث حالياً.</Typography>
  }

  return (
    <List disablePadding>
      {activities.map((activity, index) => (
        <React.Fragment key={activity.id}>
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <Avatar src={activity.avatarUrl}>
                {activity.user.charAt(0).toUpperCase()}
              </Avatar>
            </ListItemAvatar>

            <ListItemText
              primary={
                <Typography variant="subtitle1" fontWeight="bold">
                  {activity.user}
                </Typography>
              }
              secondary={
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography variant="body2" color="text.primary">
                    {activity.action}
                  </Typography>
                  <AccessTime sx={{ fontSize: 14, color: "text.secondary" }} />
                  <Typography variant="caption" color="text.secondary">
                    {activity.time}
                  </Typography>
                </Box>
              }
            />
          </ListItem>
          {index < activities.length - 1 && <Divider component="li" />}
        </React.Fragment>
      ))}
    </List>
  )
}

export default RecentActivity
