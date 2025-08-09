'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Box, Paper, TextField, Button, Typography, Container, Link, Alert, CircularProgress,} from '@mui/material';
import { useAuth } from '@/hooks/useAuth';
import LanguageSwitch from '@/components/LanguageSwitch';
import ThemeSwitch from '@/components/ThemeSwitch';

export default function ForgotPasswordPage({ params }: { params: { locale: string } }) {
  const t = useTranslations('auth.forgotPassword');
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await forgotPassword(email);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('error.default'));
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Container maxWidth="sm">
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            py: 4,
          }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 4,
              width: '100%',
              maxWidth: 400,
            }}
          >
            <Alert severity="success" sx={{ mb: 2 }}>
              {t('success.message')}
            </Alert>
            
            <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
              {t('success.description')}
            </Typography>

            <Box sx={{ textAlign: 'center' }}>
              <Link href={`/${params.locale}/auth/login`} variant="body2">
                {t('backToLogin')}
              </Link>
            </Box>
          </Paper>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4,
        }}
      >
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
          <Typography variant="h4" component="h1" gutterBottom align="center">
            {t('title')}
          </Typography>
          
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
            {t('subtitle')}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label={t('email')}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              sx={{ mb: 3 }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ mb: 2 }}
            >
              {loading ? t('sending') : t('sendResetLink')}
            </Button>
          </Box>

          <Box sx={{ textAlign: 'center' }}>
            <Link href={`/${params.locale}/auth/login`} variant="body2">
              {t('backToLogin')}
            </Link>
          </Box>

          {loading && (
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', position: 'absolute', bottom: 24, left: 0 }}>
              <CircularProgress color="primary" />
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
} 