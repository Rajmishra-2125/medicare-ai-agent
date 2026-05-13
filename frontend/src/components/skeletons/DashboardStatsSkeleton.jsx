import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardStatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in duration-500">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800">
          <div className="flex justify-between items-start mb-4">
             <Skeleton className="h-12 w-12 rounded-xl" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-8 w-24 rounded-lg" />
            <Skeleton className="h-4 w-32 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
}
