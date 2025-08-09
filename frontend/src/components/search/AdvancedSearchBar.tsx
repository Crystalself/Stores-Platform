// src/components/search/AdvancedSearchBar.tsx
'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl'; // <-- (1) استيراد hooks الترجمة
import {
    Box,
    TextField,
    InputAdornment,
    Popover,
    List,
    ListItemButton,
    ListItemAvatar,
    Avatar,
    ListItemText,
    Typography,
    ListSubheader,
    CircularProgress,
    Divider,
    IconButton,
    ListItemIcon
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import StorefrontIcon from '@mui/icons-material/Storefront';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import HistoryIcon from '@mui/icons-material/History';
import CloseIcon from '@mui/icons-material/Close';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';

// --- استيراد البيانات الوهمية ---
import { mockProducts } from '@/lib/dummy-data';
import { mockUsers } from '@/lib/mockUsers';

// --- تعريف الأنواع لزيادة الموثوقية ---
interface User {
    id: number;
    username: string;
    profilePic?: string;
    firstName: string;
    lastName: string;
    role: 'seller' | 'buyer' | 'admin';
}

interface Product {
    id: number;
    name: { en: string; ar: string };
    description: { en: string; ar: string };
    thumbnail_image: string;
    price: number;
}

// --- Custom Hook for Debouncing ---
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return debouncedValue;
}

type SearchResults = {
    stores: { id: string; name: string; logo: string; }[];
    products: { id: string; name: string; price: string; image: string; }[];
};

