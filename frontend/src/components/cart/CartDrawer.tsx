"use client";
import React from 'react';
import { 
    Drawer, 
    Box, 
    Typography, 
    Button, 
    IconButton,
    Paper,
    Fade,
    Slide
} from '@mui/material';
import { Close, ShoppingCart, ArrowForward } from '@mui/icons-material';
import { useCart } from '@/contexts/CartContext';
import { useTranslations } from 'next-intl';
import CartItemView from './CartItemView';
import Link from 'next/link';

const CartDrawer = () => {
    const t = useTranslations('Cart');
    const { isCartOpen, toggleCart, cartItems, cartTotal } = useCart();

    return (
        <Drawer 
            anchor="right" 
            open={isCartOpen} 
            onClose={toggleCart}
            ModalProps={{
                keepMounted: true,
            }}
            PaperProps={{
                sx: {
                    width: { xs: '100%', sm: 400 },
                    maxWidth: '90vw',
                    zIndex: (theme) => theme.zIndex.tooltip + 20, // 💥 أعلى من كل شيء
                }
            }}
            sx={{
                zIndex: (theme) => theme.zIndex.tooltip + 20, // 💥 حتى الـ backdrop
            }}
        >
            <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                height: '100%',
                backgroundColor: 'background.default'
            }}>
                {/* Header */}
                <Paper 
                    elevation={0}
                    sx={{ 
                        p: 2, 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                        backgroundColor: 'primary.main',
                        color: 'primary.contrastText'
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ShoppingCart />
                        <Typography variant="h6" component="h2" fontWeight="bold">
                            {t('title')} 
                        </Typography>
                    </Box>
                    <IconButton 
                        onClick={toggleCart}
                        sx={{ 
                            color: 'inherit',
                            '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            }
                        }}
                    >
                        <Close />
                    </IconButton>
                </Paper>

                {/* Content */}
                <Box sx={{ flexGrow: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                    {cartItems.length === 0 ? (
                        <Fade in={true}>
                            <Box sx={{ 
                                flexGrow: 1, 
                                display: 'flex', 
                                flexDirection: 'column', 
                                justifyContent: 'center', 
                                alignItems: 'center', 
                                gap: 3,
                                p: 4
                            }}>
                                <ShoppingCart sx={{ fontSize: 64, color: 'text.disabled' }} />
                                <Typography 
                                    variant="h6" 
                                    color="text.secondary"
                                    textAlign="center"
                                >
                                    {t('empty')}
                                </Typography>
                                <Link href="/" passHref style={{ textDecoration: 'none' }}>
                                    <Button 
                                        variant="contained" 
                                        onClick={toggleCart}
                                        startIcon={<ArrowForward />}
                                        sx={{ 
                                            px: 4, 
                                            py: 1.5,
                                            borderRadius: 2
                                        }}
                                    >
                                        {t('browseProducts')}
                                    </Button>
                                </Link>
                            </Box>
                        </Fade>
                    ) : (
                        <>
                            {/* Cart Items */}
                            <Box sx={{ 
                                flexGrow: 1, 
                                overflowY: 'auto',
                                p: 2
                            }}>
                                <Slide direction="up" in={true} mountOnEnter unmountOnExit>
                                    <Box>
                                        {cartItems.map(item => (
                                            <CartItemView key={item.id} item={item} />
                                        ))}
                                    </Box>
                                </Slide>
                            </Box>
                            
                            {/* Footer */}
                            <Paper 
                                elevation={0}
                                sx={{ 
                                    p: 2,
                                    borderTop: '1px solid',
                                    borderColor: 'divider',
                                    backgroundColor: 'background.paper'
                                }}
                            >
                                <Box sx={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between', 
                                    alignItems: 'center',
                                    mb: 2 
                                }}>
                                    <Typography variant="h6" fontWeight="bold">
                                        {t('subtotal')}
                                    </Typography>
                                    <Typography 
                                        variant="h5" 
                                        fontWeight="bold" 
                                        color="primary"
                                    >
                                        ${cartTotal.toFixed(2)}
                                    </Typography>
                                </Box>
                                
                                <Button 
                                    variant="contained" 
                                    color="primary" 
                                    size="large" 
                                    fullWidth
                                    endIcon={<ArrowForward />}
                                    sx={{ 
                                        py: 1.5,
                                        borderRadius: 2,
                                        fontSize: '1.1rem',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    {t('checkout')}
                                </Button>
                            </Paper>
                        </>
                    )}
                </Box>
            </Box>
        </Drawer>
    );
};

export default CartDrawer;
