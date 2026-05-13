import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function TableSkeleton({ rows = 5, columns = 4 }) {
  return (
    <div className="w-full animate-in fade-in duration-500">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-100 dark:border-slate-800">
              {Array.from({ length: columns }).map((_, i) => (
                <th key={i} className="px-6 py-4">
                  <Skeleton className="h-4 w-20 rounded" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-slate-800">
            {Array.from({ length: rows }).map((_, rIdx) => (
              <tr key={rIdx}>
                {Array.from({ length: columns }).map((_, cIdx) => (
                  <td key={cIdx} className="px-6 py-4">
                    {cIdx === 0 ? (
                       <div className="flex items-center gap-3">
                         <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                         <div className="space-y-2 flex-1">
                            <Skeleton className="h-4 w-24 rounded" />
                            <Skeleton className="h-3 w-32 rounded" />
                         </div>
                       </div>
                    ) : (
                       <Skeleton className={`h-4 ${cIdx === columns - 1 ? 'w-12 ml-auto' : 'w-24'} rounded`} />
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
