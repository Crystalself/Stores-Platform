"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  IconButton,
  InputAdornment,
  Checkbox,
  FormControlLabel,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Link,
} from "@mui/material"
import { Visibility, VisibilityOff, Email, Lock, Person, ArrowBack, ArrowForward } from "@mui/icons-material"
import { motion, AnimatePresence } from "framer-motion"
import { useFormik } from "formik"
import * as Yup from "yup"
import { MuiTelInput } from "mui-tel-input"
import { authService, type RegisterData } from "@/lib/auth"

/**
 * نموذج التسجيل متعدد الخطوات
 * Multi-step Registration Form Component
 */

const steps = ["المعلومات الأساسية", "كلمة المرور", "التأكيد"]

const validationSchemas = [
  // الخطوة الأولى: المعلومات الأساسية
  Yup.object({
    firstName: Yup.string().min(2, "الاسم الأول يجب أن يكون حرفين على الأقل").required("الاسم الأول مطلوب"),
    lastName: Yup.string().min(2, "الاسم الأخير يجب أن يكون حرفين على الأقل").required("الاسم الأخير مطلوب"),
    email: Yup.string().email("البريد الإلكتروني غير صحيح").required("البريد الإلكتروني مطلوب"),
    phone: Yup.string().min(10, "رقم الهاتف غير صحيح").required("رقم الهاتف مطلوب"),
  }),
  // الخطوة الثانية: كلمة المرور
  Yup.object({
    password: Yup.string()
      .min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل")
      .matches(/[a-z]/, "يجب أن تحتوي على حرف صغير واحد على الأقل")
      .matches(/[A-Z]/, "يجب أن تحتوي على حرف كبير واحد على الأقل")
      .matches(/[0-9]/, "يجب أن تحتوي على رقم واحد على الأقل")
      .matches(/[^a-zA-Z0-9]/, "يجب أن تحتوي على رمز خاص واحد على الأقل")
      .required("كلمة المرور مطلوبة"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "كلمات المرور غير متطابقة")
      .required("تأكيد كلمة المرور مطلوب"),
  }),
  // الخطوة الثالثة: التأكيد
  Yup.object({
    acceptTerms: Yup.boolean()
      .oneOf([true], "يجب الموافقة على الشروط والأحكام")
      .required("يجب الموافقة على الشروط والأحكام"),
  }),
]

interface RegisterFormProps {
  onSuccess?: () => void
}

