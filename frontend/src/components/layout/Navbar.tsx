'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';

// MUI Components & Hooks
import {
    AppBar, Toolbar, Typography, Box, IconButton, Drawer,
    List, ListItem, ListItemButton, ListItemIcon, ListItemText,
    Avatar, Menu, MenuItem, Tooltip, Container, Divider, useTheme,
    useMediaQuery, Dialog, DialogContent, Slide, AppBar as DialogAppBar
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';

// Custom Components
import AdvancedSearchBar from '@/components/search/AdvancedSearchBar';
import LanguageSwitch from '@/components/LanguageSwitch';
import ThemeSwitch from '@/components/ThemeSwitch';

// Icons
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import HomeIcon from '@mui/icons-material/Home';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import StorefrontIcon from '@mui/icons-material/Storefront';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import CloseIcon from '@mui/icons-material/Close';
import TranslateIcon from '@mui/icons-material/Translate';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import SearchIcon from '@mui/icons-material/Search';


const drawerWidth = 250;

// Helper component for Dialog transition
const DialogTransition = React.forwardRef(function Transition(
    props: TransitionProps & { children: React.ReactElement<any, any>; },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function Navbar() {
    // --- Hooks ---
    const theme = useTheme();
    const pathname = usePathname();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
    const locale = useLocale();
    const t = useTranslations('Navbar');

    // --- State ---
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
    const [mobileOptionsOpen, setMobileOptionsOpen] = useState(false);
    
    // --- Handlers ---
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => setAnchorElUser(event.currentTarget);
    const handleCloseUserMenu = () => setAnchorElUser(null);
    const toggleDrawer = (open: boolean) => () => setDrawerOpen(open);
    const handleOpenMobileOptions = () => setMobileOptionsOpen(true);
    const handleCloseMobileOptions = () => setMobileOptionsOpen(false);

    // --- Data ---
    const user = { name: 'Ahmed Ali', avatar: 'https://i.pravatar.cc/40' };

    // Data now uses translation keys
    const drawerLinks = [
        { key: 'home', icon: <HomeIcon />, href: `/${locale}/customer` },
        { key: 'products', icon: <StorefrontIcon />, href: `/${locale}/customer/proudcts` },
        { key: 'offers', icon: <LocalOfferIcon />, href: `/${locale}/customer/proudcts/offers` },
        { key: 'cart', icon: <ShoppingCartIcon />, href: `/${locale}/customer/cart` },
        { key: 'wallet', icon: <AccountBalanceWalletIcon />, href: `/${locale}/customer/wallet` },
        { key: 'arView', icon: <ViewInArIcon />, href: `/${locale}/customer/ar-view` },
        { key: 'chatbot', icon: <SmartToyIcon />, href: `/${locale}/customer/chatbot` },
    ];
    const userMenuItems = [
        { key: 'myAccount', icon: <AccountCircleOutlinedIcon fontSize="small" />, href: `/${locale}/customer/profile` },
        { key: 'myOrders', icon: <ReceiptLongOutlinedIcon fontSize="small" />, href: `/${locale}/orders` },
    ];

    // --- Reusable Drawer Content ---
    const drawerContent = (
        <Box sx={{ width: drawerWidth }} role="presentation">
            <Toolbar>
                <Typography variant="h6" sx={{ fontFamily: 'Merriweather, serif', fontWeight: 700 }}>GAZA Store</Typography>
            </Toolbar>
            <Divider />
            <List>
                {drawerLinks.map((item) => (
                    <ListItem key={item.key} disablePadding>
                        <ListItemButton component={Link} href={item.href} selected={pathname === item.href} onClick={toggleDrawer(false)}>
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={t(`drawer.${item.key}`)} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Divider />
            <List>
                {userMenuItems.map((item) => (
                    <ListItem key={item.key} disablePadding>
                        <ListItemButton component={Link} href={item.href} onClick={toggleDrawer(false)}>
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={t(`userMenu.${item.key}`)} />
                        </ListItemButton>
                    </ListItem>
                ))}
                <ListItem disablePadding>
                    <ListItemButton onClick={toggleDrawer(false)}>
                        <ListItemIcon><LogoutIcon color="error" /></ListItemIcon>
                        <ListItemText primary={t('userMenu.logout')} primaryTypographyProps={{ color: 'error' }} />
                    </ListItemButton>
                </ListItem>
            </List>
        </Box>
    );

    return (
        <>
            <AppBar position="sticky" sx={{ bgcolor: 'background.paper', color: 'text.primary', boxShadow: { xs: 1, md: 2 } }}>
                <Container maxWidth="xl">
                    <Toolbar disableGutters>
                        <IconButton
                            color="inherit"
                            aria-label={t('openDrawerAria')}
                            onClick={toggleDrawer(true)}
                            sx={{
                                mr: 1, p: 1.25, transition: 'all 0.2s ease-in-out',
                                '&:hover': {
                                    backgroundColor: 'primary.main', color: 'white',
                                    transform: 'scale(1.1)', boxShadow: '0px 4px 12px rgba(0,0,0,0.2)',
                                }
                            }}
                        >
                            <MenuIcon />
                        </IconButton>

                        <Typography
                            variant="h4" noWrap component={Link} href={`/${locale}/customer`}
                            sx={{
                                position: 'relative', overflow: 'hidden', mr: 2, fontFamily: 'Merriweather, serif',
                                fontWeight: 900, textDecoration: 'none', cursor: 'pointer', padding: '5px',
                                transition: 'transform 0.3s ease-in-out',
                                background: (theme) => `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
                                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                                textShadow: (theme) => theme.palette.mode === 'dark' ? '0 2px 8px rgba(0, 0, 0, 0.5)' : '0 2px 4px rgba(0, 0, 0, 0.2)',
                                '&:hover': { transform: 'scale(1.05)' },
                                '&::after': {
                                    content: '""', position: 'absolute', top: 0, left: 0, width: '200%', height: '100%',
                                    transform: 'translateX(-100%) skewX(-20deg)',
                                    background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0) 100%)',
                                    transition: 'transform 0.8s cubic-bezier(0.23, 1, 0.32, 1)',
                                },
                                '&:hover::after': { transform: 'translateX(100%) skewX(-20deg)' },
                            }}
                        >
                            GAZA Store
                        </Typography>

                        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center', px: 2 }}

                        >
                            <AdvancedSearchBar />
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {isSmallScreen ? (
                                <>
                                    <Tooltip title={t('search')}>
                                        <IconButton color="inherit" onClick={handleOpenMobileOptions}>
                                            <SearchIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Dialog fullScreen open={mobileOptionsOpen} onClose={handleCloseMobileOptions} TransitionComponent={DialogTransition}>
                                        <DialogAppBar sx={{ position: 'relative', boxShadow: 'none', backgroundColor: 'red' }}>
                                            <Toolbar>
                                                <IconButton edge="start" color="inherit" onClick={handleCloseMobileOptions} aria-label={t('closeAria')}><CloseIcon /></IconButton>
                                                <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">{t('searchAndOptions')}</Typography>
                                            </Toolbar>
                                        </DialogAppBar>
                                        <DialogContent sx={{ p: 2 }}>
                                            <Box mb={3}><AdvancedSearchBar /></Box>
                                            <Divider sx={{ my: 1 }} />
                                            <List>
                                                <ListItem><ListItemIcon><NotificationsIcon /></ListItemIcon><ListItemText primary={t('notifications')} /></ListItem>
                                                <ListItem><ListItemIcon><TranslateIcon /></ListItemIcon><ListItemText primary={t('language')} /><LanguageSwitch /></ListItem>
                                                <ListItem><ListItemIcon><Brightness7Icon /></ListItemIcon><ListItemText primary={t('theme')} /><ThemeSwitch /></ListItem>
                                                <Divider sx={{ my: 1 }} />
                                                {userMenuItems.map((item) => (
                                                    <ListItemButton key={item.key} component={Link} href={item.href} onClick={handleCloseMobileOptions}><ListItemIcon>{item.icon}</ListItemIcon><ListItemText primary={t(`userMenu.${item.key}`)} /></ListItemButton>
                                                ))}
                                                <ListItemButton onClick={handleCloseMobileOptions}><ListItemIcon><LogoutIcon color="error" /></ListItemIcon><ListItemText primary={t('userMenu.logout')} primaryTypographyProps={{ color: 'error' }} /></ListItemButton>
                                            </List>
                                        </DialogContent>
                                    </Dialog>
                                </>
                            ) : (
                                <>
                                    <LanguageSwitch />
                                    <ThemeSwitch />
                                    <Tooltip title={t('notifications')}><IconButton color="inherit"><NotificationsIcon /></IconButton></Tooltip>
                                    <Tooltip title={t('userMenu.openSettings')}>
                                        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}><Avatar alt={user.name} src={user.avatar} /></IconButton>
                                    </Tooltip>
                                    <Menu sx={{ mt: '45px' }} anchorEl={anchorElUser} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} keepMounted transformOrigin={{ vertical: 'top', horizontal: 'right' }} open={Boolean(anchorElUser)} onClose={handleCloseUserMenu}>
                                        {userMenuItems.map((item) => (
                                            <MenuItem key={item.key} onClick={handleCloseUserMenu} component={Link} href={item.href}><ListItemIcon>{item.icon}</ListItemIcon><ListItemText>{t(`userMenu.${item.key}`)}</ListItemText></MenuItem>
                                        ))}
                                        <Divider sx={{ my: 0.5 }} />
                                        <MenuItem onClick={handleCloseUserMenu}><ListItemIcon><LogoutIcon fontSize="small" color="error" /></ListItemIcon><ListItemText primaryTypographyProps={{ color: 'error' }}>{t('userMenu.logout')}</ListItemText></MenuItem>
                                    </Menu>
                                </>
                            )}
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
            <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
                {drawerContent}
            </Drawer>
        </>
    );
}
