import React from 'react';
import { cn } from '../../utils/cn';

interface AppButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const AppButton: React.FC<AppButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className,
  children,
  disabled,
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

  const variants = {
    primary: "bg-brand-primary text-white hover:bg-brand-secondary shadow-soft",
    secondary: "bg-surface-muted border border-surface-border text-text-main hover:bg-gray-50",
    outline: "border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white",
  };

  const sizes = {
    sm: "h-9 px-4 text-body-sm rounded-full",
    md: "h-11 px-6 py-2 text-body-md rounded-md",
    lg: "h-14 px-8 text-body-lg rounded-md",
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? (
        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : null}
      {children}
    </button>
  );
};
