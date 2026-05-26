import React from 'react';
import { AlertTriangle, Home, RotateCcw } from 'lucide-react';

const ErrorScreen = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 font-sans relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(99,102,241,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(59,130,246,0.1),transparent_50%)]" />
      
      <div className="relative max-w-md w-full bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-8 rounded-3xl shadow-2xl text-center flex flex-col items-center space-y-6">
        <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl flex items-center justify-center animate-pulse">
          <AlertTriangle className="w-8 h-8" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-slate-100">Something went wrong</h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Our systems encountered an unexpected runtime error. Sentry has logged this incident and our developers are on it.
          </p>
        </div>
        
        <div className="flex gap-4 w-full justify-center">
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 transition-all text-sm font-semibold rounded-xl text-white shadow-lg shadow-indigo-600/25 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            Reload App
          </button>
          
          <button
            onClick={() => window.location.href = '/home'}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 active:scale-95 transition-all text-sm font-semibold rounded-xl text-slate-300 border border-slate-700 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorScreen;
