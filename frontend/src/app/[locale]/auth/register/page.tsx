'use client';

import { useReducer, useRef, useEffect, useCallback , useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import {
  Box, Paper, Typography, Link, Alert, useMediaQuery, useTheme, CircularProgress, Stepper, Step, StepLabel, LinearProgress, Button, Fade
} from '@mui/material';
import { AuthForm } from '@/components/auth/AuthForm';
import type { RegisterFormData } from '@/components/auth/AuthForm';
import { useAuth } from '@/hooks/useAuth';
import LanguageSwitch from '@/components/LanguageSwitch';
import ThemeSwitch from '@/components/ThemeSwitch';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import * as Yup from 'yup';
import VisualSection from '@/components/auth/VisualSection';

// --- Step Definitions ---
const steps = ['Account', 'Contact', 'Confirm'];

// --- Validation Schema ---
const registerSchema = [
  Yup.object({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    username: Yup.string().min(3, 'At least 3 characters').required('Username is required'),
    password: Yup.string().min(8, 'At least 8 characters').required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords do not match')
      .required('Confirm your password'),
    rememberMe: Yup.boolean(),
  }),
  Yup.object({
    email: Yup.string().email('Invalid email address').required('Email is required'),
    phone: Yup.string().required('Phone is required'),
    rememberMe: Yup.boolean(),
  }),
];

// --- State & Reducer ---
interface State {
  step: number;
  formData: RegisterFormData;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  loading: boolean;
  showSuccess: boolean;
  error: string;
  direction: 'forward' | 'backward';
  shake: boolean;
}

type Action =
  | { type: 'FIELD_CHANGE'; field: keyof RegisterFormData; value: string | boolean }
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'SET_ERRORS'; errors: Record<string, string> }
  | { type: 'SET_TOUCHED'; field: keyof RegisterFormData }
  | { type: 'SET_LOADING'; loading: boolean }
  | { type: 'SET_SUCCESS'; showSuccess: boolean }
  | { type: 'SET_ERROR'; error: string }
  | { type: 'SET_SHAKE'; shake: boolean }
  | { type: 'RESET' };

