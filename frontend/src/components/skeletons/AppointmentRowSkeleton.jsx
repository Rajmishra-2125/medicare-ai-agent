import React from "react";
import { Skeleton } from "../ui/skeleton";

export default function AppointmentRowSkeleton() {
  return (
    <div className="space-y-6 w-full animate-pulse">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-100 dark:border-slate-700/50 shadow-xs"
        >
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left Section: Doctor Avatar & Info */}
            <div className="flex items-start gap-4 lg:w-1/3">
              <Skeleton className="w-16 h-16 rounded-2xl bg-slate-200 dark:bg-slate-700 shrink-0" />
              <div className="space-y-2.5 flex-1">
                <Skeleton className="h-4 w-36 bg-slate-200 dark:bg-slate-700 rounded-lg" />
                <Skeleton className="h-3 w-28 bg-slate-100 dark:bg-slate-700/60 rounded-md" />
                <Skeleton className="h-5 w-20 bg-slate-100 dark:bg-slate-700/40 rounded-md" />
              </div>
            </div>

            {/* Right Section: Timings & Actions */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between flex-1 gap-6 border-t lg:border-t-0 lg:border-l border-slate-100 dark:border-slate-700/30 pt-4 lg:pt-0 lg:pl-6">
              {/* Date & Time fields */}
              <div className="grid grid-cols-2 gap-8 flex-1">
                <div className="space-y-2">
                  <Skeleton className="h-2.5 w-12 bg-slate-100 dark:bg-slate-700/40 rounded" />
                  <Skeleton className="h-4 w-28 bg-slate-200 dark:bg-slate-700 rounded-md" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-2.5 w-12 bg-slate-100 dark:bg-slate-700/40 rounded" />
                  <Skeleton className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded-md" />
                </div>
              </div>

              {/* Status and Action Buttons */}
              <div className="flex items-center justify-between lg:justify-end gap-4 shrink-0">
                <Skeleton className="h-7 w-24 bg-slate-100 dark:bg-slate-700/50 rounded-full" />
                <div className="flex gap-2">
                  <Skeleton className="w-9 h-9 bg-slate-100 dark:bg-slate-700/50 rounded-xl" />
                  <Skeleton className="w-9 h-9 bg-slate-100 dark:bg-slate-700/50 rounded-xl" />
                  <Skeleton className="w-9 h-9 bg-slate-100 dark:bg-slate-700/50 rounded-xl" />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
