import { notFound } from "next/navigation";

// استيراد البيانات الحقيقية
import { mockUsers } from "@/lib/mockUsers";
import { mockProducts } from "@/lib/dummy-data";

// استيراد الأنواع
import { User } from "@/models/user";
import { Product } from "@/models/product";

// استيراد المكونات
import StoreHeader from "@/components/stores/StoreHeader";
import StoreOffers from '@/components/stores/StoreOffers';
import StoreProudcts from "@/components/stores/StoreProudcts";



interface Props {
  params: {
    storeId: string;
  };
}

export default function StorePage({ params }: Props) {
  const { storeId } = params;

  const seller = mockUsers.find(
    (user: User) => user.id === Number(storeId) && user.role === "seller"
  );

  if (!seller) {
    notFound();
  }

  const sellerProductsAll = mockProducts.filter(
    (p: Product) => p.user_id === seller.id
  );

  // هنا نقسم المنتجات إلى featured و otherProducts
  // لو عندك خاصية isFeatured، استبدل السطرين التاليين بما يناسب
  const sellerProducts = sellerProductsAll;
  const featuredProducts = sellerProducts.filter(product => product.is_featured);

  return (
    <div className="py-4">
      <StoreHeader
        seller={seller}
        sellerProducts={sellerProducts}
        featuredProducts={featuredProducts}
      />
      {featuredProducts && <StoreOffers featuredProducts={featuredProducts} />}
      {sellerProducts && <StoreProudcts sellerProducts={sellerProducts} />    }

    </div>
  );
}
