import React from 'react';
const StatsCard = ({ title, value, icon: Icon, colorClass }) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-zinc-100 dark:border-slate-800 p-6 flex items-center justify-between hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-medium text-zinc-500 dark:text-slate-400">{title}</h3>
        <p className="text-3xl font-bold text-zinc-800 dark:text-white tracking-tight">{value}</p>
      </div>
      <div className={`p-4 rounded-2xl transition-transform duration-300 group-hover:scale-110 flex items-center justify-center ${colorClass}`}>
        <Icon className="w-7 h-7" />
      </div>
    </div>
  );
};

export default StatsCard;
