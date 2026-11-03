import React from 'react';
import { AlertCircle, Info } from 'lucide-react';

interface BannerProps {
  variant?: 'info' | 'warning';
  message: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const Banner: React.FC<BannerProps> = ({
  variant = 'warning',
  message,
  icon,
  action,
  className = '',
}) => {
  const isWarning = variant === 'warning';

  const defaultIcon = isWarning ? (
    <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
  ) : (
    <Info className="w-4 h-4 shrink-0" aria-hidden="true" />
  );

  return (
    <div
      role={isWarning ? 'alert' : 'status'}
      className={`min-h-[44px] px-3.5 py-2.5 rounded-[8px] text-[13px] flex items-center justify-between gap-3 border transition-colors ${
        isWarning
          ? 'bg-[var(--color-warning-bg)] text-[var(--color-warning-text)] border-[var(--color-warning-border)]'
          : 'bg-[var(--color-accent-subtle)] text-[var(--color-accent)] border-[var(--color-accent-border)]'
      } ${className}`}
    >
      <div className="flex items-center gap-2.5">
        {icon ?? defaultIcon}
        <span className="font-normal">{message}</span>
      </div>
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className="text-[12px] font-medium underline underline-offset-2 shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-1"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};
