import React from 'react';
import { NavLink } from 'react-router-dom';
import { Calendar, PlusCircle, Dumbbell, TrendingUp, MoreHorizontal, Activity } from 'lucide-react';
import { navigationItems } from '../data/sampleData';

const iconMap = {
  today: Calendar,
  log: PlusCircle,
  train: Dumbbell,
  progress: TrendingUp,
  more: MoreHorizontal,
};

export const Sidebar: React.FC = () => {
  return (
    <aside
      aria-label="Desktop navigation sidebar"
      className="hidden md:flex flex-col w-60 shrink-0 border-r border-[var(--color-border-card)] bg-[var(--color-bg-card)] min-h-screen sticky top-0 transition-colors z-30"
    >
      {/* Brand Header */}
      <div className="p-6 border-b border-[var(--color-border-card)]">
        <NavLink
          to="/today"
          className="flex items-center gap-2.5 text-[var(--color-text-primary)] hover:opacity-90 transition-opacity focus-visible:outline-2 focus-visible:outline-[var(--color-accent)] rounded-[8px]"
        >
          <div className="w-8 h-8 rounded-[8px] bg-[var(--color-accent)] text-[var(--color-accent-on)] flex items-center justify-center shrink-0">
            <Activity className="w-4 h-4 stroke-[2.2px]" aria-hidden="true" />
          </div>
          <div className="flex flex-col">
            <span className="text-[16px] font-medium tracking-tight text-[var(--color-text-primary)] leading-tight">
              Fuel &amp; Form
            </span>
            <span className="text-[11px] text-[var(--color-text-secondary)] leading-tight">
              Fitness &amp; nutrition
            </span>
          </div>
        </NavLink>
      </div>

      {/* Navigation Destination Links */}
      <nav className="flex-1 p-3 space-y-1">
        {navigationItems.map((item) => {
          const Icon = iconMap[item.iconName];
          return (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) =>
                `min-h-[44px] px-3.5 py-2.5 rounded-[8px] text-[13px] transition-colors flex items-center gap-3 select-none focus-visible:outline-2 focus-visible:outline-[var(--color-accent)] focus-visible:outline-offset-1 ${
                  isActive
                    ? 'bg-[var(--color-accent-subtle)] text-[var(--color-accent)] font-medium'
                    : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-subtle)] hover:text-[var(--color-text-primary)] font-normal'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? 'stroke-[2.2px] text-[var(--color-accent)]' : 'stroke-[1.75px]'
                    }`}
                    aria-hidden="true"
                  />
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* System Theme Note / Clean Footer */}
      <div className="p-4 border-t border-[var(--color-border-card)] text-[12px] text-[var(--color-text-secondary)]">
        <p className="leading-snug">Metric units (kg, L, kcal, g)</p>
        <p className="text-[11px] text-[var(--color-text-tertiary)] mt-0.5">System light &amp; dark</p>
      </div>
    </aside>
  );
};
