'use client';

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Carousel as BaseCarousel,
  CarouselContent,
  CarouselItem,
  CarouselApi,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface GlassyCarouselProps extends React.ComponentProps<typeof BaseCarousel> {
  showDots?: boolean;
  className?: string;
  contentClassName?: string;
  children: React.ReactNode;
}

export function GlassyCarousel({
  showDots = true,
  className,
  contentClassName,
  children,
  ...props
}: GlassyCarouselProps) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;
    
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <div className={cn("relative", className)}>
      <BaseCarousel setApi={setApi} {...props}>
        <CarouselContent className={contentClassName}>
          {children}
        </CarouselContent>
        
        {/* Glassy Navigation Buttons */}
        <div className="hidden lg:block">
          <Button
            variant="outline"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full backdrop-blur-md bg-white/10 border border-white/20 shadow-lg hover:bg-white/20 transition-all duration-300 text-white"
            onClick={() => api?.scrollPrev()}
            disabled={!api?.canScrollPrev()}
          >
            <ChevronLeft className="h-6 w-6" />
            <span className="sr-only">Previous slide</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full backdrop-blur-md bg-white/10 border border-white/20 shadow-lg hover:bg-white/20 transition-all duration-300 text-white"
            onClick={() => api?.scrollNext()}
            disabled={!api?.canScrollNext()}
          >
            <ChevronRight className="h-6 w-6" />
            <span className="sr-only">Next slide</span>
          </Button>
        </div>
      </BaseCarousel>
      
      {/* Dots Indicator */}
      {showDots && count > 0 && (
        <div className="hidden lg:flex justify-center gap-1 mt-4">
          {Array.from({ length: count }).map((_, i) => (
            <button
              key={i}
              className={cn(
                "h-2 w-8 rounded-full transition-all duration-300",
                i === current 
                  ? "bg-gradient-to-r from-green-500 to-emerald-400 shadow-md" 
                  : "bg-green-200/30 backdrop-blur-md hover:bg-green-200/50"
              )}
              onClick={() => api?.scrollTo(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export { CarouselItem, CarouselContent };
