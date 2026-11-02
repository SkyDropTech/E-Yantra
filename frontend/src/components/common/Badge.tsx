import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'online' | 'offline' | 'maintenance' | 'alert' | 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'rare';
  size?: 'sm' | 'md';
  dot?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  dot = false,
  className = '',
}) => {
  const variantStyles = {
    online: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    offline: 'bg-rose-50 text-rose-700 border-rose-200',
    maintenance: 'bg-slate-100 text-slate-700 border-slate-300',
    alert: 'bg-amber-50 text-amber-800 border-amber-300',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border-rose-200',
    info: 'bg-sky-50 text-sky-700 border-sky-200',
    neutral: 'bg-stone-100 text-stone-700 border-stone-200',
    rare: 'bg-purple-50 text-purple-700 border-purple-200',
  };

  const dotColors = {
    online: 'bg-emerald-500',
    offline: 'bg-rose-500',
    maintenance: 'bg-slate-500',
    alert: 'bg-amber-500',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-rose-500',
    info: 'bg-sky-500',
    neutral: 'bg-stone-400',
    rare: 'bg-purple-500',
  };

  const sizeStyles = {
    sm: 'text-[10px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full mr-1.5 ${dotColors[variant]}`}
        />
      )}
      {children}
    </span>
  );
};
