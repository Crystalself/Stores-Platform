// src/components/ui/ProductSlider.tsx
'use client';

import { useRef } from 'react';
import Link from 'next/link';
import Slider from 'react-slick';
import { Box, Typography, Card, CardMedia, CardContent, Button, Container, IconButton, Rating, Chip, Avatar } from '@mui/material';
import { motion } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';

// --- استيراد البيانات الوهمية ---
import { mockProducts } from '@/lib/dummy-data';
import { mockUsers } from '@/lib/mockUsers';

// --- Icons ---
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';

// --- Import slick-carousel styles ---
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// --- تعريف الأنواع لزيادة الموثوقية ---
interface Product {
    id: number;
    user_id: number;
    name: { en: string; ar: string };
    thumbnail_image: string;
    price: number;
    discount: number;
    sell_count: number;
    rating: number;
    is_new: boolean;
    created_at: string;
}

// --- دالة احترافية لمعالجة وعرض المنتجات ---
const getProductsForSlider = (isLoggedIn: boolean, locale: string) => {
    if (isLoggedIn) {
        // 1. الأحدث: فرز حسب تاريخ الإنشاء وأخذ أول 3
        const newestProducts = [...mockProducts]
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .slice(0, 3)
            .map(p => ({ ...p, tagKey: 'newest' }));

        // 2. الأكثر خصماً: فرز حسب نسبة الخصم وأخذ أول 4
        const highestDiscountProducts = [...mockProducts]
            .sort((a, b) => b.discount - a.discount)
            .slice(0, 4)
            .map(p => ({ ...p, tagKey: 'mostDiscounted' }));

        // 3. الأكثر مبيعاً: فرز حسب عدد المبيعات وأخذ أول 5
        const bestSellingProducts = [...mockProducts]
            .sort((a, b) => b.sell_count - a.sell_count)
            .slice(0, 5)
            .map(p => ({ ...p, tagKey: 'bestSelling' }));
        
        // دمج القوائم مع إزالة التكرار
        const allProducts = [...newestProducts, ...highestDiscountProducts, ...bestSellingProducts];
        const uniqueProducts = Array.from(new Map(allProducts.map(p => [p.id, p])).values());
        return uniqueProducts;
    } else {
        // للزائر: 10 منتجات عشوائية
        return [...mockProducts].sort(() => 0.5 - Math.random()).slice(0, 10).map(p => ({ ...p, tagKey: null }));
    }
};

