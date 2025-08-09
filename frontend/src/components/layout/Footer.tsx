// src/components/layout/Footer.tsx
'use client';

import React from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Box, Container, Grid, Link as MuiLink, Typography, TextField, Button, IconButton, Stack, alpha } from '@mui/material';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion'; // <-- تم إصلاح الاستيراد هنا

// --- Icons ---
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import SendIcon from '@mui/icons-material/Send';
// --- Payment Icons (using placeholders for demonstration) ---
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

// --- Animation Variants ---
const iconVariants = {
    rest: { scale: 1, y: 0 },
    hover: { scale: 1.2, y: -4, transition: { type: 'spring', stiffness: 300 } },
};

const linkVariants = {
    rest: { x: 0 },
    hover: { x: -5, transition: { type: 'spring', stiffness: 400 } },
};

// --- Main Footer Component ---
export default function Footer() {
    const t = useTranslations('Footer');
    const locale = useLocale();
    const [subscribed, setSubscribed] = React.useState(false);

    const handleSubscribe = (event: React.FormEvent) => {
        event.preventDefault();
        setSubscribed(true);
        setTimeout(() => setSubscribed(false), 3000); // Reset after 3 seconds
    };

    const linkSections = t.raw('linkSections');
    const socialLinks = t.raw('socialLinks');

    return (
        <Box component="footer" sx={{
            position: 'relative',
            overflow: 'hidden',
            bgcolor: (theme) => theme.palette.mode === 'dark' ? '#10101a' : '#f4f6f8',
            color: 'text.secondary',
        }}>
            {/* Animated Background Shapes */}
            <Box component={motion.div} animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 60, ease: 'linear' }}
                sx={{ position: 'absolute', top: '10%', left: '-10%', width: '300px', height: '300px', borderRadius: '50%', bgcolor: (theme) => alpha(theme.palette.primary.main, 0.05), filter: 'blur(100px)' }}/>
            <Box component={motion.div} animate={{ rotate: -360 }} transition={{ repeat: Infinity, duration: 70, ease: 'linear' }}
                sx={{ position: 'absolute', bottom: '5%', right: '-10%', width: '300px', height: '300px', borderRadius: '50%', bgcolor: (theme) => alpha(theme.palette.secondary.main, 0.05), filter: 'blur(100px)' }}/>

            <Container maxWidth="lg" sx={{ position: 'relative', py: { xs: 6, md: 8 } }}>
                {/* == Main Footer Section == */}
                <Grid container spacing={5}>
                    <Grid item xs={12} md={4}>
                        <Typography variant="h5" gutterBottom sx={{ fontFamily: '"Merriweather", serif', fontWeight: 700, color: 'text.primary' }}>
                            {t('storeName')}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 2 }}>
                            {t('description')}
                        </Typography>
                        <Stack direction="row" spacing={1}>
                            {socialLinks.map((social: any) => (
                                <motion.div key={social.label} variants={iconVariants} initial="rest" whileHover="hover">
                                    <IconButton component="a" href={social.href} aria-label={social.label} target="_blank" rel="noopener"
                                        sx={{ bgcolor: 'action.hover', '&:hover': { bgcolor: 'primary.main', color: 'white' } }}>
                                        {social.label === 'Facebook' && <FacebookIcon />}
                                        {social.label === 'Instagram' && <InstagramIcon />}
                                        {social.label === 'Twitter' && <TwitterIcon />}
                                    </IconButton>
                                </motion.div>
                            ))}
                        </Stack>
                    </Grid>

                    {linkSections.map((section: any) => (
                        <Grid item xs={6} sm={3} md={2} key={section.title}>
                            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                                {section.title}
                            </Typography>
                            {section.links.map((link: any) => (
                                <motion.div key={link.text} variants={linkVariants} initial="rest" whileHover="hover">
                                    <MuiLink component={Link} href={`/${locale}${link.href}`} variant="body2" color="text.secondary"
                                        underline="none" display="block" sx={{ mb: 1, '&:hover': { color: 'primary.main' } }}>
                                        {link.text}
                                    </MuiLink>
                                </motion.div>
                            ))}
                        </Grid>
                    ))}

                    <Grid item xs={12} md={4}>
                        <Box sx={{
                            p: 3,
                            bgcolor: 'background.paper',
                            borderRadius: 3,
                            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                            border: '1px solid',
                            borderColor: 'divider'
                        }}>
                            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                                {t('newsletter.title')}
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 2 }}>
                                {t('newsletter.prompt')}
                            </Typography>
                            <AnimatePresence mode="wait">
                                {subscribed ? (
                                    <motion.div key="success" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                                        <Typography color="success.main" fontWeight="bold">{t('newsletter.success')}</Typography>
                                    </motion.div>
                                ) : (
                                    <motion.form key="form" onSubmit={handleSubscribe} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                                        <Box sx={{ display: 'flex' }}>
                                            <TextField variant="outlined" size="small" placeholder={t('newsletter.placeholder')} fullWidth
                                                sx={{ '& .MuiOutlinedInput-root': { borderTopRightRadius: 0, borderBottomRightRadius: 0 } }}/>
                                            <Button type="submit" variant="contained" aria-label={t('newsletter.subscribeAria')}
                                                sx={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0, px: 3 }}>
                                                <SendIcon />
                                            </Button>
                                        </Box>
                                    </motion.form>
                                )}
                            </AnimatePresence>
                        </Box>
                    </Grid>
                </Grid>
                
                {/* == Sub-Footer Section == */}
                <Box sx={{
                    mt: 8,
                    pt: 3,
                    borderTop: 1,
                    borderColor: 'divider',
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 2,
                }}>
                    <Typography variant="body2" color="text.secondary">
                        {t('copyrightText')}
                    </Typography>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <CreditCardIcon sx={{ fontSize: 32 }} />
                        <AccountBalanceWalletIcon sx={{ fontSize: 32 }} />
                        {/* Add more payment icons here */}
                    </Stack>
                </Box>
            </Container>
        </Box>
    );
}