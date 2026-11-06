import React, { useState } from 'react';
import {
  ChevronRight,
  Sliders,
  Target,
  Dumbbell,
  Package,
  Bell,
  Send,
  User,
  LogOut,
  Zap,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { Card } from '../components/Card';
import { Banner } from '../components/Banner';
import { useAuth } from '../lib/AuthContext';
import { moreMenuItems } from '../data/sampleData';
import { Chip } from '../components/Chip';
import { useEnergyUnit } from '../lib/EnergyUnitContext';
import type { EnergyUnit } from '../lib/energy';

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
  const { logout } = useAuth();
  const { energyUnit, loading: energyUnitLoading, setEnergyUnit, error: energyUnitError } = useEnergyUnit();
  const [signingOut, setSigningOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignOut = async () => {
    setSigningOut(true);
    setError(null);
    try {
      await logout();
    } catch (logoutError) {
      setError(logoutError instanceof Error ? logoutError.message : 'Unable to sign out.');
      setSigningOut(false);
    }
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title="More"
        subtitle="Settings, presets, and preferences"
      />

      <Card className="p-0 overflow-hidden divide-y divide-[var(--color-border-card)]">
        {moreMenuItems.map((item) => {
          const Icon = itemIcons[item.id] || Sliders;
          const contents = (
            <>
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
            </>
          );
          const rowClassName = 'w-full min-h-[52px] px-4 py-3 flex items-center justify-between text-left transition-colors hover:bg-[var(--color-bg-subtle)] focus-visible:outline-2 focus-visible:outline-[var(--color-accent)] focus-visible:outline-offset-[-2px] cursor-pointer';
          return item.id === 'targets' ? (
            <Link key={item.id} to="/more/targets" className={rowClassName}>{contents}</Link>
          ) : (
            <button key={item.id} type="button" className={rowClassName}>{contents}</button>
          );
        })}
        <div className="min-h-[64px] px-4 py-2 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-[8px] bg-[var(--color-bg-subtle)] border border-[var(--color-border-card)] flex items-center justify-center text-[var(--color-text-secondary)] shrink-0">
              <Zap className="w-4 h-4 stroke-[1.75px]" aria-hidden="true" />
            </div>
            <div>
              <span className="block text-[14px] font-medium text-[var(--color-text-primary)]">Energy unit</span>
              <span className="block text-[12px] text-[var(--color-text-secondary)]">Choose kcal or kJ</span>
            </div>
          </div>
          <div className="flex gap-1" aria-label="Energy unit">
            {(['kcal', 'kJ'] as const).map((unit: EnergyUnit) => (
              <Chip
                key={unit}
                selected={energyUnit === unit}
                aria-pressed={energyUnit === unit}
                disabled={energyUnitLoading}
                onClick={() => void setEnergyUnit(unit)}
              >
                {unit}
              </Chip>
            ))}
          </div>
        </div>
        <button
          type="button"
          disabled={signingOut}
          onClick={() => void handleSignOut()}
          className="w-full min-h-[52px] px-4 py-3 flex items-center justify-between text-left transition-colors hover:bg-[var(--color-bg-subtle)] focus-visible:outline-2 focus-visible:outline-[var(--color-accent)] focus-visible:outline-offset-[-2px] cursor-pointer disabled:opacity-50"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-[8px] bg-[var(--color-bg-subtle)] border border-[var(--color-border-card)] flex items-center justify-center text-[var(--color-text-secondary)] shrink-0">
              <LogOut className="w-4 h-4 stroke-[1.75px]" aria-hidden="true" />
            </div>
            <span className="text-[14px] font-medium text-[var(--color-text-primary)]">{signingOut ? 'Signing out…' : 'Sign out'}</span>
          </div>
          <ChevronRight className="w-4 h-4 text-[var(--color-text-tertiary)] shrink-0" aria-hidden="true" />
        </button>
      </Card>
      {energyUnitError && <Banner message={energyUnitError} />}
      {error && <Banner message={error} />}
    </div>
  );
};
