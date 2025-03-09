'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Define the slide data
const slides = [
  {
    id: 1,
    title: 'Premium Cannabis Seeds',
    subtitle: 'for Every Grower',
    description: 'Discover our collection of high-quality cannabis seeds, carefully selected for potency, yield, and reliability.',
    bgClass: 'bg-gradient-to-br from-green-900 via-emerald-800 to-green-950',
    accentClass: 'from-green-400 to-emerald-600',
  },
  {
    id: 2,
    title: 'Autoflowering Varieties',
    subtitle: 'Easy to Grow',
    description: 'Perfect for beginners, our autoflowering seeds provide hassle-free growing with exceptional results every time.',
    bgClass: 'bg-gradient-to-br from-amber-900 via-yellow-800 to-amber-950',
    accentClass: 'from-amber-400 to-yellow-600',
  },
  {
    id: 3,
    title: 'Feminized Seeds',
    subtitle: 'Maximum Yield',
    description: 'Our feminized seeds ensure 99% female plants, maximizing your harvest and eliminating wasted resources.',
    bgClass: 'bg-gradient-to-br from-purple-900 via-fuchsia-800 to-purple-950',
    accentClass: 'from-fuchsia-400 to-purple-600',
  },
  {
    id: 4,
    title: 'CBD Strains',
    subtitle: 'Therapeutic Benefits',
    description: 'Explore our selection of CBD-rich strains, perfect for medicinal users seeking therapeutic effects without the high.',
    bgClass: 'bg-gradient-to-br from-blue-900 via-cyan-800 to-blue-950',
    accentClass: 'from-cyan-400 to-blue-600',
  }
];

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right

  // Auto-advance slides
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const timer = setTimeout(() => {
      setDirection(1);
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [currentSlide, isAutoPlaying]);

  // Pause auto-play on hover
  const handleMouseEnter = useCallback(() => {
    setIsAutoPlaying(false);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsAutoPlaying(true);
  }, []);

  // Navigation handlers
  const handlePrevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  const handleNextSlide = useCallback(() => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, []);

  // Animation variants - softer transitions
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: 'spring', stiffness: 120, damping: 45 },
        opacity: { duration: 0.8, ease: 'easeInOut' },
      },
    },
    exit: (direction: number) => ({
      x: direction > 0 ? '-100%' : '100%',
      opacity: 0,
      transition: {
        x: { type: 'spring', stiffness: 120, damping: 45 },
        opacity: { duration: 0.8, ease: 'easeInOut' },
      },
    }),
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
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
    <div 
      className="relative h-[90vh] w-full overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Carousel slides */}
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={currentSlide}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0"
        >
          {/* Background gradient */}
          <div className={`absolute inset-0 ${slides[currentSlide].bgClass}`}></div>
          
          {/* Secondary animated gradient for depth */}
          <div className="absolute inset-0 bg-gradient-to-tr from-black/80 via-black/60 to-black/40 opacity-80"></div>
          
          {/* Animated particles for depth */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.1)_0%,_transparent_8%)] bg-[length:3vmin_3vmin]"></div>
          
          {/* Subtle texture overlay */}
          <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjZmZmIj48L3JlY3Q+CjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiMwMDAiPjwvcmVjdD4KPC9zdmc+')]"></div>
          
          {/* Decorative floating elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div 
              className="absolute top-[15%] right-[10%] w-16 h-16 rounded-full bg-white/5 backdrop-blur-md"
              animate={{ 
                y: [0, -15, 0], 
                rotate: [0, 5, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                duration: 6, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            />
            <motion.div 
              className="absolute bottom-[20%] left-[15%] w-20 h-20 rounded-full bg-white/5 backdrop-blur-md"
              animate={{ 
                y: [0, 20, 0], 
                rotate: [0, -8, 0],
                scale: [1, 1.08, 1]
              }}
              transition={{ 
                duration: 8, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: 1
              }}
            />
            <motion.div 
              className="absolute top-[40%] left-[8%] w-12 h-12 rounded-full bg-white/5 backdrop-blur-md"
              animate={{ 
                y: [0, 12, 0], 
                x: [0, 8, 0],
                rotate: [0, 15, 0]
              }}
              transition={{ 
                duration: 7, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: 2
              }}
            />
          </div>
          
          {/* Content with glassmorphism effect - main and secondary cards */}
          <motion.div 
            className="relative z-10 flex flex-col md:flex-row items-start justify-center h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 gap-6 lg:gap-10"
            variants={contentVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Main content card */}
            <div className="max-w-2xl backdrop-blur-md bg-black/20 p-8 rounded-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.37)]">
              <motion.h1 
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight"
                variants={itemVariants}
              >
                <span className="inline-block transform hover:translate-x-1 transition-transform duration-300">{slides[currentSlide].title}</span>
                <span className={`block mt-2 bg-gradient-to-r ${slides[currentSlide].accentClass} bg-clip-text text-transparent`}>
                  {slides[currentSlide].subtitle}
                </span>
              </motion.h1>
              
              <motion.p 
                className="text-xl md:text-2xl text-gray-200 mb-8"
                variants={itemVariants}
              >
                {slides[currentSlide].description}
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
            
            {/* Secondary featured card - only visible on desktop */}
            <motion.div 
              variants={itemVariants}
              className="hidden lg:block w-80 h-auto backdrop-blur-md bg-black/15 p-6 rounded-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.37)] self-center"
            >
              <div className="relative mb-4 overflow-hidden rounded-lg h-40 bg-black/20">
                <div className={`absolute inset-0 ${slides[currentSlide].bgClass} opacity-50`}></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white/70 text-sm">Strain Image</span>
                </div>
                <div className="absolute top-2 right-2 bg-white/20 backdrop-blur-md px-2 py-1 rounded-full text-xs text-white">
                  Featured
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2">
                Featured Strain
              </h3>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-white/70">THC:</span>
                  <span className="text-white font-medium">18-24%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">CBD:</span>
                  <span className="text-white font-medium">0.1-1%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Flowering:</span>
                  <span className="text-white font-medium">8-9 weeks</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Yield:</span>
                  <span className="text-white font-medium">High</span>
                </div>
              </div>
              
              <div className="pt-2 border-t border-white/10">
                <Button 
                  asChild 
                  variant="outline" 
                  size="sm" 
                  className="w-full text-white border-white/30 hover:bg-white/10 backdrop-blur-sm"
                >
                  <Link href="/products">
                    <span className="relative z-10">View Details</span>
                  </Link>
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation buttons */}
      <div className="absolute z-20 left-0 right-0 top-1/2 transform -translate-y-1/2 flex justify-between px-4 md:px-8">
        <Button
          variant="outline"
          size="icon"
          className="h-12 w-12 rounded-full backdrop-blur-md bg-white/10 border border-white/20 shadow-lg hover:bg-white/20 transition-all duration-300 text-white"
          onClick={handlePrevSlide}
        >
          <ChevronLeft className="h-6 w-6" />
          <span className="sr-only">Previous slide</span>
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-12 w-12 rounded-full backdrop-blur-md bg-white/10 border border-white/20 shadow-lg hover:bg-white/20 transition-all duration-300 text-white"
          onClick={handleNextSlide}
        >
          <ChevronRight className="h-6 w-6" />
          <span className="sr-only">Next slide</span>
        </Button>
      </div>

      {/* Dots indicator */}
      <div className="absolute z-20 bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-white w-8' 
                : 'bg-white/40 hover:bg-white/60'
            }`}
            onClick={() => {
              setDirection(index > currentSlide ? 1 : -1);
              setCurrentSlide(index);
            }}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Animated gradient accent */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-green-500 via-emerald-400 to-green-500 opacity-70"></div>
    </div>
  );
}
