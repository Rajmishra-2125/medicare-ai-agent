import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function PageLoader() {
  return (
    <div className="p-6 space-y-4 w-full h-full animate-in fade-in duration-500">
      <Skeleton className="h-10 w-48 rounded-lg" />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mt-6">
        <Skeleton className="h-32 w-full rounded-2xl" />
        <Skeleton className="h-32 w-full rounded-2xl" />
        <Skeleton className="h-32 w-full rounded-2xl" />
        <Skeleton className="h-32 w-full rounded-2xl" />
      </div>
      <Skeleton className="h-100 w-full rounded-2xl mt-8" />
    </div>
  );
}
