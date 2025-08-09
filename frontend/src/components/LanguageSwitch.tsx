import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { IconButton, Tooltip } from '@mui/material';
import { GlobeAltIcon } from '@heroicons/react/24/outline';

const LanguageSwitch: React.FC = React.memo(() => {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = pathname.split('/')[1];
  const nextLocale = currentLocale === 'ar' ? 'en' : 'ar';

  const handleSwitch = () => {
    // Replace the first segment with the next locale
    const segments = pathname.split('/');
    segments[1] = nextLocale;
    router.push(segments.join('/'));
  };

  return (
    <Tooltip title={nextLocale === 'ar' ? 'التبديل إلى العربية' : 'Switch to English'}>
      <IconButton
        onClick={handleSwitch}
        color="primary"
        aria-label="Switch language"
        size="large"
        sx={{ border: 1, borderColor: 'divider', bgcolor: 'background.paper', mx: 0.5 }}
      >
        <GlobeAltIcon style={{ width: 24, height: 24 }} />
      </IconButton>
    </Tooltip>
  );
});
LanguageSwitch.displayName = 'LanguageSwitch';
export default LanguageSwitch; 