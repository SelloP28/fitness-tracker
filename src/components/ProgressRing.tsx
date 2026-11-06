import React from 'react';
import { formatEnergy } from '../lib/energy';
import { kcalToKj } from '../lib/energy';
import type { EnergyUnit } from '../lib/energy';

interface ProgressRingProps {
  value: number;
  target: number;
  size?: number;
  strokeWidth?: number;
  unit?: EnergyUnit;
  label?: string;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  value,
  target,
  size = 110,
  strokeWidth = 9,
  unit = 'kcal',
  label = 'Calories',
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = target > 0 ? Math.min(100, Math.max(0, (value / target) * 100)) : 0;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuenow={unit === 'kJ' ? kcalToKj(value) : value}
      aria-valuemin={0}
      aria-valuemax={unit === 'kJ' ? kcalToKj(target) : target}
      className="relative flex items-center justify-center shrink-0"
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
      >
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-progress-track)"
          strokeWidth={strokeWidth}
        />
        {/* Active progress ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-300 ease-out"
        />
      </svg>
      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-1 pointer-events-none">
        <span className="text-[17px] font-medium leading-tight text-[var(--color-text-primary)]">
          {formatEnergy(value, unit)}
        </span>
        <span className="text-[12px] font-normal text-[var(--color-text-secondary)] leading-tight mt-0.5">
          of {formatEnergy(target, unit)} {unit}
        </span>
      </div>
    </div>
  );
};
