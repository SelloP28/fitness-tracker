import { Query, tablesDB } from '../appwrite';
import { config } from '../config';
import { friendlyError } from './errors';
import { createRow, currentUserId, TABLES } from './common';
import { buildTargetPayload } from './payloads';
import type { NutritionTargets, TargetInput, TargetRow } from './types';

export async function getLatestTargets(date = new Date()): Promise<NutritionTargets | null> {
  try {
    const userId = await currentUserId();
    const today = new Date(`${toLocalDateString(date)}T23:59:59.999`).toISOString();
    const response = await tablesDB.listRows<TargetRow>({
      databaseId: config.databaseId,
      tableId: TABLES.targets,
      queries: [
        Query.equal('user_id', [userId]),
        Query.lessThanEqual('effective_from', today),
        Query.orderDesc('effective_from'),
        Query.limit(100),
      ],
    });
    const row = response.rows[0];
    return row
      ? {
          calories: row.calories_kcal,
          protein: row.protein_g,
          water: row.water_ml / 1000,
          effectiveFrom: row.effective_from,
        }
      : null;
  } catch (error) {
    throw friendlyError(error, 'load your daily targets');
  }
}

export async function saveTargets(input: TargetInput): Promise<NutritionTargets> {
  try {
    await createRow<TargetRow>(TABLES.targets, (userId) => buildTargetPayload(userId, input), 'save your daily targets');
    return {
      calories: input.calories,
      protein: input.protein,
      water: input.waterMl / 1000,
      effectiveFrom: input.effectiveFrom,
    };
  } catch (error) {
    throw friendlyError(error, 'save your daily targets');
  }
}

export function toLocalDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
