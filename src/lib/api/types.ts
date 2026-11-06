import type { Models } from 'appwrite';

export interface TargetRow extends Models.Row {
  effective_from: string;
  calories_kcal: number;
  protein_g: number;
  water_ml: number;
  user_id: string;
}

export interface WaterLogRow extends Models.Row {
  logged_at: string;
  amount_ml: number;
  user_id: string;
}

export interface NutritionTotals {
  calories: number;
  protein: number;
}

export interface FoodRow extends Models.Row {
  name: string;
  serving_label: string;
  kcal: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  is_preset: boolean;
  user_id: string;
}

export interface MealLogRow extends Models.Row {
  status: string;
  eaten_at: string;
  meal_type: string | null;
  source: string;
  photo_file_id: string | null;
  note: string | null;
  user_id: string;
}

export interface MealItemRow extends Models.Row {
  meal_id: string;
  food_id: string | null;
  name: string;
  servings: number;
  kcal: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  user_id: string;
}

export interface BodyWeightRow extends Models.Row {
  weight_kg: number;
  logged_on: string;
  user_id: string;
}

export interface TargetInput {
  calories: number;
  protein: number;
  waterMl: number;
  effectiveFrom: string;
}

export interface NutritionTargets {
  calories: number;
  protein: number;
  water: number;
  effectiveFrom: string;
}

export interface FoodInput {
  name: string;
  serving_label: string;
  kcal: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  is_preset: boolean;
}

export interface MealLogInput {
  eaten_at: string;
  meal_type?: string | null;
  status: 'pending' | 'confirmed';
  source?: 'app' | 'telegram';
  photo_file_id?: string | null;
  note?: string | null;
}

export interface MealItemInput {
  meal_id: string;
  food_id?: string | null;
  name: string;
  servings: number;
  kcal: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
}

export interface BodyWeightInput {
  logged_on: string;
  weight_kg: number;
}