// --- مكون بطاقة المنتج الاحترافي ---
const ProductCard = ({ product, seller, locale, t }: { product: any, seller: any, locale: string, t: any }) => {
    const cardVariants = {
        rest: { y: 0 },
        hover: { y: -10, transition: { type: "spring", stiffness: 300 } },
    };

    const overlayVariants = {
        rest: { opacity: 0 },
        hover: { opacity: 1, transition: { duration: 0.3 } },
    };

    return (
        <Box sx={{ p: '12px !important' }}>
            <motion.div initial="rest" whileHover="hover" variants={cardVariants}>
                <Card
                    component={Link}
                    href={`/${locale}/products/${product.id}`}
                    sx={{
                        position: 'relative',
                        borderRadius: 4,
                        overflow: 'hidden',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        textDecoration: 'none',
                        transition: 'box-shadow 0.3s ease',
                        '&:hover': {
                            boxShadow: (theme) => `0px 20px 40px -10px ${theme.palette.action.hover}`,
                        }
                    }}
                >
                    <Box sx={{ overflow: 'hidden', position: 'relative', height: 280 }}>
                        <CardMedia
                            component="img"
                            image={product.thumbnail_image}
                            alt={product.name[locale as 'ar' | 'en']}
                            sx={{
                                height: '100%',
                                width: '100%',
                                objectFit: 'cover',
                                transition: 'transform 0.5s ease',
                                '.group:hover &': { // This will not work directly, hover is on parent.
                                    transform: 'scale(1.1)',
                                },
                            }}
                        />
                        <motion.div
                            variants={overlayVariants}
                            style={{
                                position: 'absolute',
                                inset: 0,
                                background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)',
                            }}
                        />
                        {product.tagKey && (
                            <Chip
                                label={t(product.tagKey, { discount: product.discount })}
                                color="primary"
                                size="small"
                                sx={{
                                    position: 'absolute', top: 16, left: 16,
                                    bgcolor: 'rgba(255, 87, 34, 0.8)', color: 'white', fontWeight: 'bold',
                                    backdropFilter: 'blur(5px)',
                                }}
                            />
                        )}
                        <motion.div variants={overlayVariants} style={{ position: 'absolute', bottom: 16, right: 16, display: 'flex', gap: '8px' }}>
                            <IconButton size="small" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', '&:hover': { bgcolor: 'primary.main' } }}>
                                <FavoriteBorderOutlinedIcon fontSize="small" />
                            </IconButton>
                            <IconButton size="small" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', '&:hover': { bgcolor: 'primary.main' } }}>
                                <ShoppingCartOutlinedIcon fontSize="small" />
                            </IconButton>
                        </motion.div>
                    </Box>
                    
                    <CardContent sx={{ flexGrow: 1, p: 2, bgcolor: 'background.paper' }}>
                        <Typography variant="h6" component="h3" noWrap sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>
                            {product.name[locale as 'ar' | 'en']}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="h5" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                                {product.price} ₪
                            </Typography>
                            <Rating name="read-only" value={product.rating} precision={0.5} readOnly size="small" />
                        </Box>
                        <motion.div variants={overlayVariants} style={{ marginTop: '8px' }}>
                            {seller && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Avatar src={seller.profilePic} sx={{ width: 24, height: 24 }} />
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>{seller.username}</Typography>
                                </Box>
                            )}
                        </motion.div>
                    </CardContent>
                </Card>
            </motion.div>
        </Box>
    );
};

export default function ProductSlider() {
    const sliderRef = useRef<Slider>(null);
    const locale = useLocale();
    const t = useTranslations('ProductSlider');
    const isLoggedIn = true; // --- للتحكم: غيرها إلى false لتجربة وضع الزائر ---

    const productsToDisplay = getProductsForSlider(isLoggedIn, locale);

    const settings = {
        dots: false,
        infinite: productsToDisplay.length > 4,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        arrows: false,
        rtl: locale === 'ar',
        responsive: [
            { breakpoint: 1200, settings: { slidesToShow: 3 } },
            { breakpoint: 900, settings: { slidesToShow: 2 } },
            { breakpoint: 600, settings: { slidesToShow: 1 } },
        ]
    };

    return (
        <Box sx={{ bgcolor: 'background.default', py: 10 }}>
            <Container maxWidth="lg">
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                    <Typography variant="h4" component="h2" sx={{ fontWeight: 700 }}>
                        {isLoggedIn ? t('titleLoggedIn') : t('titleGuest')}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton aria-label="previous slide" onClick={() => sliderRef.current?.slickPrev()} sx={{ bgcolor: 'action.hover', '&:hover': { bgcolor: 'primary.main', color: 'white' } }}>
                            {locale === 'ar' ? <ArrowForwardIosIcon /> : <ArrowBackIosNewIcon />}
                        </IconButton>
                        <IconButton aria-label="next slide" onClick={() => sliderRef.current?.slickNext()} sx={{ bgcolor: 'action.hover', '&:hover': { bgcolor: 'primary.main', color: 'white' } }}>
                            {locale === 'ar' ? <ArrowBackIosNewIcon /> : <ArrowForwardIosIcon />}
                        </IconButton>
                    </Box>
                </Box>

                <Slider ref={sliderRef} {...settings}>
                    {productsToDisplay.map((product) => {
                        const seller = mockUsers.find(u => u.id === product.user_id);
                        return <ProductCard key={product.id} product={product} seller={seller} locale={locale} t={t} />;
                    })}
                </Slider>
            </Container>  
        </Box>
    );
}   