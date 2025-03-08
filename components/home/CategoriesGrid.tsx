'use client';

import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

// Define the categories we want to display
const categories = [
  {
    id: "indica",
    name: "Indica",
    description: "Relaxing & calming strains",
    image: "/images/indica.jpg",
    color: "from-purple-500 to-purple-700",
  },
  {
    id: "sativa",
    name: "Sativa",
    description: "Energizing & uplifting varieties",
    image: "/images/sativa.jpg",
    color: "from-green-500 to-green-700",
  },
  {
    id: "hybrid",
    name: "Hybrid",
    description: "Balanced effects & characteristics",
    image: "/images/hybrid.jpg",
    color: "from-blue-500 to-blue-700",
  },
  {
    id: "autoflower",
    name: "Autoflowering",
    description: "Quick & easy to grow",
    image: "/images/autoflower.jpg",
    color: "from-yellow-500 to-yellow-700",
  },
  {
    id: "feminized",
    name: "Feminized",
    description: "Guaranteed female plants",
    image: "/images/feminized.jpg",
    color: "from-pink-500 to-pink-700",
  },
  {
    id: "cbd",
    name: "CBD",
    description: "High CBD, low THC options",
    image: "/images/cbd.jpg",
    color: "from-teal-500 to-teal-700",
  },
];

export default function CategoriesGrid() {
  return (
    <div id="categories" className="py-16 bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-4">Seed Categories</h2>
        <p className="text-lg text-center text-gray-600 dark:text-gray-400 mb-12 max-w-3xl mx-auto">
          Explore our diverse range of cannabis seeds, each carefully selected for specific growing conditions and desired effects.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link 
              key={category.id} 
              href={`/products?category=${category.id}`}
              className="transform transition-transform hover:scale-105"
            >
              <Card className="overflow-hidden h-full border-0 shadow-lg">
                <div className="relative h-48">
                  {/* Placeholder for category image */}
                  <div 
                    className="absolute inset-0 bg-gradient-to-r flex items-center justify-center"
                    style={{ 
                      backgroundImage: `url(${category.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  >
                    {/* Gradient overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-tr ${category.color} opacity-80`}></div>
                    
                    {/* Category name */}
                    <div className="relative z-10 text-center p-4">
                      <h3 className="text-2xl font-bold text-white mb-2">{category.name}</h3>
                      <p className="text-white/90">{category.description}</p>
                    </div>
                  </div>
                </div>
                <CardContent className="p-4 bg-gray-50 dark:bg-gray-900">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">View Collection</span>
                    <span className="text-green-600">→</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
