import assert from 'node:assert/strict';
import test from 'node:test';
import {
  buildBodyWeightPayload,
  buildFoodPayload,
  buildMealItemPayload,
  buildMealLogPayload,
  buildTargetPayload,
  buildWaterLogPayload,
} from './payloads';

const userId = 'user-123';

function assertKeys(payload: object, expected: string[]) {
  assert.deepEqual(Object.keys(payload), expected);
}

test('target payload uses the exact database columns and numeric values', () => {
  const payload = buildTargetPayload(userId, {
    calories: 2400,
    protein: 150,
    waterMl: 3000,
    effectiveFrom: '2026-11-06',
  });

  assertKeys(payload, ['user_id', 'effective_from', 'calories_kcal', 'protein_g', 'water_ml']);
  assert.equal(payload.effective_from, new Date('2026-11-06T00:00:00').toISOString());
  assert.equal(typeof payload.calories_kcal, 'number');
  assert.equal(typeof payload.protein_g, 'number');
  assert.equal(typeof payload.water_ml, 'number');
  assert.ok(Number.isInteger(payload.calories_kcal));
  assert.ok(Number.isInteger(payload.protein_g));
  assert.ok(Number.isInteger(payload.water_ml));
  assert.throws(
    () => buildTargetPayload(userId, { calories: 2400.5, protein: 150, waterMl: 3000, effectiveFrom: '2026-11-06' }),
    /positive whole number/
  );
});

test('water log payload uses the exact database columns', () => {
  const payload = buildWaterLogPayload(userId, '2026-11-06T10:00:00.000Z', 250);
  assertKeys(payload, ['user_id', 'logged_at', 'amount_ml']);
});

test('food payload uses the exact database columns', () => {
  const payload = buildFoodPayload(userId, {
    name: 'Oats',
    serving_label: '50 g',
    kcal: 190,
    protein_g: 7,
    carbs_g: 32,
    fat_g: 4,
    is_preset: false,
  });
  assertKeys(payload, ['user_id', 'name', 'serving_label', 'kcal', 'protein_g', 'carbs_g', 'fat_g', 'is_preset']);
});

test('meal log payload uses the exact database columns', () => {
  const payload = buildMealLogPayload(userId, { eaten_at: '2026-11-06T10:00:00.000Z', status: 'confirmed' });
  assertKeys(payload, ['user_id', 'eaten_at', 'meal_type', 'status', 'source', 'photo_file_id', 'note']);
});

test('meal item payload uses the exact database columns', () => {
  const payload = buildMealItemPayload(userId, {
    meal_id: 'meal-1',
    name: 'Oats',
    servings: 1,
    kcal: 190,
    protein_g: 7,
    carbs_g: 32,
    fat_g: 4,
  });
  assertKeys(payload, ['user_id', 'meal_id', 'food_id', 'name', 'servings', 'kcal', 'protein_g', 'carbs_g', 'fat_g']);
});

test('body weight payload uses the exact database columns', () => {
  const payload = buildBodyWeightPayload(userId, { logged_on: '2026-11-06', weight_kg: 75 });
  assertKeys(payload, ['user_id', 'logged_on', 'weight_kg']);
});
