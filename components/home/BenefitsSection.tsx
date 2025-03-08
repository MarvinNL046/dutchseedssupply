'use client';

import { Card } from "@/components/ui/card";
import { 
  Leaf, 
  Award, 
  Truck, 
  Shield, 
  Sprout, 
  Package 
} from "lucide-react";
import { motion } from "framer-motion";

// Define the benefits we want to highlight
const benefits = [
  {
    title: "Premium Genetics",
    description: "Our seeds come from award-winning strains with stable genetics for consistent results.",
    icon: Award,
    color: "text-yellow-500",
    bgColor: "bg-yellow-100 dark:bg-yellow-950/40",
    borderColor: "border-yellow-200 dark:border-yellow-900",
    shadowColor: "shadow-yellow-500/10",
    hoverShadow: "hover:shadow-yellow-500/20",
  },
  {
    title: "High Germination Rate",
    description: "Enjoy 95%+ germination success with our properly stored and tested seeds.",
    icon: Sprout,
    color: "text-green-500",
    bgColor: "bg-green-100 dark:bg-green-950/40",
    borderColor: "border-green-200 dark:border-green-900",
    shadowColor: "shadow-green-500/10",
    hoverShadow: "hover:shadow-green-500/20",
  },
  {
    title: "Discreet Shipping",
    description: "Your privacy matters. All orders ship in plain, unmarked packaging.",
    icon: Package,
    color: "text-blue-500",
    bgColor: "bg-blue-100 dark:bg-blue-950/40",
    borderColor: "border-blue-200 dark:border-blue-900",
    shadowColor: "shadow-blue-500/10",
    hoverShadow: "hover:shadow-blue-500/20",
  },
  {
    title: "Fast Delivery",
    description: "Quick processing and shipping to get your seeds to you as fast as possible.",
    icon: Truck,
    color: "text-purple-500",
    bgColor: "bg-purple-100 dark:bg-purple-950/40",
    borderColor: "border-purple-200 dark:border-purple-900",
    shadowColor: "shadow-purple-500/10",
    hoverShadow: "hover:shadow-purple-500/20",
  },
  {
    title: "Expert Growing Advice",
    description: "Access to detailed growing guides and customer support for all experience levels.",
    icon: Leaf,
    color: "text-emerald-500",
    bgColor: "bg-emerald-100 dark:bg-emerald-950/40",
    borderColor: "border-emerald-200 dark:border-emerald-900",
    shadowColor: "shadow-emerald-500/10",
    hoverShadow: "hover:shadow-emerald-500/20",
  },
  {
    title: "Secure Payments",
    description: "Shop with confidence using our secure, encrypted payment processing.",
    icon: Shield,
    color: "text-red-500",
    bgColor: "bg-red-100 dark:bg-red-950/40",
    borderColor: "border-red-200 dark:border-red-900",
    shadowColor: "shadow-red-500/10",
    hoverShadow: "hover:shadow-red-500/20",
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

// Benefit card component
function BenefitCard({ benefit, index }: { benefit: typeof benefits[0], index: number }) {
  const IconComponent = benefit.icon;
  
  return (
    <motion.div
      variants={itemVariants}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1]
      }}
    >
      <Card className={`h-full border border-gray-100 dark:border-gray-800 ${benefit.borderColor} ${benefit.shadowColor} ${benefit.hoverShadow} transition-all duration-300 hover:translate-y-[-5px] backdrop-blur-sm bg-white/80 dark:bg-gray-900/80`}>
        <div className="p-6">
          <div className="flex flex-col items-center text-center">
            {/* Animated icon container */}
            <div className={`relative p-4 rounded-2xl ${benefit.bgColor} mb-6 group`}>
              {/* Animated background pulse */}
              <div className={`absolute inset-0 rounded-2xl ${benefit.bgColor} opacity-60 animate-pulse`} 
                style={{ animationDuration: `${3 + index * 0.5}s` }}
              />
              
              {/* Icon with hover animation */}
              <IconComponent className={`h-8 w-8 ${benefit.color} relative z-10 transform transition-transform duration-300 group-hover:scale-110`} />
              
              {/* Decorative elements */}
              <div className={`absolute -right-1 -bottom-1 w-3 h-3 rounded-full ${benefit.color} opacity-40`}></div>
              <div className={`absolute -left-1 -top-1 w-2 h-2 rounded-full ${benefit.color} opacity-30`}></div>
            </div>
            
            {/* Content */}
            <h3 className="text-xl font-semibold mb-3 group-hover:text-green-600 transition-colors duration-300">{benefit.title}</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{benefit.description}</p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

export default function BenefitsSection() {
  return (
    <div className="py-24 relative overflow-hidden">
      {/* Background with subtle pattern */}
      <div className="absolute inset-0 bg-gray-50 dark:bg-gray-900">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:20px_20px] opacity-50"></div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-800 to-transparent"></div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-800 to-transparent"></div>
      
      <motion.div 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
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
            Why Choose Our Seeds
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-green-500 to-emerald-400 mx-auto rounded-full mb-6"></div>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            We&apos;re committed to providing the highest quality cannabis seeds with exceptional service and support.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <BenefitCard key={index} benefit={benefit} index={index} />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
