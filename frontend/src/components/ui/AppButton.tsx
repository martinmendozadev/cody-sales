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
  // Reglas del sistema de diseño
  const baseStyles = "inline-flex items-center justify-center rounded-md font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

  const variants = {
    primary: "bg-brand-primary text-white hover:bg-brand-secondary",
    secondary: "bg-surface-muted text-gray-900 hover:bg-gray-200",
    outline: "border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white",
  };

  const sizes = {
    sm: "h-9 px-3 text-body-sm",
    md: "h-10 px-4 py-2 text-body-md",
    lg: "h-12 px-8 text-body-lg",
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
