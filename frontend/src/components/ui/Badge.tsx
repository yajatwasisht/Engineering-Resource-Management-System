import React from 'react';
import { cn } from '../../utils/cn';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: string;
}

export const Badge: React.FC<BadgeProps> = ({ 
  className, 
  variant = 'default',
  children,
  ...props 
}) => {
  const getVariantClasses = (variant: string) => {
    switch (variant) {
      case 'primary':
        return 'bg-primary-100 text-primary-800';
      case 'secondary':
        return 'bg-gray-100 text-gray-800';
      case 'bg-red-500':
        return 'bg-red-100 text-red-800';
      case 'bg-yellow-500':
        return 'bg-yellow-100 text-yellow-800';
      case 'bg-green-500':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        getVariantClasses(variant),
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}; 