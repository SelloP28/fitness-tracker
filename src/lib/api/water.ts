import { Query, tablesDB } from '../appwrite';
import { config } from '../config';
import { friendlyError } from './errors';
import { createRow, currentUserId, TABLES } from './common';
import { buildWaterLogPayload } from './payloads';
import { getLatestTargets } from './targets';
import type { WaterLogRow } from './types';

export async function addWater(ml: number): Promise<WaterLogRow | null> {
  try {
    if (!Number.isInteger(ml) || ml <= 0) {
      throw new Error('Water amount must be a positive whole number of milliliters.');
    }

    const now = new Date();
    const currentLitres = await getWaterTotalForDay(now);
    const targets = await getLatestTargets(now);
    const remainingMl = targets ? Math.floor(targets.water * 1.5 * 1000 - currentLitres * 1000) : ml;
    const acceptedMl = Math.min(ml, Math.max(0, remainingMl));

    if (acceptedMl <= 0) return null;

    return await createRow<WaterLogRow>(
      TABLES.waterLogs,
      (ownerId) => buildWaterLogPayload(ownerId, now.toISOString(), acceptedMl),
      'log water'
    );
  } catch (error) {
    throw friendlyError(error, 'log water');
  }
}

export async function getWaterTotalForDay(date: Date): Promise<number> {
  try {
    const userId = await currentUserId();
    const { start, end } = localDayRange(date);
    const response = await tablesDB.listRows<WaterLogRow>({
      databaseId: config.databaseId,
      tableId: TABLES.waterLogs,
      queries: [
        Query.equal('user_id', [userId]),
        Query.greaterThanEqual('logged_at', start),
        Query.lessThan('logged_at', end),
        Query.limit(100),
      ],
    });
    const totalMl = response.rows.reduce((total, row) => total + row.amount_ml, 0);
    return totalMl / 1000;
  } catch (error) {
    throw friendlyError(error, 'load today’s water total');
  }
}

export function localDayRange(date: Date): { start: string; end: string } {
  const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
  return { start: startOfDay.toISOString(), end: endOfDay.toISOString() };
}
