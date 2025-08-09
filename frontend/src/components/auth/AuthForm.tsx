'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import {
  Box,
  TextField,
  Button,
  Divider,
  Typography,
  Snackbar,
} from '@mui/material';
import { OAuthButtons } from './OAuthButtons';
import { PasswordField } from './PasswordField';
import { MuiTelInput, matchIsValidTel } from 'mui-tel-input';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon      from '@mui/icons-material/Cancel';
import { motion } from 'framer-motion';
import { useTheme } from '@mui/material/styles';

interface LoginFormData {
  username: string;
  password: string;
  rememberMe: boolean;
}

export interface RegisterFormData extends LoginFormData {
  confirmPassword: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

type AuthFormProps =
  | {
      type: 'login';
      onSubmit: (formData: LoginFormData) => void;
      loading?: boolean;
      showPassword?: boolean;
      onTogglePassword?: () => void;
      formData?: Partial<LoginFormData>;
      onFieldChange?: (field: keyof LoginFormData, value: string | boolean) => void;
      firstFieldRef?: React.RefObject<HTMLInputElement>;
    }
  | {
      type: 'register';
      onSubmit: (formData: RegisterFormData) => void;
      loading?: boolean;
      showPassword?: boolean;
      onTogglePassword?: () => void;
      formData?: Partial<RegisterFormData>;
      onFieldChange?: (field: keyof RegisterFormData, value: string | boolean) => void;
      firstFieldRef?: React.RefObject<HTMLInputElement>;
    };

interface Touched { [key: string]: boolean; }
interface Errors { [key: string]: string; }

// AnimatedTextField: a reusable, animated, accessible text field
function AnimatedTextField({
  inputRef,
  label,
  value,
  onChange,
  error,
  touched,
  helperText,
  type = 'text',
  autoComplete,
  ...props
}: {
  inputRef: React.RefObject<HTMLInputElement>;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error: boolean;
  touched: boolean;
  helperText?: string;
  type?: string;
  autoComplete?: string;
  [key: string]: any;
}) {
  const theme = useTheme();
  return (
    <TextField
      inputRef={inputRef}
      fullWidth
      label={label}
      value={value}
      onChange={onChange}
      error={error && touched}
      type={type}
      autoComplete={autoComplete}
      margin="normal"
      InputProps={{
        endAdornment: (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: touched ? 1 : 0, scale: touched ? 1 : 0.8 }}
            transition={{ duration: 0.2 }}
          >
            {error && touched ? <CancelIcon color="error" /> : touched ? <CheckCircleIcon color="success" /> : null}
          </motion.div>
        ),
        sx: {
          borderColor: error && touched
            ? theme.palette.error.main
            : touched
            ? theme.palette.success.main
            : theme.palette.grey[300],
          transition: 'border-color 0.3s',
        },
      }}
      helperText={
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: error && touched ? 1 : 0, y: error && touched ? 0 : 10 }}
          transition={{ duration: 0.2 }}
          aria-live="polite"
        >
          {error && touched ? helperText : ''}
        </motion.div>
      }
      {...props}
    />
  );
}

