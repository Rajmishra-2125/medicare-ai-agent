import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import DashboardStatsSkeleton from "./DashboardStatsSkeleton";
import TableSkeleton from "./TableSkeleton";

export default function DashboardSkeleton() {
  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto animate-in fade-in duration-500">
      <DashboardStatsSkeleton />
      
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-zinc-100 dark:border-slate-800 p-6 mt-8">
        <Skeleton className="h-8 w-48 mb-6" />
        <TableSkeleton rows={4} columns={5} />
      </div>
    </div>
  );
}
