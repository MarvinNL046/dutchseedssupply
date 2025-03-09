import { ProductGridSkeleton } from "@/components/products/ProductCardSkeleton";
import { Skeleton } from "@/components/ui/Skeleton";

export default function ProductsLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page title skeleton */}
      <div className="mb-8">
        <Skeleton className="h-10 w-64 mb-4" />
        <Skeleton className="h-5 w-full max-w-2xl" />
      </div>
      
      {/* Filters skeleton */}
      <div className="flex flex-wrap gap-4 mb-8">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-32" />
      </div>
      
      {/* Products grid skeleton */}
      <ProductGridSkeleton count={9} />
    </div>
  );
}
