import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { motion } from 'framer-motion';


interface VisualSectionProps {
  t: (key: string) => string | React.ReactNode;
  isMdDown: boolean;
  LogoWithAnimation: React.FC<{ size?: number }>;
}

const VisualSection: React.FC<VisualSectionProps> = ({ t, isMdDown, LogoWithAnimation }) => {
  const theme = useTheme();

  if (isMdDown) return null;

  const isLight = theme.palette.mode === 'light';

  const textColor = isLight ? '#003366' : '#d0e8ff';
  const backgroundColor = isLight ? '#a0c4ff' : '#001f3f';

  // نمش كنقاط صغيرة عشوائية باستخدام radial-gradient صغيرة متكررة
  const frecklesBackground = `
    radial-gradient(circle 1.5px at 20% 25%, rgba(255, 200, 120, 0.7) 99%, transparent 100%),
    radial-gradient(circle 2px at 40% 60%, rgba(255, 220, 130, 0.5) 99%, transparent 100%),
    radial-gradient(circle 1px at 70% 40%, rgba(255, 210, 125, 0.6) 99%, transparent 100%),
    radial-gradient(circle 1.8px at 80% 70%, rgba(255, 195, 100, 0.6) 99%, transparent 100%)
  `;

  return (
    <motion.div
      initial={{ width: '50%' }}
      animate={{ width: '33%' }}
      transition={{ duration: 1.5, ease: 'easeInOut' }}
      style={{ display: 'flex' }}    >
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          position: 'relative',
          backgroundColor,
          backgroundImage: frecklesBackground,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          overflow: 'hidden',
          borderRadius: .5,
          boxShadow: isLight
            ? '0 0 20px 4px rgba(0, 0, 80, 0.7), inset 0 0 12px 6px rgba(255, 255, 255, 0.5)'
            : '0 0 25px 5px rgba(180, 210, 255, 0.8), inset 0 0 20px 8px rgba(120, 170, 255, 0.6)',
          padding: 3,
          minHeight: 400,
          userSelect: 'none',
          transition: 'background-color 0.4s ease',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            color: textColor,
            position: 'relative',
            zIndex: 1,
            paddingX: 2,
            paddingTop: 10,
            textAlign: 'center',
            gap: 4,
            marginTop: 5
          }}
        >
          <LogoWithAnimation size={isLight ? 220 : 180} />

          <Typography
            variant="h3"
            component="h1"
            fontWeight={900}
            sx={{
              mb: 1,
              letterSpacing: '0.05em',
              textShadow: isLight
                ? '1px 1px 2px rgba(0,0,0,0.2)'
                : '1px 1px 6px rgba(0,0,0,0.8)',
              userSelect: 'text',
            }}
          >
            {t('visualTitle')}
          </Typography>

          <Typography
            variant="h6"
            sx={{
              opacity: 0.85,
              fontWeight: 500,
              maxWidth: 360,
              userSelect: 'text',
              lineHeight: 1.4,
            }}
          >
            {t('visualSubtitle')}
          </Typography>
        </Box>
      </Box>
    </motion.div>
  );
};

export default VisualSection;
