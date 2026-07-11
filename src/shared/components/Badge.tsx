import React from 'react';
import type { BadgeVariant } from '@/shared/types';

export interface BadgeProps {
  variant: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

function Badge({ variant, children, className = '' }: BadgeProps) {
  const variantClasses = {
    success: 'bg-success-100 text-success-700 ring-success-600/20',
    warning: 'bg-warning-100 text-warning-700 ring-warning-600/20',
    neutral: 'bg-neutral-100 text-neutral-700 ring-neutral-600/20',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-caption font-medium ring-1 ring-inset transition-colors duration-200 ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
}

export { Badge };
