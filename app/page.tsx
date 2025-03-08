import { getTranslations } from "@/lib/i18n";
import translations from "@/locale/translations";

// Import homepage components
import HeroSection from "@/components/home/HeroSection";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import CategoriesGrid from "@/components/home/CategoriesGrid";
import BenefitsSection from "@/components/home/BenefitsSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import GrowingGuide from "@/components/home/GrowingGuide";
import NewsletterSignup from "@/components/home/NewsletterSignup";
import FaqSection from "@/components/home/FaqSection";

export default async function Home() {
  // Get translations for the current locale
  // We're not using translations directly in this file as each component handles its own translations
  await getTranslations(translations); // Pre-load translations for components
  
  return (
    <div>
      {/* Hero Section */}
      <HeroSection />
      
      {/* Featured Products Carousel */}
      <FeaturedProducts />
      
      {/* Categories Grid */}
      <CategoriesGrid />
      
      {/* Benefits of Cannabis Seeds */}
      <BenefitsSection />
      
      {/* Customer Testimonials */}
      <TestimonialsSection />
      
      {/* Growing Guide */}
      <GrowingGuide />
      
      {/* Newsletter Signup */}
      <NewsletterSignup />
      
      {/* FAQ Section */}
      <FaqSection />
    </div>
  );
}
