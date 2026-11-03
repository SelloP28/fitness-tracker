import React, { useState } from 'react';
import { Dumbbell, GlassWater, Camera, Check } from 'lucide-react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Chip } from '../components/Chip';
import { ProgressRing } from '../components/ProgressRing';
import { ProgressBar } from '../components/ProgressBar';
import { Banner } from '../components/Banner';
import { PageHeader } from '../components/PageHeader';
import { PWAInstallPrompt } from '../components/PWAInstallPrompt';
import {
  initialTargets,
  initialNutrition,
  quickAddOptions,
  sampleWorkout,
  pendingPhotosBanner,
} from '../data/sampleData';
import { addWater, addMeal, formatLiters } from '../lib/calculator';

export const TodayPage: React.FC = () => {
  const [nutrition, setNutrition] = useState(initialNutrition);
  const targets = initialTargets;
  const [lastAddedLabel, setLastAddedLabel] = useState<string | null>(null);

  // Formatted current date (e.g. "Tuesday, 3 November" or "Tue 3 Nov")
  const formattedDate = new Intl.DateTimeFormat('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  }).format(new Date());

  const maxWaterL = targets.water * 1.5;
  const isWaterAtMax = nutrition.water >= maxWaterL;

  const handleAddWater = (ml: number) => {
    setNutrition((prev) => ({
      ...prev,
      water: addWater(prev.water, ml, targets.water),
    }));
  };

  const handleQuickAdd = (optionId: string) => {
    const selected = quickAddOptions.find((opt) => opt.id === optionId);
    if (!selected) return;

    setNutrition((prev) => {
      const updated = addMeal(
        { calories: prev.calories, protein: prev.protein },
        { calories: selected.calories, protein: selected.protein }
      );
      return {
        ...prev,
        calories: updated.calories,
        protein: updated.protein,
      };
    });

    setLastAddedLabel(selected.label);
    setTimeout(() => {
      setLastAddedLabel(null);
    }, 2500);
  };

  return (
    <div className="space-y-4">
      {/* PWA Install Notification Bar */}
      <PWAInstallPrompt />

      {/* Page Header */}
      <PageHeader
        title="Today"
        subtitle={formattedDate}
        action={
          lastAddedLabel ? (
            <span className="text-[12px] text-[var(--color-success-text)] bg-[var(--color-success-bg)] border border-[var(--color-success-border)] px-2.5 py-1 rounded-full flex items-center gap-1 transition-opacity">
              <Check className="w-3 h-3" aria-hidden="true" />
              Added {lastAddedLabel}
            </span>
          ) : null
        }
      />

      {/* Warning Banner */}
      <Banner
        variant="warning"
        message={pendingPhotosBanner.message}
        icon={<Camera className="w-4 h-4 shrink-0" aria-hidden="true" />}
      />

      {/* Main Nutrition Progress Card */}
      <Card className="p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-6">
          {/* Circular Calories Progress */}
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

          {/* Labelled Progress Bars */}
          <div className="w-full flex-1 flex flex-col justify-center gap-4">
            <ProgressBar
              label="Protein"
              value={nutrition.protein}
              target={targets.protein}
              unit="g"
            />
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

      {/* Responsive Grid for Secondary Actions & Today's Workout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Water Logging Controls & Quick Add Card */}
        <Card className="flex flex-col gap-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[13px] font-medium text-[var(--color-text-primary)]">
                Log water
              </span>
              <span className="text-[12px] text-[var(--color-text-secondary)]">
                Target {formatLiters(targets.water)} L {isWaterAtMax && '(Max 150% reached)'}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="secondary"
                disabled={isWaterAtMax}
                onClick={() => handleAddWater(250)}
                icon={<GlassWater className="w-4 h-4 text-[var(--color-accent)]" aria-hidden="true" />}
                aria-label="Add 250 milliliters of water"
              >
                +250 ml
              </Button>
              <Button
                variant="secondary"
                disabled={isWaterAtMax}
                onClick={() => handleAddWater(500)}
                icon={<GlassWater className="w-4 h-4 text-[var(--color-accent)]" aria-hidden="true" />}
                aria-label="Add 500 milliliters of water"
              >
                +500 ml
              </Button>
            </div>
          </div>

          <div className="border-t border-[var(--color-border-card)] pt-3">
            <span className="block text-[12px] font-normal text-[var(--color-text-secondary)] mb-2">
              Quick add
            </span>
            <div className="flex flex-wrap gap-2">
              {quickAddOptions.map((option) => (
                <Chip
                  key={option.id}
                  onClick={() => handleQuickAdd(option.id)}
                  aria-label={`Add ${option.label}, ${option.calories} calories, ${option.protein} grams protein`}
                >
                  {option.label}
                </Chip>
              ))}
            </div>
          </div>
        </Card>

        {/* Workout Card */}
        <Card className="flex flex-col justify-between gap-4">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-[8px] bg-[var(--color-bg-subtle)] border border-[var(--color-border-card)] flex items-center justify-center text-[var(--color-accent)] shrink-0">
                  <Dumbbell className="w-4 h-4" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="text-[15px] font-medium text-[var(--color-text-primary)] leading-snug">
                    {sampleWorkout.name}
                  </h2>
                  <p className="text-[12px] text-[var(--color-text-secondary)]">
                    {sampleWorkout.subtitle}
                  </p>
                </div>
              </div>
            </div>
            <p className="text-[13px] text-[var(--color-text-secondary)] mt-3 leading-relaxed">
              Targeting chest, shoulders, and triceps with progressive overload tracking.
            </p>
          </div>

          <Button
            variant="secondary"
            fullWidth
            aria-label="Start workout Upper A"
          >
            Start workout
          </Button>
        </Card>
      </div>
    </div>
  );
};
