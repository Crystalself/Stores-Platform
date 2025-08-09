import React, { RefObject } from 'react';
import { TextField, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

export interface AnimatedTextFieldProps {
  inputRef: RefObject<HTMLInputElement>;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error: boolean;
  touched: boolean;
  helperText?: string;
  type?: string;
  autoComplete?: string;
  [key: string]: unknown;
}

export const AnimatedTextField: React.FC<AnimatedTextFieldProps> = ({
  inputRef, label, value, onChange, error, touched, helperText, type = 'text', autoComplete, ...props
}) => {
  const theme = useTheme();
  return (
    <TextField
      inputRef={inputRef}
      fullWidth
      label={label}
      value={value}
      onChange={onChange}
      error={error && touched}
      type={type}
      autoComplete={autoComplete}
      margin="normal"
      InputProps={{
        endAdornment: (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: touched ? 1 : 0, scale: touched ? 1 : 0.8 }}
            transition={{ duration: 0.2 }}
          >
            {error && touched ? <CancelIcon color="error" /> : touched ? <CheckCircleIcon color="success" /> : null}
          </motion.div>
        ),
        sx: {
          borderColor: error && touched
            ? theme.palette.error.main
            : touched
            ? theme.palette.success.main
            : theme.palette.grey[300],
          transition: 'border-color 0.3s',
        },
      }}
      helperText={
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: error && touched ? 1 : 0, y: error && touched ? 0 : 10 }}
          transition={{ duration: 0.2 }}
          aria-live="polite"
        >
          {error && touched ? helperText : ''}
        </motion.div>
      }
      {...props}
    />
  );
}; 