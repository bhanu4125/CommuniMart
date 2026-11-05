import { formatINR } from './formatters';

describe('Currency formatters', () => {
  it('formats zero as free', () => {
    expect(formatINR(0)).toBe('₹0 / Free');
  });

  it('formats positive numbers with rupee sign', () => {
    expect(formatINR(250)).toContain('250');
  });
});
