'use client';

import { useState } from "react";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Define form schema with validation
const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

export default function NewsletterSignup() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });
  
  // Handle form submission
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    
    try {
      // In a real implementation, this would call your API
      // For now, we'll simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log("Newsletter signup:", values);
      setIsSuccess(true);
      form.reset();
    } catch (error) {
      console.error("Newsletter signup error:", error);
      form.setError("email", { 
        type: "manual", 
        message: "There was an error subscribing. Please try again." 
      });
    } finally {
      setIsSubmitting(false);
    }
  }
  
  return (
    <div className="py-16 bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-green-50 dark:bg-green-950 rounded-lg shadow-md p-8 md:p-12">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-2/3">
              <h2 className="text-3xl font-bold mb-4">Join Our Growers Community</h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                Subscribe to our newsletter for exclusive discounts, growing tips, and early access to new seed varieties.
              </p>
              
              {isSuccess ? (
                <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 p-4 rounded-md">
                  <p className="font-medium">Thank you for subscribing!</p>
                  <p>You&apos;ll receive our next newsletter with exclusive offers.</p>
                </div>
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col sm:flex-row gap-3">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input 
                              placeholder="Enter your email" 
                              type="email" 
                              className="h-12" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="submit" 
                      className="h-12 bg-green-600 hover:bg-green-700"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Subscribing...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          Subscribe
                        </span>
                      )}
                    </Button>
                  </form>
                </Form>
              )}
              
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </div>
            
            <div className="md:w-1/3 flex justify-center">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md transform rotate-3">
                <div className="bg-green-100 dark:bg-green-900 p-2 rounded">
                  <div className="text-center">
                    <div className="text-green-600 dark:text-green-400 font-bold mb-1">SPECIAL OFFER</div>
                    <div className="text-2xl font-bold mb-1">15% OFF</div>
                    <div className="text-sm">Your first order when you subscribe</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
