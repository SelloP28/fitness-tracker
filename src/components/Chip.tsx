import React from 'react';

interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export const Chip: React.FC<ChipProps> = ({
  selected = false,
  children,
  icon,
  className = '',
  type = 'button',
  ...rest
}) => {
  return (
    <button
      type={type}
      aria-pressed={selected}
      className={`min-h-[44px] px-3.5 py-2 rounded-full text-[13px] font-normal transition-colors border flex items-center gap-1.5 cursor-pointer focus-visible:outline-2 focus-visible:outline-[var(--color-accent)] focus-visible:outline-offset-2 active:scale-[0.98] select-none ${
        selected
          ? 'bg-[var(--color-accent-subtle)] text-[var(--color-accent)] border-[var(--color-accent-border)] font-medium'
          : 'bg-[var(--color-bg-subtle)] text-[var(--color-text-primary)] border-[var(--color-border-card)] hover:bg-[var(--color-bg-hover)]'
      } ${className}`}
      {...rest}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};
