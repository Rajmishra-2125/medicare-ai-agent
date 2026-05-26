import React from "react";
import { Link } from "react-router-dom";

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionPath,
  onActionClick,
}) {
  return (
    <div className="w-full flex flex-col items-center justify-center text-center p-8 sm:p-12 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700/50 shadow-xs max-w-xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Premium Glassmorphism Icon Background */}
      {Icon && (
        <div className="mb-6 w-20 h-20 rounded-3xl bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-inner group">
          <Icon className="w-9 h-9 stroke-[1.75] group-hover:scale-110 transition-transform duration-300" />
        </div>
      )}

      {/* Text Blocks */}
      <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2 leading-tight tracking-tight">
        {title}
      </h3>
      <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-sm mb-6">
        {description}
      </p>

      {/* Conditional CTA Action Button */}
      {actionLabel && (
        <>
          {actionPath ? (
            <Link
              to={actionPath}
              className="inline-flex items-center justify-center px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/35 hover:-translate-y-0.5 duration-200"
            >
              {actionLabel}
            </Link>
          ) : (
            <button
              onClick={onActionClick}
              className="inline-flex items-center justify-center px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/35 hover:-translate-y-0.5 duration-200"
            >
              {actionLabel}
            </button>
          )}
        </>
      )}
    </div>
  );
}
