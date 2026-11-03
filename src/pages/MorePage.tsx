import React from 'react';
import {
  ChevronRight,
  Sliders,
  Target,
  Dumbbell,
  Package,
  Bell,
  Send,
  User,
} from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { Card } from '../components/Card';
import { moreMenuItems } from '../data/sampleData';

const itemIcons: Record<string, React.ElementType> = {
  presets: Sliders,
  targets: Target,
  workouts: Dumbbell,
  equipment: Package,
  reminders: Bell,
  telegram: Send,
  'data-account': User,
};

export const MorePage: React.FC = () => {
  return (
    <div className="space-y-4">
      <PageHeader
        title="More"
        subtitle="Settings, presets, and preferences"
      />

      <Card className="p-0 overflow-hidden divide-y divide-[var(--color-border-card)]">
        {moreMenuItems.map((item) => {
          const Icon = itemIcons[item.id] || Sliders;
          return (
            <button
              key={item.id}
              type="button"
              className="w-full min-h-[52px] px-4 py-3 flex items-center justify-between text-left transition-colors hover:bg-[var(--color-bg-subtle)] focus-visible:outline-2 focus-visible:outline-[var(--color-accent)] focus-visible:outline-offset-[-2px] cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-[8px] bg-[var(--color-bg-subtle)] border border-[var(--color-border-card)] flex items-center justify-center text-[var(--color-text-secondary)] shrink-0">
                  <Icon className="w-4 h-4 stroke-[1.75px]" aria-hidden="true" />
                </div>
                <div>
                  <span className="block text-[14px] font-medium text-[var(--color-text-primary)]">
                    {item.label}
                  </span>
                  <span className="block text-[12px] text-[var(--color-text-secondary)]">
                    {item.description}
                  </span>
                </div>
              </div>
              <ChevronRight
                className="w-4 h-4 text-[var(--color-text-tertiary)] shrink-0"
                aria-hidden="true"
              />
            </button>
          );
        })}
      </Card>
    </div>
  );
};
