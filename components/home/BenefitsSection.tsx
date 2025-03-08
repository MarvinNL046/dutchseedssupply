'use client';

import { Card, CardContent } from "@/components/ui/card";
import { 
  Leaf, 
  Award, 
  Truck, 
  Shield, 
  Sprout, 
  Package 
} from "lucide-react";

// Define the benefits we want to highlight
const benefits = [
  {
    title: "Premium Genetics",
    description: "Our seeds come from award-winning strains with stable genetics for consistent results.",
    icon: Award,
    color: "text-yellow-500",
    bgColor: "bg-yellow-100 dark:bg-yellow-950",
  },
  {
    title: "High Germination Rate",
    description: "Enjoy 95%+ germination success with our properly stored and tested seeds.",
    icon: Sprout,
    color: "text-green-500",
    bgColor: "bg-green-100 dark:bg-green-950",
  },
  {
    title: "Discreet Shipping",
    description: "Your privacy matters. All orders ship in plain, unmarked packaging.",
    icon: Package,
    color: "text-blue-500",
    bgColor: "bg-blue-100 dark:bg-blue-950",
  },
  {
    title: "Fast Delivery",
    description: "Quick processing and shipping to get your seeds to you as fast as possible.",
    icon: Truck,
    color: "text-purple-500",
    bgColor: "bg-purple-100 dark:bg-purple-950",
  },
  {
    title: "Expert Growing Advice",
    description: "Access to detailed growing guides and customer support for all experience levels.",
    icon: Leaf,
    color: "text-emerald-500",
    bgColor: "bg-emerald-100 dark:bg-emerald-950",
  },
  {
    title: "Secure Payments",
    description: "Shop with confidence using our secure, encrypted payment processing.",
    icon: Shield,
    color: "text-red-500",
    bgColor: "bg-red-100 dark:bg-red-950",
  },
];

export default function BenefitsSection() {
  return (
    <div className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-4">Why Choose Our Seeds</h2>
        <p className="text-lg text-center text-gray-600 dark:text-gray-400 mb-12 max-w-3xl mx-auto">
          We&apos;re committed to providing the highest quality cannabis seeds with exceptional service and support.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon;
            
            return (
              <Card key={index} className="border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className={`p-3 rounded-full ${benefit.bgColor} mb-4`}>
                      <IconComponent className={`h-8 w-8 ${benefit.color}`} />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400">{benefit.description}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
