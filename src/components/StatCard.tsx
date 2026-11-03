import React from 'react';
import { Card } from './Card';

interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  note?: string;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  unit,
  note,
  className = '',
}) => {
  return (
    <Card className={`flex flex-col gap-1 p-3.5 ${className}`}>
      <span className="text-[12px] font-normal text-[var(--color-text-secondary)]">
        {label}
      </span>
      <div className="flex items-baseline gap-1">
        <span className="text-xl font-medium text-[var(--color-text-primary)]">
          {value}
        </span>
        {unit && (
          <span className="text-[12px] font-normal text-[var(--color-text-secondary)]">
            {unit}
          </span>
        )}
      </div>
      {note && (
        <span className="text-[12px] font-normal text-[var(--color-text-tertiary)] mt-0.5">
          {note}
        </span>
      )}
    </Card>
  );
};
