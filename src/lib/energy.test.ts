import assert from 'node:assert/strict';
import test from 'node:test';
import { energyLabel, formatEnergy, kcalToKj, kjToKcal } from './energy';

test('converts kcal to kJ and back to the nearest whole kcal', () => {
  assert.equal(kcalToKj(1500), 6276);
  assert.equal(kjToKcal(6276), 1500);
});

test('round-trips representative kcal values within one kcal', () => {
  for (const kcal of [1, 120, 1500, 2600, 12345]) {
    assert.ok(Math.abs(kjToKcal(kcalToKj(kcal)) - kcal) <= 1);
  }
});

test('formats energy as whole numbers with thousands separators', () => {
  assert.equal(formatEnergy(1500, 'kcal'), '1,500');
  assert.equal(formatEnergy(1500, 'kJ'), '6,276');
  assert.equal(formatEnergy(1500.4, 'kcal'), '1,500');
});

test('returns the selected energy label', () => {
  assert.equal(energyLabel('kcal'), 'kcal');
  assert.equal(energyLabel('kJ'), 'kJ');
});
