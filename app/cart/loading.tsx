import { Skeleton } from "@/components/ui/Skeleton";

export default function CartLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Cart header skeleton */}
      <div className="mb-8">
        <Skeleton className="h-10 w-48 mb-4" />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart items skeleton - takes up 2/3 of the space on desktop */}
        <div className="lg:col-span-2 space-y-4">
          {/* Cart items */}
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-white dark:bg-gray-900 rounded-lg shadow-md p-4 border border-gray-200 dark:border-gray-800">
              {/* Product image skeleton */}
              <Skeleton className="h-24 w-24 rounded-md" />
              
              {/* Product details */}
              <div className="flex-1 min-w-0">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-4" />
                
                {/* Quantity controls */}
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-8 w-12" />
                  <Skeleton className="h-8 w-8" />
                </div>
              </div>
              
              {/* Price and remove button */}
              <div className="flex flex-col items-end space-y-2">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-8 w-24" />
              </div>
            </div>
          ))}
        </div>
        
        {/* Order summary skeleton - takes up 1/3 of the space on desktop */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-800 h-fit">
          <Skeleton className="h-6 w-40 mb-6" />
          
          <div className="space-y-4 mb-6">
            <div className="flex justify-between">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 w-16" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-16" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-16" />
            </div>
            
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
              <div className="flex justify-between font-bold">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-20" />
              </div>
            </div>
          </div>
          
          <Skeleton className="h-12 w-full mb-4" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    </div>
  );
}
