import React from "react";
import { Skeleton } from "../ui/skeleton";

export default function DoctorProfileSkeleton() {
  return (
    <div className="w-full space-y-8 animate-pulse">
      {/* Header Banner Shimmer */}
      <div className="bg-slate-200 dark:bg-slate-800 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row gap-6 items-center border border-slate-100 dark:border-slate-700/30">
        <Skeleton className="w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-slate-300 dark:bg-slate-700 shrink-0" />
        <div className="flex-1 space-y-3.5 text-center md:text-left">
          <Skeleton className="h-6 w-48 bg-slate-300 dark:bg-slate-700 mx-auto md:mx-0 rounded-lg" />
          <Skeleton className="h-4 w-32 bg-slate-200 dark:bg-slate-700 mx-auto md:mx-0 rounded-md" />
          <div className="flex justify-center md:justify-start gap-2 pt-2">
            <Skeleton className="h-5 w-16 bg-slate-200 dark:bg-slate-700 rounded-full" />
            <Skeleton className="h-5 w-24 bg-slate-200 dark:bg-slate-700 rounded-full" />
          </div>
        </div>
      </div>

      {/* Grid Content Layout */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Details Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-100 dark:border-slate-700/50 space-y-6">
            <div className="space-y-3">
              <Skeleton className="h-5 w-36 bg-slate-200 dark:bg-slate-700 rounded-lg" />
              <Skeleton className="h-3 w-full bg-slate-100 dark:bg-slate-700/60 rounded-md" />
              <Skeleton className="h-3 w-11/12 bg-slate-100 dark:bg-slate-700/60 rounded-md" />
              <Skeleton className="h-3 w-4/5 bg-slate-100 dark:bg-slate-700/60 rounded-md" />
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-50 dark:border-slate-700/20">
              <Skeleton className="h-5 w-40 bg-slate-200 dark:bg-slate-700 rounded-lg" />
              <div className="grid sm:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex gap-3 items-center">
                    <Skeleton className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700/50" />
                    <div className="space-y-1.5 flex-1">
                      <Skeleton className="h-3 w-16 bg-slate-100 dark:bg-slate-700/60 rounded" />
                      <Skeleton className="h-3.5 w-24 bg-slate-200 dark:bg-slate-700 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Info Section */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-100 dark:border-slate-700/50 space-y-4">
            <Skeleton className="h-5 w-28 bg-slate-200 dark:bg-slate-700 rounded-lg" />
            <div className="space-y-3">
              <Skeleton className="h-10 w-full bg-slate-100 dark:bg-slate-700/50 rounded-xl" />
              <Skeleton className="h-10 w-full bg-slate-100 dark:bg-slate-700/50 rounded-xl" />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-100 dark:border-slate-700/50 space-y-4">
            <Skeleton className="h-5 w-32 bg-slate-200 dark:bg-slate-700 rounded-lg" />
            <div className="flex gap-3">
              <Skeleton className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-700 shrink-0" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-28 bg-slate-200 dark:bg-slate-700 rounded" />
                <Skeleton className="h-3 w-20 bg-slate-100 dark:bg-slate-700/60 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
