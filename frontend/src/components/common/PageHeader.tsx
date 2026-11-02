import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  tagline?: string;
  actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  badge,
  tagline,
  actions,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-stone-200/70 mb-6 gap-4">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
            {title}
          </h1>
          {badge}
        </div>
        {subtitle && (
          <p className="text-xs text-stone-500 mt-1 font-medium">
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3">
        {tagline && (
          <span className="hidden lg:inline-flex items-center text-xs font-medium text-emerald-800 bg-emerald-50/80 border border-emerald-200/60 px-3 py-1.5 rounded-full">
            🌿 {tagline}
          </span>
        )}
        {actions}
      </div>
    </div>
  );
};
