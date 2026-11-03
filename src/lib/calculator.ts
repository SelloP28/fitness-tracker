/**
 * Adds water in milliliters, capping at 150% of the target (in liters).
 * @param currentL Current water logged in liters
 * @param addedMl Amount to add in milliliters (e.g. 250 or 500)
 * @param targetL Daily target in liters (e.g. 3.0)
 * @returns New water value in liters, rounded to two decimal places
 */
export function addWater(currentL: number, addedMl: number, targetL: number): number {
  const maxAllowedL = targetL * 1.5;
  const addedL = addedMl / 1000;
  const nextL = Math.min(maxAllowedL, currentL + addedL);
  return Math.round(nextL * 100) / 100;
}

/**
 * Adds calories and protein from a quick add item to current totals.
 */
export function addMeal(
  current: { calories: number; protein: number },
  meal: { calories: number; protein: number }
): { calories: number; protein: number } {
  return {
    calories: current.calories + meal.calories,
    protein: current.protein + meal.protein,
  };
}

/**
 * Calculates percentage completion (clamped between 0 and 100 for standard bars, or uncapped if specified).
 */
export function getPercentage(current: number, target: number, clamp = true): number {
  if (target <= 0) return 0;
  const pct = (current / target) * 100;
  if (!clamp) return Math.round(pct);
  return Math.min(100, Math.max(0, Math.round(pct)));
}

/**
 * Formats numbers with thousands comma separators (e.g. 1640 -> "1,640").
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

/**
 * Formats water value in Liters to single decimal precision if whole (e.g. 1.2 or 3.0).
 */
export function formatLiters(val: number): string {
  return val.toFixed(1);
}
