import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Banner } from '../components/Banner';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import { getLatestTargets, toLocalDateString, saveTargets } from '../lib/api/targets';
import type { NutritionTargets } from '../lib/api/types';
import { formatLiters } from '../lib/calculator';
import { useEnergyUnit } from '../lib/EnergyUnitContext';
import { energyLabel, formatEnergy, kjToKcal, kcalToKj } from '../lib/energy';

const inputClassName = 'w-full min-h-[44px] rounded-[8px] border border-[var(--color-border-card)] bg-[var(--color-bg-page)] px-3 text-[14px] text-[var(--color-text-primary)] focus-visible:outline-2 focus-visible:outline-[var(--color-accent)]';
const today = toLocalDateString(new Date());

export function TargetsPage() {
  const { energyUnit, loading: energyUnitLoading } = useEnergyUnit();
  const navigate = useNavigate();
  const [currentTargets, setCurrentTargets] = useState<NutritionTargets | null>(null);
  const [date, setDate] = useState(today);
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [water, setWater] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [canRetryLoad, setCanRetryLoad] = useState(false);

  const loadTargets = async () => {
    setLoading(true);
    setError(null);
    try {
      const targets = await getLatestTargets();
      setCurrentTargets(targets);
      setCanRetryLoad(false);
      if (targets) {
        setCalories(String(energyUnit === 'kJ' ? kcalToKj(targets.calories) : targets.calories));
        setProtein(String(targets.protein));
        setWater(String(Math.round(targets.water * 1000)));
      }
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load current targets.');
      setCanRetryLoad(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (energyUnitLoading) return;
    void loadTargets();
  }, [energyUnit, energyUnitLoading]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const values = [calories, protein, water].map(Number);
    if (values.some((value) => !Number.isInteger(value) || value <= 0)) {
      setError('Enter a positive whole number for each daily target.');
      return;
    }
    setSaving(true);
    setError(null);
    setCanRetryLoad(false);
    try {
      await saveTargets({
        calories: energyUnit === 'kJ' ? kjToKcal(values[0]) : values[0],
        protein: values[1],
        waterMl: values[2],
        effectiveFrom: date,
      });
      navigate('/today', { replace: true });
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Unable to save targets.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <PageHeader title="Daily targets" subtitle="Set targets for a date; previous entries are kept" />
      <Card>
        <h2 className="text-[14px] font-medium mb-2">Current targets</h2>
        {loading ? (
          <div className="h-5 w-56 rounded bg-[var(--color-bg-subtle)] animate-pulse" aria-label="Loading targets" />
        ) : currentTargets ? (
          <p className="text-[13px] text-[var(--color-text-secondary)]">
            {formatEnergy(currentTargets.calories, energyUnit)} {energyLabel(energyUnit)} · {currentTargets.protein} g protein · {formatLiters(currentTargets.water)} L water
          </p>
        ) : (
          <p className="text-[13px] text-[var(--color-text-secondary)]">No targets have been set yet.</p>
        )}
      </Card>
      <Card>
        {error && (
          <Banner
            className="mb-4"
            message={error}
            action={canRetryLoad ? { label: 'Retry', onClick: () => void loadTargets() } : undefined}
          />
        )}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block space-y-1.5">
            <span className="text-[13px] text-[var(--color-text-secondary)]">Daily calories ({energyLabel(energyUnit)})</span>
            <input className={inputClassName} type="number" min="1" step="1" required value={calories} onChange={(event) => setCalories(event.target.value)} />
            {energyUnit === 'kJ' && calories !== '' && (
              <span className="block text-[12px] text-[var(--color-text-secondary)]">
                Equivalent: {formatEnergy(kjToKcal(Number(calories)), 'kcal')} kcal
              </span>
            )}
          </label>
          <label className="block space-y-1.5">
            <span className="text-[13px] text-[var(--color-text-secondary)]">Daily protein (g)</span>
            <input className={inputClassName} type="number" min="1" step="1" required value={protein} onChange={(event) => setProtein(event.target.value)} />
          </label>
          <label className="block space-y-1.5">
            <span className="text-[13px] text-[var(--color-text-secondary)]">Daily water (ml)</span>
            <input className={inputClassName} type="number" min="1" step="1" required value={water} onChange={(event) => setWater(event.target.value)} />
          </label>
          <label className="block space-y-1.5">
            <span className="text-[13px] text-[var(--color-text-secondary)]">Effective from</span>
            <input className={inputClassName} type="date" required value={date} onChange={(event) => setDate(event.target.value)} />
          </label>
          <div className="flex gap-2">
            <Button type="submit" variant="primary" disabled={saving || loading || energyUnitLoading}>
              {saving ? 'Saving…' : 'Save targets'}
            </Button>
            <Link to="/more" className="min-h-[44px] inline-flex items-center px-3 text-[13px] text-[var(--color-text-secondary)] focus-visible:outline-2 focus-visible:outline-[var(--color-accent)]">Cancel</Link>
          </div>
        </form>
      </Card>
    </div>
  );
}
