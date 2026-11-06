import React from 'react';
import { TrendingUp } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { Card } from '../components/Card';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';

const sampleWeightTrend = [
  { day: 'Mon', weight: 78.4 },
  { day: 'Tue', weight: 78.2 },
  { day: 'Wed', weight: 78.1 },
  { day: 'Thu', weight: 77.9 },
  { day: 'Fri', weight: 77.8 },
  { day: 'Sat', weight: 77.6 },
  { day: 'Sun', weight: 77.5 },
];

export const ProgressPage: React.FC = () => {
  return (
    <div className="space-y-4">
      <PageHeader
        title="Progress"
        subtitle="Weight, body metrics, and photo logs"
      />

      <Card className="flex flex-col items-center text-center p-8 sm:p-12 gap-3">
        <div className="w-12 h-12 rounded-[12px] bg-[var(--color-bg-subtle)] border border-[var(--color-border-card)] flex items-center justify-center text-[var(--color-accent)]">
          <TrendingUp className="w-6 h-6 stroke-[1.75px]" aria-hidden="true" />
        </div>
        <h2 className="text-base font-medium text-[var(--color-text-primary)]">
          Progress analytics coming soon
        </h2>
        <p className="text-[13px] text-[var(--color-text-secondary)] max-w-sm leading-relaxed mb-4">
          Visual trends for body weight (kg), weekly energy averages, volume progression, and progress photos.
        </p>

        {/* Lightweight sample trend preview */}
        <div className="w-full max-w-md h-36 bg-[var(--color-bg-subtle)] rounded-[8px] p-2 border border-[var(--color-border-card)]">
          <div className="text-left px-2 pb-1 text-[11px] font-normal text-[var(--color-text-secondary)]">
            Sample weekly weight trend (kg)
          </div>
          <ResponsiveContainer width="100%" height={105}>
            <LineChart data={sampleWeightTrend} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
              <XAxis dataKey="day" stroke="var(--color-text-tertiary)" fontSize={11} tickLine={false} />
              <YAxis domain={['dataMin - 0.5', 'dataMax + 0.5']} stroke="var(--color-text-tertiary)" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-bg-card)',
                  borderColor: 'var(--color-border-card)',
                  borderRadius: '6px',
                  fontSize: '12px',
                  color: 'var(--color-text-primary)',
                }}
              />
              <Line
                type="monotone"
                dataKey="weight"
                stroke="var(--color-accent)"
                strokeWidth={2}
                dot={{ r: 3, fill: 'var(--color-accent)' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};