export default function AdvancedSearchBar() {
    const locale = useLocale(); // <-- (1) الحصول على اللغة الحالية (ar/en)
    const t = useTranslations('SearchBar'); // <-- (1) تهيئة دالة الترجمة

    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState<SearchResults | null>(null);
    const [recentSearches, setRecentSearches] = useState<string[]>([]);
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null); 
    const debouncedQuery = useDebounce(query, 300);

    useEffect(() => {
        try {
            const storedSearches = localStorage.getItem('recentSearches');
            if (storedSearches) {
                setRecentSearches(JSON.parse(storedSearches));
            }
        } catch (error) {
            console.error("Failed to parse recent searches from localStorage", error);
            localStorage.removeItem('recentSearches');
        }
    }, []);

    const performSearch = useCallback((searchTerm: string) => {
        if (searchTerm.length < 2) {
            setResults(null);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setResults(null);

        setTimeout(() => {
            const lowercasedQuery = searchTerm.toLowerCase();

            const filteredStores = mockUsers
                .filter((user: User) => user.role === 'seller' && (
                    user.username.toLowerCase().includes(lowercasedQuery) ||
                    user.firstName.toLowerCase().includes(lowercasedQuery) ||
                    user.lastName.toLowerCase().includes(lowercasedQuery)
                ))
                .map((user: User) => ({
                    id: `${user.id}`,
                    name: user.username,
                    logo: user.profilePic || ''
                }));

            // --- (2) البحث باللغتين العربية والإنجليزية ---
            const filteredProducts = mockProducts
                .filter((product: Product) =>
                    product.name.ar.toLowerCase().includes(lowercasedQuery) ||
                    product.name.en.toLowerCase().includes(lowercasedQuery) ||
                    product.description.ar.toLowerCase().includes(lowercasedQuery) ||
                    product.description.en.toLowerCase().includes(lowercasedQuery)
                )
                .map((product: Product) => ({
                    id: `${product.id}`,
                    // --- (2) عرض الاسم حسب اللغة الحالية ---
                    name: locale === 'ar' ? product.name.ar : product.name.en,
                    price: `${product.price} ₪`,
                    image: product.thumbnail_image
                }));

            if (filteredStores.length > 0 || filteredProducts.length > 0) {
                setResults({ stores: filteredStores, products: filteredProducts });
            } else {
                setResults(null);
            }

            setIsLoading(false);
        }, 300);
    }, [locale]); // <-- إضافة اللغة كـ dependency

    useEffect(() => {
        performSearch(debouncedQuery);
    }, [debouncedQuery, performSearch]);

    const addSearchToRecents = (term: string) => {
        const updatedSearches = [term, ...recentSearches.filter(s => s !== term)].slice(0, 20);
        setRecentSearches(updatedSearches);
        localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
    };
    
    const removeSearchFromRecents = (termToRemove: string) => {
        const updatedSearches = recentSearches.filter(s => s !== termToRemove);
        setRecentSearches(updatedSearches);
        localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
    };

    const handleFocus = () => setIsPopoverOpen(true);
    const handleClose = () => setIsPopoverOpen(false);

    const handleSearchAction = () => {
        if (query.trim()) {
            addSearchToRecents(query);
            handleClose();
        }
    }

    const handleRecentSearchClick = (term: string) => {
        setQuery(term);
        performSearch(term);
    };

    const renderPopoverContent = () => {
        if (isLoading) {
            return <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}><CircularProgress /></Box>;
        }
        if (results) {
            return (
                <List>
                    {/* --- (3) استخدام النصوص المترجمة --- */}
                    {results.stores.length > 0 && <ListSubheader>{t('stores')}</ListSubheader>}
                    {results.stores.map(store => (
                        <ListItemButton key={store.id} component={Link} href={`/stores/${store.id}`} onClick={handleSearchAction}>
                            <ListItemAvatar><Avatar src={store.logo}><StorefrontIcon /></Avatar></ListItemAvatar>
                            <ListItemText primary={store.name} />
                        </ListItemButton>
                    ))}
                    {results.products.length > 0 && results.stores.length > 0 && <Divider sx={{ my: 1 }} />}
                    {results.products.length > 0 && <ListSubheader>{t('products')}</ListSubheader>}
                    {results.products.map(product => (
                        <ListItemButton key={product.id} component={Link} href={`/${locale}/products/${product.id}`} onClick={handleSearchAction}>
                            <ListItemAvatar><Avatar src={product.image} variant="rounded"><Inventory2OutlinedIcon /></Avatar></ListItemAvatar>
                            <ListItemText primary={product.name} secondary={product.price} />
                        </ListItemButton>
                    ))}
                    <Divider sx={{ my: 1 }} />
                    <ListItemButton component={Link} href={`/search?q=${query}`} onClick={handleSearchAction} sx={{ justifyContent: 'center' }}>
                        <Typography color="primary" variant="body2">{t('viewAllResults', { query })}</Typography>
                    </ListItemButton>
                </List>
            );
        }
        if (debouncedQuery.length > 1 && !isLoading && !results) {
            return <Typography sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}>{t('noResults')}</Typography>;
        }
        if (recentSearches.length > 0) {
            return (
                <List>
                    <ListSubheader sx={{ textAlign: 'right' }}>{t('recentSearches')}</ListSubheader>
                    {recentSearches.slice(0, 5).map((term, index) => (
                        <ListItemButton key={index} onClick={() => handleRecentSearchClick(term)}>
                            <ListItemIcon sx={{ minWidth: 'auto', mr: 1.5 }}><HistoryIcon sx={{ color: 'text.secondary' }} /></ListItemIcon>
                            <ListItemText primary={term} />
                            <IconButton size="small" onClick={(e) => { e.stopPropagation(); removeSearchFromRecents(term); }} aria-label={t('deleteAria', { term })}>
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        </ListItemButton>
                    ))}
                    {recentSearches.length > 5 && (
                        <>
                            <Divider sx={{ my: 1 }} />
                            <ListItemButton component={Link} href="/search/history" onClick={handleClose}>
                                <ListItemIcon sx={{ minWidth: 'auto', mr: 1.5 }}><ManageSearchIcon sx={{ color: 'primary.main' }} /></ListItemIcon>
                                <ListItemText primary={t('viewMoreHistory')} primaryTypographyProps={{ color: 'primary' }} />
                            </ListItemButton>
                        </>
                    )}
                </List>
            );
        }
        return <Typography sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}>{t('searchPrompt')}</Typography>;
    };

    return (
        <Box sx={{ width: '100%', maxWidth: 500 }} ref={searchRef}>
            <TextField
                variant="outlined"
                size="small"
                fullWidth
                placeholder={t('placeholder')} // <-- (3) استخدام placeholder مترجم
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={handleFocus}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '50px', backgroundColor: (theme) => theme.palette.action.hover, '& fieldset': { border: 'none' } } }}
                InputProps={{
                    startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: 'text.secondary' }} /></InputAdornment>,
                    endAdornment: query && (
                        <InputAdornment position="end">
                            <IconButton size="small" onClick={() => setQuery('')}><CloseIcon fontSize="small" /></IconButton>
                        </InputAdornment>
                    )
                }}
            />
            <Popover
                open={isPopoverOpen}
                anchorEl={searchRef.current}
                onClose={handleClose}
                disableAutoFocus
                disableEnforceFocus
                ModalProps={{ hideBackdrop: true }}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                transformOrigin={{ vertical: 'top', horizontal: 'center' }}
                PaperProps={{
                    sx: {
                        width: searchRef.current?.clientWidth, mt: 1, borderRadius: 2,
                        boxShadow: '0px 10px 25px -5px rgba(0,0,0,0.1)',
                        maxHeight: '70vh',
                    }
                }}
            >
                {renderPopoverContent()}
            </Popover>
        </Box>
    );
}

