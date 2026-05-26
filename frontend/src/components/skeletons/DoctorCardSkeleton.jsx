import React from "react";
import { Skeleton } from "../ui/skeleton";

export default function DoctorCardSkeleton() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 w-full animate-pulse">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-100 dark:border-slate-700/50 shadow-xs flex flex-col space-y-4"
        >
          {/* Avatar and Header Info */}
          <div className="flex items-center gap-4">
            <Skeleton className="w-16 h-16 rounded-2xl bg-slate-200 dark:bg-slate-700" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded-lg" />
              <Skeleton className="h-3 w-20 bg-slate-100 dark:bg-slate-700/60 rounded-md" />
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-50 dark:border-slate-700/30">
            <div className="text-center space-y-1.5">
              <Skeleton className="h-3 w-8 bg-slate-100 dark:bg-slate-700/60 mx-auto rounded-md" />
              <div className="text-[10px] text-slate-400 font-medium">Rating</div>
            </div>
            <div className="text-center space-y-1.5 border-x border-slate-100 dark:border-slate-700/50">
              <Skeleton className="h-3 w-8 bg-slate-100 dark:bg-slate-700/60 mx-auto rounded-md" />
              <div className="text-[10px] text-slate-400 font-medium">Exp</div>
            </div>
            <div className="text-center space-y-1.5">
              <Skeleton className="h-3 w-10 bg-slate-100 dark:bg-slate-700/60 mx-auto rounded-md" />
              <div className="text-[10px] text-slate-400 font-medium">Patients</div>
            </div>
          </div>

          {/* Location & Fee */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton className="w-3 h-3 rounded-full bg-slate-100 dark:bg-slate-700/60" />
              <Skeleton className="h-3 w-40 bg-slate-100 dark:bg-slate-700/60 rounded-md" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="w-3 h-3 rounded-full bg-slate-100 dark:bg-slate-700/60" />
              <Skeleton className="h-3 w-24 bg-slate-100 dark:bg-slate-700/60 rounded-md" />
            </div>
          </div>

          {/* Action button */}
          <Skeleton className="h-10 w-full bg-indigo-100/50 dark:bg-indigo-950/20 rounded-xl" />
        </div>
      ))}
    </div>
  );
}
