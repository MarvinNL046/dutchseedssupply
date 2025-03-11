'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface Product {
  id: number;
  name: string;
  description: string;
}

interface ProductVariant {
  product_id: number;
  domain_id: string;
  price: number;
  stock: number;
  products: Product;
}

interface GlassyProductCardProps {
  variant: ProductVariant;
  index: number;
}

export default function GlassyProductCard({ variant, index }: GlassyProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1]
      }}
      whileHover={{ 
        y: -5,
        transition: { duration: 0.2 }
      }}
      className="h-full"
    >
      <Card className="overflow-hidden h-full border-0 backdrop-blur-[2px] bg-white/80 dark:bg-gray-900/80 shadow-lg hover:shadow-xl transition-all duration-300 relative">
        {/* Gradient border effect */}
        <div className="absolute inset-0 rounded-xl p-[1px] bg-[#8CB85C]/20 -z-10"></div>
        
        {/* Glass shine effect */}
        <div className="absolute -inset-x-full -top-[150%] bottom-0 h-[500%] w-[300%] opacity-20 bg-gradient-to-r from-transparent via-white to-transparent transform rotate-45 transition-all duration-1000 pointer-events-none"></div>
        
        <div className="h-48 bg-gray-200 dark:bg-gray-700 relative overflow-hidden group">
          {/* Placeholder for product image */}
          <div className="absolute inset-0 flex items-center justify-center text-gray-500 dark:text-gray-400 bg-[#f3f8e9] dark:bg-[#203700]">
            Seed Image
          </div>
          
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
            <div className="p-4 w-full">
              <p className="text-white text-sm font-medium truncate">{variant.products.description}</p>
            </div>
          </div>
        </div>
        
        <CardContent className="p-4 relative z-10">
          <h3 className="text-lg font-semibold mb-2 text-[#4E8B01] dark:text-[#8CB85C]">{variant.products.name}</h3>
          <p className="text-sm text-[#3f6f01] dark:text-[#8CB85C] line-clamp-2 mb-2 opacity-80">
            {variant.products.description}
          </p>
          <div className="flex justify-between items-center mt-3">
            <span className="text-lg font-bold text-[#4E8B01] dark:text-[#8CB85C]">€{variant.price.toFixed(2)}</span>
            <span className={`text-sm px-2 py-1 rounded-full ${variant.stock > 0 ? 'bg-[#e3efd0] text-[#3f6f01] dark:bg-[#2f5301] dark:text-[#c7dfa1]' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
              {variant.stock > 0 ? `${variant.stock} in stock` : 'Out of stock'}
            </span>
          </div>
        </CardContent>
        
        <CardFooter className="p-4 pt-0">
          <Button asChild variant="gradient" className="w-full">
            <Link href={`/products/${variant.products.id}`}>
              <span className="relative z-10">View Details</span>
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
