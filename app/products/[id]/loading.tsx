import { Skeleton } from "@/components/ui/Skeleton";

export default function ProductDetailLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product image skeleton */}
        <div className="rounded-lg overflow-hidden">
          <Skeleton className="h-96 w-full" />
        </div>
        
        {/* Product details skeleton */}
        <div className="space-y-6">
          {/* Breadcrumb skeleton */}
          <div className="flex items-center space-x-2 mb-4">
            <Skeleton className="h-4 w-16" />
            <div className="text-gray-400">/</div>
            <Skeleton className="h-4 w-24" />
            <div className="text-gray-400">/</div>
            <Skeleton className="h-4 w-32" />
          </div>
          
          {/* Title skeleton */}
          <Skeleton className="h-10 w-3/4" />
          
          {/* Price skeleton */}
          <Skeleton className="h-8 w-32" />
          
          {/* Rating skeleton */}
          <div className="flex items-center space-x-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-5 w-5 mr-1" />
              ))}
            </div>
            <Skeleton className="h-5 w-16" />
          </div>
          
          {/* Description skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-5/6" />
          </div>
          
          {/* Specifications skeleton */}
          <div className="space-y-4 mt-6">
            <Skeleton className="h-6 w-40" />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Skeleton className="h-5 w-24 mb-1" />
                <Skeleton className="h-5 w-32" />
              </div>
              <div>
                <Skeleton className="h-5 w-24 mb-1" />
                <Skeleton className="h-5 w-32" />
              </div>
              <div>
                <Skeleton className="h-5 w-24 mb-1" />
                <Skeleton className="h-5 w-32" />
              </div>
              <div>
                <Skeleton className="h-5 w-24 mb-1" />
                <Skeleton className="h-5 w-32" />
              </div>
            </div>
          </div>
          
          {/* Add to cart button skeleton */}
          <div className="flex items-center space-x-4 mt-8">
            <Skeleton className="h-12 w-32" />
            <Skeleton className="h-12 w-48" />
          </div>
        </div>
      </div>
    </div>
  );
}
