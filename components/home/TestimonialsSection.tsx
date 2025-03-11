'use client';

import { useState, useEffect } from "react";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star } from "lucide-react";

// Define testimonial data
const testimonials = [
  {
    id: 1,
    name: "Alex M.",
    location: "Amsterdam, Netherlands",
    avatar: "AM",
    rating: 5,
    text: "I&apos;ve been growing for years and these are some of the best genetics I&apos;ve worked with. The White Widow seeds had a 100% germination rate and the plants are thriving.",
  },
  {
    id: 2,
    name: "Sarah K.",
    location: "Berlin, Germany",
    avatar: "SK",
    rating: 5,
    text: "Extremely fast shipping and the packaging was very discreet. The Northern Lights seeds I ordered produced beautiful, resinous plants. Will definitely order again!",
  },
  {
    id: 3,
    name: "Michael T.",
    location: "Barcelona, Spain",
    avatar: "MT",
    rating: 4,
    text: "Great customer service when I had questions about growing techniques. The autoflowering seeds were perfect for my first grow - very forgiving and produced a nice yield.",
  },
  {
    id: 4,
    name: "Emma L.",
    location: "Copenhagen, Denmark",
    avatar: "EL",
    rating: 5,
    text: "The CBD seeds I purchased have been amazing for my medical needs. The plants grew quickly and the final product has exactly the effect I was looking for.",
  },
  {
    id: 5,
    name: "David R.",
    location: "Prague, Czech Republic",
    avatar: "DR",
    rating: 5,
    text: "I&apos;ve tried several seed banks, but Dutch Seed Supply has the best combination of quality, price, and reliability. The Amnesia Haze seeds were exceptional.",
  },
];

export default function TestimonialsSection() {
  // Using a generic type for the carousel API
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [api, setApi] = useState<any>(null);
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <div className="py-16 bg-[#f9f9f7] dark:bg-gray-950 rounded-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-4">What Our Customers Say</h2>
        <p className="text-lg text-center text-gray-600 dark:text-gray-400 mb-12 max-w-3xl mx-auto">
          Don&apos;t just take our word for it - hear from growers who have experienced success with our seeds.
        </p>
        
        <Carousel
          setApi={setApi}
          opts={{
            align: "center",
            loop: true,
          }}
          className="w-full max-w-4xl mx-auto"
        >
          <CarouselContent>
            {testimonials.map((testimonial) => (
              <CarouselItem key={testimonial.id} className="md:basis-1/1 lg:basis-1/1">
                <div className="p-1">
                  <Card className="border-0 shadow-md">
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center text-center">
                        <Avatar className="h-16 w-16 mb-4 bg-green-100 text-green-800">
                          <AvatarFallback>{testimonial.avatar}</AvatarFallback>
                        </Avatar>
                        
                        <div className="flex mb-4">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-5 w-5 ${i < testimonial.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                        
                        <blockquote className="text-lg italic mb-4">
                          &ldquo;{testimonial.text}&rdquo;
                        </blockquote>
                        
                        <div>
                          <p className="font-semibold">{testimonial.name}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{testimonial.location}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          
          <div className="flex justify-center items-center gap-4 mt-8">
            <CarouselPrevious className="relative" />
            <div className="text-sm text-gray-500">
              {current} / {count}
            </div>
            <CarouselNext className="relative" />
          </div>
        </Carousel>
      </div>
    </div>
  );
}
