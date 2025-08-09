'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useTranslations } from 'next-intl';
import {
  Box,
  Typography,
  Container,
  Grid,
  alpha,
  useTheme,
} from '@mui/material';
import { motion, AnimatePresence, useInView } from 'framer-motion';

// --- Icons ---
import SecurityIcon from '@mui/icons-material/Security';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import HeadsetMicIcon from '@mui/icons-material/HeadsetMic';
import HighQualityIcon from '@mui/icons-material/HighQuality';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import EnergySavingsLeafIcon from '@mui/icons-material/EnergySavingsLeaf';
import GroupsIcon from '@mui/icons-material/Groups';
import ReplayIcon from '@mui/icons-material/Replay';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';

// --- Types ---
type TrustFeature = {
  id: number;
  key: string;
  icon: JSX.Element;
  animationType: keyof typeof animations;
};

// --- Animations ---
const animations = {
  bubble: {
    initial: { scale: 0, opacity: 0 },
    animate: {
      scale: 1,
      opacity: 1,
      transition: { type: 'spring', stiffness: 150, damping: 15 },
    },
    exit: { scale: 0, opacity: 0, transition: { duration: 0.3 } },
  },
  thrown: {
    initial: { x: '-100vw', y: '-100vh', rotate: -180, opacity: 0 },
    animate: {
      x: 0,
      y: 0,
      rotate: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 40, damping: 10 },
    },
    exit: { scale: 0, opacity: 0, transition: { duration: 0.3 } },
  },
  'collide-left': {
    initial: { x: '-100vw', scale: 0.5, opacity: 0 },
    animate: {
      x: 0,
      scale: 1,
      opacity: 1,
      transition: { type: 'spring', stiffness: 50, damping: 12 },
    },
    exit: { scale: 0, opacity: 0, transition: { duration: 0.3 } },
  },
  'collide-right': {
    initial: { x: '100vw', scale: 0.5, opacity: 0 },
    animate: {
      x: 0,
      scale: 1,
      opacity: 1,
      transition: { type: 'spring', stiffness: 50, damping: 12 },
    },
    exit: { scale: 0, opacity: 0, transition: { duration: 0.3 } },
  },
};

// --- Custom Hook ---
const useShuffledFeatures = (features: TrustFeature[], interval: number) => {
  const [shuffled, setShuffled] = useState<TrustFeature[]>([]);

  useEffect(() => {
    const update = () => {
      const copy = [...features];
      const newShuffle = copy.sort(() => Math.random() - 0.5).slice(0, 4);
      setShuffled(newShuffle);
    };
    update();
    const timer = setInterval(update, interval);
    return () => clearInterval(timer);
  }, [features, interval]);

  return shuffled;
};

// --- Card Component ---
const FeatureCard = ({
  feature,
  t,
  theme,
}: {
  feature: TrustFeature;
  t: ReturnType<typeof useTranslations>;
  theme: ReturnType<typeof useTheme>;
}) => (
  <motion.div
    key={feature.id}
    variants={animations[feature.animationType]}
    initial="initial"
    animate="animate"
    exit="exit"
    style={{ perspective: 800, width: '100%', height: '100%' }}
  >
    <motion.div
      style={{ width: '100%', height: '100%', transformStyle: 'preserve-3d' }}
      whileHover={{ rotateY: 10, rotateX: -10 }}
    >
      <Box
        sx={{
          p: 4,
          textAlign: 'center',
          borderRadius: 4,
          bgcolor: alpha(theme.palette.background.paper, 0.85),
          backdropFilter: 'blur(14px)',
          border: '1px solid',
          borderColor: alpha(theme.palette.divider, 0.1),
          boxShadow: `0 12px 36px -8px ${alpha(theme.palette.common.black, 0.2)}`,
          '&:hover': {
            boxShadow: `0 24px 48px -12px ${alpha(theme.palette.common.black, 0.3)}`,
          },
        }}
      >
        <Box sx={{ fontSize: 64, mb: 2, color: 'secondary.main' }}>
          {feature.icon}
        </Box>
        <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
          {t(`${feature.key}.title`)}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t(`${feature.key}.description`)}
        </Typography>
      </Box>
    </motion.div>
  </motion.div>
);

// --- Main Component ---
export default function TrustSection() {
  const t = useTranslations('TrustSection');
  const theme = useTheme();

  const features = useMemo<TrustFeature[]>(
    () => [
      { id: 1, key: 'securePayment', icon: <SecurityIcon fontSize="inherit" />, animationType: 'bubble' },
      { id: 2, key: 'fastDelivery', icon: <LocalShippingIcon fontSize="inherit" />, animationType: 'thrown' },
      { id: 3, key: 'authenticProducts', icon: <VerifiedUserIcon fontSize="inherit" />, animationType: 'collide-left' },
      { id: 4, key: 'customerSupport', icon: <HeadsetMicIcon fontSize="inherit" />, animationType: 'collide-right' },
      { id: 5, key: 'qualityGuarantee', icon: <HighQualityIcon fontSize="inherit" />, animationType: 'bubble' },
      { id: 6, key: 'exclusiveOffers', icon: <LocalOfferIcon fontSize="inherit" />, animationType: 'thrown' },
      { id: 7, key: 'ecoFriendly', icon: <EnergySavingsLeafIcon fontSize="inherit" />, animationType: 'collide-left' },
      { id: 8, key: 'communitySupport', icon: <GroupsIcon fontSize="inherit" />, animationType: 'collide-right' },
      { id: 9, key: 'easyReturns', icon: <ReplayIcon fontSize="inherit" />, animationType: 'bubble' },
      { id: 10, key: 'premiumSelection', icon: <WorkspacePremiumIcon fontSize="inherit" />, animationType: 'thrown' },
    ],
    []
  );

  const visible = useShuffledFeatures(features, 240000); // كل 4 دقائق

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <Box
      ref={ref}
      sx={{
        position: 'relative',
        overflow: 'hidden',
        py: { xs: 8, md: 12 },
        bgcolor: theme.palette.mode === 'dark' ? '#0a0a10' : '#f7f9fc',
      }}
    >
      {/* Rotating Background Circles */}
      <Box
        component={motion.div}
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 50, ease: 'linear' }}
        sx={{
          position: 'absolute',
          top: '-20%',
          left: '-20%',
          width: 400,
          height: 400,
          borderRadius: '50%',
          bgcolor: alpha(theme.palette.primary.main, 0.05),
          filter: 'blur(100px)',
        }}
      />
      <Box
        component={motion.div}
        animate={{ rotate: -360 }}
        transition={{ repeat: Infinity, duration: 60, ease: 'linear' }}
        sx={{
          position: 'absolute',
          bottom: '-20%',
          right: '-20%',
          width: 400,
          height: 400,
          borderRadius: '50%',
          bgcolor: alpha(theme.palette.secondary.main, 0.05),
          filter: 'blur(100px)',
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative' }}>
        <Typography
          component={motion.h2}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          variant="h3"
          sx={{ textAlign: 'center', fontWeight: 800, mb: 8 }}
        >
          {t('title')}
        </Typography>

        {isInView && (
          <Grid
            container
            spacing={4}
            justifyContent="center"
            alignItems="center"
          >
            <AnimatePresence mode="wait" initial={false}>
              {visible.map((feature) => (
                <Grid
                  key={feature.id}
                  item
                  xs={12}
                  sm={6}
                  md={3}
                  sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <FeatureCard feature={feature} t={t} theme={theme} />
                </Grid>
              ))}
            </AnimatePresence>
          </Grid>
        )}
      </Container>
    </Box>
  );
}
