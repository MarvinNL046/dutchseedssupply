import HeroSection from '@/components/home/HeroSection';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import BenefitsSection from '@/components/home/BenefitsSection';
import CategoriesGrid from '@/components/home/CategoriesGrid';
import GrowingGuide from '@/components/home/GrowingGuide';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import FaqSection from '@/components/home/FaqSection';
import NewsletterSignup from '@/components/home/NewsletterSignup';

export default function Home() {
  return (
    <div className="bg-green-50 dark:bg-green-950">
      <HeroSection />
      <div className="container mx-auto px-4 py-8">
        <FeaturedProducts />
        <CategoriesGrid />
        <BenefitsSection />
        <GrowingGuide />
        <TestimonialsSection />
        <FaqSection />
        <NewsletterSignup />
      </div>
    </div>
  );
}
