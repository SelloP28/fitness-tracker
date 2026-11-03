import React from 'react';
import { NavLink } from 'react-router-dom';
import { Calendar, PlusCircle, Dumbbell, TrendingUp, MoreHorizontal } from 'lucide-react';
import { navigationItems } from '../data/sampleData';

const iconMap = {
  today: Calendar,
  log: PlusCircle,
  train: Dumbbell,
  progress: TrendingUp,
  more: MoreHorizontal,
};

export const TabBar: React.FC = () => {
  return (
    <nav
      aria-label="Primary mobile navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--color-bg-card)] border-t border-[var(--color-border-card)] pb-safe transition-colors"
    >
      <div className="grid grid-cols-5 items-center h-16 max-w-lg mx-auto px-2">
        {navigationItems.map((item) => {
          const Icon = iconMap[item.iconName];
          return (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) =>
                `min-h-[44px] flex flex-col items-center justify-center gap-1 text-[11px] font-normal transition-colors select-none focus-visible:outline-2 focus-visible:outline-[var(--color-accent)] focus-visible:outline-offset-[-2px] ${
                  isActive
                    ? 'text-[var(--color-accent)] font-medium'
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={`w-5 h-5 transition-transform ${
                      isActive ? 'stroke-[2.2px] scale-105' : 'stroke-[1.75px]'
                    }`}
                    aria-hidden="true"
                  />
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
