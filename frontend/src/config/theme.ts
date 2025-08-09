"use client";
import { createTheme, Theme } from "@mui/material/styles";

// Greek-inspired, global SaaS color palette
const colors = {
  primary: {
    50: '#f2f6ff', 100: '#d9e2ff', 200: '#b0c4ff', 300: '#7a9fff', 400: '#4c7dff', 500: '#2156f8', 600: '#1a44c2', 700: '#16389e', 800: '#122c7a', 900: '#0d1e4d',
    darkBg: '#181c24', // deep blue-black
    darkSurface: '#232837', // slightly lighter for surfaces
    darkHover: '#232d3b', // hover for surfaces
    darkActive: '#1a2233', // active/pressed
    darkBorder: '#232d3b',
    darkText: '#e3e8ef', // high contrast, not pure white
  },
  secondary: {
    50: '#fff8e1', 100: '#ffecb3', 200: '#ffe082', 300: '#ffd54f', 400: '#ffca28', 500: '#ffc107', 600: '#ffb300', 700: '#ffa000', 800: '#ff8f00', 900: '#ff6f00',
    dark: '#ffd54f', // gold accent for dark mode
    darkText: '#fffbe6',
  },
  accent: {
    50: '#e3fcec', 100: '#b2f2d7', 200: '#7be0b0', 300: '#3bc98e', 400: '#16b97e', 500: '#009e60', 600: '#007a47', 700: '#005c36', 800: '#003e25', 900: '#002214',
    dark: '#21b573', // teal-green for dark mode
    darkText: '#e3fcec',
  },
  gold: {
    50: '#fffbe6', 100: '#fff3bf', 200: '#ffe066', 300: '#ffd700', 400: '#ffc300', 500: '#ffb300', 600: '#ffa000', 700: '#ff8c00', 800: '#ff7f00', 900: '#ff6f00',
    dark: '#ffd700',
    darkText: '#fffbe6',
  },
  grey: {
    50: '#f8f9fa', 100: '#f1f3f5', 200: '#e9ecef', 300: '#dee2e6', 400: '#ced4da', 500: '#adb5bd', 600: '#868e96', 700: '#495057', 800: '#343a40', 900: '#212529',
    darkBg: '#181c24',
    darkSurface: '#232837',
    darkHover: '#232d3b',
    darkBorder: '#2c3240',
    darkText: '#e3e8ef',
    darkSecondaryText: '#b0b8c1',
    darkDivider: '#2c3240',
  },
  error: {
    50: '#fff5f5', 100: '#ffe3e3', 200: '#ffbdbd', 300: '#ff8787', 400: '#ff6b6b', 500: '#fa5252', 600: '#f03e3e', 700: '#e03131', 800: '#c92a2a', 900: '#a51111',
    dark: '#ff6b6b',
    darkBg: '#2a1a1a',
    darkText: '#ffbdbd',
  },
};

// Custom font families for use in components if needed
export const fontFamilies = {
  primary: 'Poppins, Inter, "Noto Sans", "Helvetica Neue", Arial, sans-serif',
  mono: 'JetBrains Mono, Fira Code, Consolas, monospace',
  greek: 'Noto Sans Greek, Poppins, Inter, Arial, sans-serif',
};

const getShadows = (shadow: string) => [
  'none',
  ...Array(24).fill(shadow)
] as [
  'none', string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string
];

