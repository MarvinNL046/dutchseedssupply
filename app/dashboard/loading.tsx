import { Skeleton } from "@/components/ui/Skeleton";

export default function DashboardLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Dashboard header skeleton */}
      <div className="mb-8">
        <Skeleton className="h-10 w-64 mb-4" />
        <Skeleton className="h-5 w-full max-w-2xl" />
      </div>
      
      {/* Dashboard cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-800">
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-10 w-24 mb-4" />
            <Skeleton className="h-4 w-full" />
          </div>
        ))}
      </div>
      
      {/* Recent orders skeleton */}
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-800">
        <Skeleton className="h-6 w-40 mb-4" />
        
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col md:flex-row md:items-center justify-between py-4 border-b border-gray-200 dark:border-gray-800">
              <div className="flex flex-col space-y-2 mb-2 md:mb-0">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-48" />
              </div>
              <div className="flex flex-col space-y-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
              <Skeleton className="h-8 w-24 mt-2 md:mt-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
