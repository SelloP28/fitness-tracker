import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Camera, Dumbbell, GlassWater } from 'lucide-react';
import { Banner } from '../components/Banner';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Chip } from '../components/Chip';
import { PageHeader } from '../components/PageHeader';
import { ProgressBar } from '../components/ProgressBar';
import { ProgressRing } from '../components/ProgressRing';
import { PWAInstallPrompt } from '../components/PWAInstallPrompt';
import { quickAddOptions, sampleWorkout } from '../data/sampleData';
import { addWater as calculateWater, formatLiters } from '../lib/calculator';
import { createMealItem, createMealLog, getPendingMealLogCount, getTodayMealTotals } from '../lib/api/meals';
import { addWater, getWaterTotalForDay } from '../lib/api/water';
import { getLatestTargets } from '../lib/api/targets';
import type { NutritionTargets } from '../lib/api/types';

interface TodayData {
  calories: number;
  protein: number;
  water: number;
}

const emptyNutrition: TodayData = { calories: 0, protein: 0, water: 0 };

export const TodayPage: React.FC = () => {
  const [nutrition, setNutrition] = useState<TodayData>(emptyNutrition);
  const [targets, setTargets] = useState<NutritionTargets | null>(null);
  const [pendingMeals, setPendingMeals] = useState(0);
  const [loading, setLoading] = useState(true);
  const [addingWater, setAddingWater] = useState(false);
  const [addingTestMeal, setAddingTestMeal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formattedDate = new Intl.DateTimeFormat('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  }).format(new Date());

  const loadToday = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [todayTargets, mealTotals, waterTotal, pendingCount] = await Promise.all([
        getLatestTargets(),
        getTodayMealTotals(),
        getWaterTotalForDay(new Date()),
        getPendingMealLogCount(),
      ]);
      setTargets(todayTargets);
      setNutrition({ ...mealTotals, water: waterTotal });
      setPendingMeals(pendingCount);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load today’s data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadToday();
  }, [loadToday]);

  const maxWaterL = targets ? targets.water * 1.5 : Number.POSITIVE_INFINITY;
  const isWaterAtMax = nutrition.water >= maxWaterL;

  const handleAddWater = async (ml: number) => {
    if (addingWater || isWaterAtMax) return;
    const previousWater = nutrition.water;
    const optimisticWater = targets
      ? calculateWater(previousWater, ml, targets.water)
      : Math.round((previousWater + ml / 1000) * 100) / 100;
    setAddingWater(true);
    setError(null);
    setNutrition((previous) => ({ ...previous, water: optimisticWater }));
    try {
      const waterLog = await addWater(ml);
      if (waterLog) {
        setNutrition((previous) => ({
          ...previous,
          water: Math.round((previousWater + waterLog.amount_ml / 1000) * 100) / 100,
        }));
      } else if (targets) {
        setNutrition((previous) => ({ ...previous, water: maxWaterL }));
      }
    } catch (waterError) {
      setNutrition((previous) => ({ ...previous, water: previousWater }));
      setError(waterError instanceof Error ? waterError.message : 'Unable to log water.');
    } finally {
      setAddingWater(false);
    }
  };

  const handleAddTestMeal = async () => {
    if (addingTestMeal) return;
    setAddingTestMeal(true);
    setError(null);
    try {
      const meal = await createMealLog({
        status: 'confirmed',
        eaten_at: new Date().toISOString(),
      });
      await createMealItem({
        meal_id: meal.$id,
        name: 'Test meal',
        servings: 1,
        kcal: 250,
        protein_g: 20,
        carbs_g: 0,
        fat_g: 0,
      });
      await loadToday();
    } catch (mealError) {
      setError(mealError instanceof Error ? mealError.message : 'Unable to add the test meal.');
    } finally {
      setAddingTestMeal(false);
    }
  };

  return (
    <div className="space-y-4">
      <PWAInstallPrompt />
      <PageHeader title="Today" subtitle={formattedDate} />

      {error && (
        <Banner
          message={error}
          action={{ label: 'Retry', onClick: () => void loadToday() }}
        />
      )}

      {pendingMeals > 0 && (
        <Banner
          variant="warning"
          message={`${pendingMeals} meal${pendingMeals === 1 ? '' : 's'} waiting to confirm`}
          icon={<Camera className="w-4 h-4 shrink-0" aria-hidden="true" />}
        />
      )}

      {loading ? (
        <div className="space-y-4" aria-label="Loading today’s data">
          <Card className="h-40 animate-pulse">
            <div className="h-full rounded-[8px] bg-[var(--color-bg-subtle)]" />
          </Card>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="h-52 animate-pulse"><div className="h-full rounded-[8px] bg-[var(--color-bg-subtle)]" /></Card>
            <Card className="h-52 animate-pulse"><div className="h-full rounded-[8px] bg-[var(--color-bg-subtle)]" /></Card>
          </div>
        </div>
      ) : (
        <>
          {targets ? (
            <Card className="p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-6">
                <div className="flex flex-col items-center">
                  <ProgressRing
                    value={nutrition.calories}
                    target={targets.calories}
                    unit="kcal"
                    label="Calories progress"
                    size={120}
                    strokeWidth={10}
                  />
                </div>
                <div className="w-full flex-1 flex flex-col justify-center gap-4">
                  <ProgressBar label="Protein" value={nutrition.protein} target={targets.protein} unit="g" />
                  <ProgressBar
                    label="Water"
                    value={nutrition.water}
                    target={targets.water}
                    unit="L"
                    displayValue={formatLiters(nutrition.water)}
                    displayTarget={formatLiters(targets.water)}
                  />
                </div>
              </div>
            </Card>
          ) : (
            <Card className="flex flex-col gap-2">
              <h2 className="text-[15px] font-medium text-[var(--color-text-primary)]">Set your daily targets</h2>
              <p className="text-[13px] text-[var(--color-text-secondary)]">
                Add calorie, protein, and water goals to see your daily progress.
              </p>
              <Link
                to="/more/targets"
                className="min-h-[44px] inline-flex items-center text-[13px] font-medium text-[var(--color-accent)] focus-visible:outline-2 focus-visible:outline-[var(--color-accent)]"
              >
                Set targets
              </Link>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="flex flex-col gap-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[13px] font-medium text-[var(--color-text-primary)]">Log water</span>
                  <span className="text-[12px] text-[var(--color-text-secondary)]">
                    {targets ? `Target ${formatLiters(targets.water)} L ${isWaterAtMax ? '(Max 150% reached)' : ''}` : 'No target set'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="secondary"
                    disabled={addingWater || isWaterAtMax}
                    onClick={() => void handleAddWater(250)}
                    icon={<GlassWater className="w-4 h-4 text-[var(--color-accent)]" aria-hidden="true" />}
                    aria-label="Add 250 milliliters of water"
                  >
                    +250 ml
                  </Button>
                  <Button
                    variant="secondary"
                    disabled={addingWater || isWaterAtMax}
                    onClick={() => void handleAddWater(500)}
                    icon={<GlassWater className="w-4 h-4 text-[var(--color-accent)]" aria-hidden="true" />}
                    aria-label="Add 500 milliliters of water"
                  >
                    +500 ml
                  </Button>
                </div>
              </div>

              <div className="border-t border-[var(--color-border-card)] pt-3">
                <span className="block text-[12px] font-normal text-[var(--color-text-secondary)] mb-2">Quick add</span>
                <div className="flex flex-wrap gap-2">
                  {quickAddOptions.map((option) => (
                    <Chip key={option.id} aria-label={`${option.label}, ${option.calories} calories, ${option.protein} grams protein`}>
                      {option.label}
                    </Chip>
                  ))}
                </div>
              </div>
            </Card>

            <Card className="flex flex-col justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-[8px] bg-[var(--color-bg-subtle)] border border-[var(--color-border-card)] flex items-center justify-center text-[var(--color-accent)] shrink-0">
                    <Dumbbell className="w-4 h-4" aria-hidden="true" />
                  </div>
                  <div>
                    <h2 className="text-[15px] font-medium text-[var(--color-text-primary)] leading-snug">{sampleWorkout.name}</h2>
                    <p className="text-[12px] text-[var(--color-text-secondary)]">{sampleWorkout.subtitle}</p>
                  </div>
                </div>
                <p className="text-[13px] text-[var(--color-text-secondary)] mt-3 leading-relaxed">
                  Targeting chest, shoulders, and triceps with progressive overload tracking.
                </p>
              </div>
              <Button variant="secondary" fullWidth aria-label="Start workout Upper A">Start workout</Button>
            </Card>
          </div>

          {/* TODO: Remove this temporary test-meal action in the next step. */}
          <div className="flex justify-end">
            <Button variant="secondary" disabled={addingTestMeal} onClick={() => void handleAddTestMeal()}>
              {addingTestMeal ? 'Adding test meal…' : 'Add test meal'}
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
