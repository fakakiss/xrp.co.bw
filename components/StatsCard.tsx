import React, { ReactNode } from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  trend?: string;
  colorClass?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({ title, value, subtitle, icon, trend, colorClass = "text-white" }) => {
  return (
    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg flex flex-col justify-between h-full relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity transform scale-150">
        {icon}
      </div>
      
      <div className="flex justify-between items-start mb-4">
        <div>
            <p className="text-slate-400 text-sm font-medium uppercase tracking-wide">{title}</p>
            <h3 className={`text-3xl font-bold mt-1 ${colorClass}`}>{value}</h3>
        </div>
        <div className={`p-2 rounded-lg bg-slate-700/50 text-slate-300`}>
            {icon}
        </div>
      </div>
      
      {(subtitle || trend) && (
        <div className="flex items-center justify-between mt-2 pt-3 border-t border-slate-700/50">
           {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
           {trend && <span className="text-xs font-bold text-green-400 bg-green-900/20 px-2 py-1 rounded">{trend}</span>}
        </div>
      )}
    </div>
  );
};
