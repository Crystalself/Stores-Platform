"use client";
import React, { useEffect, useState } from 'react';
import { Container, Typography, CircularProgress, Alert } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { fetchProductById, updateProduct, EditableProduct } from '@/services/productService';
import ProductForm from '@/components/products/ProductForm';
import type { Product } from '@/models/product';

interface EditProductPageProps { params: { productId: string } }

const EditProductPage: React.FC<EditProductPageProps> = ({ params }) => {
    const t = useTranslations('EditProductPage');
    const router = useRouter();
    const productId = parseInt(params.productId, 10);

    const [product, setProduct] = useState<EditableProduct | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadProduct = async () => {
            try {
                const data = await fetchProductById(productId);
                if (data) setProduct(data);
                else setError(t('notFound'));
            } catch {
                setError(t('errorMsg'));
            } finally {
                setLoading(false);
            }
        };
        loadProduct();
    }, [productId, t]);

    const handleSubmit = async (data: FormData) => {
        data.set('id', String(productId));
        return updateProduct(data);
    };

    const handleCancel = () => {
        router.push('/seller/products/manage');
    };

    if (loading) return <CircularProgress sx={{ display: 'block', margin: 'auto', mt: 5 }} />;
    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <Container maxWidth="md" sx={{ my: 4 }}>
            <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
              {t('title')}
            </Typography>
            {product && (
                <ProductForm 
                    isEditMode 
                    initialData={(product as unknown) as Product}
                    onSubmit={handleSubmit} 
                    onCancel={handleCancel}
                />
            )}
        </Container>
    );
};
export default EditProductPage;
