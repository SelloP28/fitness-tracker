import { account, ID, Permission, Query, Role, tablesDB } from '../appwrite';
import { config } from '../config';
import { friendlyError } from './errors';
import type { Models } from 'appwrite';

export const TABLES = {
  targets: 'targets',
  waterLogs: 'water_logs',
  foods: 'foods',
  mealLogs: 'meal_logs',
  mealItems: 'meal_items',
  bodyWeights: 'body_weights',
} as const;

export async function currentUserId(): Promise<string> {
  const user = await account.get();
  return user.$id;
}

export async function createRow<Row extends Models.Row>(
  tableId: string,
  buildData: (userId: string) => Record<string, string | number | boolean | null>,
  action: string
): Promise<Row> {
  try {
    const userId = await currentUserId();
    const data = buildData(userId);
    const row = await tablesDB.createRow({
      databaseId: config.databaseId,
      tableId,
      rowId: ID.unique(),
      data: data as unknown as Models.DefaultRow,
      permissions: [
        Permission.read(Role.user(userId)),
        Permission.update(Role.user(userId)),
        Permission.delete(Role.user(userId)),
      ],
    });
    return row as unknown as Row;
  } catch (error) {
    throw friendlyError(error, action);
  }
}

export async function listRows<Row extends Models.Row>(
  tableId: string,
  queries: string[] = [],
  action = 'load your data'
): Promise<Row[]> {
  try {
    const userId = await currentUserId();
    const response = await tablesDB.listRows<Row>({
      databaseId: config.databaseId,
      tableId,
      queries: [Query.equal('user_id', [userId]), ...queries, Query.limit(100)],
    });
    return response.rows;
  } catch (error) {
    throw friendlyError(error, action);
  }
}
