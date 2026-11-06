import { Query } from '../appwrite';
import { createRow, listRows, TABLES } from './common';
import { friendlyError } from './errors';
import { localDayRange } from './water';
import { buildFoodPayload, buildMealItemPayload, buildMealLogPayload } from './payloads';
import type { FoodInput, FoodRow, MealItemInput, MealItemRow, MealLogInput, MealLogRow, NutritionTotals } from './types';

export async function getTodayMealTotals(date = new Date()): Promise<NutritionTotals> {
  try {
    const { start, end } = localDayRange(date);
    const meals = await listRows<MealLogRow>(
      TABLES.mealLogs,
      [
        Query.equal('status', ['confirmed']),
        Query.greaterThanEqual('eaten_at', start),
        Query.lessThan('eaten_at', end),
      ],
      'load today’s meals'
    );
    if (meals.length === 0) return { calories: 0, protein: 0 };

    const items = await listRows<MealItemRow>(
      TABLES.mealItems,
      [Query.equal('meal_id', meals.map((meal) => meal.$id))],
      'load today’s meal details'
    );
    return items.reduce(
      (totals, item) => ({
        calories: totals.calories + item.kcal,
        protein: totals.protein + item.protein_g,
      }),
      { calories: 0, protein: 0 }
    );
  } catch (error) {
    throw friendlyError(error, 'load today’s meal totals');
  }
}

export async function getPendingMealLogCount(): Promise<number> {
  try {
    const rows = await listRows<MealLogRow>(
      TABLES.mealLogs,
      [Query.equal('status', ['pending'])],
      'check pending meals'
    );
    return rows.length;
  } catch (error) {
    throw friendlyError(error, 'check pending meals');
  }
}

export function createFood(data: FoodInput): Promise<FoodRow> {
  return createRow<FoodRow>(TABLES.foods, (userId) => buildFoodPayload(userId, data), 'save food');
}

export function listFoods(): Promise<FoodRow[]> {
  return listRows<FoodRow>(TABLES.foods, [Query.orderAsc('name')], 'load foods');
}

export function createMealLog(data: MealLogInput): Promise<MealLogRow> {
  return createRow<MealLogRow>(TABLES.mealLogs, (userId) => buildMealLogPayload(userId, data), 'save meal');
}

export function listMealLogs(): Promise<MealLogRow[]> {
  return listRows<MealLogRow>(TABLES.mealLogs, [Query.orderDesc('eaten_at')], 'load meals');
}

export function createMealItem(data: MealItemInput): Promise<MealItemRow> {
  return createRow<MealItemRow>(TABLES.mealItems, (userId) => buildMealItemPayload(userId, data), 'save meal details');
}

export function listMealItems(mealLogId: string): Promise<MealItemRow[]> {
  return listRows<MealItemRow>(
    TABLES.mealItems,
    [Query.equal('meal_id', [mealLogId])],
    'load meal details'
  );
}
