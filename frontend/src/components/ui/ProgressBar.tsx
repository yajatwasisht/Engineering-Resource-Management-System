import React from 'react';
import { cn } from '../../utils/cn';

interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  color?: 'default' | 'success' | 'warning' | 'danger';
}

export const ProgressBar = React.forwardRef<HTMLDivElement, ProgressBarProps>(
  ({ className, value, max = 100, color = 'default', ...props }, ref) => {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));
    
    const getColorClass = () => {
      switch (color) {
        case 'success':
          return 'bg-green-600';
        case 'warning':
          return 'bg-yellow-500';
        case 'danger':
          return 'bg-red-600';
        default:
          return 'bg-blue-600';
      }
    };

    return (
      <div
        ref={ref}
        className={cn('h-2 w-full overflow-hidden rounded-full bg-gray-200', className)}
        {...props}
      >
        <div
          className={cn('h-full transition-all', getColorClass())}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
    );
  }
);

ProgressBar.displayName = 'ProgressBar'; 