'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Box,
  Paper,
  Typography,
  Container,
  Alert,
  CircularProgress,
  Link,
} from '@mui/material';
import { useAuth } from '@/hooks/useAuth';

export default function OAuthCallbackPage({ params }: { params: { locale: string } }) {
  const t = useTranslations('auth.oauth');
  const router = useRouter();
  const searchParams = useSearchParams();
  const { handleOAuthCallback } = useAuth();
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get('code');
        const error = searchParams.get('error');
        const state = searchParams.get('state');

        if (error) {
          setError(t('error.oauthError'));
          setLoading(false);
          return;
        }

        if (!code) {
          setError(t('error.noCode'));
          setLoading(false);
          return;
        }

        await handleOAuthCallback({ code, state });
        router.push('/');
      } catch (err) {
        setError(err instanceof Error ? err.message : t('error.default'));
        setLoading(false);
      }
    };

    handleCallback();
  }, [searchParams, handleOAuthCallback, router, t]);

  if (loading) {
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
              textAlign: 'center',
            }}
          >
            <CircularProgress sx={{ mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              {t('processing')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('pleaseWait')}
            </Typography>
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
          }}
        >
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
          
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
            {t('error.description')}
          </Typography>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              {t('tryAgain')}{' '}
              <Link href={`/${params.locale}/auth/login`} style={{ color: 'inherit' }}>
                {t('backToLogin')}
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
} 