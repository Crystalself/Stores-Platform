'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Box, Paper, Typography, Link, Alert,
} from '@mui/material';
import { AuthForm } from '@/components/auth/AuthForm';
import { useAuth } from '@/hooks/useAuth';
import LanguageSwitch from '@/components/LanguageSwitch';
import ThemeSwitch from '@/components/ThemeSwitch';
import Image from 'next/image';
import { useTheme, useMediaQuery } from '@mui/material';
import VisualSection from '@/components/auth/VisualSection';

export default function LoginPage({ params }: { params: { locale: string } }) {
  const t = useTranslations('auth.login');
  const rt =useTranslations('auth.register');
  const router = useRouter();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const isMdDown = useMediaQuery(theme.breakpoints.down('md'));

  const handleSubmit = async (formData: { username: string; password: string; rememberMe: boolean }) => {
    setLoading(true);
    setError('');

    try {
      await login(formData.username, formData.password, formData.rememberMe);
      router.push(`/${params.locale}/customer`);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('error.default'));
    } finally {
      setLoading(false);
    }
  };

  // Dummy LogoWithAnimation for login page
  const LogoWithAnimation = ({ size = 250, isMdDown = false }) => {
    interface RippleType {
      x: number;
      y: number;
      size: number;
      key: number;
    }
    const [ripple, setRipple] = useState<RippleType | null>(null);
    const [isHovered, setIsHovered] = useState(false);

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
      const target = e.currentTarget;
      const rect = target.getBoundingClientRect();
      const rippleSize = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - rippleSize / 2;
      const y = e.clientY - rect.top - rippleSize / 2;

      setRipple({
        x,
        y,
        size: rippleSize,
        key: Date.now(),
      });

      setTimeout(() => setRipple(null), 600);
    };

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
            // Hardcoded color arrays for each arc, in order
            const normalColors = ['#FF0000', '#FFFF00', '#FFA500', '#FFFF00']; // red, yellow, orange, yellow
            const hoverColors = ['#FFA500', '#008000', '#FFFF00', '#008000']; // orange, green, yellow, green
            const strokeWidth = isHovered ? 16 : 8;
            const colors = isHovered ? hoverColors : normalColors;
            return [0, 1, 2, 3].map((i) => (
              <Box
                key={i}
                component="path"
                className={`arc arc${i + 1}`}
                d={`M ${125 + 105 * Math.cos(i * Math.PI / 2)} ${125 + 105 * Math.sin(i * Math.PI / 2)}
                A 105 105 0 0 1 ${125 + 105 * Math.cos((i + 1) * Math.PI / 2)} ${125 + 105 * Math.sin((i + 1) * Math.PI / 2)}`} sx={{
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

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: isMdDown ? 'column' : 'row',
        alignItems: 'stretch',
        justifyContent: 'center',
        py: 0,
      }}
    >
      {/* Left/Form Section */}
      <Box sx={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', px: { xs: 0, md: 4 } }}>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: '100%',
            maxWidth: 400,
            position: 'relative',
          }}
        >
          <Box sx={{ position: 'absolute', top: 16, left: 16 }}>
            <LanguageSwitch />
          </Box>
          <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
            <ThemeSwitch />
          </Box>
          {/* Logo above Sign In on small screens */}
          {isMdDown && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>

              <Box sx={{ position: 'relative', width: 90, height: 90, display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="logo-frame-hover-group">
                <LogoWithAnimation size={80} />
              </Box>

            </Box>
          )}
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              align="center"
              sx={(theme) => ({
                backgroundColor: theme.palette.mode === 'dark' ? '#353942' : '#f2f6ff',
                color: theme.palette.mode === 'dark'
                  ? theme.palette.primary.contrastText
                  : theme.palette.primary.main,
                py: 1,
                borderRadius: 2,
                boxShadow: theme.palette.mode === 'dark'
                  ? '0 2px 8px 0 rgba(44,47,54,0.18)'
                  : '0 2px 8px 0 rgba(33,86,248,0.08)',
                display: 'inline-block',
                mb: 1,
                mx: 'auto', // يجعلها في المنتصف عند inline-block
              })}
            >
              {t('title')}
            </Typography>
          </Box>

          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
            {t('subtitle')}
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <AuthForm
            type="login"
            onSubmit={handleSubmit}
            loading={loading}
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword(!showPassword)}
          />
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Link href={`/${params.locale}/auth/forgot-password`} variant="body2">
              {t('forgotPassword')}
            </Link>
          </Box>
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              {t('noAccount')}{' '}
              <Link href={`/${params.locale}/auth/register`}>
                {t('createAccount')}
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Box>

      {/* Right/Visual Section (hidden on mdDown) */}
      <VisualSection
        t={rt}
        isMdDown={isMdDown}
        LogoWithAnimation={LogoWithAnimation}
      />
    </Box>
  );
} 