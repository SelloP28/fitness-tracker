import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  as: Component = 'div',
  ...rest
}) => {
  return (
    <Component
      className={`bg-[var(--color-bg-card)] border border-[var(--color-border-card)] rounded-[12px] p-4 text-[var(--color-text-primary)] transition-colors ${className}`}
      {...rest}
    >
      {children}
    </Component>
  );
};
