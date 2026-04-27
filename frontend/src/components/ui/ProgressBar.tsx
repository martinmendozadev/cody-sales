import React from 'react';
import { cn } from '../../utils/cn';

interface ProgressBarProps {
  percentage: number;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ percentage, className }) => {
  // Asegurarnos de que el porcentaje esté entre 0 y 100
  const clampedPercentage = Math.min(Math.max(percentage, 0), 100);

  // Cambiar el color si se alcanzó la meta
  const isGoalReached = clampedPercentage >= 100;
  const barColor = isGoalReached ? 'bg-success-base' : 'bg-brand-primary';

  return (
    <div className={cn("w-full bg-surface-muted rounded-full h-4 overflow-hidden", className)}>
      <div
        className={cn("h-4 transition-all duration-500 ease-out rounded-full", barColor)}
        style={{ width: `${clampedPercentage}%` }}
      />
    </div>
  );
};