export function AuthForm({
  type,
  onSubmit,
  loading = false,
  showPassword = false,
  onTogglePassword,
  // formData: controlledFormData,   // تم التعطيل مؤقتاً
  // onFieldChange,                 // تم التعطيل مؤقتاً
  firstFieldRef,
}: AuthFormProps) {
  const t = useTranslations(`auth.${type}`);
  const [formData, setFormData] = useState<RegisterFormData | LoginFormData>(
    type === 'register'
      ? {
          username: '',
          email: '',
          password: '',
          confirmPassword: '',
          firstName: '',
          lastName: '',
          rememberMe: false,
          phone: '',
        }
      : {
          username: '',
          password: '',
          rememberMe: false,
        }
  );
  const [touched, setTouched] = useState<Touched>({});
  const [errors, setErrors] = useState<Errors>({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [defaultCountry] = useState<'PS'>('PS');

  // استخدم الحالة الداخلية فقط
  const effectiveFormData = formData;

  const setField = (field: keyof RegisterFormData | keyof LoginFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setTouched((prev: Touched) => ({ ...prev, [field]: true }));
  };

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setField(field as keyof RegisterFormData, value);
  };

  const handlePhoneChange = (value: string) => {
    setField('phone', value);
  };

  // دالة التحقق
  const validate: (field: string) => string = (field) => {
    if (type === 'register') {
      switch (field) {
        case 'firstName':
          return (effectiveFormData as RegisterFormData).firstName.trim() ? '' : t('firstName') + ' is required';
        case 'lastName':
          return (effectiveFormData as RegisterFormData).lastName.trim() ? '' : t('lastName') + ' is required';
        case 'username':
          return (effectiveFormData as RegisterFormData).username.length >= 3 ? '' : 'At least 3 characters';
        case 'email':
          return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test((effectiveFormData as RegisterFormData).email) ? '' : 'Invalid email address';
        case 'phone':
          return matchIsValidTel((effectiveFormData as RegisterFormData).phone) ? '' : 'Invalid phone number';
        case 'password':
          return (effectiveFormData as RegisterFormData).password.length >= 8 ? '' : 'At least 8 characters';
        case 'confirmPassword':
          return (effectiveFormData as RegisterFormData).confirmPassword === (effectiveFormData as RegisterFormData).password ? '' : 'Passwords do not match';
        default:
          return '';
      }
    } else {
      switch (field) {
        case 'username':
          return (effectiveFormData as LoginFormData).username.length >= 3 ? '' : 'At least 3 characters';
        case 'password':
          return (effectiveFormData as LoginFormData).password.length >= 8 ? '' : 'At least 8 characters';
        default:
          return '';
      }
    }
  };

  // تحقق من الأخطاء عند التغيير
  useEffect(() => {
    if (type !== 'register') return;
    const newErrors: Errors = {};
    (Object.keys(effectiveFormData) as (keyof RegisterFormData)[]).forEach((field) => {
      if (typeof (effectiveFormData as RegisterFormData)[field] === 'string' && (touched[field] || field === 'password' || field === 'confirmPassword')) {
        newErrors[field] = validate(field);
      }
    });
    setErrors(newErrors);
  }, [effectiveFormData, touched, type]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTouched: Touched = {};
    Object.keys(effectiveFormData).forEach((field) => { newTouched[field] = true; });
    setTouched(newTouched);
    const newErrors: Errors = {};
    if (type === 'register') {
      (Object.keys(effectiveFormData) as (keyof RegisterFormData)[]).forEach((field) => {
        if (typeof (effectiveFormData as RegisterFormData)[field] === 'string') newErrors[field] = validate(field);
      });
    } else {
      (['username', 'password'] as (keyof LoginFormData)[]).forEach((field) => {
        if (typeof (effectiveFormData as LoginFormData)[field] === 'string') newErrors[field] = validate(field);
      });
    }
    setErrors(newErrors);
    if (Object.values(newErrors).some(Boolean)) return;
    if (type === 'register') {
      onSubmit(effectiveFormData as RegisterFormData);
    } else {
      onSubmit(effectiveFormData as LoginFormData);
    }
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => setSnackbarOpen(false);

  // النصوص الافتراضية (Placeholders)
  const placeholders = {
    firstName: 'John',
    lastName: 'Doe',
    username: 'johndoe',
    email: 'john@example.com',
    phone: '+970 599 123 456',
    password: '••••••••',
    confirmPassword: '••••••••',
  };

  // Create refs for all fields
  const fieldRefs = {
    firstName: useRef<HTMLInputElement>(null),
    lastName: useRef<HTMLInputElement>(null),
    username: useRef<HTMLInputElement>(null),
    email: useRef<HTMLInputElement>(null),
    phone: useRef<HTMLInputElement>(null),
    password: useRef<HTMLInputElement>(null),
    confirmPassword: useRef<HTMLInputElement>(null),
  };

  // Auto-scroll/focus to first error
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      const firstErrorField = Object.keys(errors)[0];
      const ref = fieldRefs[firstErrorField as keyof typeof fieldRefs];
      if (ref && ref.current) {
        ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        ref.current.focus();
      }
    }
  }, [errors]);

  return (
    <Box>
      <Box component="form" onSubmit={handleSubmit} autoComplete="on" sx={{ maxWidth: 400, mx: 'auto' }}>
        {type === 'register' && (
          <>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <AnimatedTextField
                inputRef={fieldRefs.firstName}
                label={t('firstName')}
                value={(effectiveFormData as RegisterFormData).firstName}
                onChange={handleChange('firstName')}
                error={!!errors.firstName}
                touched={!!touched.firstName}
                helperText={errors.firstName}
                autoComplete="given-name"
                required
              />
              <AnimatedTextField
                inputRef={fieldRefs.lastName}
                label={t('lastName')}
                value={(effectiveFormData as RegisterFormData).lastName}
                onChange={handleChange('lastName')}
                error={!!errors.lastName}
                touched={!!touched.lastName}
                helperText={errors.lastName}
                autoComplete="family-name"
                required
              />
            </Box>
            <AnimatedTextField
              inputRef={fieldRefs.username}
              label={t('username')}
              value={effectiveFormData.username}
              onChange={handleChange('username')}
              error={!!errors.username}
              touched={!!touched.username}
              helperText={errors.username}
              autoComplete="username"
              required
            />
            <AnimatedTextField
              inputRef={fieldRefs.email}
              label={t('email')}
              value={(effectiveFormData as RegisterFormData).email}
              onChange={handleChange('email')}
              error={!!errors.email}
              touched={!!touched.email}
              helperText={errors.email}
              autoComplete="email"
              required
              type="email"
            />
            <MuiTelInput
              fullWidth
              label={t('phone') || 'Phone'}
              placeholder={placeholders.phone}
              value={(effectiveFormData as RegisterFormData).phone}
              onChange={handlePhoneChange}
              required
              autoComplete="tel"
              margin="normal"
              sx={{ mb: 2 }}
              defaultCountry={defaultCountry}
              error={!!errors.phone}
              inputRef={fieldRefs.phone}
            />
            <PasswordField
              label={t('password')}
              value={effectiveFormData.password}
              onChange={handleChange('password')}
              showPassword={showPassword}
              onTogglePassword={onTogglePassword}
              required
              sx={{ mb: 2 }}
              error={!!errors.password && touched.password}
              helperText={touched.password ? errors.password || undefined : undefined}
              autoComplete="new-password"
            />
            <PasswordField
              label={t('confirmPassword')}
              value={(effectiveFormData as RegisterFormData).confirmPassword}
              onChange={handleChange('confirmPassword')}
              showPassword={showPassword}
              onTogglePassword={onTogglePassword}
              required
              sx={{ mb: 3 }}
              error={!!errors.confirmPassword && touched.confirmPassword}
              helperText={touched.confirmPassword ? errors.confirmPassword || undefined : undefined}
              autoComplete="new-password"
            />
          </>
        )}
        {type === 'login' && (
          <>
            <AnimatedTextField
              inputRef={fieldRefs.username}
              label={t('username')}
              value={effectiveFormData.username || ''}
              onChange={handleChange('username')}
              error={!!errors.username}
              touched={!!touched.username}
              helperText={errors.username}
              autoComplete="username"
              required
            />
            <PasswordField
              label={t('password')}
              value={effectiveFormData.password || ''}
              onChange={handleChange('password')}
              showPassword={showPassword}
              onTogglePassword={onTogglePassword}
              required
              sx={{ mb: 3 }}
              error={!!errors.password && touched.password}
              helperText={touched.password ? errors.password || undefined : undefined}
              autoComplete="current-password"
            />
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <input
                type="checkbox"
                id="rememberMe"
                checked={!!effectiveFormData.rememberMe}
                onChange={handleChange('rememberMe')}
                style={{ marginRight: 8 }}
              />
              <label htmlFor="rememberMe" style={{ cursor: 'pointer' }}>{t('rememberMe')}</label>
            </Box>
          </>
        )}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          disabled={loading}
          sx={{ mb: 3, fontWeight: 700, fontSize: 18 }}
        >
          {loading ? t('loading') : t('submit')}
        </Button>
        <Divider sx={{ my: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {t('or')}
          </Typography>
        </Divider>
        <OAuthButtons />
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={t('success') || 'Registration successful! Please check your email for the activation code.'}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      />
    </Box>
  );
}
