// src/components/sections/CategorySection.tsx
'use client';

import React from 'react';
import { Box, Typography, useTheme, alpha, Container } from '@mui/material';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { ProductCategory } from '@/models/product';

// --- (1) Data Structure & Placeholders ---
const categories = Object.values(ProductCategory);

const categoryDetails: Record<ProductCategory, { color: string }> = {
    FASHION: { color: '#e91e63' },
    ELECTRONICS: { color: '#2196f3' },
    HOME_SUPPLIES: { color: '#4caf50' },
    ACCESSORIES: { color: '#ff9800' },
    BEAUTY: { color: '#9c27b0' },
    BOOKS: { color: '#795548' },
    TOYS: { color: '#f44336' },
    SPORTS: { color: '#00bcd4' },
    HOME: { color: '#8bc34a' },
};

// --- (2) Animation Variants ---
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1, // Stagger the animation of each card
        },
    },
};

const cardDealVariants = {
    hidden: { opacity: 0, x: -100, y: -100, rotate: -45, scale: 0.5 },
    visible: {
        opacity: 1,
        x: 0,
        y: 0,
        rotate: 0,
        scale: 1,
        transition: { type: 'spring', stiffness: 100, damping: 15 },
    },
};

// --- (3) The Interactive Card Component ---
const CategoryCard = ({ category }: { category: ProductCategory }) => {
    const t = useTranslations('CategorySection');
    const locale = useLocale();
    const cardRef = React.useRef<HTMLDivElement>(null);

    // 3D Tilt Effect Logic
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
    const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });
    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['15deg', '-15deg']);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-15deg', '15deg']);
    const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ['100%', '0%']);
    const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ['100%', '0%']);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const { width, height, left, top } = cardRef.current.getBoundingClientRect();
        x.set((e.clientX - left) / width - 0.5);
        y.set((e.clientY - top) / height - 0.5);
    };
    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            variants={cardDealVariants}
            style={{
                transformStyle: 'preserve-3d',
                flexShrink: 0,
            }}
        >
            <Box
                component={Link}
                href={`/${locale}/category/${category.toLowerCase()}`}
                sx={{
                    display: 'block',
                    position: 'relative',
                    width: { xs: 160, sm: 200 },
                    height: { xs: 200, sm: 250 },
                    textDecoration: 'none',
                    transform: 'translateZ(0)',
                }}
            >
                <motion.div
                    style={{
                        width: '100%',
                        height: '100%',
                        position: 'relative',
                        transformStyle: 'preserve-3d',
                        rotateX,
                        rotateY,
                        borderRadius: '24px',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        background: `url(https://placehold.co/300x300/${categoryDetails[category].color.substring(1)}/FFFFFF?text=${category})`,
                        backgroundSize: 'cover',
                    }}
                >
                    <Box sx={{ position: 'absolute', inset: 0, borderRadius: '24px', overflow: 'hidden' }}>
                        <motion.div
                            style={{
                                position: 'absolute',
                                top: 0, left: 0, right: 0, bottom: 0,
                                background: `radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.4), transparent 40%)`,
                                mixBlendMode: 'soft-light',
                            }}
                        />
                    </Box>
                    <Box sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        p: 2,
                        color: 'white',
                        background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)',
                        borderBottomLeftRadius: '24px',
                        borderBottomRightRadius: '24px',
                    }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', textShadow: '0 1px 5px rgba(0,0,0,0.5)' }}>
                            {t(`categories.${category}`)}
                        </Typography>
                    </Box>
                </motion.div>
            </Box>
        </motion.div>
    );
};


// --- (4) Main Section Component ---
export default function CategorySection() {
    const t = useTranslations('CategorySection');

    return (
        <Box sx={{
            position: 'relative',
            overflow: 'hidden',
            py: { xs: 8, md: 12 },
            bgcolor: (theme) => theme.palette.mode === 'dark' ? '#0a0a10' : '#f7f9fc',
        }}>
            <Box component={motion.div} animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 50, ease: 'linear' }}
                sx={{ position: 'absolute', top: '-20%', left: '-20%', width: '400px', height: '400px', borderRadius: '50%', bgcolor: (theme) => alpha(theme.palette.primary.main, 0.05), filter: 'blur(100px)' }}/>
            <Box component={motion.div} animate={{ rotate: -360 }} transition={{ repeat: Infinity, duration: 60, ease: 'linear' }}
                sx={{ position: 'absolute', bottom: '-20%', right: '-20%', width: '400px', height: '400px', borderRadius: '50%', bgcolor: (theme) => alpha(theme.palette.secondary.main, 0.05), filter: 'blur(100px)' }}/>
            
            <Container maxWidth="lg">
                <Typography variant="h3" sx={{ textAlign: 'center', fontWeight: 800, mb: 6 }}>
                    {t('title')}
                </Typography>

                <Box
                    sx={{
                        display: 'flex',
                        overflowX: 'auto',
                        py: 2,
                        gap: 4,
                        scrollbarWidth: 'none', // For Firefox
                        '&::-webkit-scrollbar': {
                            display: 'none', // For Chrome, Safari, and Opera
                        },
                    }}
                >
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        variants={containerVariants}
                        style={{ display: 'flex', gap: '32px', padding: '0 16px' }}
                    >
                        {categories.map((cat) => (
                            <CategoryCard key={cat} category={cat} />
                        ))}
                    </motion.div>
                </Box>
            </Container>
        </Box>
    );
}