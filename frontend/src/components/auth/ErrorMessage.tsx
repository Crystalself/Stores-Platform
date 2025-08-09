'use client';

import { Alert, AlertTitle } from '@mui/material';

interface ErrorMessageProps {
  error: string;
  title?: string;
}

export function ErrorMessage({ error, title }: ErrorMessageProps) {
  if (!error) return null;

  return (
    <Alert severity="error" sx={{ mb: 2 }}>
      {title && <AlertTitle>{title}</AlertTitle>}
      {error}
    </Alert>
  );
} 