const initialState: State = {
  step: 0,
  formData: {
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    rememberMe: false,
  },
  errors: {},
  touched: {},
  loading: false,
  showSuccess: false,
  error: '',
  direction: 'forward',
  shake: false,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'FIELD_CHANGE':
      return {
        ...state,
        formData: { ...state.formData, [action.field]: action.value },
        touched: { ...state.touched, [action.field]: true },
      };
    case 'NEXT_STEP':
      return { ...state, step: state.step + 1, direction: 'forward' };
    case 'PREV_STEP':
      return { ...state, step: state.step - 1, direction: 'backward' };
    case 'SET_ERRORS':
      return { ...state, errors: action.errors };
    case 'SET_TOUCHED':
      return { ...state, touched: { ...state.touched, [action.field]: true } };
    case 'SET_LOADING':
      return { ...state, loading: action.loading };
    case 'SET_SUCCESS':
      return { ...state, showSuccess: action.showSuccess };
    case 'SET_ERROR':
      return { ...state, error: action.error };
    case 'SET_SHAKE':
      return { ...state, shake: action.shake };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

export default function RegisterPage({ params }: { params: { locale: string } }) {
  const t = useTranslations('auth.register');
  const router = useRouter();
  const { register } = useAuth();
  const theme = useTheme();
  const isMdDown = useMediaQuery(theme.breakpoints.down('md'));
  const isLgUp = useMediaQuery(theme.breakpoints.up('lg'));
  const isRTL = t('dir', { default: 'ltr' }) === 'rtl' || theme.direction === 'rtl';
  const [state, dispatch] = useReducer(reducer, initialState);
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);

  // Focus management
  useEffect(() => {
    firstFieldRef.current?.focus();
  }, [state.step]);

  // Confetti on success
  useEffect(() => {
    if (state.showSuccess) {
      confetti({ particleCount: 120, spread: 90, origin: { y: 0.5 }, zIndex: 9999 });
    }
  }, [state.showSuccess]);

  // Shake animation for error feedback
  useEffect(() => {
    if (state.shake) {
      const timeout = setTimeout(() => dispatch({ type: 'SET_SHAKE', shake: false }), 500);
      return () => clearTimeout(timeout);
    }
  }, [state.shake]);

  // --- Validation ---
  const validateStep = useCallback(async () => {
    try {
      await registerSchema[state.step].validate(state.formData, { abortEarly: false });
      dispatch({ type: 'SET_ERRORS', errors: {} });
      return true;
    } catch (err: any) {
      const errors: Record<string, string> = {};
      if (err.inner) {
        err.inner.forEach((e: any) => {
          errors[e.path] = e.message;
        });
      }
      dispatch({ type: 'SET_ERRORS', errors });
      dispatch({ type: 'SET_SHAKE', shake: true });
      return false;
    }
  }, [state.formData, state.step]);

  // --- Handlers ---
  const handleFieldChange = useCallback((field: keyof RegisterFormData, value: string | boolean) => {
    dispatch({ type: 'FIELD_CHANGE', field, value });
  }, []);

  const handleNext = useCallback(async () => {
    const valid = await validateStep();
    if (valid) dispatch({ type: 'NEXT_STEP' });
  }, [validateStep]);

  const handleBack = useCallback(() => {
    dispatch({ type: 'PREV_STEP' });
  }, []);

  const handleSubmit = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', loading: true });
    dispatch({ type: 'SET_ERROR', error: '' });
    try {
      await register(state.formData);
      dispatch({ type: 'SET_SUCCESS', showSuccess: true });
      setTimeout(() => {
        router.push(`/${params.locale}/auth/verify-email`);
        dispatch({ type: 'RESET' });
      }, 1800);
    } catch (err) {
      dispatch({ type: 'SET_ERROR', error: err instanceof Error ? err.message : t('error.default') });
    } finally {
      dispatch({ type: 'SET_LOADING', loading: false });
    }
  }, [register, state.formData, router, params.locale, t]);

  // --- Progress Calculation ---
  const progress = Math.round(((state.step + 1) / steps.length) * 100);

  // --- Animated Stepper ---
  const StepperComponent = (
    <Stepper activeStep={state.step} alternativeLabel sx={{ mb: 3 }}>
      {steps.map((label, idx) => (
        <Step key={label} completed={state.step > idx}>
          <StepLabel>{t(label.toLowerCase())}</StepLabel>
        </Step>
      ))}
    </Stepper>
  );

  // --- Animated Progress Bar ---
  const ProgressBar = (
    <Fade in>
      <LinearProgress variant="determinate" value={progress} sx={{ height: 6, borderRadius: 3, mb: 2 }} />
    </Fade>
  );

  // --- Animated Button ---
  const NextButton = (
    <Button
      variant="contained"
      color="primary"
      onClick={handleNext}
      disabled={state.loading}
      sx={{ minWidth: 120, fontWeight: 700, fontSize: 18, mt: 2 }}
    >
      {state.loading ? <CircularProgress size={24} color="inherit" /> : t('next', { default: 'Next' })}
    </Button>
  );

  const SubmitButton = (
    <Button
      variant="contained"
      color="success"
      onClick={handleSubmit}
      disabled={state.loading}
      sx={{ minWidth: 120, fontWeight: 700, fontSize: 18, mt: 2 }}
    >
      {state.loading ? <CircularProgress size={24} color="inherit" /> : t('submit', { default: 'Register' })}
    </Button>
  );

  // --- Animated Success ---
  const SuccessAnimation = (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.5, type: 'spring' }}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 20,
        background: 'rgba(255,255,255,0.96)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <motion.svg width={96} height={96} viewBox="0 0 96 96" initial={{ rotate: -30 }} animate={{ rotate: 0 }} transition={{ duration: 0.5, type: 'spring' }}>
        <circle cx={48} cy={48} r={44} fill="#e6f7e6" />
        <motion.path
          d="M32 52l12 12 20-24"
          fill="none"
          stroke="#21b573"
          strokeWidth={6}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        />
      </motion.svg>
      <Typography variant="h5" color="success.main" sx={{ mt: 2, mb: 1, fontWeight: 700 }}>
        {t('success', { default: 'Registration Successful!' })}
      </Typography>
      <Typography variant="body2" color="text.secondary" align="center">
        {t('successDesc', { default: 'Redirecting to verification...' })}
      </Typography>
    </motion.div>
  );

  // Logo animation component
  const LogoWithAnimation: React.FC<{ size?: number; isMdDown?: boolean }> = ({ size = 250, isMdDown = false }) => {
    interface RippleType {
      x: number;
      y: number;
      size: number;
      key: number;
    }
    const [ripple, setRipple] = useState<RippleType | null>(null);
    const [isHovered, setIsHovered] = useState<boolean>(false);

    const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
      const target = e.currentTarget;
      const rect = target.getBoundingClientRect();
      const rippleSize = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - rippleSize / 2;
      const y = e.clientY - rect.top - rippleSize / 2;
      setRipple({ x, y, size: rippleSize, key: Date.now() });
      setTimeout(() => setRipple(null), 600);
    }, []);

    return (
      <Box
        sx={{
          position: 'relative',
          width: size,
          height: size,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: isMdDown ? '0 auto 2rem' : '0 auto',
          cursor: 'pointer',
          overflow: 'hidden',
        }}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label="Logo animation"
      >
        {ripple && (
          <Box
            key={ripple.key}
            sx={{
              position: 'absolute',
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              transform: 'scale(0)',
              animation: 'ripple 600ms linear',
              width: ripple.size,
              height: ripple.size,
              left: ripple.x,
              top: ripple.y,
              pointerEvents: 'none',
              '@keyframes ripple': {
                to: {
                  transform: 'scale(4)',
                  opacity: 0,
                },
              },
            }}
          />
        )}
        <Box
          component="svg"
          width="100%"
          height="100%"
          viewBox="0 0 250 250"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 1,
            transform: isHovered ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          {(() => {
            const normalColors = ['#FF0000', '#FFFF00', '#FFA500', '#FFFF00'];
            const hoverColors = ['#FFA500', '#008000', '#FFFF00', '#008000'];
            const strokeWidth = isHovered ? 16 : 8;
            const colors = isHovered ? hoverColors : normalColors;
            return [0, 1, 2, 3].map((i) => (
              <Box
                key={i}
                component="path"
                className={`arc arc${i + 1}`}
                d={`M ${125 + 105 * Math.cos(i * Math.PI / 2)} ${125 + 105 * Math.sin(i * Math.PI / 2)}
                A 105 105 0 0 1 ${125 + 105 * Math.cos((i + 1) * Math.PI / 2)} ${125 + 105 * Math.sin((i + 1) * Math.PI / 2)}`}
                sx={{
                  strokeWidth,
                  fill: 'none',
                  strokeLinecap: 'round',
                  strokeDasharray: isHovered ? '160 0' : '0 1',
                  stroke: colors[i],
                  transition: 'stroke 0.6s ease, stroke-dasharray 1.2s ease, stroke-width 0.6s',
                }}
              />
            ));
          })()}
        </Box>
        <Box
          sx={{
            position: 'relative',
            zIndex: 2,
            width: '80%',
            height: '80%',
            borderRadius: '50%',
            overflow: 'hidden',
            background: theme.palette.background.paper,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 2,
            boxShadow: theme.shadows[2],
          }}
        >
          <Image
            src="/image/logo/big.png"
            alt="Logo"
            width={200}
            height={200}
            style={{
              objectFit: 'contain',
              width: '100%',
              height: '100%',
            }}
          />
        </Box>
      </Box>
    );
  };

  // --- Main Render ---
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: isLgUp ? (isRTL ? 'row-reverse' : 'row') : 'column' }}>
      {/* Left/Form Section */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          px: { xs: 2, md: 6, lg: 10 },
          py: { xs: 4, md: 8 },
          minWidth: 0,
          position: 'relative',
        }}
      >
        <Box sx={{ position: 'absolute', top: 16, left: 16 }}>
          <LanguageSwitch />
        </Box>
        <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
          <ThemeSwitch />
        </Box>
        {state.loading && (
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', position: 'absolute', bottom: 24, left: 0 }}>
            <CircularProgress color="primary" />
          </Box>
        )}
        <div ref={errorRef} aria-live="assertive" style={{ position: 'absolute', left: -9999, height: 1, width: 1, overflow: 'hidden' }}>{state.error}</div>
        {isMdDown && <LogoWithAnimation size={150} isMdDown />}
        <Paper elevation={3} sx={{ width: '100%', maxWidth: 480, p: { xs: 3, md: 5 }, borderRadius: 4, position: 'relative', overflow: 'hidden', minHeight: 340 }}>
          {ProgressBar}
          {StepperComponent}
          <AnimatePresence>
            {state.showSuccess && SuccessAnimation}
          </AnimatePresence>
          <motion.div
            key={state.step}
            animate={state.shake ? { x: [0, -16, 16, -12, 12, -6, 6, 0] } : { x: 0 }}
            transition={{ duration: 0.5, type: 'spring' }}
          >
            <Typography variant="h4" component="h1" gutterBottom align="center">
              {t('title')}
            </Typography>
            {state.error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {state.error}
              </Alert>
            )}
            {state.step === 0 && (
              <AuthForm
                type="register"
                onSubmit={handleNext}
                loading={state.loading}
                formData={state.formData}
                onFieldChange={handleFieldChange}
                firstFieldRef={firstFieldRef}
                errors={state.errors}
                touched={state.touched}
              />
            )}
            {state.step === 1 && (
              <AuthForm
                type="register"
                onSubmit={handleNext}
                loading={state.loading}
                formData={state.formData}
                onFieldChange={handleFieldChange}
                firstFieldRef={firstFieldRef}
                errors={state.errors}
                touched={state.touched}
              />
            )}
            {state.step === 2 && (
              <Box>
                <Typography variant="h6" align="center" sx={{ mb: 2 }}>{t('confirmTitle', { default: 'Confirm your details' })}</Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography><b>{t('firstName')}:</b> {state.formData.firstName}</Typography>
                  <Typography><b>{t('lastName')}:</b> {state.formData.lastName}</Typography>
                  <Typography><b>{t('username')}:</b> {state.formData.username}</Typography>
                  <Typography><b>{t('email')}:</b> {state.formData.email}</Typography>
                  <Typography><b>{t('phone')}:</b> {state.formData.phone}</Typography>
                </Box>
                {SubmitButton}
              </Box>
            )}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Box>
                {state.step > 0 && (
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.92 }}
                    onClick={handleBack}
                    style={{ fontWeight: 600, fontSize: 16, background: 'none', border: 'none', color: theme.palette.primary.main, cursor: 'pointer' }}
                  >
                    {t('back', { default: 'Back' })}
                  </motion.button>
                )}
              </Box>
              <Box>
                {state.step < steps.length - 1 && NextButton}
              </Box>
            </Box>
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                {t('hasAccount')}{' '}
                <Link href={`/${params.locale}/auth/login`}>
                  {t('signIn')}
                </Link>
              </Typography>
            </Box>
          </motion.div>
        </Paper>
      </Box>
      {/* Right/Visual Section (hidden on mdDown) */}
      <VisualSection
        t={t}
        isMdDown={isMdDown}
        LogoWithAnimation={LogoWithAnimation}
      />
    </Box>
  );
}