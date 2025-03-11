'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import HeroCarousel from "./HeroCarousel";
import { useClientTranslations } from "@/lib/i18n";
import translations from "@/locale/translations";

export default function HeroSection() {
  const { t } = useClientTranslations(translations);
  const [scrollY, setScrollY] = useState(0);
  const [isMobile, setIsMobile] = useState(true);

  // Handle scroll for parallax effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check if we're on desktop
  useEffect(() => {
    const checkIfDesktop = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    // Initial check
    checkIfDesktop();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkIfDesktop);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIfDesktop);
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  // For mobile and tablet, show the static hero
  if (isMobile) {
    return (
      <div className="relative h-[90vh] w-full overflow-hidden">
        {/* Animated gradient background with parallax effect */}
        <div 
          className="absolute inset-0"
          style={{ 
            transform: `translateY(${scrollY * 0.5}px) scale(${1 + scrollY * 0.0005})`,
            transition: "transform 0.1s cubic-bezier(0.17, 0.67, 0.83, 0.67)",
          }}
        >
          {/* Solid background */}
          <div className="absolute inset-0 bg-[#4E8B01]"></div>
          
          {/* Secondary animated gradient for depth */}
          <div className="absolute inset-0 bg-gradient-to-tr from-black/80 via-black/60 to-black/40 opacity-80"></div>
          
          {/* Animated particles for depth (simulated with pseudo-elements in CSS) */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.1)_0%,_transparent_8%)] bg-[length:3vmin_3vmin]"></div>
          
          {/* Subtle texture overlay */}
          <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjZmZmIj48L3JlY3Q+CjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiMwMDAiPjwvcmVjdD4KPC9zdmc+')]"></div>
        </div>
        
        {/* Content with glassmorphism effect */}
        <motion.div 
          className="relative z-10 flex flex-col items-start justify-center h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="max-w-2xl backdrop-blur-sm bg-black/20 p-8 rounded-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.37)]">
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight"
              variants={itemVariants}
            >
              <span className="inline-block transform hover:translate-x-1 transition-transform duration-300">{t('premiumCannabisSeeds')}</span>
              <span className="block mt-2 text-[#8CB85C]">{t('forEveryGrower')}</span>
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-gray-200 mb-8"
              variants={itemVariants}
            >
              {t('discoverCollection')}
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              variants={itemVariants}
            >
              <Button 
                asChild 
                size="lg" 
                className="bg-[#4E8B01] hover:bg-[#3f6f01] relative overflow-hidden group"
              >
                <Link href="/products">
                  <span className="relative z-10">{t('shopNow')}</span>
                  <span className="absolute inset-0 bg-[#3f6f01] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <span className="absolute -inset-x-1 bottom-0 h-[2px] bg-[#8CB85C]"></span>
                </Link>
              </Button>
              
              <Button 
                asChild 
                variant="outline" 
                size="lg" 
                className="text-white border-white/30 hover:bg-white/10 backdrop-blur-sm relative overflow-hidden group"
              >
                <Link href="#categories">
                  <span className="relative z-10">{t('exploreVarieties')}</span>
                  <span className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <span className="absolute -inset-x-1 bottom-0 h-[2px] bg-gradient-to-r from-white/40 to-white/10"></span>
                </Link>
              </Button>
            </motion.div>
          </div>
          
          {/* Decorative elements */}
          <motion.div 
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.8 }}
          >
            <div className="flex flex-col items-center">
              <span className="text-white/80 text-sm mb-2">{t('scrollToExplore')}</span>
              <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-1">
                <motion.div 
                  className="w-1 h-2 bg-white/80 rounded-full"
                  animate={{ 
                    y: [0, 12, 0],
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 1.5,
                    ease: "easeInOut" 
                  }}
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
        
        {/* Animated gradient accent */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#8CB85C] opacity-70"></div>
      </div>
    );
  }

  // For desktop, show the carousel
  return <HeroCarousel />;
}
