// src/api/apiService.js

import axios from 'axios';

// ... (الكود الحالي لـ apiClient و interceptors يبقى كما هو)

// --- دوال المنتجات المحدثة ---

/**
 * الخطوة 1: إنشاء منتج جديد بالبيانات النصية فقط.
 * @param {object} productData - كائن يحتوي على name, description, price, category.
 * @returns {Promise} - وعد يحتوي على بيانات المنتج الجديد بما في ذلك الـ ID.
 */
export const addProductData = (productData) => {
  // هذا الطلب يرسل JSON
  return apiClient.put('/user/seller/product/add', productData);
};

/**
 * الخطوة 2: رفع الصور لمنتج موجود.
 * @param {string} productId - معرّف المنتج الذي تم إنشاؤه في الخطوة 1.
 * @param {FormData} filesFormData - كائن FormData يحتوي على thumbnail_image و images.
 * @returns {Promise}
 */
export const uploadProductImages = (productId, filesFormData) => {
  // هذا الطلب يرسل FormData
  // ملاحظة: الرابط مقترح ويجب الاتفاق عليه مع مطور الباك إند
  return apiClient.post(`/user/seller/product/${productId}/upload-images`, filesFormData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// ... باقي دوال الـ API الأخرى