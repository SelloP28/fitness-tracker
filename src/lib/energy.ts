export const KCAL_TO_KJ = 4.184;

export type EnergyUnit = 'kcal' | 'kJ';

export function kcalToKj(kcal: number): number {
  return Math.round(kcal * KCAL_TO_KJ);
}

export function kjToKcal(kj: number): number {
  return Math.round(kj / KCAL_TO_KJ);
}

export function formatEnergy(kcal: number, unit: EnergyUnit): string {
  const value = unit === 'kJ' ? kcalToKj(kcal) : Math.round(kcal);
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value);
}

export function energyLabel(unit: EnergyUnit): EnergyUnit {
  return unit;
}