const typography = {
  fontFamily: fontFamilies.greek,
  h1: { fontSize: '2.8rem', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.03em' },
  h2: { fontSize: '2.2rem', fontWeight: 700, lineHeight: 1.2 },
  h3: { fontSize: '1.8rem', fontWeight: 700, lineHeight: 1.3 },
  h4: { fontSize: '1.5rem', fontWeight: 600, lineHeight: 1.4 },
  h5: { fontSize: '1.2rem', fontWeight: 600, lineHeight: 1.5 },
  h6: { fontSize: '1rem', fontWeight: 600, lineHeight: 1.5 },
  subtitle1: { fontSize: '1.1rem', fontWeight: 500, lineHeight: 1.6 },
  subtitle2: { fontSize: '1rem', fontWeight: 500, lineHeight: 1.6 },
  body1: { fontSize: '1rem', fontWeight: 400, lineHeight: 1.7 },
  body2: { fontSize: '0.95rem', fontWeight: 400, lineHeight: 1.7 },
  button: { fontSize: '1rem', fontWeight: 700, lineHeight: 1.5, textTransform: 'none' as const },
  caption: { fontSize: '0.85rem', fontWeight: 500, lineHeight: 1.5 },
  overline: { fontSize: '0.8rem', fontWeight: 700, lineHeight: 1.5, textTransform: 'uppercase' as const, letterSpacing: '0.1em' },
};

const componentOverrides = {
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 16,
        textTransform: 'none' as const,
        fontWeight: 700,
        letterSpacing: '0.02em',
        padding: '0.75rem 2rem',
        boxShadow: '0 2px 12px 0 rgba(33,86,248,0.08)',
        transition: 'all 0.2s cubic-bezier(.4,0,.2,1)',
        '&:hover': { boxShadow: '0 4px 24px 0 rgba(33,86,248,0.12)' },
      },
      contained: {
        background: `linear-gradient(90deg, ${colors.primary[500]} 0%, ${colors.primary[700]} 100%)`,
        color: '#fff',
        '&:hover': {
          background: `linear-gradient(90deg, ${colors.primary[700]} 0%, ${colors.primary[900]} 100%)`,
        },
      },
      outlined: {
        borderWidth: 2,
        borderColor: colors.primary[500],
        color: colors.primary[700],
        '&:hover': { borderColor: colors.primary[700], background: colors.primary[50] },
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: ({ theme }: { theme: Theme }) => ({
        borderRadius: 24,
        boxShadow: '0 4px 32px 0 rgba(33,86,248,0.08)',
        padding: '2rem',
        background: theme.palette.mode === 'dark' ? colors.primary.darkSurface : '#fff',
      }),
    },
  },
  MuiTextField: {
    styleOverrides: {
      root: {
        borderRadius: 16,
        background: colors.grey[50],
        '& .MuiOutlinedInput-root': {
          borderRadius: 16,
          background: colors.grey[50],
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: colors.primary[300] },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: colors.primary[500], borderWidth: 2 },
        },
      },
    },
  },
  MuiAppBar: {
    styleOverrides: {
      root: ({ theme }: { theme: Theme }) => ({
        backdropFilter: 'blur(12px)',
        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(144, 157, 182, 0.95)' : 'rgba(255,255,255,0.95)',
        boxShadow: '0 2px 8px rgba(33,86,248,0.08)',
      }),
    },
  },
  MuiDrawer: {
    styleOverrides: {
      paper: ({ theme }: { theme: Theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? colors.primary.darkSurface : 'rgba(255,255,255,0.98)',
        backdropFilter: 'blur(12px)',
      }),
    },
  },
  MuiChip: {
    styleOverrides: {
      root: { borderRadius: 20, fontWeight: 600, fontSize: '1rem' },
    },
  },
  MuiFab: {
    styleOverrides: {
      root: {
        boxShadow: '0 4px 24px rgba(33,86,248,0.12)',
        '&:hover': { boxShadow: '0 8px 32px rgba(33,86,248,0.18)' },
      },
    },
  },
  // INPUTS & FIELDS
  MuiInputBase: {
    styleOverrides: {
      root: {
        borderRadius: 12,
        background: colors.grey[50],
        fontSize: '1.05rem',
        fontWeight: 500,
        transition: 'box-shadow 0.2s',
        '&.Mui-disabled': {
          background: colors.grey[100],
          color: colors.grey[400],
        },
      },
      input: {
        padding: '0.75rem 1rem',
        '::placeholder': {
          color: colors.grey[400],
          opacity: 1,
        },
      },
    },
  },
  MuiOutlinedInput: {
    styleOverrides: {
      root: {
        borderRadius: 12,
        background: colors.grey[50],
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: colors.primary[500],
          boxShadow: `0 0 0 2px ${colors.primary[100]}`,
        },
      },
      notchedOutline: {
        borderColor: colors.grey[300],
      },
    },
  },
  MuiFilledInput: {
    styleOverrides: {
      root: {
        borderRadius: 12,
        background: colors.grey[100],
        '&:hover': {
          background: colors.grey[200],
        },
        '&.Mui-focused': {
          background: colors.grey[50],
        },
      },
    },
  },
  MuiInputLabel: {
    styleOverrides: {
      root: {
        fontWeight: 600,
        color: colors.grey[700],
        fontSize: '1rem',
        letterSpacing: '0.01em',
      },
    },
  },
  MuiFormLabel: {
    styleOverrides: {
      root: {
        fontWeight: 600,
        color: colors.grey[700],
        fontSize: '1rem',
      },
    },
  },
  MuiFormHelperText: {
    styleOverrides: {
      root: {
        fontSize: '0.92rem',
        color: colors.grey[600],
        marginLeft: 0,
      },
    },
  },
  MuiInputAdornment: {
    styleOverrides: {
      root: {
        color: colors.grey[500],
      },
    },
  },
  // OUTPUTS & DISPLAY
  MuiTypography: {
    styleOverrides: {
      root: {
        color: 'inherit',
        fontFamily: fontFamilies.greek,
      },
    },
  },
  MuiAlert: {
    styleOverrides: {
      root: {
        borderRadius: 12,
        fontWeight: 500,
        fontSize: '1rem',
        boxShadow: '0 2px 8px 0 rgba(250,82,82,0.06)',
      },
      standardError: {
        background: colors.error[50],
        color: colors.error[700],
      },
      standardSuccess: {
        background: colors.accent[50],
        color: colors.accent[700],
      },
      standardWarning: {
        background: colors.gold[50],
        color: colors.gold[700],
      },
      standardInfo: {
        background: colors.primary[50],
        color: colors.primary[700],
      },
    },
  },
  MuiAlertTitle: {
    styleOverrides: {
      root: {
        fontWeight: 700,
        fontSize: '1.1rem',
      },
    },
  },
  MuiTooltip: {
    styleOverrides: {
      tooltip: ({ theme }: { theme: Theme }) => ({
        borderRadius: 8,
        background: theme.palette.mode === 'dark' ? colors.grey[800] : colors.grey[900],
        color: '#fff',
        fontSize: '0.98rem',
        fontWeight: 500,
        boxShadow: '0 2px 8px 0 rgba(33,86,248,0.10)',
        padding: '0.6em 1em',
      }),
      arrow: ({ theme }: { theme: Theme }) => ({
        color: theme.palette.mode === 'dark' ? colors.grey[800] : colors.grey[900],
      }),
    },
  },
  // MENUS & DROPDOWNS
  MuiMenu: {
    styleOverrides: {
      paper: ({ theme }: { theme: Theme }) => ({
        borderRadius: 14,
        boxShadow: '0 8px 32px 0 rgba(33,86,248,0.10)',
        minWidth: 180,
        padding: '0.5em 0',
        background: theme.palette.mode === 'dark' ? colors.primary.darkSurface : '#fff',
      }),
    },
  },
  MuiMenuItem: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        fontWeight: 500,
        fontSize: '1rem',
        padding: '0.7em 1.5em',
        transition: 'background 0.2s',
        '&:hover': {
          background: colors.primary[50],
        },
        '&.Mui-selected': {
          background: colors.primary[100],
          color: colors.primary[700],
        },
      },
    },
  },
  // LISTS
  MuiList: {
    styleOverrides: {
      root: ({ theme }: { theme: Theme }) => ({
        borderRadius: 12,
        background: theme.palette.mode === 'dark' ? colors.primary.darkSurface : '#fff',
        boxShadow: '0 2px 8px 0 rgba(33,86,248,0.04)',
        padding: '0.5em 0',
      }),
    },
  },
  MuiListItem: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        fontWeight: 500,
        fontSize: '1rem',
        padding: '0.7em 1.5em',
        transition: 'background 0.2s',
        '&:hover': {
          background: colors.primary[50],
        },
        '&.Mui-selected': {
          background: colors.primary[100],
          color: colors.primary[700],
        },
      },
    },
  },
  // TABLES
  MuiTable: {
    styleOverrides: {
      root: ({ theme }: { theme: Theme }) => ({
        borderRadius: 12,
        background: theme.palette.mode === 'dark' ? colors.primary.darkSurface : '#fff',
        boxShadow: '0 2px 8px 0 rgba(33,86,248,0.04)',
      }),
    },
  },
  MuiTableHead: {
    styleOverrides: {
      root: ({ theme }: { theme: Theme }) => ({
        background: theme.palette.mode === 'dark' ? colors.primary.darkBg : colors.primary[50],
        '& .MuiTableCell-head': {
          fontWeight: 700,
          color: theme.palette.mode === 'dark' ? colors.primary.darkText : colors.primary[700],
          fontSize: '1.05rem',
        },
      }),
    },
  },
  MuiTableCell: {
    styleOverrides: {
      root: ({ theme }: { theme: Theme }) => ({
        fontSize: '1rem',
        borderBottom: `1px solid ${theme.palette.mode === 'dark' ? colors.grey.darkBorder : colors.grey[200]}`,
        padding: '0.85em 1.2em',
        color: theme.palette.mode === 'dark' ? colors.primary.darkText : colors.grey[800],
      }),
      head: ({ theme }: { theme: Theme }) => ({
        fontWeight: 700,
        color: theme.palette.mode === 'dark' ? colors.primary.darkText : colors.primary[700],
        background: theme.palette.mode === 'dark' ? colors.primary.darkBg : colors.primary[50],
      }),
      body: ({ theme }: { theme: Theme }) => ({
        color: theme.palette.mode === 'dark' ? colors.primary.darkText : colors.grey[800],
      }),
    },
  },
  MuiTableRow: {
    styleOverrides: {
      root: {
        transition: 'background 0.2s',
        '&:hover': {
          background: colors.primary[50],
        },
      },
    },
  },
  MuiTableBody: {
    styleOverrides: {
      root: {
        background: '#fff',
      },
    },
  },
  MuiTableContainer: {
    styleOverrides: {
      root: {
        borderRadius: 12,
        boxShadow: '0 2px 8px 0 rgba(33,86,248,0.04)',
        background: '#fff',
      },
    },
  },
  MuiTablePagination: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        background: colors.grey[50],
        fontWeight: 500,
      },
      toolbar: {
        paddingLeft: 16,
        paddingRight: 16,
      },
      selectIcon: {
        color: colors.primary[500],
      },
    },
  },
  MuiTableSortLabel: {
    styleOverrides: {
      root: {
        color: colors.primary[700],
        '&.Mui-active': {
          color: colors.primary[900],
        },
      },
      icon: {
        color: colors.primary[500],
      },
    },
  },
  // SNACKBAR
  MuiSnackbar: {
    styleOverrides: {
      root: {
        borderRadius: 12,
        boxShadow: '0 2px 8px 0 rgba(33,86,248,0.10)',
        fontWeight: 500,
        fontSize: '1rem',
      },
    },
  },
  // DIALOGS & POPOVERS
  MuiDialog: {
    styleOverrides: {
      paper: ({ theme }: { theme: Theme }) => ({
        borderRadius: 18,
        boxShadow: '0 8px 32px 0 rgba(33,86,248,0.12)',
        padding: '1.5em 1.5em 1em 1.5em',
        background: theme.palette.mode === 'dark' ? colors.primary.darkSurface : '#fff',
      }),
    },
  },
  MuiDialogTitle: {
    styleOverrides: {
      root: {
        fontWeight: 700,
        fontSize: '1.3rem',
        paddingBottom: 8,
      },
    },
  },
  MuiDialogContent: {
    styleOverrides: {
      root: {
        padding: '1em 0',
      },
    },
  },
  MuiDialogActions: {
    styleOverrides: {
      root: {
        padding: '0.5em 0 0.5em 0',
      },
    },
  },
  MuiPopover: {
    styleOverrides: {
      paper: {
        borderRadius: 14,
        boxShadow: '0 8px 32px 0 rgba(33,86,248,0.10)',
      },
    },
  },
  // PAPER
  MuiPaper: {
    styleOverrides: {
      root: ({ theme }: { theme: Theme }) => ({
        borderRadius: 16,
        boxShadow: '0 2px 12px 0 rgba(33,86,248,0.08)',
        background: theme.palette.mode === 'dark' ? colors.primary.darkSurface : '#fff',
      }),
    },
  },
  // TABS
  MuiTabs: {
    styleOverrides: {
      root: {
        minHeight: 48,
        borderRadius: 12,
        background: colors.grey[50],
        padding: '0.2em 0.5em',
      },
      indicator: {
        height: 4,
        borderRadius: 4,
        background: colors.primary[500],
      },
    },
  },
  MuiTab: {
    styleOverrides: {
      root: {
        fontWeight: 600,
        fontSize: '1rem',
        borderRadius: 8,
        minHeight: 44,
        padding: '0.7em 1.5em',
        transition: 'background 0.2s',
        '&.Mui-selected': {
          color: colors.primary[700],
          background: colors.primary[50],
        },
      },
    },
  },
  // ACCORDION
  MuiAccordion: {
    styleOverrides: {
      root: {
        borderRadius: 14,
        boxShadow: '0 2px 8px 0 rgba(33,86,248,0.06)',
        background: '#fff',
        margin: '0.5em 0',
        '&:before': {
          display: 'none',
        },
      },
    },
  },
  MuiAccordionSummary: {
    styleOverrides: {
      root: {
        borderRadius: 12,
        fontWeight: 600,
        fontSize: '1.05rem',
        background: colors.grey[50],
        minHeight: 48,
        '&.Mui-expanded': {
          minHeight: 48,
        },
      },
      content: {
        margin: 0,
      },
    },
  },
  MuiAccordionDetails: {
    styleOverrides: {
      root: {
        padding: '1em',
        background: colors.grey[50],
        borderRadius: 10,
      },
    },
  },
  // STEPPER
  MuiStepper: {
    styleOverrides: {
      root: {
        background: 'transparent',
        padding: 0,
      },
    },
  },
  MuiStep: {
    styleOverrides: {
      root: {
        padding: 0,
      },
    },
  },
  MuiStepLabel: {
    styleOverrides: {
      label: {
        fontWeight: 600,
        fontSize: '1rem',
      },
    },
  },
  MuiStepContent: {
    styleOverrides: {
      root: {
        marginLeft: 16,
        borderLeft: `2px solid ${colors.primary[100]}`,
        paddingLeft: 16,
      },
    },
  },
  // PAGINATION
  MuiPagination: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        background: 'transparent',
        padding: '0.5em',
      },
      ul: {
        gap: 8,
      },
    },
  },
  // BREADCRUMBS
  MuiBreadcrumbs: {
    styleOverrides: {
      root: {
        fontWeight: 500,
        fontSize: '1rem',
        color: colors.grey[700],
      },
      separator: {
        color: colors.grey[400],
      },
    },
  },
  // AVATAR & BADGE
  MuiAvatar: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        fontWeight: 600,
        fontSize: '1.1rem',
        background: colors.primary[100],
        color: colors.primary[700],
      },
    },
  },
  MuiBadge: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        fontWeight: 700,
        fontSize: '0.9rem',
        background: colors.error[500],
        color: '#fff',
        padding: '0.2em 0.6em',
      },
    },
  },
  // BOTTOM NAVIGATION
  MuiBottomNavigation: {
    styleOverrides: {
      root: {
        borderRadius: 14,
        background: colors.grey[50],
        boxShadow: '0 2px 8px 0 rgba(33,86,248,0.06)',
      },
    },
  },
  MuiBottomNavigationAction: {
    styleOverrides: {
      root: {
        color: colors.grey[600],
        '&.Mui-selected': {
          color: colors.primary[700],
        },
      },
    },
  },
  // COLLAPSE
  MuiCollapse: {
    styleOverrides: {
      root: {
        transition: 'height 0.3s',
      },
    },
  },
  // DIVIDER
  MuiDivider: {
    styleOverrides: {
      root: {
        borderColor: colors.grey[200],
        borderWidth: 2,
        opacity: 0.8,
      },
    },
  },
  // GRID
  MuiGrid: {
    styleOverrides: {
      root: {
        gap: 16,
      },
    },
  },
  // ICON & ICON BUTTON
  MuiIcon: {
    styleOverrides: {
      root: {
        fontSize: '1.3rem',
        color: colors.primary[500],
      },
    },
  },
  MuiIconButton: {
    styleOverrides: {
      root: {
        borderRadius: 10,
        background: 'transparent',
        transition: 'background 0.2s',
        '&:hover': {
          background: colors.primary[50],
        },
      },
    },
  },
  // IMAGE LIST
  MuiImageList: {
    styleOverrides: {
      root: {
        borderRadius: 12,
        gap: 8,
      },
    },
  },
  MuiImageListItem: {
    styleOverrides: {
      root: {
        borderRadius: 10,
        overflow: 'hidden',
      },
    },
  },
  // LINEAR PROGRESS
  MuiLinearProgress: {
    styleOverrides: {
      root: {
        borderRadius: 6,
        height: 10,
        background: colors.grey[200],
      },
      bar: {
        borderRadius: 6,
        background: colors.primary[500],
      },
    },
  },
  // LINK
  MuiLink: {
    styleOverrides: {
      root: {
        color: colors.primary[600],
        fontWeight: 600,
        textDecoration: 'none',
        transition: 'color 0.2s',
        '&:hover': {
          color: colors.primary[900],
          textDecoration: 'underline',
        },
      },
    },
  },
  // MODAL
  MuiModal: {
    styleOverrides: {
      root: {
        backdropFilter: 'blur(4px)',
      },
    },
  },
  // SKELETON
  MuiSkeleton: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        background: colors.grey[200],
      },
    },
  },
  // SPEED DIAL
  MuiSpeedDial: {
    styleOverrides: {
      fab: {
        borderRadius: 12,
        boxShadow: '0 4px 24px rgba(33,86,248,0.12)',
      },
    },
  },
  MuiSpeedDialAction: {
    styleOverrides: {
      fab: {
        borderRadius: 10,
        background: colors.primary[500],
        color: '#fff',
        '&:hover': {
          background: colors.primary[700],
        },
      },
    },
  },
  // TOGGLE BUTTONS
  MuiToggleButton: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        fontWeight: 600,
        fontSize: '1rem',
        borderColor: colors.primary[100],
        color: colors.primary[700],
        '&.Mui-selected': {
          background: colors.primary[100],
          color: colors.primary[900],
        },
      },
    },
  },
  MuiToggleButtonGroup: {
    styleOverrides: {
      root: {
        borderRadius: 10,
        gap: 8,
      },
    },
  },
  // TREE VIEW
  MuiTreeView: {
    styleOverrides: {
      root: {
        background: 'transparent',
        borderRadius: 10,
        padding: 4,
      },
    },
  },
  MuiTreeItem: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        fontWeight: 500,
        fontSize: '1rem',
        padding: '0.5em 1em',
        transition: 'background 0.2s',
        '&:hover': {
          background: colors.primary[50],
        },
        '&.Mui-selected': {
          background: colors.primary[100],
          color: colors.primary[700],
        },
      },
    },
  },
};

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: colors.primary[500],
      light: colors.primary[300],
      dark: colors.primary[900],
      contrastText: '#fff',
    },
    secondary: {
      main: colors.secondary[500],
      light: colors.secondary[300],
      dark: colors.secondary[900],
      contrastText: '#fff',
    },
    error: {
      main: colors.error[500],
      light: colors.error[300],
      dark: colors.error[900],
      contrastText: '#fff',
    },
    warning: {
      main: colors.secondary[700],
      light: colors.secondary[300],
      dark: colors.secondary[900],
      contrastText: '#fff',
    },
    info: {
      main: colors.primary[300],
      light: colors.primary[100],
      dark: colors.primary[700],
      contrastText: '#fff',
    },
    success: {
      main: colors.accent[500],
      light: colors.accent[300],
      dark: colors.accent[900],
      contrastText: '#fff',
    },
    grey: colors.grey,
    background: {
      default: '#f8f9fa',
      paper: '#fff',
    },
    text: {
      primary: colors.grey[900],
      secondary: colors.grey[700],
    },
    divider: colors.grey[200],
  },
  typography,
  components: componentOverrides,
  shape: { borderRadius: 16 },
  shadows: getShadows('0 2px 12px 0 rgba(33,86,248,0.08)'),
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: colors.primary[400],
      light: colors.primary[200],
      dark: colors.primary[900],
      contrastText: colors.primary.darkText,
    },
    secondary: {
      main: colors.secondary.dark,
      light: colors.secondary[200],
      dark: colors.secondary[900],
      contrastText: colors.secondary.darkText,
    },
    error: {
      main: colors.error.dark,
      light: colors.error[200],
      dark: colors.error[900],
      contrastText: colors.error.darkText,
    },
    warning: {
      main: colors.gold.dark,
      light: colors.gold[200],
      dark: colors.gold[900],
      contrastText: colors.gold.darkText,
    },
    info: {
      main: colors.primary[200],
      light: colors.primary[100],
      dark: colors.primary[700],
      contrastText: colors.primary.darkText,
    },
    success: {
      main: colors.accent.dark,
      light: colors.accent[200],
      dark: colors.accent[900],
      contrastText: colors.accent.darkText,
    },
    grey: colors.grey,
    background: {
      default: '#23272f',
      paper: '#2c2f36',
    },
    text: {
      primary: colors.primary.darkText,
      secondary: colors.grey.darkSecondaryText,
    },
    divider: colors.grey.darkDivider,
  },
  typography,
  components: componentOverrides,
  shape: { borderRadius: 16 },
  shadows: getShadows('0 4px 24px 0 rgba(33,86,248,0.12)'),
});

export { colors };

export const themeConfig = {
  light: lightTheme,
  dark: darkTheme,
  colors,
  typography,
};
