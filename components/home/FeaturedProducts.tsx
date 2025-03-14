'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { CarouselItem, CarouselContent } from "@/components/ui/GlassyCarousel";
import { GlassyCarousel } from "@/components/ui/GlassyCarousel";
import { Button } from "@/components/ui/button";
import GlassyProductCard from "./GlassyProductCard";
import { motion } from "framer-motion";
import { useClientTranslations } from "@/lib/i18n";
import translations from "@/locale/translations";

// Define types for our data
type Product = {
  id: number;
  name: string;
  description: string;
};

type ProductVariant = {
  product_id: number;
  domain_id: string;
  price: number;
  stock: number;
  products: Product;
};

export default function FeaturedProducts() {
  const { t } = useClientTranslations(translations);
  const [featuredProducts, setFeaturedProducts] = useState<ProductVariant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real implementation, this would fetch from your API
    // For now, we'll use mock data
    const mockProducts: ProductVariant[] = [
      {
        product_id: 1,
        domain_id: "com",
        price: 9.99,
        stock: 50,
        products: {
          id: 1,
          name: "Northern Lights",
          description: "A classic indica strain known for its resinous buds and resilient growing properties."
        }
      },
      {
        product_id: 2,
        domain_id: "com",
        price: 12.99,
        stock: 30,
        products: {
          id: 2,
          name: "White Widow",
          description: "A balanced hybrid famous for its white crystal resin and powerful effects."
        }
      },
      {
        product_id: 3,
        domain_id: "com",
        price: 11.99,
        stock: 25,
        products: {
          id: 3,
          name: "Amnesia Haze",
          description: "A sativa-dominant strain with an energetic, uplifting effect and citrus flavor."
        }
      },
      {
        product_id: 4,
        domain_id: "com",
        price: 14.99,
        stock: 20,
        products: {
          id: 4,
          name: "Blue Dream",
          description: "A sativa-dominant hybrid delivering a balanced high with a sweet berry aroma."
        }
      },
      {
        product_id: 5,
        domain_id: "com",
        price: 10.99,
        stock: 40,
        products: {
          id: 5,
          name: "Girl Scout Cookies",
          description: "An indica-dominant hybrid with a sweet and earthy aroma and powerful effects."
        }
      }
    ];

    // Simulate API delay
    setTimeout(() => {
      setFeaturedProducts(mockProducts);
      setIsLoading(false);
    }, 500);
  }, []);

  if (isLoading) {
    return (
      <div className="py-16">
        <div className="w-full">
          <motion.h2 
            className="text-4xl font-bold text-center mb-4 text-[#4E8B01] inline-block"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {t('featuredSeeds')}
          </motion.h2>
          <div className="h-1 w-20 bg-[#8CB85C] mx-auto rounded-full mb-12"></div>
          <div className="flex justify-center">
            <div className="w-full h-64 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 relative overflow-hidden bg-[#f9f9f7] dark:bg-gray-950 rounded-xl">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-[#8CB85C]/5 blur-3xl"></div>
        <div className="absolute top-1/3 -right-24 w-64 h-64 rounded-full bg-[#7AAED8]/5 blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold mb-4 text-[#4E8B01] inline-block">
            {t('featuredSeeds')}
          </h2>
          <div className="h-1 w-20 bg-[#8CB85C] mx-auto rounded-full mb-6"></div>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            {t('exploreSelection')}
          </p>
        </motion.div>
        
        {/* Desktop Glassy Carousel */}
        <div className="hidden lg:block">
          <GlassyCarousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full px-4"
          >
            <CarouselContent>
              {featuredProducts.map((variant, index) => (
                <CarouselItem key={variant.product_id} className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4 p-2">
                  <GlassyProductCard variant={variant} index={index} />
                </CarouselItem>
              ))}
            </CarouselContent>
          </GlassyCarousel>
        </div>
        
        {/* Mobile Standard Cards */}
        <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
          {featuredProducts.slice(0, 4).map((variant, index) => (
            <GlassyProductCard key={variant.product_id} variant={variant} index={index} />
          ))}
        </div>
        
        <div className="text-center mt-10">
          <Button asChild variant="gradient" className="px-8 py-6 text-lg">
            <Link href="/products">{t('viewAllProducts')}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
