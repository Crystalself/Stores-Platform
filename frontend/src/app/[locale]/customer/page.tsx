// src/app/[locale]/welcome/page.tsx

import HeroSection from "@/components/sections/HeroSection";
import ProductSlider from "@/components/ui/ProductSlider";
import Footer from "@/components/layout/Footer";
import AnnouncementBar from '@/components/layout/AnnouncementBar'
import TrustSection from '@/components/sections/TrustSection'
import CategorySection from '@/components/sections/CategorySection'


export default function WelcomePage() {
  return (
    <>
      <AnnouncementBar />
      <main>
        <HeroSection />
        <TrustSection />
        <ProductSlider />
        <CategorySection />
      </main>
      <Footer />
    </>
  );
}