import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { escapeRegex } from '../utils/escapeRegex';

describe('escapeRegex', () => {
  it('treats regex metacharacters as literal search text', () => {
    const query = '[drill] (brand)+';
    const expression = new RegExp(escapeRegex(query), 'i');

    assert.equal(expression.test(query), true);
    assert.equal(expression.test('drill brand'), false);
  });

  it('preserves ordinary search text', () => {
    assert.equal(new RegExp(escapeRegex('garden plants'), 'i').test('Garden Plants'), true);
  });
});
