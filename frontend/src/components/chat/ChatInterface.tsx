"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  Avatar,
  Chip,
  Menu,
  MenuItem,
  CircularProgress,
} from "@mui/material"
import { Send, AttachFile, MoreVert, Phone, VideoCall, Info } from "@mui/icons-material"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "@/components/auth/AuthProvider"
import type { Chat, Message, MessageType } from "@/types/chat"
import { t } from "@/utils/translations" // Import t from translations

/**
 * واجهة الدردشة التفاعلية
 * Interactive Chat Interface Component
 */

interface ChatInterfaceProps {
  chat: Chat
  onSendMessage: (content: string, type: MessageType) => Promise<void>
  onLoadMore?: () => void
  loading?: boolean
}

export default function ChatInterface({ chat, onSendMessage, onLoadMore, loading = false }: ChatInterfaceProps) {
  const { user } = useAuth()
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [sending, setSending] = useState(false)
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // التمرير للأسفل عند إضافة رسائل جديدة
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // معالج إرسال الرسالة
  const handleSendMessage = async () => {
    if (!message.trim() || sending) return

    setSending(true)
    try {
      await onSendMessage(message.trim(), "text")
      setMessage("")
    } catch (error) {
      console.error("فشل في إرسال الرسالة:", error)
    } finally {
      setSending(false)
    }
  }

  // معالج الضغط على Enter
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // معالج رفع الملفات
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // معالجة رفع الملف
      console.log("رفع ملف:", file.name)
    }
  }

  // الحصول على المشارك الآخر
  const otherParticipant = chat.participants.find((p) => p.userId !== user?.id)

  return (
    <Paper
      elevation={3}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 3,
        overflow: "hidden",
      }}
    >
      {/* رأس الدردشة */}
      <Box
        sx={{
          p: 2,
          bgcolor: "primary.main",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar src={otherParticipant?.user.profilePic} alt={otherParticipant?.user.firstName}>
            {otherParticipant?.user.firstName?.[0]}
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight="bold">
              {otherParticipant?.user.firstName} {otherParticipant?.user.lastName}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              {otherParticipant?.role === "merchant" ? t("merchant") : t("customer")}
            </Typography>
          </Box>
        </Box>

        <Box display="flex" alignItems="center" gap={1}>
          <IconButton color="inherit" size="small">
            <Phone />
          </IconButton>
          <IconButton color="inherit" size="small">
            <VideoCall />
          </IconButton>
          <IconButton color="inherit" size="small" onClick={(e) => setMenuAnchor(e.currentTarget)}>
            <MoreVert />
          </IconButton>
        </Box>

        {/* قائمة الخيارات */}
        <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={() => setMenuAnchor(null)}>
          <MenuItem onClick={() => setMenuAnchor(null)}>
            <Info sx={{ mr: 1 }} />
            {t("chatInfo")}
          </MenuItem>
        </Menu>
      </Box>

      {/* منطقة الرسائل */}
      <Box
        sx={{
          flex: 1,
          overflow: "auto",
          p: 2,
          bgcolor: "grey.50",
        }}
      >
        {loading && (
          <Box display="flex" justifyContent="center" mb={2}>
            <CircularProgress size={24} />
          </Box>
        )}

        <AnimatePresence>
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} isOwn={msg.senderId === user?.id} />
          ))}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </Box>

      {/* شريط الإدخال */}
      <Box
        sx={{
          p: 2,
          bgcolor: "background.paper",
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box display="flex" alignItems="flex-end" gap={1}>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            style={{ display: "none" }}
            accept="image/*,application/pdf,.doc,.docx"
          />

          <IconButton color="primary" onClick={() => fileInputRef.current?.click()}>
            <AttachFile />
          </IconButton>

          <TextField
            fullWidth
            multiline
            maxRows={4}
            placeholder={t("typeMessage")}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={sending}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
              },
            }}
          />

          <IconButton
            color="primary"
            onClick={handleSendMessage}
            disabled={!message.trim() || sending}
            sx={{
              bgcolor: "primary.main",
              color: "white",
              "&:hover": {
                bgcolor: "primary.dark",
              },
              "&:disabled": {
                bgcolor: "grey.300",
              },
            }}
          >
            {sending ? <CircularProgress size={20} /> : <Send />}
          </IconButton>
        </Box>
      </Box>
    </Paper>
  )
}

// مكون فقاعة الرسالة
interface MessageBubbleProps {
  message: Message
  isOwn: boolean
}

function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: isOwn ? "flex-end" : "flex-start",
          mb: 2,
        }}
      >
        <Box
          sx={{
            maxWidth: "70%",
            display: "flex",
            flexDirection: isOwn ? "row-reverse" : "row",
            alignItems: "flex-end",
            gap: 1,
          }}
        >
          {!isOwn && (
            <Avatar src={message.sender.profilePic} alt={message.sender.firstName} sx={{ width: 32, height: 32 }}>
              {message.sender.firstName?.[0]}
            </Avatar>
          )}

          <Box>
            <Paper
              elevation={1}
              sx={{
                p: 2,
                borderRadius: 3,
                bgcolor: isOwn ? "primary.main" : "white",
                color: isOwn ? "white" : "text.primary",
                ...(isOwn
                  ? {
                      borderBottomRightRadius: 8,
                    }
                  : {
                      borderBottomLeftRadius: 8,
                    }),
              }}
            >
              {/* نوع الرسالة */}
              {message.type === "contract_update" && <Chip label={t("contractUpdate")} size="small" sx={{ mb: 1 }} />}

              {/* محتوى الرسالة */}
              <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                {message.content}
              </Typography>

              {/* المرفقات */}
              {message.attachments && message.attachments.length > 0 && (
                <Box mt={1}>
                  {message.attachments.map((attachment) => (
                    <Chip key={attachment.id} label={attachment.name} size="small" clickable sx={{ mr: 1, mb: 1 }} />
                  ))}
                </Box>
              )}
            </Paper>

            {/* وقت الرسالة */}
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                display: "block",
                textAlign: isOwn ? "right" : "left",
                mt: 0.5,
                px: 1,
              }}
            >
              {new Date(message.createdAt).toLocaleTimeString("ar", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Typography>
          </Box>
        </Box>
      </Box>
    </motion.div>
  )
}
