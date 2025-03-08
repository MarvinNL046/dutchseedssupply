'use client';

import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRef } from "react";

// Define the categories we want to display
const categories = [
  {
    id: "indica",
    name: "Indica",
    description: "Relaxing & calming strains",
    image: "/images/indica.jpg",
    color: "from-purple-500 to-purple-700",
    hoverColor: "from-purple-400 to-purple-600",
    shadowColor: "shadow-purple-500/20",
  },
  {
    id: "sativa",
    name: "Sativa",
    description: "Energizing & uplifting varieties",
    image: "/images/sativa.jpg",
    color: "from-green-500 to-green-700",
    hoverColor: "from-green-400 to-green-600",
    shadowColor: "shadow-green-500/20",
  },
  {
    id: "hybrid",
    name: "Hybrid",
    description: "Balanced effects & characteristics",
    image: "/images/hybrid.jpg",
    color: "from-blue-500 to-blue-700",
    hoverColor: "from-blue-400 to-blue-600",
    shadowColor: "shadow-blue-500/20",
  },
  {
    id: "autoflower",
    name: "Autoflowering",
    description: "Quick & easy to grow",
    image: "/images/autoflower.jpg",
    color: "from-yellow-500 to-yellow-700",
    hoverColor: "from-yellow-400 to-yellow-600",
    shadowColor: "shadow-yellow-500/20",
  },
  {
    id: "feminized",
    name: "Feminized",
    description: "Guaranteed female plants",
    image: "/images/feminized.jpg",
    color: "from-pink-500 to-pink-700",
    hoverColor: "from-pink-400 to-pink-600",
    shadowColor: "shadow-pink-500/20",
  },
  {
    id: "cbd",
    name: "CBD",
    description: "High CBD, low THC options",
    image: "/images/cbd.jpg",
    color: "from-teal-500 to-teal-700",
    hoverColor: "from-teal-400 to-teal-600",
    shadowColor: "shadow-teal-500/20",
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
      <Link href={`/products?category=${category.id}`}>
        <Card 
          ref={cardRef}
          className={`overflow-hidden h-full border-0 ${category.shadowColor} shadow-xl transition-all duration-300 ease-out will-change-transform`}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <div className="relative h-48 overflow-hidden group">
            {/* Background image with zoom effect */}
            <div 
              className="absolute inset-0 bg-cover bg-center transform group-hover:scale-110 transition-transform duration-700 ease-out"
              style={{ 
                backgroundImage: `url(${category.image})`,
              }}
            />
            
            {/* Gradient overlay with transition */}
            <div className={`absolute inset-0 bg-gradient-to-tr ${category.color} group-hover:${category.hoverColor} opacity-80 transition-colors duration-300`}></div>
            
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
              <span className="text-green-600 group-hover:translate-x-1 transition-transform duration-300">→</span>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}

export default function CategoriesGrid() {
  return (
    <div id="categories" className="py-24 bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
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
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent inline-block">
            Seed Categories
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-green-500 to-emerald-400 mx-auto rounded-full mb-6"></div>
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
