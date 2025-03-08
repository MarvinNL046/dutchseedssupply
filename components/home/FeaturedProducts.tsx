'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
      <div className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Seeds</h2>
          <div className="flex justify-center">
            <div className="w-full h-64 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">Featured Seeds</h2>
        
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {featuredProducts.map((variant) => (
              <CarouselItem key={variant.product_id} className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                <div className="p-1">
                  <Card className="overflow-hidden">
                    <div className="h-48 bg-gray-200 dark:bg-gray-700 relative">
                      {/* Placeholder for product image */}
                      <div className="absolute inset-0 flex items-center justify-center text-gray-500 dark:text-gray-400">
                        Seed Image
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="text-lg font-semibold mb-2">{variant.products.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-2">
                        {variant.products.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold">€{variant.price.toFixed(2)}</span>
                        <span className={`text-sm ${variant.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {variant.stock > 0 ? `${variant.stock} in stock` : 'Out of stock'}
                        </span>
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                      <Button asChild className="w-full bg-green-600 hover:bg-green-700">
                        <Link href={`/products/${variant.products.id}`}>View Details</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-center mt-8">
            <CarouselPrevious className="relative mr-2" />
            <CarouselNext className="relative ml-2" />
          </div>
        </Carousel>
        
        <div className="text-center mt-10">
          <Button asChild variant="outline" className="border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-950">
            <Link href="/products">View All Products</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
