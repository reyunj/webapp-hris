import * as React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning';
}

function Badge({ className = '', variant = 'default', ...props }: BadgeProps) {
  const variants = {
    default: 'bg-zinc-900 text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200',
    secondary: 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-700',
    destructive: 'bg-red-600 text-zinc-50 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800',
    outline: 'border border-zinc-200 dark:border-zinc-800',
    success: 'bg-green-600 text-zinc-50 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800',
    warning: 'bg-yellow-600 text-zinc-50 hover:bg-yellow-700 dark:bg-yellow-700 dark:hover:bg-yellow-800',
  };

  return (
    <div
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${variants[variant]} ${className}`}
      {...props}
    />
  );
}

export { Badge };
