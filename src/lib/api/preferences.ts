import { account } from '../appwrite';
import { friendlyError } from './errors';
import type { EnergyUnit } from '../energy';

interface AccountPreferences extends Record<string, unknown> {
  energyUnit?: unknown;
}

function isEnergyUnit(value: unknown): value is EnergyUnit {
  return value === 'kcal' || value === 'kJ';
}

export async function getEnergyUnitPreference(): Promise<EnergyUnit> {
  try {
    const prefs = await account.getPrefs<AccountPreferences>();
    return isEnergyUnit(prefs.energyUnit) ? prefs.energyUnit : 'kcal';
  } catch (error) {
    throw friendlyError(error, 'load your energy unit preference');
  }
}

export async function saveEnergyUnitPreference(unit: EnergyUnit): Promise<void> {
  try {
    const prefs = await account.getPrefs<AccountPreferences>();
    await account.updatePrefs<AccountPreferences>({
      prefs: { ...prefs, energyUnit: unit },
    });
  } catch (error) {
    throw friendlyError(error, 'save your energy unit preference');
  }
}
