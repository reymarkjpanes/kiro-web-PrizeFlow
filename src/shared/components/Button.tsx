import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'default' | 'small';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'default', className = '', disabled, children, ...props }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md transition-all duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 active:scale-95';

    const variantClasses = {
      primary: 'bg-primary-600 text-white hover:bg-primary-700 shadow-sm',
      secondary: 'bg-white text-neutral-700 border border-neutral-300 hover:bg-neutral-50 shadow-sm',
      danger: 'bg-danger-600 text-white hover:bg-danger-700 shadow-sm',
      success: 'bg-success-600 text-white hover:bg-success-700 shadow-sm',
    };

    const sizeClasses = {
      default: 'px-4 py-2 text-body-sm gap-2',
      small: 'px-3 py-1.5 text-caption gap-1.5',
    };

    const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : '';

    return (
      <button
        ref={ref}
        className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
export { Button };
