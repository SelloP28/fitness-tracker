import type { BodyWeightInput, FoodInput, MealItemInput, MealLogInput, TargetInput } from './types';

export function buildTargetPayload(userId: string, input: TargetInput) {
  for (const [field, value] of Object.entries({
    calories_kcal: input.calories,
    protein_g: input.protein,
    water_ml: input.waterMl,
  })) {
    if (!Number.isInteger(value) || value <= 0) {
      throw new Error(`${field} must be a positive whole number.`);
    }
  }

  return {
    user_id: userId,
    effective_from: new Date(input.effectiveFrom + 'T00:00:00').toISOString(),
    calories_kcal: input.calories,
    protein_g: input.protein,
    water_ml: input.waterMl,
  };
}

export function buildWaterLogPayload(userId: string, loggedAt: string, amountMl: number) {
  return { user_id: userId, logged_at: loggedAt, amount_ml: amountMl };
}

export function buildFoodPayload(userId: string, input: FoodInput) {
  return {
    user_id: userId,
    name: input.name,
    serving_label: input.serving_label,
    kcal: input.kcal,
    protein_g: input.protein_g,
    carbs_g: input.carbs_g,
    fat_g: input.fat_g,
    is_preset: input.is_preset,
  };
}

export function buildMealLogPayload(userId: string, input: MealLogInput) {
  return {
    user_id: userId,
    eaten_at: input.eaten_at,
    meal_type: input.meal_type ?? null,
    status: input.status,
    source: input.source ?? 'app',
    photo_file_id: input.photo_file_id ?? null,
    note: input.note ?? null,
  };
}

export function buildMealItemPayload(userId: string, input: MealItemInput) {
  return {
    user_id: userId,
    meal_id: input.meal_id,
    food_id: input.food_id ?? null,
    name: input.name,
    servings: input.servings,
    kcal: input.kcal,
    protein_g: input.protein_g,
    carbs_g: input.carbs_g,
    fat_g: input.fat_g,
  };
}

export function buildBodyWeightPayload(userId: string, input: BodyWeightInput) {
  return { user_id: userId, logged_on: input.logged_on, weight_kg: input.weight_kg };
}
