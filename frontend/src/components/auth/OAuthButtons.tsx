'use client';

import { useTranslations } from 'next-intl';
import {
  Box,
  Button,
  Typography,
} from '@mui/material';
import { Google, Facebook } from '@mui/icons-material';
import { useAuth } from '@/hooks/useAuth';

export function OAuthButtons() {
  const t = useTranslations('auth.oauth');
  const { loginWithGoogle, loginWithFacebook } = useAuth();

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (error) {
      console.error('Google login failed:', error);
    }
  };

  const handleFacebookLogin = async () => {
    try {
      await loginWithFacebook();
    } catch (error) {
      console.error('Facebook login failed:', error);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent:'space-between'}}>
      <Button
        variant="outlined"
        startIcon={<Google />}
        onClick={handleGoogleLogin}
        sx={{
          borderColor: '#db4437',
          color: '#db4437',
          '&:hover': {
            borderColor: '#c23321',
            backgroundColor: 'rgba(219, 68, 55, 0.04)',
          },
          marginX:3
        }}
      >
        <Typography sx={{marginX:1}} variant="body2">
          {t('continueWithGoogle')}
        </Typography>
      </Button>

      <Button
        variant="outlined"
        startIcon={<Facebook />}
        onClick={handleFacebookLogin}
        sx={{
          borderColor: '#4267B2',
          color: '#4267B2',
          '&:hover': {
            borderColor: '#365899',
            backgroundColor: 'rgba(66, 103, 178, 0.04)',
          },
        }}
      >
        <Typography sx={{marginX:1 }} variant="body2">
        {t('continueWithFacebook')}
        </Typography>
      </Button>
    </Box>
  );
} 