export default function RegisterForm({ onSuccess }: RegisterFormProps) {
  const router = useRouter()
  const [activeStep, setActiveStep] = useState(0)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
    validationSchema: validationSchemas[activeStep],
    onSubmit: async (values) => {
      if (activeStep < steps.length - 1) {
        // الانتقال للخطوة التالية
        setActiveStep(activeStep + 1)
        formik.setTouched({})
      } else {
        // إرسال البيانات للخادم
        setLoading(true)
        setError("")

        try {
          await authService.register(values as RegisterData)

          if (onSuccess) {
            onSuccess()
          } else {
            router.push("/auth/verify-email?email=" + encodeURIComponent(values.email))
          }
        } catch (err: any) {
          setError(err.message || "حدث خطأ في إنشاء الحساب")
        } finally {
          setLoading(false)
        }
      }
    },
  })

  const handleBack = () => {
    setActiveStep(activeStep - 1)
    formik.setTouched({})
  }

  // مؤشر قوة كلمة المرور
  const getPasswordStrength = (password: string) => {
    const requirements = [
      { test: /.{8,}/, label: "8 أحرف على الأقل" },
      { test: /[a-z]/, label: "حرف صغير واحد على الأقل" },
      { test: /[A-Z]/, label: "حرف كبير واحد على الأقل" },
      { test: /[0-9]/, label: "رقم واحد على الأقل" },
      { test: /[^a-zA-Z0-9]/, label: "رمز خاص واحد على الأقل" },
    ]

    return requirements.map((req, index) => ({
      ...req,
      met: req.test.test(password),
      key: index,
    }))
  }

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            {/* الاسم الأول والأخير */}
            <Box display="flex" gap={2} mb={3}>
              <TextField
                fullWidth
                name="firstName"
                label="الاسم الأول"
                value={formik.values.firstName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                helperText={formik.touched.firstName && formik.errors.firstName}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />
              <TextField
                fullWidth
                name="lastName"
                label="الاسم الأخير"
                value={formik.values.lastName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                helperText={formik.touched.lastName && formik.errors.lastName}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />
            </Box>

            {/* البريد الإلكتروني */}
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
                "& .MuiOutlinedInput-root": { borderRadius: 2 },
              }}
            />

            {/* رقم الهاتف */}
            <MuiTelInput
              fullWidth
              name="phone"
              label="رقم الهاتف"
              value={formik.values.phone}
              onChange={(value) => formik.setFieldValue("phone", value)}
              onBlur={formik.handleBlur}
              error={formik.touched.phone && Boolean(formik.errors.phone)}
              helperText={formik.touched.phone && formik.errors.phone}
              defaultCountry="PS"
              sx={{
                mb: 3,
                "& .MuiOutlinedInput-root": { borderRadius: 2 },
              }}
            />
          </motion.div>
        )

      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            {/* كلمة المرور */}
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
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 3,
                "& .MuiOutlinedInput-root": { borderRadius: 2 },
              }}
            />

            {/* تأكيد كلمة المرور */}
            <TextField
              fullWidth
              name="confirmPassword"
              label="تأكيد كلمة المرور"
              type={showConfirmPassword ? "text" : "password"}
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
              helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 3,
                "& .MuiOutlinedInput-root": { borderRadius: 2 },
              }}
            />

            {/* مؤشر قوة كلمة المرور */}
            <Box mb={3}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                متطلبات كلمة المرور:
              </Typography>
              <Box display="flex" flexDirection="column" gap={0.5}>
                {getPasswordStrength(formik.values.password).map((requirement) => (
                  <Typography
                    key={requirement.key}
                    variant="caption"
                    color={requirement.met ? "success.main" : "text.secondary"}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      "&::before": {
                        content: requirement.met ? "'✓'" : "'○'",
                        fontWeight: "bold",
                      },
                    }}
                  >
                    {requirement.label}
                  </Typography>
                ))}
              </Box>
            </Box>
          </motion.div>
        )

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            {/* تأكيد البيانات */}
            <Box textAlign="center" mb={4}>
              <Typography variant="h6" gutterBottom>
                تأكيد البيانات
              </Typography>
              <Typography variant="body2" color="text.secondary">
                يرجى مراجعة بياناتك قبل إنشاء الحساب
              </Typography>
            </Box>

            <Box
              sx={{
                p: 3,
                borderRadius: 2,
                backgroundColor: "grey.50",
                mb: 3,
              }}
            >
              <Typography variant="body2" gutterBottom>
                <strong>الاسم:</strong> {formik.values.firstName} {formik.values.lastName}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>البريد الإلكتروني:</strong> {formik.values.email}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>رقم الهاتف:</strong> {formik.values.phone}
              </Typography>
            </Box>

            {/* الموافقة على الشروط */}
            <FormControlLabel
              control={
                <Checkbox
                  name="acceptTerms"
                  checked={formik.values.acceptTerms}
                  onChange={formik.handleChange}
                  color="primary"
                />
              }
              label={
                <Typography variant="body2">
                  أوافق على{" "}
                  <Link href="/terms" target="_blank">
                    الشروط والأحكام
                  </Link>{" "}
                  و{" "}
                  <Link href="/privacy" target="_blank">
                    سياسة الخصوصية
                  </Link>
                </Typography>
              }
              sx={{ mb: 2 }}
            />
            {formik.touched.acceptTerms && formik.errors.acceptTerms && (
              <Typography variant="caption" color="error" display="block" mb={2}>
                {formik.errors.acceptTerms}
              </Typography>
            )}
          </motion.div>
        )

      default:
        return null
    }
  }

  return (
    <Box>
      {/* مؤشر الخطوات */}
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* رسالة الخطأ */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* النموذج */}
      <Box component="form" onSubmit={formik.handleSubmit}>
        <AnimatePresence mode="wait">{renderStepContent(activeStep)}</AnimatePresence>

        {/* أزرار التنقل */}
        <Box display="flex" justifyContent="space-between" mt={4}>
          <Button
            onClick={handleBack}
            disabled={activeStep === 0}
            startIcon={<ArrowBack />}
            sx={{ visibility: activeStep === 0 ? "hidden" : "visible" }}
          >
            السابق
          </Button>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              endIcon={activeStep === steps.length - 1 ? null : <ArrowForward />}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
                "&:hover": {
                  boxShadow: "0 6px 20px rgba(102, 126, 234, 0.6)",
                },
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : activeStep === steps.length - 1 ? (
                "إنشاء الحساب"
              ) : (
                "التالي"
              )}
            </Button>
          </motion.div>
        </Box>
      </Box>
    </Box>
  )
}
