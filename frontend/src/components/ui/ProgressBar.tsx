import { Box, Typography } from '@mui/material';
import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  step: number;
  total: number;
  labels?: string[];
  onStepClick?: (step: number) => void;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ step, total, labels = [], onStepClick }) => (
  <Box sx={{ width: '100%', mb: 4 }} aria-label="Registration progress" role="progressbar" aria-valuenow={step} aria-valuemin={1} aria-valuemax={total}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      {[...Array(total)].map((_, i) => {
        const isCompleted = i < step;
        const isActive = i + 1 === step;
        const isClickable = !!onStepClick && isCompleted && i + 1 < step;
        return (
          <motion.div
            key={i}
            initial={{ scaleY: 0.8, opacity: 0.7 }}
            animate={{
              background: isCompleted
                ? 'linear-gradient(90deg, #2156f8 0%, #16389e 100%)'
                : '#e9ecef',
              scaleY: isActive ? 1.2 : 1,
              opacity: isCompleted || isActive ? 1 : 0.7,
            }}
            transition={{ duration: 0.4, type: 'spring', bounce: 0.2 }}
            style={{
              flex: 1,
              height: 6,
              borderRadius: 3,
              cursor: isClickable ? 'pointer' : 'default',
              outline: isClickable ? '2px solid #2156f8' : 'none',
            }}
            tabIndex={isClickable ? 0 : -1}
            aria-label={labels[i] ? `${labels[i]}${isCompleted ? ' (completed)' : ''}` : `Step ${i + 1}`}
            onClick={isClickable ? () => onStepClick(i + 1) : undefined}
            onKeyDown={isClickable ? (e) => { if (e.key === 'Enter' || e.key === ' ') onStepClick(i + 1); } : undefined}
          />
        );
      })}
    </Box>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
      {(labels.length === total ? labels : Array.from({ length: total }, (_, i) => `Step ${i + 1}`)).map((label, i) => (
        <motion.span
          key={i}
          animate={{
            color: step === i + 1 ? '#2156f8' : '#888',
            fontWeight: step === i + 1 ? 700 : 400,
            scale: step === i + 1 ? 1.1 : 1,
          }}
          transition={{ duration: 0.3 }}
        >
          <Typography variant="caption">{label}</Typography>
        </motion.span>
      ))}
    </Box>
  </Box>
); 