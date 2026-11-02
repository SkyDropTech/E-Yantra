import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: string;
    isPositive?: boolean;
    isNeutral?: boolean;
    label?: string;
  };
  icon?: LucideIcon;
  iconBgColor?: string;
  iconColor?: string;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  trend,
  icon: Icon,
  iconBgColor = 'bg-emerald-50',
  iconColor = 'text-emerald-700',
  className = '',
}) => {
  return (
    <div
      className={`bg-white rounded-xl p-5 border border-stone-200/80 shadow-xs flex flex-col justify-between transition-all duration-200 hover:border-stone-300 ${className}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-medium text-stone-500 uppercase tracking-wider block mb-1">
            {title}
          </span>
          <div className="text-2xl lg:text-3xl font-extrabold text-stone-900 tracking-tight">
            {value}
          </div>
        </div>

        {Icon && (
          <div className={`p-2.5 rounded-lg ${iconBgColor} ${iconColor}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
        {trend && (
          <div className="flex items-center space-x-1 font-medium">
            {trend.isNeutral ? (
              <span className="flex items-center text-stone-500">
                <Minus className="w-3.5 h-3.5 mr-0.5" />
                {trend.value}
              </span>
            ) : trend.isPositive ? (
              <span className="flex items-center text-emerald-600">
                <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
                {trend.value}
              </span>
            ) : (
              <span className="flex items-center text-rose-600">
                <TrendingDown className="w-3.5 h-3.5 mr-0.5" />
                {trend.value}
              </span>
            )}
            {trend.label && (
              <span className="text-stone-400 font-normal ml-1">{trend.label}</span>
            )}
          </div>
        )}

        {subtitle && (
          <span className="text-stone-500 text-[11px] font-medium ml-auto">
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
};
