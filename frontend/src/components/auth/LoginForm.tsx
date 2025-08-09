"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Box,
  TextField,
  Button,
  Alert,
  IconButton,
  InputAdornment,
  Checkbox,
  FormControlLabel,
  CircularProgress,
} from "@mui/material"
import { Visibility, VisibilityOff, Email, Lock } from "@mui/icons-material"
import { motion } from "framer-motion"
import { useFormik } from "formik"
import * as Yup from "yup"
import { useAuth } from "./AuthProvider"
import type { LoginCredentials } from "@/types/auth"

/**
 * نموذج تسجيل الدخول
 * Login Form Component
 */

const validationSchema = Yup.object({
  email: Yup.string().email("البريد الإلكتروني غير صحيح").required("البريد الإلكتروني مطلوب"),
  password: Yup.string().min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل").required("كلمة المرور مطلوبة"),
})

interface LoginFormProps {
  onSuccess?: () => void
  redirectTo?: string
}

export default function LoginForm({ onSuccess, redirectTo = "/" }: LoginFormProps) {
  const router = useRouter()
  const { login } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    validationSchema,
    onSubmit: async (values: LoginCredentials) => {
      setLoading(true)
      setError("")

      try {
        await login(values)

        if (onSuccess) {
          onSuccess()
        } else {
          router.push(redirectTo)
        }
      } catch (err: any) {
        setError(err.message || "حدث خطأ في تسجيل الدخول")
      } finally {
        setLoading(false)
      }
    },
  })

  return (
    <Box component="form" onSubmit={formik.handleSubmit}>
      {/* رسالة الخطأ */}
      {error && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
        >
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        </motion.div>
      )}

      {/* حقل البريد الإلكتروني */}
      <TextField
        fullWidth
        name="email"
        label="البريد الإلكتروني"
        type="email"
        value={formik.values.email}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.email && Boolean(formik.errors.email)}
        helperText={formik.touched.email && formik.errors.email}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Email color="action" />
            </InputAdornment>
          ),
        }}
        sx={{
          mb: 3,
          "& .MuiOutlinedInput-root": {
            borderRadius: 2,
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            },
          },
        }}
      />

      {/* حقل كلمة المرور */}
      <TextField
        fullWidth
        name="password"
        label="كلمة المرور"
        type={showPassword ? "text" : "password"}
        value={formik.values.password}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.password && Boolean(formik.errors.password)}
        helperText={formik.touched.password && formik.errors.password}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Lock color="action" />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
                aria-label="toggle password visibility"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{
          mb: 2,
          "& .MuiOutlinedInput-root": {
            borderRadius: 2,
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            },
          },
        }}
      />

      {/* تذكرني */}
      <FormControlLabel
        control={
          <Checkbox
            name="rememberMe"
            checked={formik.values.rememberMe}
            onChange={formik.handleChange}
            color="primary"
          />
        }
        label="تذكرني"
        sx={{ mb: 3 }}
      />

      {/* زر تسجيل الدخول */}
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          disabled={loading}
          sx={{
            py: 1.5,
            borderRadius: 2,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
            "&:hover": {
              boxShadow: "0 6px 20px rgba(102, 126, 234, 0.6)",
            },
            "&:disabled": {
              background: "rgba(0, 0, 0, 0.12)",
            },
          }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "تسجيل الدخول"}
        </Button>
      </motion.div>
    </Box>
  )
}
