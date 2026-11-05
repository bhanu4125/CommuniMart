import { formatINR } from './formatters';

export const testFormatters = () => {
  const zero = formatINR(0);
  if (zero !== '₹0 / Free') {
    throw new Error(`Expected '₹0 / Free', got ${zero}`);
  }

  const positive = formatINR(250);
  if (!positive.includes('250')) {
    throw new Error(`Expected INR string containing 250, got ${positive}`);
  }
};
