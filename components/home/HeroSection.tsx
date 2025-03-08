'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function HeroSection() {
  const [scrollY, setScrollY] = useState(0);

  // Handle scroll for parallax effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
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
        {/* Primary gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-900 via-emerald-800 to-green-950"></div>
        
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
            <span className="inline-block transform hover:translate-x-1 transition-transform duration-300">Premium</span>{" "}
            <span className="inline-block transform hover:translate-x-1 transition-transform duration-300">Cannabis</span>{" "}
            <span className="inline-block transform hover:translate-x-1 transition-transform duration-300">Seeds</span>
            <span className="block mt-2 bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">for Every Grower</span>
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-gray-200 mb-8"
            variants={itemVariants}
          >
            Discover our collection of high-quality cannabis seeds, carefully selected for potency, yield, and reliability.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4"
            variants={itemVariants}
          >
            <Button 
              asChild 
              size="lg" 
              className="bg-green-600 hover:bg-green-700 relative overflow-hidden group"
            >
              <Link href="/products">
                <span className="relative z-10">Shop Now</span>
                <span className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="absolute -inset-x-1 bottom-0 h-[2px] bg-gradient-to-r from-green-400 to-emerald-500"></span>
              </Link>
            </Button>
            
            <Button 
              asChild 
              variant="outline" 
              size="lg" 
              className="text-white border-white/30 hover:bg-white/10 backdrop-blur-sm relative overflow-hidden group"
            >
              <Link href="#categories">
                <span className="relative z-10">Explore Varieties</span>
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
            <span className="text-white/80 text-sm mb-2">Scroll to explore</span>
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
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-green-500 via-emerald-400 to-green-500 opacity-70"></div>
    </div>
  );
}
