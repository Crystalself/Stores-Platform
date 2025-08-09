'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

// --- MUI & Theming ---
import { Box, Typography, IconButton, alpha } from '@mui/material';

// --- Icons ---
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CampaignIcon from '@mui/icons-material/Campaign';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import CloseIcon from '@mui/icons-material/Close';

// --- Libraries ---
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

// --- Announcement Bar Component ---
export default function AnnouncementBar() {
    const [isVisible, setIsVisible] = useState(false);
    const t = useTranslations('AnnouncementBar');

    // --- بيانات الإعلانات ---
    // يمكنك توسيع هذه القائمة بسهولة
    const announcements = [
        { key: 'freeShipping', icon: <LocalShippingIcon sx={{ fontSize: 16, mr: 1 }} /> },
        { key: 'weekendSale', icon: <CampaignIcon sx={{ fontSize: 16, mr: 1 }} /> },
        { key: 'newArrivals', icon: <NewReleasesIcon sx={{ fontSize: 16, mr: 1 }} /> },
    ];

    // التأكد من أن الشريط لم يتم إغلاقه في هذه الجلسة
    useEffect(() => {
        const isDismissed = sessionStorage.getItem('announcementDismissed');
        if (!isDismissed) {
            setIsVisible(true);
        }
    }, []);

    const handleDismiss = () => {
        setIsVisible(false);
        sessionStorage.setItem('announcementDismissed', 'true');
    };

    // إعدادات السلايدر
    const sliderSettings = {
        dots: false,
        arrows: false,
        infinite: true,
        vertical: true,
        verticalSwiping: true,
        autoplay: true,
        autoplaySpeed: 3000,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
    };

    if (!isVisible) return null;

    return (
        <Box sx={{
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
            color: 'text.primary',
            py: 1,
            px: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
        }}>
            <Box sx={{ height: '24px', width: '100%', overflow: 'hidden' }}>
                <Slider {...sliderSettings}>
                    {announcements.map((item) => (
                        <Box key={item.key} sx={{ display: 'flex !important', alignItems: 'center', justifyContent: 'center' }}>
                            {item.icon}
                            <Typography variant="body2" component="span" sx={{ fontWeight: 500 }}>
                                {t(item.key)}
                            </Typography>
                        </Box>
                    ))}
                </Slider>
            </Box>
            <IconButton
                size="small"
                onClick={handleDismiss}
                aria-label={t('dismissAria')}
                sx={{ position: 'absolute', right: { xs: 0, sm: 8 }, left: { xs: 'auto', sm: 'auto' } }} // Support RTL/LTR
            >
                <CloseIcon sx={{ fontSize: 18 }} />
            </IconButton>
        </Box>
    );
}
