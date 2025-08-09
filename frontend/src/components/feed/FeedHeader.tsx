import React from 'react';
import { Box, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

const FeedHeader = () => {
  const t = useTranslations('FeedPage');

  return (
    <Box sx={{ textAlign: 'center', mb: 4, mt: 4 }}>
      <Typography
        variant="h1"
        fontWeight="bold"
        suppressHydrationWarning
        tabIndex={0}
        aria-label="عنوان صفحة المنتجات"
        sx={{
          mb: 1,
          letterSpacing: 2,
          fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
          userSelect: 'none',
          lineHeight: 1.1,
          textShadow: '0 2px 16px rgba(0,0,0,0.10), 0 1px 1px rgba(0,0,0,0.08)',
          fontFamily: '"Montserrat", "Roboto", Arial, sans-serif',
          background: 'linear-gradient(90deg, #6a11cb, #2575fc, #ff512f, #dd2476)',
          backgroundSize: '200% 200%',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          color: 'transparent',
          transition: 'background-position 0.7s',
          cursor: 'pointer',
          '&:hover': {
            backgroundPosition: '100% 0',
            animation: 'gradientMovePro 1.5s linear infinite',
            fontSize: { xs: '2.9rem', sm: '3.9rem', md: '4.9rem' },
          },
        }}
      >
        {t('showProducts', { default: 'عرض المنتجات' })}
      </Typography>

      <Typography
        variant="h5"
        tabIndex={0}
        aria-label="وصف صفحة المنتجات"
        sx={{
          fontWeight: 400,
          fontSize: { xs: '1.1rem', md: '1.7rem' },
          mt: 1,
          letterSpacing: 1,
          userSelect: 'none',
          textShadow: '0 1px 8px rgba(0,0,0,0.10)',
          fontFamily: '"Montserrat", "Roboto", Arial, sans-serif',
          background: 'linear-gradient(90deg, #6a11cb, #2575fc, #ff512f, #dd2476)',
          backgroundSize: '200% 200%',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          color: 'transparent',
          transition: 'background-position 0.7s',
          cursor: 'pointer',
          '&:hover': {
            backgroundPosition: '100% 0',
            animation: 'gradientMovePro 1.5s linear infinite',
          },
        }}
      >
        {t('subtitle', { default: 'Discover the latest products from different stores' })}
      </Typography>
    </Box>
  );
};

export default FeedHeader;