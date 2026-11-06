import { Query } from '../appwrite';
import { createRow, listRows, TABLES } from './common';
import { buildBodyWeightPayload } from './payloads';
import type { BodyWeightInput, BodyWeightRow } from './types';

export function createBodyWeight(data: BodyWeightInput): Promise<BodyWeightRow> {
  return createRow<BodyWeightRow>(
    TABLES.bodyWeights,
    (userId) => buildBodyWeightPayload(userId, data),
    'save body weight'
  );
}

export function listBodyWeights(): Promise<BodyWeightRow[]> {
  return listRows<BodyWeightRow>(TABLES.bodyWeights, [Query.orderDesc('logged_on')], 'load body weights');
}
