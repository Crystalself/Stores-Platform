
// components/cart/CartItemView.tsx
"use client";
import React from 'react';
import { 
    Box, 
    Typography, 
    IconButton, 
    TextField, 
    Avatar,
    Chip
} from '@mui/material';
import { DeleteOutline, Add, Remove } from '@mui/icons-material';
import { useCart } from '@/contexts/CartContext';
import { CartItem } from '@/models/cart';

interface CartItemViewProps {
  item: CartItem;
}

const CartItemView: React.FC<CartItemViewProps> = ({ item }) => {
    const { updateQuantity, removeFromCart } = useCart();
    const finalPrice = item.price - (item.price * (item.discount / 100));

    const handleQuantityChange = (newQuantity: number) => {
        if (newQuantity >= 1 && newQuantity <= item.stock) {
            updateQuantity(item.id, newQuantity);
        }
    };

    return (
        <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mb: 2, 
            gap: 2,
            p: 2,
            borderRadius: 2,
            backgroundColor: 'background.paper',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            }
        }}>
            <Avatar 
                src={item.thumbnail_image} 
                alt={item.name} 
                variant="rounded" 
                sx={{ 
                    width: 64, 
                    height: 64,
                    borderRadius: 1
                }} 
            />
            
            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                <Typography 
                    variant="subtitle1" 
                    fontWeight="bold"
                    sx={{ 
                        mb: 0.5,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                    }}
                >
                    {item.name}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Typography 
                        variant="h6" 
                        color="primary" 
                        fontWeight="bold"
                    >
                        ${finalPrice.toFixed(2)}
                    </Typography>
                    
                    {item.discount > 0 && (
                        <Chip 
                            label={`${item.discount}% OFF`}
                            color="error"
                            size="small"
                            sx={{ fontSize: '0.75rem' }}
                        />
                    )}
                </Box>
                
                <Typography 
                    variant="body2" 
                    color="text.secondary"
                >
                    Stock: {item.stock} units
                </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton 
                    size="small"
                    onClick={() => handleQuantityChange(item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    sx={{ 
                        border: '1px solid',
                        borderColor: 'divider',
                        '&:hover': {
                            backgroundColor: 'action.hover',
                        }
                    }}
                >
                    <Remove fontSize="small" />
                </IconButton>
                
                <TextField
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(parseInt(e.target.value, 10) || 1)}
                    inputProps={{ 
                        min: 1, 
                        max: item.stock,
                        style: { textAlign: 'center' } 
                    }}
                    sx={{ 
                        width: '60px',
                        '& .MuiInputBase-input': {
                            textAlign: 'center',
                            padding: '8px 4px',
                        }
                    }}
                    size="small"
                />
                
                <IconButton 
                    size="small"
                    onClick={() => handleQuantityChange(item.quantity + 1)}
                    disabled={item.quantity >= item.stock}
                    sx={{ 
                        border: '1px solid',
                        borderColor: 'divider',
                        '&:hover': {
                            backgroundColor: 'action.hover',
                        }
                    }}
                >
                    <Add fontSize="small" />
                </IconButton>
            </Box>
            
            <IconButton 
                onClick={() => removeFromCart(item.id)} 
                color="error" 
                size="small"
                sx={{
                    '&:hover': {
                        backgroundColor: 'error.light',
                        color: 'error.contrastText',
                    }
                }}
            >
                <DeleteOutline />
            </IconButton>
        </Box>
    );
};

export default CartItemView;
