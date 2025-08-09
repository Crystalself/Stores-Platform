"use client";
import React, { useState } from 'react';
import { Box, Card, CardMedia, Grid } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductGalleryProps {
  images: string[];
  altText: string;
}

const ProductGallery: React.FC<ProductGalleryProps> = ({ images, altText }) => {
  const [selectedImage, setSelectedImage] = useState(images[0]);

  return (
    <Box>
      <Card sx={{ mb: 2, overflow: 'hidden' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CardMedia
              component="img"
              image={selectedImage}
              alt={altText}
              sx={{ height: 400, objectFit: 'cover' }}
              loading="lazy"
              // Optionally add srcSet for WebP if available
            />
          </motion.div>
        </AnimatePresence>
      </Card>
      <Grid container spacing={1}>
        {images.map((img, index) => (
          <Grid item xs={3} key={index}>
            <Card
              onClick={() => setSelectedImage(img)}
              sx={{
                cursor: 'pointer',
                border: selectedImage === img ? '2px solid' : '2px solid transparent',
                borderColor: selectedImage === img ? 'primary.main' : 'transparent',
                transition: 'border-color 0.2s',
              }}
            >
              <CardMedia component="img" image={img} alt={`${altText} thumbnail ${index + 1}`} sx={{ height: 80, objectFit: 'cover' }} loading="lazy" />
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
export default ProductGallery;