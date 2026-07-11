import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

function Card({ className = '', children, ...props }: CardProps) {
  return (
    <div
      className={`bg-white rounded-lg shadow-sm border border-neutral-200 p-4 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export { Card };
