import React from 'react';

interface ProgressBarProps {
  label: string;
  value: number;
  target: number;
  unit: string;
  displayValue?: string;
  displayTarget?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  label,
  value,
  target,
  unit,
  displayValue,
  displayTarget,
}) => {
  const percentage = target > 0 ? Math.min(100, Math.max(0, (value / target) * 100)) : 0;
  const shownVal = displayValue ?? value.toString();
  const shownTarget = displayTarget ?? target.toString();

  return (
    <div className="w-full flex flex-col gap-1.5">
      <div className="flex justify-between items-baseline text-[13px]">
        <span className="font-normal text-[var(--color-text-secondary)]">{label}</span>
        <span className="font-medium text-[var(--color-text-primary)]">
          {shownVal} / {shownTarget} {unit}
        </span>
      </div>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={target}
        className="h-2 w-full rounded-full bg-[var(--color-progress-track)] overflow-hidden"
      >
        <div
          className="h-full bg-[var(--color-accent)] rounded-full transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
