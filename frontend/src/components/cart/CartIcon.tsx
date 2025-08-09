"use client";
import React from 'react';
import { IconButton, Badge } from '@mui/material';
import { ShoppingCart } from '@mui/icons-material';
import { useCart } from '@/contexts/CartContext';

const CartIcon = () => {
    const { toggleCart, cartCount } = useCart();

    return (
        <IconButton 
            color="inherit" 
            onClick={toggleCart}
            sx={{
                '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
                transition: 'all 0.2s ease-in-out',
            }}
        >
            <Badge 
                badgeContent={cartCount} 
                color="error"
                sx={{
                    '& .MuiBadge-badge': {
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                    }
                }}
            >
                <ShoppingCart />
            </Badge>
        </IconButton>
    );
};

export default CartIcon;

