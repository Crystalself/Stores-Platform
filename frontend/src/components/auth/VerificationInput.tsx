'use client';

import { useRef, useEffect } from 'react';
import {
  Box,
  TextField,
} from '@mui/material';
import { SxProps, Theme } from '@mui/material/styles';

interface VerificationInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  sx?: SxProps<Theme>;
}

export function VerificationInput({ 
  value, 
  onChange, 
  length = 6,
  sx 
}: VerificationInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const numericInput = input.replace(/\D/g, '');
    
    if (numericInput.length <= length) {
      onChange(numericInput);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && value.length === 0) {
      e.preventDefault();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const numericData = pastedData.replace(/\D/g, '');
    const truncatedData = numericData.slice(0, length);
    onChange(truncatedData);
  };

  useEffect(() => {
    if (value.length === length && inputRef.current) {
      inputRef.current.blur();
    }
  }, [value, length]);

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', ...sx }}>
      <TextField
        ref={inputRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        inputProps={{
          maxLength: length,
          style: { 
            textAlign: 'center',
            fontSize: '1.5rem',
            letterSpacing: '0.5rem',
            fontWeight: 'bold',
          }
        }}
        placeholder={"0".repeat(length)}
        sx={{
          width: '100%',
          maxWidth: 300,
          '& .MuiInputBase-input': {
            textAlign: 'center',
          },
        }}
      />
    </Box>
  );
} 