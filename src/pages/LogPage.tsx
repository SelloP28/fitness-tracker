import React from 'react';
import { PlusCircle } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { Card } from '../components/Card';

export const LogPage: React.FC = () => {
  return (
    <div className="space-y-4">
      <PageHeader
        title="Log"
        subtitle="Nutrition and meal entry"
      />

      <Card className="flex flex-col items-center text-center p-8 sm:p-12 gap-3">
        <div className="w-12 h-12 rounded-[12px] bg-[var(--color-bg-subtle)] border border-[var(--color-border-card)] flex items-center justify-center text-[var(--color-accent)]">
          <PlusCircle className="w-6 h-6 stroke-[1.75px]" aria-hidden="true" />
        </div>
        <h2 className="text-base font-medium text-[var(--color-text-primary)]">
          Meal logging coming soon
        </h2>
        <p className="text-[13px] text-[var(--color-text-secondary)] max-w-sm leading-relaxed">
          Log meals by searching foods, using presets, or scanning nutrition labels and meal photos.
        </p>
      </Card>
    </div>
  );
};
