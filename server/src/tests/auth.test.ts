import { describe, it } from 'node:test';
import assert from 'node:assert';
import jwt from 'jsonwebtoken';

describe('JWT Auth Token Utility', () => {
  const secret = 'test-society-jwt-secret';

  it('should sign and verify valid payload', () => {
    const payload = { userId: '12345', role: 'resident' };
    const token = jwt.sign(payload, secret, { expiresIn: '1h' });
    const decoded = jwt.verify(token, secret) as any;
    assert.strictEqual(decoded.userId, '12345');
    assert.strictEqual(decoded.role, 'resident');
  });
});
