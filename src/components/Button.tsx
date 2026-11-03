import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'secondary',
  children,
  icon,
  fullWidth = false,
  className = '',
  type = 'button',
  disabled = false,
  ...rest
}) => {
  const baseStyles =
    'min-h-[44px] px-4 py-2.5 rounded-[8px] text-[13px] font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-2 focus-visible:outline-[var(--color-accent)] focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none border';

  const variantStyles =
    variant === 'primary'
      ? 'bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-[var(--color-accent-on)] border-transparent active:opacity-95'
      : 'bg-[var(--color-bg-subtle)] hover:bg-[var(--color-bg-hover)] text-[var(--color-text-primary)] border-[var(--color-border-card)] active:opacity-90';

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles} ${widthStyle} ${className}`}
      {...rest}
    >
      {icon && <span className="shrink-0 flex items-center">{icon}</span>}
      <span className="truncate">{children}</span>
    </button>
  );
};
