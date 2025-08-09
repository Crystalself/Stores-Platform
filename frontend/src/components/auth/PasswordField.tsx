'use client';

import { useState } from 'react';
import {
  TextField,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { SxProps, Theme } from '@mui/material/styles';

interface PasswordFieldProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showPassword?: boolean;
  onTogglePassword?: () => void;
  required?: boolean;
  sx?: SxProps<Theme>;
  error?: boolean;
  helperText?: string;
  autoComplete?: string;
}

export function PasswordField({
  label,
  value,
  onChange,
  showPassword = false,
  onTogglePassword,
  required = false,
  sx,
  error,
  helperText,
  autoComplete,
}: PasswordFieldProps) {
  const [localShowPassword, setLocalShowPassword] = useState(false);
  
  const isPasswordVisible = showPassword !== undefined ? showPassword : localShowPassword;
  const handleTogglePassword = onTogglePassword || (() => setLocalShowPassword(!localShowPassword));

  return (
    <TextField
      fullWidth
      label={label}
      type={isPasswordVisible ? 'text' : 'password'}
      value={value}
      onChange={onChange}
      required={required}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={handleTogglePassword}
              edge="end"
            >
              {isPasswordVisible ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      }}
      sx={sx}
      error={error}
      helperText={helperText}
      autoComplete={autoComplete}
    />
  );
} 