import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { useThemeMode } from '@/contexts/ThemeContext';

const ThemeSwitch: React.FC = React.memo(() => {
  const { mode, toggleTheme } = useThemeMode();
  return (
    <Tooltip title={mode === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}>
      <IconButton
        onClick={toggleTheme}
        color="primary"
        aria-label="Toggle theme"
        size="large"
        sx={{ border: 1, borderColor: 'divider', bgcolor: 'background.paper', mx: 0.5 }}
      >
        {mode === 'light' ? (
          <MoonIcon style={{ width: 24, height: 24 }} />
        ) : (
          <SunIcon style={{ width: 24, height: 24 }} />
        )}
      </IconButton>
    </Tooltip>
  );
});
ThemeSwitch.displayName = 'ThemeSwitch';
export default ThemeSwitch; 