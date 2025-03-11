'use client';

import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRef } from "react";
import React from "react";

// Define the categories we want to display with pastel colors
const categories = [
  {
    id: "indica",
    name: "Indica",
    description: "Relaxing & calming strains",
    color: "bg-[#B39CD8]",
    hoverColor: "bg-[#C1AFDF]",
    shadowColor: "shadow-[#B39CD8]/30",
  },
  {
    id: "sativa",
    name: "Sativa",
    description: "Energizing & uplifting varieties",
    color: "bg-[#8CB85C]",
    hoverColor: "bg-[#A6C87C]",
    shadowColor: "shadow-[#8CB85C]/30",
  },
  {
    id: "hybrid",
    name: "Hybrid",
    description: "Balanced effects & characteristics",
    color: "bg-[#7AAED8]",
    hoverColor: "bg-[#A9CBEF]",
    shadowColor: "shadow-[#7AAED8]/30",
  },
  {
    id: "autoflowering",
    name: "Autoflowering",
    description: "Quick & easy to grow",
    color: "bg-[#E0A85C]",
    hoverColor: "bg-[#F4D7A1]",
    shadowColor: "shadow-[#E0A85C]/30",
  },
  {
    id: "feminized",
    name: "Feminized",
    description: "Guaranteed female plants",
    color: "bg-[#E8A5C0]",
    hoverColor: "bg-[#F2C7D8]",
    shadowColor: "shadow-[#E8A5C0]/30",
  },
  {
    id: "cbd",
    name: "CBD",
    description: "High CBD, low THC options",
    color: "bg-[#88C9C2]",
    hoverColor: "bg-[#A8D7D2]",
    shadowColor: "shadow-[#88C9C2]/30",
  },
  {
    id: "usa",
    name: "USA",
    description: "Premium American genetics",
    color: "bg-[#E05C5C]",
    hoverColor: "bg-[#F47C7C]",
    shadowColor: "shadow-[#E05C5C]/30",
  },
  {
    id: "f1-hybrids",
    name: "F1-Hybrids",
    description: "Superior growth & uniformity",
    color: "bg-[#9C6AD8]",
    hoverColor: "bg-[#B68AE5]",
    shadowColor: "shadow-[#9C6AD8]/30",
  },
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
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
      stiffness: 80,
      damping: 12
    }
  }
};

// Create a wrapper for Card that can accept a ref
const TiltableCard = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof Card>>(
  (props, ref) => <Card {...props} ref={ref} />
);
TiltableCard.displayName = 'TiltableCard';

// Card component with 3D tilt effect
function TiltCard({ category, index }: { category: typeof categories[0], index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  };
  
  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  };
  
  return (
    <motion.div
      variants={itemVariants}
      className="h-full"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1]
      }}
    >
      <Link href={`/category/${category.id}`}>
        <TiltableCard 
          ref={cardRef}
          className={`overflow-hidden h-full border-0 ${category.shadowColor} shadow-xl transition-all duration-300 ease-out will-change-transform`}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <div className="relative h-48 overflow-hidden group">
            {/* Solid background with animation */}
            <div 
              className={`absolute inset-0 ${category.color} group-hover:${category.hoverColor} transform group-hover:scale-110 transition-all duration-700 ease-out`}
            />
            
            {/* Pattern overlay for texture */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.8)_0%,_transparent_70%)]"></div>
            
            {/* Glassmorphism card content */}
            <div className="absolute inset-0 flex items-center justify-center p-6">
              <div className="backdrop-blur-[2px] bg-white/10 p-4 rounded-xl border border-white/20 w-full transform group-hover:scale-105 transition-transform duration-300">
                <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-md">{category.name}</h3>
                <p className="text-white/90 drop-shadow-sm">{category.description}</p>
              </div>
            </div>
          </div>
          
          <CardContent className="p-4 bg-white dark:bg-gray-800 transition-colors duration-300">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">View Collection</span>
              <span className="text-[#4E8B01] dark:text-[#8CB85C] group-hover:translate-x-1 transition-transform duration-300">→</span>
            </div>
          </CardContent>
        </TiltableCard>
      </Link>
    </motion.div>
  );
}

export default function CategoriesGrid() {
  return (
    <div id="categories" className="py-24 bg-[#f9f9f7] dark:bg-gray-950 rounded-xl">
      <motion.div 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold mb-4 text-[#4E8B01] inline-block">
            Seed Categories
          </h2>
          <div className="h-1 w-20 bg-[#8CB85C] mx-auto rounded-full mb-6"></div>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Explore our diverse range of cannabis seeds, each carefully selected for specific growing conditions and desired effects.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <TiltCard key={category.id} category={category} index={index} />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
