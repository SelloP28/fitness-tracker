import test from 'node:test';
import assert from 'node:assert/strict';
import { addWater, addMeal, getPercentage, formatNumber, formatLiters } from './calculator';

test('addWater adds 250ml correctly', () => {
  const result = addWater(1.2, 250, 3.0);
  assert.equal(result, 1.45);
});

test('addWater adds 500ml correctly', () => {
  const result = addWater(1.2, 500, 3.0);
  assert.equal(result, 1.7);
});

test('addWater caps at 150% of the target (4.5 L for a 3.0 L target)', () => {
  // Target = 3.0 L -> 150% = 4.5 L
  const result1 = addWater(4.4, 250, 3.0);
  assert.equal(result1, 4.5);

  const result2 = addWater(4.5, 500, 3.0);
  assert.equal(result2, 4.5);
});

test('addMeal updates calories and protein accurately', () => {
  const current = { calories: 1640, protein: 98 };
  const quickMeal = { calories: 390, protein: 18 };
  const updated = addMeal(current, quickMeal);
  assert.equal(updated.calories, 2030);
  assert.equal(updated.protein, 116);
});

test('getPercentage calculates clamped and uncapped values', () => {
  assert.equal(getPercentage(1640, 2600), 63);
  assert.equal(getPercentage(98, 160), 61);
  assert.equal(getPercentage(1.2, 3.0), 40);
  // Exceeding 100%
  assert.equal(getPercentage(3000, 2600, true), 100);
  assert.equal(getPercentage(3000, 2600, false), 115);
});

test('formatNumber adds comma separators', () => {
  assert.equal(formatNumber(1640), '1,640');
  assert.equal(formatNumber(2600), '2,600');
});

test('formatLiters outputs one decimal place', () => {
  assert.equal(formatLiters(1.2), '1.2');
  assert.equal(formatLiters(3), '3.0');
});
