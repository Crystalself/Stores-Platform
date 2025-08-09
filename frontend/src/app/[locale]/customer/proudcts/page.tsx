// ✅ ملف: app/[locale]/feed/page.tsx
'use client';

import React, { Suspense } from 'react';
import ProductFeed from '@/components/products/ProductFeed';
import { Box, CircularProgress } from '@mui/material';
import FeedHeader from '@/components/feed/FeedHeader';

export default function FeedPage() {
  return (
    <>
      <FeedHeader />

      <style jsx global>{`
        @keyframes gradientMovePro {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>

      <Suspense fallback={<Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>}>
        <ProductFeed />
      </Suspense>
    </>
  );
}
