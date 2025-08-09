// src/components/sections/HeroSection.tsx
'use client';

import { Box, Button, Container, Grid, Typography, Avatar, AvatarGroup } from '@mui/material';
import { motion, useAnimation } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect } from 'react';
import Link from 'next/link';

// --- استيراد البيانات الوهمية ---
import { mockUsers } from '@/lib/mockUsers'; // تأكد من أن المسار صحيح

// Icons
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// --- (1) مكون لتأثير الصاعقة المتعرجة ---
const LightningBolt = ({ controls }: { controls: any }) => (
    <Box
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={controls}
        sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 10,
        }}
    >
        <motion.svg width="200" height="100" viewBox="0 0 200 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <motion.path
                d="M199 1L120 99L140 40L60 99L80 1H199Z"
                stroke="white"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: [0, 1, 0] }}
                transition={{ duration: 0.7, ease: "easeInOut", times: [0, 0.5, 1] }}
                style={{
                    filter: `drop-shadow(0 0 5px #fff) drop-shadow(0 0 10px #FF5722)`,
                }}
            />
        </motion.svg>
    </Box>
);

export default function HeroSection() {
    const locale = useLocale();
    const t = useTranslations('HeroSection');

    const placeholderData = {
        headline: t('headline'),
        gradientText: t('gradientText'),
        features: t.raw('features'),
        primaryCta: t('primaryCta'),
        secondaryCta: t('secondaryCta'),
        socialProofText: t('socialProofText'),
    };

    const textControls = useAnimation();
    const imageControls = useAnimation();
    const boltControls = useAnimation();

    useEffect(() => {
        const sequence = async () => {
            await boltControls.start({ opacity: 1 });
            await Promise.all([
                textControls.start({ x: 0, transition: { type: 'spring', stiffness: 50, delay: 0.2 } }),
                imageControls.start({ x: 0, transition: { type: 'spring', stiffness: 50, delay: 0.2 } }),
            ]);
        };
        sequence();
    }, [textControls, imageControls, boltControls]);

    return (
        <Box
            sx={{
                position: 'relative',
                overflow: 'hidden',
                // --- (2) خلفية متجاوبة مع الثيم ---
                background: (theme) => theme.palette.mode === 'dark'
                    ? 'linear-gradient(135deg, #10101a 0%, #0a0a10 100%)'
                    : 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
                color: 'text.primary',
                py: { xs: 8, md: 12 },
            }}
        >
            <Box
                sx={{
                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                    // --- (2) تأثير إضاءة متجاوب مع الثيم ---
                    background: (theme) => theme.palette.mode === 'dark'
                        ? 'radial-gradient(circle at 30% 70%, rgba(255, 87, 34, 0.15) 0%, rgba(255, 87, 34, 0) 60%)'
                        : 'radial-gradient(circle at 30% 70%, rgba(255, 87, 34, 0.1) 0%, rgba(255, 87, 34, 0) 50%)',
                    animation: 'aurora 20s infinite alternate',
                    '@keyframes aurora': {
                        '0%': { transform: 'scale(1) rotate(0deg)', opacity: 0.5 },
                        '100%': { transform: 'scale(1.5) rotate(90deg)', opacity: 1 },
                    },
                }}
            />

            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
                <Grid container spacing={{ xs: 8, md: 4 }} alignItems="center" justifyContent="center">
                    
                    <LightningBolt controls={boltControls} />

                    <Grid item xs={12} md={6} sx={{ textAlign: { xs: 'center', md: 'start' } }}>
                        <motion.div
                            initial={{ x: locale === 'ar' ? '25%' : '-25%' }}
                            animate={textControls}
                        >
                            <motion.div initial={{ x: locale === 'ar' ? '100%' : '-100%', opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.8, duration: 0.7 }}>
                                <Typography variant="h2" component="h1" sx={{ fontWeight: 800, mb: 2 }}>
                                    {placeholderData.headline}{' '}
                                    <Typography component="span" variant="inherit" sx={{ background: 'linear-gradient(90deg, #FF5722, #FF8A65)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                        {placeholderData.gradientText}
                                    </Typography>
                                </Typography>
                            </motion.div>

                            <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1, delayChildren: 1.2 } } }}>
                                {placeholderData.features.map((feature: string, index: number) => (
                                    <motion.div key={index} variants={{ hidden: { y: -20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1, justifyContent: { xs: 'center', md: 'flex-start' } }}>
                                            <CheckCircleIcon color="secondary" />
                                            <Typography variant="h6" sx={{ color: 'text.secondary' }}>{feature}</Typography>
                                        </Box>
                                    </motion.div>
                                ))}
                            </motion.div>
                            
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8, duration: 0.5 }}>
                                <Box sx={{ mt: 4, display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: { xs: 'center', md: 'flex-start' } }}>
                                    <Button variant="outlined" color="inherit" size="large" sx={{ px: 4, py: 1.5, borderRadius: '8px', '&:hover': { bgcolor: 'action.hover' } }}>
                                        {placeholderData.secondaryCta}
                                    </Button>
                                </Box>
                                <Box sx={{ mt: 5, display: 'flex', alignItems: 'center', gap: 2, justifyContent: { xs: 'center', md: 'flex-start' } }}>
                                    <AvatarGroup max={4}>
                                        {mockUsers.slice(0, 4).map(user => (
                                            <Avatar key={user.id} alt={user.username} src={user.profilePic} />
                                        ))}
                                    </AvatarGroup>
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>{placeholderData.socialProofText}</Typography>
                                </Box>
                            </motion.div>
                        </motion.div>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                        <motion.div
                            initial={{ x: locale === 'ar' ? '-25%' : '25%' }}
                            animate={imageControls}
                            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                        >
                            <motion.div
                                initial={{ y: 50, opacity: 0, rotate: -15 }}
                                animate={{ y: 0, opacity: 1, rotate: 0 }}
                                transition={{ delay: 0.8, duration: 1 }}
                                whileHover={{ y: -10, scale: 1.05, transition: { type: 'spring', stiffness: 200 } }}
                            >
                                <Box
                                    component="img"
                                    src="/image/logo/gaza.png"
                                    alt="Gaza Store Logo"
                                    sx={{
                                        width: { xs: 280, sm: 350, md: 400 },
                                        height: 'auto',
                                        filter: 'drop-shadow(0px 20px 30px rgba(0,0,0,0.3))',
                                        transition: 'filter 0.3s ease',
                                        '&:hover': { filter: 'drop-shadow(0px 20px 30px rgba(0,0,0,0.3)) saturate(1.2)' }
                                    }}
                                />
                            </motion.div>
                            <Button
                                component={Link}
                                href={`/${locale}/proudcts`}
                                variant="contained"
                                color="primary"
                                size="large"
                                endIcon={<ArrowForwardIcon />}
                                sx={{
                                    mt: 4, px: 5, py: 1.5, borderRadius: '50px', fontWeight: 'bold',
                                    animation: 'pulse 2s infinite',
                                    '@keyframes pulse': {
                                        '0%': { boxShadow: '0 0 0 0 rgba(255, 87, 34, 0.7)' },
                                        '70%': { boxShadow: '0 0 0 15px rgba(255, 87, 34, 0)' },
                                        '100%': { boxShadow: '0 0 0 0 rgba(255, 87, 34, 0)' },
                                    }
                                }}
                            >
                                {placeholderData.primaryCta}
                            </Button>
                        </motion.div>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}   