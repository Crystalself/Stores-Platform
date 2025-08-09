// src/components/products/ProductForm.tsx

"use client";
import React, { useState } from 'react';
import { TextField, Button, Box, MenuItem, CircularProgress, Alert, Typography, IconButton } from '@mui/material';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import * as yup from 'yup';
import { PhotoCamera, Clear } from '@mui/icons-material';

// أفترض أن هذه الـ types موجودة لديك
import { CreateProductDTO, ProductCategory, Product } from '@/models/product';

// 1. تحديث الـ Props لتشمل دالة onCancel
interface ProductFormProps {
  isEditMode?: boolean;
  initialData?: Product;
  onSubmit: (data: FormData) => Promise<any>; // سيتم الآن إرسال FormData مباشرة
  onCancel: () => void; // زر للإلغاء أو الرجوع
}

// 2. تحديث النوع ليشمل الملفات بدلاً من الروابط النصية
type FormState = Omit<CreateProductDTO, 'thumbnail_image' | 'images'> & {
  thumbnail_image: File | null;
  images: File[];
};

const ProductForm: React.FC<ProductFormProps> = ({ isEditMode = false, initialData, onSubmit, onCancel }) => {
  const t = useTranslations();
  
  const [loading, setLoading] = useState(false);
  const [formStatus, setFormStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  
  // 3. تحديث الحالة الابتدائية للتعامل مع الملفات
  const [formData, setFormData] = useState<Partial<FormState>>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    price: initialData?.price || 0,
    stock: initialData?.stock || 0,
    discount: initialData?.discount || 0,
    category: initialData?.category || ProductCategory.FASHION,
    thumbnail_image: null,
    images: [],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 4. تحديث مخطط التحقق (Yup Schema) للتعامل مع الملفات
  const productSchema = yup.object().shape({
    name: yup.string().required(t('Validation.nameRequired')),
    description: yup.string().required(t('Validation.descriptionRequired')),
    price: yup.number().positive(t('Validation.priceRequired')).required(t('Validation.priceRequired')),
    stock: yup.number().min(0, t('Validation.stockRequired')).required(t('Validation.stockRequired')),
    discount: yup.number().min(0, t('Validation.discountInvalid')).max(100, t('Validation.discountInvalid')).required(),
    category: yup.string().oneOf(Object.values(ProductCategory)).required(t('Validation.categoryRequired')),
    // التحقق من الصورة المصغرة (ملف وليس رابط)
    thumbnail_image: yup.mixed().required(t('Validation.thumbnailRequired'))
      .test('fileType', t('Validation.invalidFileType'), value => value && ['image/jpeg', 'image/png', 'image/webp'].includes((value as File).type)),
    // التحقق من صور المعرض (اختياري)
    images: yup.array().of(
      yup.mixed().test('fileType', t('Validation.invalidFileType'), value => value && ['image/jpeg', 'image/png', 'image/webp'].includes((value as File).type))
    ),
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 5. دالة جديدة للتعامل مع تغيير الملفات
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files) {
      if (name === 'thumbnail_image') {
        setFormData(prev => ({ ...prev, thumbnail_image: files[0] || null }));
      } else if (name === 'images') {
        setFormData(prev => ({ ...prev, images: Array.from(files) }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setFormStatus(null);

    try {
      await productSchema.validate(formData, { abortEarly: false });
      setLoading(true);

      // 6. تجهيز FormData هنا مباشرة داخل الفورم
      const dataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'thumbnail_image' && value) {
          dataToSend.append('thumbnail_image', value as File);
        } else if (key === 'images' && Array.isArray(value)) {
          (value as File[]).forEach(file => dataToSend.append('images', file));
        } else if (value !== null && value !== undefined) {
          dataToSend.append(key, String(value));
        }
      });
      
      // استدعاء الدالة القادمة من الـ Parent Component مع FormData
      await onSubmit(dataToSend);
      // لم نعد بحاجة لدالة onSuccess هنا، لأن المنطق بالكامل أصبح في الـ Parent

    } catch (err) {
      if (err instanceof yup.ValidationError) {
        const newErrors: Record<string, string> = {};
        err.inner.forEach(error => { if (error.path) newErrors[error.path] = error.message; });
        setErrors(newErrors);
      } else {
        // الخطأ القادم من الـ API سيتم عرضه في الـ Parent Component
        console.error("API Error:", err);
        setFormStatus({ type: 'error', message: isEditMode ? t('EditProductPage.errorMsg') : t('AddProductPage.errorMsg') });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      {/* الحقول النصية تبقى كما هي */}
      <TextField name="name" label={t('ProductForm.productName')} value={formData.name} onChange={handleChange} error={!!errors.name} helperText={errors.name} required />
      <TextField name="description" label={t('ProductForm.productDescription')} value={formData.description} onChange={handleChange} multiline rows={4} error={!!errors.description} helperText={errors.description} required />
      <TextField name="price" label={t('ProductForm.price')} type="number" inputProps={{ min: 0, step: "0.01" }} value={formData.price} onChange={handleChange} error={!!errors.price} helperText={errors.price} required />
      <TextField name="stock" label={t('ProductForm.stock')} type="number" inputProps={{ min: 0 }} value={formData.stock} onChange={handleChange} error={!!errors.stock} helperText={errors.stock} required />
      <TextField name="discount" label={t('ProductForm.discount')} type="number" inputProps={{ min: 0, max: 100 }} value={formData.discount} onChange={handleChange} error={!!errors.discount} helperText={errors.discount} required />
      <TextField name="category" label={t('ProductForm.category')} value={formData.category} onChange={handleChange} select required error={!!errors.category} helperText={errors.category}>
        {Object.values(ProductCategory).map((cat) => (
          <MenuItem key={cat} value={cat}>{t(`Categories.${cat}`)}</MenuItem>
        ))}
      </TextField>

      {/* 7. تصميم احترافي لحقول رفع الملفات */}
      <Box sx={{ border: '1px dashed grey', p: 2, borderRadius: 1, borderColor: errors.thumbnail_image ? 'error.main' : 'grey.400' }}>
        <Typography variant="subtitle1" gutterBottom>{t('ProductForm.thumbnailImage')}</Typography>
        <Button variant="outlined" component="label" startIcon={<PhotoCamera />}>
          {t('ProductForm.uploadThumbnail')}
          <input type="file" name="thumbnail_image" hidden onChange={handleFileChange} accept="image/png, image/jpeg, image/webp" />
        </Button>
        {formData.thumbnail_image && <Typography sx={{ display: 'inline', ml: 2 }}>{formData.thumbnail_image.name}</Typography>}
        {errors.thumbnail_image && <Typography color="error" variant="caption" sx={{ display: 'block', mt: 1 }}>{errors.thumbnail_image}</Typography>}
      </Box>

      <Box sx={{ border: '1px dashed grey', p: 2, borderRadius: 1, borderColor: errors.images ? 'error.main' : 'grey.400' }}>
        <Typography variant="subtitle1" gutterBottom>{t('ProductForm.galleryImages')}</Typography>
        <Button variant="outlined" component="label" startIcon={<PhotoCamera />}>
          {t('ProductForm.uploadGalleryImages')}
          <input type="file" name="images" hidden onChange={handleFileChange} multiple accept="image/png, image/jpeg, image/webp" />
        </Button>
        <Box sx={{ mt: 1 }}>
          {formData.images?.map((file, index) => <Typography key={index} variant="body2">{file.name}</Typography>)}
        </Box>
        {errors.images && <Typography color="error" variant="caption" sx={{ display: 'block', mt: 1 }}>{errors.images}</Typography>}
      </Box>

      <AnimatePresence>
        {formStatus && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <Alert severity={formStatus.type}>{formStatus.message}</Alert>
          </motion.div>
        )}
      </AnimatePresence>

      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
        <Button onClick={onCancel} variant="outlined" sx={{ flex: 1 }} disabled={loading}>
            {t('Common.cancel')}
        </Button>
        <Button type="submit" variant="contained" disabled={loading} size="large" sx={{ flex: 2 }}>
            {loading ? <CircularProgress size={24} color="inherit" /> : (isEditMode ? t('ProductForm.saveChangesBtn') : t('ProductForm.addProductBtn'))}
        </Button>
      </Box>
    </Box>
  );
};
export default ProductForm;



// عندك يا حج في اختلاف في طريقة عرض الصور بين الفرونت والباك - الفرونت بياخد الصورة الباك بياخد رابط 