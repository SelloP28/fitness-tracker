import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { getEnergyUnitPreference, saveEnergyUnitPreference } from './api/preferences';
import type { EnergyUnit } from './energy';

interface EnergyUnitContextValue {
  energyUnit: EnergyUnit;
  loading: boolean;
  error: string | null;
  setEnergyUnit: (unit: EnergyUnit) => Promise<void>;
  clearError: () => void;
}

const EnergyUnitContext = createContext<EnergyUnitContextValue | null>(null);

export function EnergyUnitProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [energyUnit, setEnergyUnitState] = useState<EnergyUnit>('kcal');
  const [loading, setLoading] = useState(Boolean(user));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setEnergyUnitState('kcal');
      setLoading(false);
      setError(null);
      return;
    }

    let active = true;
    setLoading(true);
    setError(null);
    void getEnergyUnitPreference()
      .then((unit) => {
        if (active) setEnergyUnitState(unit);
      })
      .catch((loadError: unknown) => {
        if (active) setError(loadError instanceof Error ? loadError.message : 'Unable to load energy unit preference.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [user]);

  const setEnergyUnit = useCallback(async (unit: EnergyUnit) => {
    if (unit === energyUnit) return;
    const previousUnit = energyUnit;
    setEnergyUnitState(unit);
    setError(null);
    try {
      await saveEnergyUnitPreference(unit);
    } catch (saveError) {
      setEnergyUnitState(previousUnit);
      setError(saveError instanceof Error ? saveError.message : 'Unable to save energy unit preference.');
    }
  }, [energyUnit]);

  const clearError = useCallback(() => setError(null), []);
  const value = useMemo(
    () => ({ energyUnit, loading, error, setEnergyUnit, clearError }),
    [energyUnit, loading, error, setEnergyUnit, clearError]
  );

  return <EnergyUnitContext.Provider value={value}>{children}</EnergyUnitContext.Provider>;
}

export function useEnergyUnit(): EnergyUnitContextValue {
  const context = useContext(EnergyUnitContext);
  if (!context) throw new Error('useEnergyUnit must be used within an EnergyUnitProvider.');
  return context;
}
